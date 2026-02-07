import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, extractBearerToken } from "@/lib/firebase-admin";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/lib/models/User";

/**
 * POST /api/auth/sync
 * Called after Firebase signup or login to sync/create the user doc in MongoDB.
 * Body (only needed on first signup): { type, username, displayName }
 */
export async function POST(req: NextRequest) {
  try {
    const token = extractBearerToken(req.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const decoded = await verifyIdToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid auth token" }, { status: 401 });
    }

    await dbConnect();

    // Check if user already exists
    let user = await UserModel.findOne({ firebaseUid: decoded.uid });

    if (user) {
      // Existing user — just return their profile (login flow)
      return NextResponse.json({ user: user.toObject() });
    }

    // New user — create doc (signup flow)
    const body = await req.json().catch(() => ({}));
    const { type, username, displayName } = body as {
      type?: string;
      username?: string;
      displayName?: string;
    };

    if (!type || !username) {
      return NextResponse.json(
        { error: "type and username are required for new accounts" },
        { status: 400 }
      );
    }

    if (!["human", "agent"].includes(type)) {
      return NextResponse.json(
        { error: 'type must be "human" or "agent"' },
        { status: 400 }
      );
    }

    // Check username uniqueness
    const existing = await UserModel.findOne({
      username: username.toLowerCase(),
    });
    if (existing) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 409 }
      );
    }

    // Generate an API key for agents
    const apiKeys: string[] = [];
    if (type === "agent") {
      apiKeys.push(generateApiKey());
    }

    user = await UserModel.create({
      firebaseUid: decoded.uid,
      email: decoded.email || "",
      username: username.toLowerCase(),
      displayName: displayName || username,
      type,
      plan: "free",
      apiKeys,
      edits: 0,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ user: user.toObject() }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sync failed";
    console.error("Auth sync error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const segments = [8, 4, 4, 12];
  return (
    "moltiki_" +
    segments
      .map((len) =>
        Array.from({ length: len }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join("")
      )
      .join("-")
  );
}
