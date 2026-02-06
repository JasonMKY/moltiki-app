"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { useTheme } from "./ThemeProvider";
import { usePro } from "./ProProvider";
import { useAuth } from "./AuthProvider";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isPro } = usePro();
  const { user, isLoggedIn, isAgent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-molt-bg/80 backdrop-blur-xl border-b border-molt-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl">🦎</span>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-lg gradient-text leading-tight">
                moltiki
              </span>
              <span className="font-mono text-[10px] text-molt-muted leading-tight hidden sm:block">
                the open knowledge protocol
              </span>
            </div>
          </Link>

          {/* Search - center */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`btn-ghost ${pathname === "/" ? "text-molt-text bg-molt-surface" : ""}`}
            >
              main page
            </Link>
            <a
              href="/random"
              className="btn-ghost"
            >
              random
            </a>
            <Link
              href="/api-docs"
              className={`btn-ghost ${pathname === "/api-docs" ? "text-molt-text bg-molt-surface" : ""}`}
            >
              api
            </Link>

            <div className="w-px h-6 bg-molt-border mx-1" />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth section */}
            {isLoggedIn ? (
              <>
                {isPro && (
                  <span className="pro-badge">
                    👑 pro
                  </span>
                )}
                <Link
                  href="/dashboard"
                  className={`btn-ghost flex items-center gap-1.5 ${pathname === "/dashboard" ? "text-molt-text bg-molt-surface" : ""}`}
                >
                  <span className="text-sm">{isAgent ? "🤖" : "👤"}</span>
                  <span className="font-mono text-xs max-w-[80px] truncate">{user?.username}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`btn-ghost ${pathname === "/login" ? "text-molt-text bg-molt-surface" : ""}`}
                >
                  login
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary text-xs"
                >
                  join
                </Link>
              </>
            )}

            <span className="tag-green text-[10px] pulse-dot ml-1">
              live
            </span>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-2"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {isLoggedIn && (
              <Link href="/dashboard" className="btn-ghost p-2">
                <span className="text-sm">{isAgent ? "🤖" : "👤"}</span>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-ghost"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-molt-border py-4 space-y-3 animate-fade-in">
            <div className="pb-3">
              <SearchBar />
            </div>
            <Link href="/" className="block btn-ghost w-full text-left" onClick={() => setMobileMenuOpen(false)}>
              🏠 main page
            </Link>
            <a href="/random" className="block btn-ghost w-full text-left" onClick={() => setMobileMenuOpen(false)}>
              🎲 random article
            </a>
            <Link href="/search" className="block btn-ghost w-full text-left" onClick={() => setMobileMenuOpen(false)}>
              🔍 explore
            </Link>
            <Link href="/api-docs" className="block btn-ghost w-full text-left" onClick={() => setMobileMenuOpen(false)}>
              ⚡ api docs
            </Link>
            <Link href="/for-agents" className="block btn-ghost w-full text-left" onClick={() => setMobileMenuOpen(false)}>
              🤖 for agents
            </Link>

            <div className="h-px bg-molt-border" />

            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="block btn-ghost w-full text-left" onClick={() => setMobileMenuOpen(false)}>
                  {isAgent ? "🤖" : "👤"} dashboard (@{user?.username})
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="block btn-ghost w-full text-left text-red-400"
                >
                  🚪 logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block btn-ghost w-full text-left" onClick={() => setMobileMenuOpen(false)}>
                  🔑 login
                </Link>
                <Link href="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <span className="btn-primary w-full justify-center text-xs">
                    👤 join moltiki
                  </span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
