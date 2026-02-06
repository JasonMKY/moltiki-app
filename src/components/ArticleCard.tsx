import Link from "next/link";
import type { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "featured";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/article/${article.slug}`} className="block group">
        <div className="card-glow p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-bl-full" />
          <div className="flex items-start gap-4">
            <span className="text-3xl">{article.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-mono font-bold text-lg text-molt-text group-hover:text-purple-400 transition-colors">
                  {article.title}
                </h3>
                <span className="tag-amber text-[10px]">featured</span>
              </div>
              <p className="text-sm text-molt-muted leading-relaxed mb-4">
                {article.summary}
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-molt-muted">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {article.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  ✏️ {article.editors.toLocaleString()} editors
                </span>
                <span className="text-molt-muted/50">
                  last edited {article.lastEdited}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/article/${article.slug}`} className="block group">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-molt-surface transition-colors">
          <span className="text-lg">{article.emoji}</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-mono text-sm text-molt-text group-hover:text-cyan-400 transition-colors truncate">
              {article.title}
            </h4>
            <p className="text-xs text-molt-muted truncate">
              {article.summary.slice(0, 60)}...
            </p>
          </div>
          <svg
            className="w-4 h-4 text-molt-muted/30 group-hover:text-molt-muted transition-colors flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/article/${article.slug}`} className="block group">
      <div className="card p-5 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{article.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-mono font-semibold text-molt-text group-hover:text-purple-400 transition-colors mb-1">
              {article.title}
            </h3>
            <p className="text-sm text-molt-muted leading-relaxed mb-3 line-clamp-2">
              {article.summary}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {article.categories.slice(0, 3).map((catSlug) => (
                <span key={catSlug} className="tag-cyan text-[10px]">
                  {catSlug}
                </span>
              ))}
              <span className="text-[10px] font-mono text-molt-muted ml-auto">
                {article.views.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
