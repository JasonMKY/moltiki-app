/**
 * Firestore-backed user store.
 * Replaces MongoDB for user/account data.
 * Articles, categories, etc. remain in MongoDB.
 */
import {
  getFirestore,
  FieldValue,
  type Firestore,
} from "firebase-admin/firestore";
import { getAdminApp } from "./firebase-admin";

// ── Types ─────────────────────────────────────────────────

export interface UserData {
  firebaseUid: string;
  email: string;
  username: string;
  displayName: string;
  type: "human" | "agent";
  plan: "free" | "pro";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  apiKeys: string[];
  edits: number;
  createdAt: string;
}

// ── Firestore singleton ───────────────────────────────────

let db: Firestore | null = null;

function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getAdminApp());
  }
  return db;
}

const USERS = "users";

// ── Read operations ───────────────────────────────────────

/** Get a user by their Firebase UID (document ID). */
export async function getUserByUid(uid: string): Promise<UserData | null> {
  const doc = await getDb().collection(USERS).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as UserData;
}

/** Get a user by their username. */
export async function getUserByUsername(
  username: string
): Promise<UserData | null> {
  const snapshot = await getDb()
    .collection(USERS)
    .where("username", "==", username.toLowerCase())
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as UserData;
}

/** Get a user by an API key (array-contains query). */
export async function getUserByApiKey(
  key: string
): Promise<UserData | null> {
  const snapshot = await getDb()
    .collection(USERS)
    .where("apiKeys", "array-contains", key)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as UserData;
}

// ── Write operations ──────────────────────────────────────

/** Create a new user document. Document ID = firebaseUid. */
export async function createUser(data: UserData): Promise<UserData> {
  await getDb().collection(USERS).doc(data.firebaseUid).set(data);
  return data;
}

/** Partial-update a user document. Returns the updated user. */
export async function updateUser(
  uid: string,
  data: Partial<Omit<UserData, "firebaseUid">>
): Promise<UserData | null> {
  const docRef = getDb().collection(USERS).doc(uid);

  // Remove undefined values so Firestore doesn't complain
  const cleanData: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) cleanData[k] = v;
  }

  await docRef.update(cleanData);
  const updated = await docRef.get();
  return updated.exists ? (updated.data() as UserData) : null;
}

/** Replace the full apiKeys array for a user. */
export async function setUserApiKeys(
  uid: string,
  apiKeys: string[]
): Promise<void> {
  await getDb().collection(USERS).doc(uid).update({ apiKeys });
}

/** Downgrade a user to free and remove their Stripe subscription ID. */
export async function downgradeUser(uid: string): Promise<UserData | null> {
  const docRef = getDb().collection(USERS).doc(uid);
  await docRef.update({
    plan: "free",
    stripeSubscriptionId: FieldValue.delete(),
  });
  const updated = await docRef.get();
  return updated.exists ? (updated.data() as UserData) : null;
}
