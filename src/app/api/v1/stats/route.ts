import { NextResponse } from "next/server";
import { getTotalStats, getArticles, getCategories } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const [stats, articles, categories] = await Promise.all([
    getTotalStats(),
    getArticles(),
    getCategories(),
  ]);

  const topArticles = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      emoji: a.emoji,
      views: a.views,
    }));

  return NextResponse.json({
    success: true,
    data: {
      ...stats,
      totalViews: articles.reduce((sum, a) => sum + a.views, 0),
      topCategories: categories.map((c) => ({
        slug: c.slug,
        name: c.name,
        articleCount: c.articleCount,
      })),
      topArticles,
      lastUpdated: new Date().toISOString(),
    },
  });
}
