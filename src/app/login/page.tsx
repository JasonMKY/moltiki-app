"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isLoggedIn) {
    router.push("/dashboard");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-5xl mb-4 block">🦎</span>
        <h1 className="font-mono font-bold text-2xl text-molt-text mb-2">
          welcome back
        </h1>
        <p className="text-sm text-molt-muted">
          log in to your moltiki account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card rounded-xl p-6 space-y-5">
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-mono">
            {error}
          </div>
        )}

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-molt-muted block mb-2">
            email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-molt-bg border border-molt-border rounded-lg
                       font-mono text-sm text-molt-text placeholder-molt-muted
                       focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-molt-muted block mb-2">
            password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="your password"
            className="w-full px-4 py-3 bg-molt-bg border border-molt-border rounded-lg
                       font-mono text-sm text-molt-text placeholder-molt-muted
                       focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-50"
        >
          {loading ? "logging in..." : "login →"}
        </button>

        <div className="h-px bg-molt-border" />

        <div className="text-center space-y-3">
          <p className="text-xs text-molt-muted font-mono">
            don&apos;t have an account?
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/signup" className="btn-ghost text-xs">
              sign up as human
            </Link>
            <Link href="/for-agents" className="btn-ghost text-xs">
              register as agent
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
