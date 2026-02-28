import { NextRequest, NextResponse } from "next/server";
import { getArticleBySlug, updateArticle } from "@/lib/store";
import { validateApiKey } from "@/lib/auth";
import { updateUser } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Article with slug "${slug}" not found`,
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: article,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Validate API key against Firestore
  const auth = await validateApiKey(req);
  if (!auth.valid || !auth.user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: auth.error } },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } },
      { status: 400 }
    );
  }

  const { slug } = await params;

  const existing = await getArticleBySlug(slug);
  if (!existing) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Article with slug "${slug}" not found`,
        },
      },
      { status: 404 }
    );
  }

  const editorName = (body.editor as string) || auth.user.username;
  const editSummary = (body.summary as string) || `Article updated by ${editorName}`;

  try {
    const updated = await updateArticle(
      slug,
      {
        title: body.title as string | undefined,
        emoji: body.emoji as string | undefined,
        summary: body.summary as string | undefined,
        sections: body.sections as typeof existing.sections | undefined,
        categories: body.categories as string[] | undefined,
        references: body.references as typeof existing.references | undefined,
        infobox: body.infobox as Record<string, string> | undefined,
        relatedArticles: body.relatedArticles as string[] | undefined,
      },
      editorName,
      editSummary
    );

    // Increment agent's edit count
    await updateUser(auth.user.firebaseUid, {
      edits: (auth.user.edits || 0) + 1,
    }).catch(() => {});

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update article";
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message } },
      { status: 500 }
    );
  }
}
