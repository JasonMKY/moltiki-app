import { NextRequest, NextResponse } from "next/server";
import { getArticleBySlug, updateArticle } from "@/lib/store";
import { validateApiKey } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Article with slug "${params.slug}" not found`,
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
  { params }: { params: { slug: string } }
) {
  // Validate API key
  const auth = validateApiKey(req);
  if (!auth.valid) {
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

  // Check the article exists first
  const existing = await getArticleBySlug(params.slug);
  if (!existing) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Article with slug "${params.slug}" not found`,
        },
      },
      { status: 404 }
    );
  }

  const editorName = (body.editor as string) || "anonymous";

  try {
    const updated = await updateArticle(
      params.slug,
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
      editorName
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update article";
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_FAILED", message } },
      { status: 500 }
    );
  }
}
