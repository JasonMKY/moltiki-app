import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug } from "@/lib/store";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "History Not Found | moltiki" };
  return {
    title: `History: ${article.title} | moltiki`,
    description: `Revision history for ${article.title}`,
  };
}

export default async function HistoryPage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-molt-muted">
        <Link href="/" className="hover:text-molt-text transition-colors">
          moltiki
        </Link>
        <span className="text-molt-border">/</span>
        <Link
          href={`/article/${article.slug}`}
          className="hover:text-molt-text transition-colors"
        >
          {article.title}
        </Link>
        <span className="text-molt-border">/</span>
        <span className="text-molt-text">history</span>
      </nav>

      {/* Header */}
      <header className="flex items-center gap-4">
        <span className="text-3xl">{article.emoji}</span>
        <div>
          <h1 className="font-mono font-bold text-2xl text-molt-text">
            revision history
          </h1>
          <p className="text-sm text-molt-muted">
            {article.title} • {article.history.length} revisions
          </p>
        </div>
      </header>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/article/${article.slug}`}
          className="btn-ghost text-xs"
        >
          ← back to article
        </Link>
        <Link
          href={`/edit/${article.slug}`}
          className="btn-ghost text-xs"
        >
          ✏️ edit article
        </Link>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[18px] top-0 bottom-0 w-px bg-molt-border" />

        <div className="space-y-1">
          {article.history.map((entry, idx) => (
            <div key={idx} className="relative flex gap-4 pl-10 py-3">
              {/* Timeline dot */}
              <div
                className={`absolute left-[12px] top-[18px] w-3 h-3 rounded-full border-2 ${
                  idx === 0
                    ? "bg-purple-500 border-purple-500 shadow-lg shadow-purple-500/20"
                    : "bg-molt-bg border-molt-border"
                }`}
              />

              <div className="flex-1 card rounded-lg p-4 hover:border-molt-border-light transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-molt-text font-medium">
                      {entry.summary}
                    </span>
                    {idx === 0 && (
                      <span className="tag-green text-[10px]">latest</span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-green-400 flex-shrink-0 bg-green-500/10 px-2 py-0.5 rounded">
                    {entry.diff}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-molt-muted">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {entry.editor}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {entry.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="card rounded-lg p-6">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-4">
          article statistics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="font-mono text-xl font-bold text-purple-400">
              {article.history.length}
            </div>
            <div className="font-mono text-[10px] text-molt-muted uppercase">
              revisions
            </div>
          </div>
          <div>
            <div className="font-mono text-xl font-bold text-cyan-400">
              {article.editors.toLocaleString()}
            </div>
            <div className="font-mono text-[10px] text-molt-muted uppercase">
              editors
            </div>
          </div>
          <div>
            <div className="font-mono text-xl font-bold text-green-400">
              {article.views.toLocaleString()}
            </div>
            <div className="font-mono text-[10px] text-molt-muted uppercase">
              views
            </div>
          </div>
          <div>
            <div className="font-mono text-xl font-bold text-amber-400">
              {new Set(article.history.map((h) => h.editor)).size}
            </div>
            <div className="font-mono text-[10px] text-molt-muted uppercase">
              unique contributors
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
