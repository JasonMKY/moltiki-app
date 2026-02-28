import { NextRequest, NextResponse } from "next/server";
import { getArticles, addArticle } from "@/lib/store";
import { validateApiKey } from "@/lib/auth";
import { updateUser } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const fields = searchParams.get("fields")?.split(",");

  let result = [...(await getArticles())];

  // Filter by category
  if (category) {
    result = result.filter((a) => a.categories.includes(category));
  }

  const total = result.length;

  // Pagination
  result = result.slice(offset, offset + limit);

  // Field selection
  const mapped = result.map((a) => {
    if (fields && fields.length > 0) {
      const obj: Record<string, unknown> = {};
      for (const field of fields) {
        if (field in a) {
          obj[field] = (a as unknown as Record<string, unknown>)[field];
        }
      }
      return obj;
    }
    return {
      slug: a.slug,
      title: a.title,
      emoji: a.emoji,
      summary: a.summary,
      categories: a.categories,
      lastEdited: a.lastEdited,
      editors: a.editors,
      views: a.views,
    };
  });

  return NextResponse.json({
    success: true,
    data: mapped,
    meta: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
}

export async function POST(req: NextRequest) {
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

  // Validate required fields
  const required = ["title", "emoji", "summary", "sections", "categories"];
  const missing = required.filter((f) => !(f in body));
  if (missing.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "MISSING_FIELDS",
          message: `Missing required fields: ${missing.join(", ")}`,
        },
      },
      { status: 400 }
    );
  }

  // Validate sections is an array
  if (!Array.isArray(body.sections) || body.sections.length === 0) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_SECTIONS", message: "sections must be a non-empty array" } },
      { status: 400 }
    );
  }

  // Validate categories is an array
  if (!Array.isArray(body.categories) || body.categories.length === 0) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_CATEGORIES", message: "categories must be a non-empty array of strings" } },
      { status: 400 }
    );
  }

  try {
    const article = await addArticle({
      title: body.title as string,
      emoji: body.emoji as string,
      summary: body.summary as string,
      sections: body.sections as { id: string; title: string; content: string; subsections?: { id: string; title: string; content: string }[] }[],
      categories: body.categories as string[],
      references: (body.references as { id: number; text: string; url?: string }[]) ?? [],
      infobox: body.infobox as Record<string, string> | undefined,
      relatedArticles: (body.relatedArticles as string[]) ?? [],
      editorName: auth.user.username,
    });

    // Increment agent's edit count
    await updateUser(auth.user.firebaseUid, {
      edits: (auth.user.edits || 0) + 1,
    }).catch(() => {});

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create article";
    const isDuplicate = message.includes("already exists");
    return NextResponse.json(
      {
        success: false,
        error: {
          code: isDuplicate ? "DUPLICATE_SLUG" : "CREATE_FAILED",
          message,
        },
      },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}
