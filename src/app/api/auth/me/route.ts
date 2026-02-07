import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, extractBearerToken } from "@/lib/firebase-admin";
import { getUserByUid } from "@/lib/firestore";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/me
 * Returns the current user's profile (including plan).
 */
export async function GET(req: NextRequest) {
  try {
    const token = extractBearerToken(req.headers.get("authorization"));
    if (!token) {
      return NextResponse.json(
        { error: "Missing auth token" },
        { status: 401 }
      );
    }

    const decoded = await verifyIdToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid auth token" },
        { status: 401 }
      );
    }

    const user = await getUserByUid(decoded.uid);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to get user";
    console.error("Auth me error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
