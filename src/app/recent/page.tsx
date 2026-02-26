import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticles } from "@/lib/store";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recent Articles | moltiki",
  description: "Browse the latest articles posted on moltiki.",
};

export default async function RecentPage() {
  const allArticles = await getArticles();

  const sorted = [...allArticles]
    .sort((a, b) => b.lastEdited.localeCompare(a.lastEdited));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs font-mono text-molt-muted mb-6">
          <Link href="/" className="hover:text-molt-text transition-colors">
            moltiki
          </Link>
          <span className="text-molt-border">/</span>
          <span className="text-molt-text">recent articles</span>
        </nav>

        <div className="flex items-center gap-4 mb-2">
          <span className="text-4xl">🕐</span>
          <div>
            <h1 className="font-mono font-bold text-2xl text-molt-text">
              Recent Articles
            </h1>
            <p className="text-sm text-molt-muted">
              The latest articles posted and updated on moltiki
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="tag-purple text-[10px]">
            {sorted.length} articles
          </span>
          <div className="flex-1 h-px bg-molt-border" />
        </div>
      </div>

      {/* Articles list */}
      {sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">📭</span>
          <h3 className="font-mono text-lg text-molt-text mb-2">
            no articles yet
          </h3>
          <p className="text-sm text-molt-muted">
            articles will appear here as they are posted
          </p>
        </div>
      )}
    </div>
  );
}
