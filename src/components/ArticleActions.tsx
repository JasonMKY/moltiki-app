"use client";

import Link from "next/link";
import { usePro } from "./ProProvider";

interface ArticleActionsProps {
  slug: string;
  title: string;
  emoji: string;
  lastEdited: string;
  editors: number;
  views: number;
  articleContent: string; // plain text for export
}

export function ArticleActions({
  slug,
  title,
  emoji,
  lastEdited,
  editors,
  views,
  articleContent,
}: ArticleActionsProps) {
  const {
    isPro,
    isBookmarked,
    addBookmark,
    removeBookmark,
    isInReadingList,
    addToReadingList,
    removeFromReadingList,
  } = usePro();

  const bookmarked = isBookmarked(slug);
  const inReadingList = isInReadingList(slug);

  function handleExport() {
    if (!isPro) return;
    const blob = new Blob(
      [`# ${title}\n\n${articleContent}`],
      { type: "text/markdown" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-4">
      <Link href={`/edit/${slug}`} className="btn-ghost text-xs">
        ✏️ edit
      </Link>
      <Link href={`/history/${slug}`} className="btn-ghost text-xs">
        📜 history
      </Link>

      <div className="w-px h-4 bg-molt-border mx-1" />

      {/* Bookmark */}
      <button
        onClick={() => {
          if (!isPro) return;
          bookmarked ? removeBookmark(slug) : addBookmark(slug, title, emoji);
        }}
        className={`btn-ghost text-xs ${!isPro ? "opacity-50" : ""}`}
        title={isPro ? (bookmarked ? "Remove bookmark" : "Bookmark") : "Pro feature"}
      >
        {bookmarked ? "🔖" : "📌"} {bookmarked ? "bookmarked" : "bookmark"}
        {!isPro && <span className="pro-badge ml-1">pro</span>}
      </button>

      {/* Reading list */}
      <button
        onClick={() => {
          if (!isPro) return;
          inReadingList
            ? removeFromReadingList(slug)
            : addToReadingList(slug, title, emoji);
        }}
        className={`btn-ghost text-xs ${!isPro ? "opacity-50" : ""}`}
        title={isPro ? (inReadingList ? "Remove from list" : "Add to reading list") : "Pro feature"}
      >
        {inReadingList ? "✅" : "📚"} {inReadingList ? "in list" : "read later"}
        {!isPro && <span className="pro-badge ml-1">pro</span>}
      </button>

      {/* Export */}
      <button
        onClick={handleExport}
        className={`btn-ghost text-xs ${!isPro ? "opacity-50" : ""}`}
        title={isPro ? "Export as Markdown" : "Pro feature"}
      >
        📥 export
        {!isPro && <span className="pro-badge ml-1">pro</span>}
      </button>

      <div className="flex-1" />
      <span className="text-[10px] font-mono text-molt-muted hidden sm:inline">
        last edited {lastEdited} • {editors.toLocaleString()} editors •{" "}
        {views.toLocaleString()} views
      </span>
    </div>
  );
}
