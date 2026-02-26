import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ArticleModel from "@/lib/models/Article";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const docs = await ArticleModel.find()
      .sort({ lastEdited: -1 })
      .limit(10)
      .select("slug title emoji lastEdited")
      .lean();

    const articles = docs.map((d) => ({
      slug: (d as Record<string, unknown>).slug,
      title: (d as Record<string, unknown>).title,
      emoji: (d as Record<string, unknown>).emoji,
      lastEdited: (d as Record<string, unknown>).lastEdited,
    }));

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
