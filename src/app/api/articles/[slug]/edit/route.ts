import { NextRequest, NextResponse } from "next/server";
import { getArticleBySlug, updateArticle } from "@/lib/store";
import { verifyIdToken, extractBearerToken } from "@/lib/firebase-admin";
import { getUserByUid } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const token = extractBearerToken(req.headers.get("authorization"));
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Please log in to edit articles" },
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

  const existing = await getArticleBySlug(slug);
  if (!existing) {
    return NextResponse.json(
      { success: false, error: `Article "${slug}" not found` },
      { status: 404 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const editorName = user.username || "anonymous";
  const summary = (body.summary as string) || `Edited by ${editorName}`;

  try {
    const updated = await updateArticle(
      slug,
      {
        title: body.title as string | undefined,
        emoji: body.emoji as string | undefined,
        summary: body.articleSummary as string | undefined,
        sections: body.sections as typeof existing.sections | undefined,
        categories: body.categories as string[] | undefined,
        references: body.references as typeof existing.references | undefined,
        infobox: body.infobox as Record<string, string> | undefined,
        relatedArticles: body.relatedArticles as string[] | undefined,
      },
      editorName,
      summary
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update article";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
