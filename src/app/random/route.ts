import { redirect } from "next/navigation";
import { getRandomArticle } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const randomArticle = await getRandomArticle();
  redirect(`/article/${randomArticle.slug}`);
}
