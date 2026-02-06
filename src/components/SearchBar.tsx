"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchArticles } from "@/lib/articles";
import type { Article } from "@/lib/types";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length >= 2) {
      const found = searchArticles(query).slice(0, 6);
      setResults(found);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(`/article/${results[selectedIndex].slug}`);
        setIsOpen(false);
        setQuery("");
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative">
      <div className="relative group">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-molt-muted group-focus-within:text-purple-400 transition-colors"
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
          ref={inputRef}
          type="text"
          placeholder="search moltiki..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="w-full pl-10 pr-12 py-2 bg-molt-surface border border-molt-border rounded-lg
                     font-mono text-sm text-molt-text placeholder-molt-muted
                     focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20
                     transition-all duration-200"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-molt-muted bg-molt-bg border border-molt-border">
          /
        </kbd>
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-molt-card border border-molt-border rounded-lg shadow-2xl overflow-hidden z-50 animate-fade-in"
        >
          {results.map((article, idx) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                idx === selectedIndex
                  ? "bg-purple-500/10 border-l-2 border-l-purple-500"
                  : "hover:bg-molt-surface border-l-2 border-l-transparent"
              }`}
            >
              <span className="text-lg">{article.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-molt-text font-medium truncate">
                  {article.title}
                </div>
                <div className="text-xs text-molt-muted truncate">
                  {article.summary.slice(0, 80)}...
                </div>
              </div>
              <svg
                className="w-4 h-4 text-molt-muted flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ))}
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => {
              setIsOpen(false);
              setQuery("");
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-purple-400 bg-molt-bg/50 border-t border-molt-border hover:bg-molt-surface transition-colors"
          >
            search all articles for &quot;{query}&quot; →
          </Link>
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-molt-card border border-molt-border rounded-lg shadow-2xl p-4 z-50 animate-fade-in"
        >
          <p className="text-sm text-molt-muted font-mono text-center">
            no articles found for &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
