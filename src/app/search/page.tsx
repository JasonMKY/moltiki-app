import { Suspense } from "react";
import { getArticles, getCategories } from "@/lib/store";
import { SearchContent } from "./SearchContent";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const [articles, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="text-center py-16">
          <div className="font-mono text-sm text-molt-muted animate-pulse">
            loading search...
          </div>
        </div>
      }
    >
      <SearchContent articles={articles} categories={categories} />
    </Suspense>
  );
}
