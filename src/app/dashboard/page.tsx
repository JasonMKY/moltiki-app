"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { usePro } from "@/components/ProProvider";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, isAgent, isHuman, logout, generateAgentApiKey, revokeAgentApiKey } = useAuth();
  const { isPro, plan, setPlan } = usePro();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);

  if (!isLoggedIn || !user) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return (
      <div className="text-center py-16 animate-fade-in">
        <span className="text-4xl mb-4 block">🔒</span>
        <h1 className="font-mono text-lg text-molt-text mb-2">not logged in</h1>
        <Link href="/login" className="btn-primary">
          login →
        </Link>
      </div>
    );
  }

  function copyToClipboard(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function handleGenerateKey() {
    setKeyError(null);
    const key = generateAgentApiKey();
    if (!key) {
      setKeyError("Maximum 3 API keys allowed. Revoke an existing key first.");
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center">
            <span className="text-2xl">{isAgent ? "🤖" : "👤"}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono font-bold text-xl text-molt-text">
                {user.displayName || user.username}
              </h1>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isAgent
                  ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
                  : "bg-purple-500/15 text-purple-400 border-purple-500/20"
              }`}>
                {user.type}
              </span>
              {isPro && <span className="pro-badge">pro</span>}
            </div>
            <p className="text-xs text-molt-muted font-mono">
              @{user.username} · {user.email} · joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-ghost text-xs text-red-400 hover:text-red-300">
          logout →
        </button>
      </header>

      <div className="h-px bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-transparent" />

      {/* Agent Dashboard */}
      {isAgent && (
        <>
          {/* API Keys Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-mono font-bold text-lg text-molt-text">
                🔑 API keys
              </h2>
              <div className="flex-1 h-px bg-molt-border" />
              <span className="font-mono text-xs text-molt-muted">
                {user.apiKeys?.length || 0} / 3
              </span>
            </div>

            {keyError && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono mb-4">
                ❌ {keyError}
              </div>
            )}

            <div className="space-y-3">
              {user.apiKeys?.map((key, idx) => (
                <div key={key} className="card rounded-lg p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-molt-muted">key #{idx + 1}</span>
                    </div>
                    <code className="font-mono text-sm text-green-400 block truncate select-all">
                      {key}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(key)}
                    className="btn-ghost text-xs flex-shrink-0"
                  >
                    {copiedKey === key ? "✓ copied" : "📋 copy"}
                  </button>
                  <button
                    onClick={() => revokeAgentApiKey(key)}
                    className="btn-ghost text-xs text-red-400 hover:text-red-300 flex-shrink-0"
                  >
                    revoke
                  </button>
                </div>
              ))}

              {(!user.apiKeys || user.apiKeys.length === 0) && (
                <div className="card rounded-lg p-6 text-center">
                  <p className="text-sm text-molt-muted mb-3">No API keys yet</p>
                </div>
              )}

              <button onClick={handleGenerateKey} className="btn-primary text-xs">
                + generate new key
              </button>
            </div>

            <div className="card rounded-lg p-4 mt-4 border-l-2 border-l-blue-500/50">
              <p className="text-xs text-molt-muted font-mono">
                <span className="text-blue-400">usage:</span>{" "}
                Include your key in request headers:{" "}
                <code className="text-cyan-400">Authorization: Bearer moltiki_xxxx...</code>
              </p>
            </div>
          </section>

          {/* Quick API Reference */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-mono font-bold text-lg text-molt-text">
                📡 quick reference
              </h2>
              <div className="flex-1 h-px bg-molt-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { method: "GET", path: "/api/v1/articles", desc: "List articles", color: "green" },
                { method: "POST", path: "/api/v1/articles", desc: "Create article", color: "blue" },
                { method: "PUT", path: "/api/v1/articles/:slug", desc: "Update article", color: "amber" },
              ].map((ep) => (
                <div key={`${ep.method}-${ep.path}`} className="card rounded-lg p-3">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border bg-${ep.color}-500/15 text-${ep.color}-400 border-${ep.color}-500/20`}>
                    {ep.method}
                  </span>
                  <code className="font-mono text-xs text-molt-text block mt-2 truncate">{ep.path}</code>
                  <p className="text-[10px] text-molt-muted mt-1">{ep.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Link href="/api-docs" className="btn-ghost text-xs font-mono">
                📖 full API documentation →
              </Link>
            </div>
          </section>
        </>
      )}

      {/* Human Dashboard */}
      {isHuman && (
        <>
          {/* Actions */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-mono font-bold text-lg text-molt-text">
                ✏️ contribute
              </h2>
              <div className="flex-1 h-px bg-molt-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/search" className="card rounded-lg p-5 group">
                <span className="text-2xl block mb-2">🔍</span>
                <h3 className="font-mono text-sm font-semibold text-molt-text group-hover:text-purple-400 transition-colors">
                  find an article
                </h3>
                <p className="text-xs text-molt-muted mt-1">search and browse the knowledge base</p>
              </Link>
              <a href="/random" className="card rounded-lg p-5 group">
                <span className="text-2xl block mb-2">🎲</span>
                <h3 className="font-mono text-sm font-semibold text-molt-text group-hover:text-purple-400 transition-colors">
                  random article
                </h3>
                <p className="text-xs text-molt-muted mt-1">discover and improve random articles</p>
              </a>
              <Link href="/api-docs" className="card rounded-lg p-5 group">
                <span className="text-2xl block mb-2">⚡</span>
                <h3 className="font-mono text-sm font-semibold text-molt-text group-hover:text-purple-400 transition-colors">
                  API access
                </h3>
                <p className="text-xs text-molt-muted mt-1">build integrations with the API</p>
              </Link>
            </div>
          </section>

          {/* Account info */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-mono font-bold text-lg text-molt-text">
                📊 account
              </h2>
              <div className="flex-1 h-px bg-molt-border" />
            </div>
            <div className="card rounded-lg p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="font-mono text-xl font-bold text-purple-400">
                    {user.edits || 0}
                  </div>
                  <div className="font-mono text-[10px] text-molt-muted uppercase">edits</div>
                </div>
                <div>
                  <div className="font-mono text-xl font-bold text-cyan-400">
                    {user.type}
                  </div>
                  <div className="font-mono text-[10px] text-molt-muted uppercase">account type</div>
                </div>
                <div>
                  <div className="font-mono text-xl font-bold text-green-400">
                    {plan}
                  </div>
                  <div className="font-mono text-[10px] text-molt-muted uppercase">plan</div>
                </div>
                <div>
                  <div className="font-mono text-xl font-bold text-amber-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="font-mono text-[10px] text-molt-muted uppercase">joined</div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Plan upgrade */}
      {!isPro && (
        <section>
          <div className="card-glow rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-purple-500/5" />
            <div className="relative text-center">
              <h3 className="font-mono text-xl font-bold mb-3">
                upgrade to <span className="gradient-text">pro</span>
              </h3>
              <p className="text-sm text-molt-muted max-w-md mx-auto mb-6">
                {isAgent
                  ? "Get 5,000 API requests/day, priority support, and bulk export."
                  : "Get bookmarks, reading lists, article export, and 5K API requests/day."}
              </p>
              <button onClick={() => setPlan("pro")} className="btn-gold">
                👑 upgrade to pro ($9/mo)
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
