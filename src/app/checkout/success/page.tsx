"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { refreshUser, isPro } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      setError("No session ID found. Please try upgrading again.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(
          `/api/checkout/verify?session_id=${sessionId}`
        );
        const data = await res.json();

        if (data.paid) {
          // Refresh user profile from DB to pick up the new plan
          await refreshUser();
          setStatus("success");
        } else {
          setStatus("error");
          setError("Payment was not completed. Please try again.");
        }
      } catch {
        setStatus("error");
        setError("Failed to verify payment. Please contact support.");
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (status === "verifying") {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="inline-block w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-6" />
        <h1 className="font-mono text-xl font-bold text-molt-text mb-2">
          verifying payment...
        </h1>
        <p className="text-sm text-molt-muted">
          please wait while we confirm your subscription
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-20 animate-fade-in">
        <span className="text-5xl mb-6 block">😕</span>
        <h1 className="font-mono text-xl font-bold text-molt-text mb-2">
          something went wrong
        </h1>
        <p className="text-sm text-molt-muted mb-6 max-w-md mx-auto">
          {error}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/pricing" className="btn-primary">
            try again
          </Link>
          <Link href="/" className="btn-secondary">
            go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="relative inline-block mb-6">
        <span className="text-6xl block">👑</span>
        <div className="absolute -inset-4 bg-amber-400/10 rounded-full blur-xl" />
      </div>
      <h1 className="font-mono text-2xl font-bold text-molt-text mb-2">
        welcome to <span className="gradient-text">pro</span>!
      </h1>
      <p className="text-sm text-molt-muted mb-8 max-w-md mx-auto">
        your payment was successful. you now have access to all pro features
        including bookmarks, reading lists, article export, and 5,000 API
        requests per day.
      </p>

      {isPro && (
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-8">
          <span className="pro-badge">pro</span>
          <span className="font-mono text-sm text-amber-400">
            subscription active
          </span>
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <Link href="/dashboard" className="btn-gold">
          go to dashboard
        </Link>
        <Link href="/" className="btn-secondary">
          explore articles
        </Link>
      </div>

      <div className="mt-12 max-w-lg mx-auto">
        <div className="card rounded-xl p-6">
          <h3 className="font-mono text-sm font-bold text-molt-text mb-3">
            your pro perks:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-left">
            {[
              "5,000 API req/day",
              "Bookmarks",
              "Reading lists",
              "Article export",
              "Gold badge",
              "No ads",
              "Priority support",
              "Stats API",
            ].map((perk) => (
              <div
                key={perk}
                className="flex items-center gap-2 text-xs font-mono"
              >
                <svg
                  className="w-3 h-3 text-amber-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-molt-muted">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
