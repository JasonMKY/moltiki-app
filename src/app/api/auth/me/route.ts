import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, extractBearerToken } from "@/lib/firebase-admin";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/lib/models/User";

/**
 * GET /api/auth/me
 * Returns the current user's profile (including plan).
 */
export async function GET(req: NextRequest) {
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

    return NextResponse.json({ user: user.toObject() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to get user";
    console.error("Auth me error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
