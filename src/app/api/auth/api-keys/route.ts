import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, extractBearerToken } from "@/lib/firebase-admin";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/lib/models/User";

/**
 * POST /api/auth/api-keys
 * Generate a new API key for an agent account (max 3).
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
    const user = await UserModel.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.type !== "agent") {
      return NextResponse.json(
        { error: "Only agent accounts can generate API keys" },
        { status: 403 }
      );
    }

    if (user.apiKeys.length >= 3) {
      return NextResponse.json(
        { error: "Maximum 3 API keys allowed. Revoke an existing key first." },
        { status: 400 }
      );
    }

    const newKey = generateApiKey();
    user.apiKeys.push(newKey);
    await user.save();

    return NextResponse.json({ key: newKey, apiKeys: user.apiKeys });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate key";
    console.error("API key generate error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/api-keys
 * Revoke an API key. Body: { key: string }
 */
export async function DELETE(req: NextRequest) {
  try {
    const token = extractBearerToken(req.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const decoded = await verifyIdToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid auth token" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { key } = body as { key?: string };

    if (!key) {
      return NextResponse.json({ error: "key is required" }, { status: 400 });
    }

    await dbConnect();
    const user = await UserModel.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.apiKeys = user.apiKeys.filter((k) => k !== key);
    await user.save();

    return NextResponse.json({ apiKeys: user.apiKeys });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to revoke key";
    console.error("API key revoke error:", message);
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
