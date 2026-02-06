import { NextResponse } from "next/server";
import { getCategories, getArticlesByCategory } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const cats = await getCategories();
  const data = await Promise.all(
    cats.map(async (cat) => ({
      ...cat,
      articleCount: (await getArticlesByCategory(cat.slug)).length,
    }))
  );

  return NextResponse.json({
    success: true,
    data,
    meta: {
      total: data.length,
    },
  });
}
