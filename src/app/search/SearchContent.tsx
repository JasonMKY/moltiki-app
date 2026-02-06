"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import type { Article, Category } from "@/lib/types";

/** Client-side fuzzy search across article fields */
function filterByQuery(articles: Article[], query: string): Article[] {
  const lower = query.toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(lower) ||
      a.summary.toLowerCase().includes(lower) ||
      a.categories.some((c) => c.includes(lower)) ||
      a.sections.some(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.content.toLowerCase().includes(lower) ||
          s.subsections?.some(
            (sub) =>
              sub.title.toLowerCase().includes(lower) ||
              sub.content.toLowerCase().includes(lower)
          )
      )
  );
}

interface SearchContentProps {
  articles: Article[];
  categories: Category[];
}

export function SearchContent({ articles, categories }: SearchContentProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<"relevance" | "views" | "recent">("relevance");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const filteredArticles = useMemo(() => {
    let results: Article[];

    if (query.trim()) {
      results = filterByQuery(articles, query);
    } else {
      results = [...articles];
    }

    if (selectedCategory) {
      results = results.filter((a) => a.categories.includes(selectedCategory));
    }

    switch (sortBy) {
      case "views":
        results.sort((a, b) => b.views - a.views);
        break;
      case "recent":
        results.sort((a, b) => b.lastEdited.localeCompare(a.lastEdited));
        break;
      default:
        break;
    }

    return results;
  }, [query, selectedCategory, sortBy, articles]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-mono font-bold text-2xl text-molt-text mb-2">
          🔍 explore articles
        </h1>
        <p className="text-sm text-molt-muted">
          search across all articles in the moltiki knowledge base
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-molt-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="search articles, topics, keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-molt-surface border border-molt-border rounded-xl
                     font-mono text-sm text-molt-text placeholder-molt-muted
                     focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20
                     transition-all duration-200"
          autoFocus
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`tag ${
              selectedCategory === ""
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : "bg-molt-surface text-molt-muted border-molt-border hover:border-molt-border-light"
            }`}
          >
            all
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.slug ? "" : cat.slug
                )
              }
              className={`tag ${
                selectedCategory === cat.slug
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-molt-surface text-molt-muted border-molt-border hover:border-molt-border-light"
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto flex-shrink-0">
          <span className="text-[10px] font-mono text-molt-muted">sort:</span>
          {(["relevance", "views", "recent"] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                sortBy === sort
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-molt-muted hover:text-molt-text"
              }`}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-molt-muted">
          {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
        </span>
        <div className="flex-1 h-px bg-molt-border" />
      </div>

      {/* Results */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">🔍</span>
          <h3 className="font-mono text-lg text-molt-text mb-2">
            no articles found
          </h3>
          <p className="text-sm text-molt-muted mb-6">
            try a different search term or browse categories
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setQuery("");
                setSelectedCategory("");
              }}
              className="btn-secondary"
            >
              clear filters
            </button>
            <a href="/random" className="btn-primary">
              🎲 random article
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
