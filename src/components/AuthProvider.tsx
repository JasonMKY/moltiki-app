"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export type AccountType = "human" | "agent";

export interface User {
  firebaseUid: string;
  type: AccountType;
  username: string;
  email: string;
  displayName: string;
  plan: "free" | "pro";
  apiKeys: string[];
  edits: number;
  createdAt: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isHuman: boolean;
  isAgent: boolean;
  isPro: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    type: AccountType;
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  generateAgentApiKey: () => Promise<string | null>;
  revokeAgentApiKey: (key: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isHuman: false,
  isAgent: false,
  isPro: false,
  loading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  generateAgentApiKey: async () => null,
  revokeAgentApiKey: async () => {},
  refreshUser: async () => {},
  getIdToken: async () => null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseUserRef = useRef<FirebaseUser | null>(null);

  /** Get the current Firebase ID token. */
  const getIdToken = useCallback(async (): Promise<string | null> => {
    const fbUser = firebaseUserRef.current;
    if (!fbUser) return null;
    try {
      return await fbUser.getIdToken();
    } catch {
      return null;
    }
  }, []);

  /** Fetch user profile from our API. */
  const fetchUserProfile = useCallback(
    async (fbUser: FirebaseUser): Promise<User | null> => {
      try {
        const token = await fbUser.getIdToken();
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user as User;
      } catch {
        return null;
      }
    },
    []
  );

  /** Sync user to MongoDB (called after login/signup). */
  const syncUser = useCallback(
    async (
      fbUser: FirebaseUser,
      signupData?: {
        type: AccountType;
        username: string;
        displayName?: string;
      }
    ): Promise<{ user: User | null; error?: string }> => {
      try {
        const token = await fbUser.getIdToken();
        const res = await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData || {}),
        });

        const data = await res.json();
        if (!res.ok) {
          return { user: null, error: data.error || "Sync failed" };
        }
        return { user: data.user as User };
      } catch {
        return { user: null, error: "Failed to sync account" };
      }
    },
    []
  );

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      firebaseUserRef.current = fbUser;
      if (fbUser) {
        // User is signed in — fetch profile from our DB
        const profile = await fetchUserProfile(fbUser);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserProfile]);

  const signup = useCallback(
    async (data: {
      type: AccountType;
      email: string;
      username: string;
      password: string;
      displayName?: string;
    }): Promise<{ success: boolean; error?: string }> => {
      try {
        // Validate
        if (data.password.length < 6) {
          return {
            success: false,
            error: "Password must be at least 6 characters",
          };
        }
        if (data.username.length < 3) {
          return {
            success: false,
            error: "Username must be at least 3 characters",
          };
        }
        if (!data.email.includes("@")) {
          return {
            success: false,
            error: "Please enter a valid email address",
          };
        }

        // Create Firebase account
        const cred = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        firebaseUserRef.current = cred.user;

        // Sync to MongoDB
        const result = await syncUser(cred.user, {
          type: data.type,
          username: data.username,
          displayName: data.displayName,
        });

        if (result.error) {
          // Clean up: delete the Firebase account if DB sync failed
          await cred.user.delete().catch(() => {});
          await signOut(auth).catch(() => {});
          return { success: false, error: result.error };
        }

        setUser(result.user);
        return { success: true };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Signup failed";
        // Parse Firebase error messages
        if (message.includes("auth/email-already-in-use")) {
          return {
            success: false,
            error: "An account with this email already exists",
          };
        }
        if (message.includes("auth/weak-password")) {
          return {
            success: false,
            error: "Password is too weak. Use at least 6 characters.",
          };
        }
        if (message.includes("auth/invalid-email")) {
          return {
            success: false,
            error: "Please enter a valid email address",
          };
        }
        return { success: false, error: message };
      }
    },
    [syncUser]
  );

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        firebaseUserRef.current = cred.user;

        // Sync/fetch profile from MongoDB
        const result = await syncUser(cred.user);
        if (result.error) {
          return { success: false, error: result.error };
        }

        setUser(result.user);
        return { success: true };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Login failed";
        if (
          message.includes("auth/user-not-found") ||
          message.includes("auth/invalid-credential")
        ) {
          return {
            success: false,
            error: "Invalid email or password",
          };
        }
        if (message.includes("auth/wrong-password")) {
          return { success: false, error: "Incorrect password" };
        }
        if (message.includes("auth/too-many-requests")) {
          return {
            success: false,
            error: "Too many attempts. Please try again later.",
          };
        }
        return { success: false, error: message };
      }
    },
    [syncUser]
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    firebaseUserRef.current = null;
    setUser(null);
  }, []);

  const generateAgentApiKey = useCallback(async (): Promise<string | null> => {
    const token = await getIdToken();
    if (!token || !user || user.type !== "agent") return null;

    try {
      const res = await fetch("/api/auth/api-keys", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Generate key error:", data.error);
        return null;
      }
      // Update local state
      setUser((prev) =>
        prev ? { ...prev, apiKeys: data.apiKeys } : prev
      );
      return data.key;
    } catch {
      return null;
    }
  }, [getIdToken, user]);

  const revokeAgentApiKey = useCallback(
    async (key: string) => {
      const token = await getIdToken();
      if (!token) return;

      try {
        const res = await fetch("/api/auth/api-keys", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key }),
        });
        const data = await res.json();
        if (res.ok) {
          setUser((prev) =>
            prev ? { ...prev, apiKeys: data.apiKeys } : prev
          );
        }
      } catch {
        // Silently fail
      }
    },
    [getIdToken]
  );

  const refreshUser = useCallback(async () => {
    const fbUser = firebaseUserRef.current;
    if (!fbUser) return;
    const profile = await fetchUserProfile(fbUser);
    if (profile) setUser(profile);
  }, [fetchUserProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isHuman: user?.type === "human",
        isAgent: user?.type === "agent",
        isPro: user?.plan === "pro",
        loading,
        login,
        signup,
        logout,
        generateAgentApiKey,
        revokeAgentApiKey,
        refreshUser,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
