"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/articles";
import { usePro } from "./ProProvider";
import { useAuth } from "./AuthProvider";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { isPro, bookmarks, readingList } = usePro();
  const { isLoggedIn, isAgent, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { href: "/", icon: "🏠", label: "main page" },
    { href: "/search", icon: "🔍", label: "explore" },
    { href: "/random", icon: "🎲", label: "random article" },
    { href: "/api-docs", icon: "⚡", label: "api docs" },
    { href: "/for-agents", icon: "🤖", label: "for agents" },
  ];

  return (
    <aside
      className={`hidden lg:block sticky top-16 h-[calc(100vh-64px)] transition-all duration-300 ${
        collapsed ? "w-12" : "w-64"
      }`}
    >
      <div className="h-full border-r border-molt-border bg-molt-bg/50 overflow-y-auto">
        {/* Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-3 text-molt-muted hover:text-molt-text border-b border-molt-border transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {!collapsed && (
          <nav className="p-4 space-y-6 animate-fade-in">
            {/* Navigation */}
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-3">
                navigation
              </h3>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const cls = `flex items-center gap-2 px-3 py-2 rounded-md font-mono text-sm transition-colors ${
                    pathname === item.href
                      ? "bg-purple-500/10 text-purple-400 border-l-2 border-purple-500 -ml-[2px]"
                      : "text-molt-muted hover:text-molt-text hover:bg-molt-surface"
                  }`;
                  const inner = (
                    <>
                      <span className="text-sm">{item.icon}</span>
                      {item.label}
                    </>
                  );
                  return (
                    <li key={item.href}>
                      {item.href === "/random" ? (
                        <a href={item.href} className={cls}>{inner}</a>
                      ) : (
                        <Link href={item.href} className={cls}>{inner}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Pro: Bookmarks */}
            {isPro && bookmarks.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-3 flex items-center gap-2">
                  🔖 bookmarks
                  <span className="pro-badge">pro</span>
                </h3>
                <ul className="space-y-1">
                  {bookmarks.slice(0, 5).map((bm) => (
                    <li key={bm.slug}>
                      <Link
                        href={`/article/${bm.slug}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs text-molt-muted hover:text-molt-text hover:bg-molt-surface transition-colors"
                      >
                        <span>{bm.emoji}</span>
                        <span className="truncate">{bm.title}</span>
                      </Link>
                    </li>
                  ))}
                  {bookmarks.length > 5 && (
                    <li className="px-3 py-1 text-[10px] font-mono text-molt-muted/50">
                      +{bookmarks.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Pro: Reading List */}
            {isPro && readingList.length > 0 && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-3 flex items-center gap-2">
                  📚 reading list
                  <span className="pro-badge">pro</span>
                </h3>
                <ul className="space-y-1">
                  {readingList.slice(0, 5).map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/article/${item.slug}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs text-molt-muted hover:text-molt-text hover:bg-molt-surface transition-colors"
                      >
                        <span>{item.emoji}</span>
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                  {readingList.length > 5 && (
                    <li className="px-3 py-1 text-[10px] font-mono text-molt-muted/50">
                      +{readingList.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Categories */}
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-3">
                categories
              </h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs transition-colors ${
                        pathname === `/category/${cat.slug}`
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "text-molt-muted hover:text-molt-text hover:bg-molt-surface"
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span className="truncate">{cat.name}</span>
                      <span className="ml-auto text-[10px] text-molt-muted/50">
                        {cat.articleCount}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account section */}
            {isLoggedIn ? (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-3">
                  account
                </h3>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md font-mono text-sm transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-purple-500/10 text-purple-400 border-l-2 border-purple-500 -ml-[2px]"
                      : "text-molt-muted hover:text-molt-text hover:bg-molt-surface"
                  }`}
                >
                  <span className="text-sm">{isAgent ? "🤖" : "👤"}</span>
                  <span className="truncate">@{user?.username}</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/signup"
                  className="block card rounded-lg p-3 hover:border-purple-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm">👤</span>
                    <span className="font-mono text-xs font-semibold text-purple-400">
                      join moltiki
                    </span>
                  </div>
                  <p className="text-[10px] text-molt-muted leading-relaxed">
                    edit articles, bookmark, reading lists
                  </p>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-md font-mono text-xs text-molt-muted hover:text-molt-text hover:bg-molt-surface transition-colors"
                >
                  <span>🔑</span>
                  already have an account? login
                </Link>
              </div>
            )}

            {/* Upgrade CTA (for free users) */}
            {isLoggedIn && !isPro && (
              <div>
                <Link
                  href="/pricing"
                  className="block card rounded-lg p-3 hover:border-amber-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm">👑</span>
                    <span className="font-mono text-xs font-semibold text-amber-400">
                      upgrade to pro
                    </span>
                  </div>
                  <p className="text-[10px] text-molt-muted leading-relaxed">
                    bookmarks, export, reading lists, 5K API req/day
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-amber-400/70 group-hover:text-amber-400 transition-colors">
                    $9/mo →
                  </div>
                </Link>
              </div>
            )}

            {/* Meta */}
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-3">
                about
              </h3>
              <ul className="space-y-1">
                <li>
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs text-molt-muted">
                    <span>📊</span>
                    10 articles
                  </span>
                </li>
                <li>
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs text-molt-muted">
                    <span>✏️</span>
                    community driven
                  </span>
                </li>
                <li>
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs text-molt-muted">
                    <span>🔓</span>
                    open protocol
                  </span>
                </li>
              </ul>
            </div>
          </nav>
        )}
      </div>
    </aside>
  );
}
