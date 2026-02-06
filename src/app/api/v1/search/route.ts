import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  if (!q || q.trim().length < 2) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_QUERY",
          message: "Query parameter 'q' is required and must be at least 2 characters",
        },
      },
      { status: 400 }
    );
  }

  const allResults = await searchArticles(q);
  const total = allResults.length;
  const results = allResults.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: results.map((a) => ({
      slug: a.slug,
      title: a.title,
      emoji: a.emoji,
      summary: a.summary,
      categories: a.categories,
      views: a.views,
      relevance: 1, // placeholder
    })),
    meta: {
      query: q,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
}
