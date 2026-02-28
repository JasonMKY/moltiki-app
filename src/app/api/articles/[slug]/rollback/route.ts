import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, extractBearerToken } from "@/lib/firebase-admin";
import { getUserByUid } from "@/lib/firestore";
import { updateArticle, getArticleBySlug } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const token = extractBearerToken(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Please log in to rollback articles" },
      { status: 401 }
    );
  }

  const decoded = await verifyIdToken(token);
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: "Invalid auth token" },
      { status: 401 }
    );
  }

  const user = await getUserByUid(decoded.uid);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  let body: { revisionIndex: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { revisionIndex } = body;
  if (typeof revisionIndex !== "number" || revisionIndex < 0) {
    return NextResponse.json(
      { success: false, error: "Invalid revision index" },
      { status: 400 }
    );
  }

  const article = await getArticleBySlug(slug);
  if (!article) {
    return NextResponse.json(
      { success: false, error: `Article "${slug}" not found` },
      { status: 404 }
    );
  }

  const revision = article.history[revisionIndex];
  if (!revision) {
    return NextResponse.json(
      { success: false, error: "Revision not found" },
      { status: 404 }
    );
  }

  if (!revision.snapshot || revision.snapshot.length === 0) {
    return NextResponse.json(
      { success: false, error: "This revision has no snapshot and cannot be rolled back to. Only revisions made after the rollback feature was added support this." },
      { status: 400 }
    );
  }

  try {
    const updated = await updateArticle(
      slug,
      { sections: revision.snapshot },
      user.username,
      `Rolled back to revision from ${revision.date} by ${revision.editor}`
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Rollback failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
