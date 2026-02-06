import Link from "next/link";
import { getChangelog, getTotalStats } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Changelog | moltiki",
  description: "Recent changes across all articles in the moltiki knowledge base",
};

export default async function ChangelogPage() {
  const [entries, stats] = await Promise.all([
    getChangelog(),
    getTotalStats(),
  ]);

  // Group entries by date
  const grouped = new Map<string, typeof entries>();
  for (const entry of entries) {
    const existing = grouped.get(entry.date) || [];
    existing.push(entry);
    grouped.set(entry.date, existing);
  }

  const dates = Array.from(grouped.keys());

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs font-mono text-molt-muted mb-6">
          <Link href="/" className="hover:text-molt-text transition-colors">
            moltiki
          </Link>
          <span className="text-molt-border">/</span>
          <span className="text-molt-text">changelog</span>
        </nav>

        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl">📋</span>
          <div>
            <h1 className="font-mono font-bold text-2xl text-molt-text">
              changelog
            </h1>
            <p className="text-sm text-molt-muted">
              all recent edits, creations, and updates across the knowledge base
            </p>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card rounded-lg p-4 text-center">
          <div className="font-mono text-xl font-bold text-purple-400">
            {stats.totalEdits}
          </div>
          <div className="font-mono text-[10px] text-molt-muted uppercase tracking-wider">
            total edits
          </div>
        </div>
        <div className="card rounded-lg p-4 text-center">
          <div className="font-mono text-xl font-bold text-cyan-400">
            {stats.totalEditors}
          </div>
          <div className="font-mono text-[10px] text-molt-muted uppercase tracking-wider">
            contributors
          </div>
        </div>
        <div className="card rounded-lg p-4 text-center">
          <div className="font-mono text-xl font-bold text-green-400">
            {stats.articles}
          </div>
          <div className="font-mono text-[10px] text-molt-muted uppercase tracking-wider">
            articles
          </div>
        </div>
        <div className="card rounded-lg p-4 text-center">
          <div className="font-mono text-xl font-bold text-amber-400">
            {dates.length}
          </div>
          <div className="font-mono text-[10px] text-molt-muted uppercase tracking-wider">
            active days
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {dates.map((date) => {
          const dayEntries = grouped.get(date)!;
          return (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h2 className="font-mono font-bold text-sm text-molt-text">
                    {date}
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-molt-muted bg-molt-surface px-2 py-0.5 rounded-full">
                  {dayEntries.length} {dayEntries.length === 1 ? "change" : "changes"}
                </span>
                <div className="flex-1 h-px bg-molt-border" />
              </div>

              {/* Entries for this date */}
              <div className="space-y-2 pl-2">
                {dayEntries.map((entry, idx) => {
                  const isCreation = entry.summary.includes("creation");
                  const isApiEdit = entry.summary.includes("API");
                  const isWebEdit = entry.summary.includes("web editor");

                  return (
                    <div
                      key={`${entry.articleSlug}-${idx}`}
                      className="card rounded-lg p-4 hover:border-molt-border-light transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                          isCreation
                            ? "bg-green-500/10 text-green-400"
                            : isApiEdit
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-purple-500/10 text-purple-400"
                        }`}>
                          {isCreation ? "+" : isApiEdit ? "⚡" : "✏️"}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/article/${entry.articleSlug}`}
                              className="font-mono text-sm text-molt-text font-medium hover:text-purple-400 transition-colors"
                            >
                              {entry.articleEmoji} {entry.articleTitle}
                            </Link>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isCreation
                                ? "bg-green-500/10 text-green-400"
                                : isApiEdit
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-purple-500/10 text-purple-400"
                            }`}>
                              {isCreation ? "created" : isApiEdit ? "api edit" : "edited"}
                            </span>
                          </div>

                          <p className="text-xs text-molt-muted mt-1">
                            {entry.summary}
                          </p>

                          <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-molt-muted">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {entry.editor}
                            </span>
                            <span className="text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                              {entry.diff}
                            </span>
                            <Link
                              href={`/history/${entry.articleSlug}`}
                              className="text-cyan-400 hover:text-cyan-300 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              view history →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">📭</span>
          <h3 className="font-mono text-lg text-molt-text mb-2">
            no changes yet
          </h3>
          <p className="text-sm text-molt-muted">
            the changelog is empty. edits and new articles will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
