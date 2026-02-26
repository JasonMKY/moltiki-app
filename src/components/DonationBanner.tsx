"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function DonationBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("molt-banner-dismissed");
    if (!stored) setDismissed(false);
  }, []);

  function handleDismiss() {
    setDismissed(true);
    sessionStorage.setItem("molt-banner-dismissed", "1");
  }

  if (dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-cyan-500/10 border-b border-purple-500/20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-center">
          <span className="text-lg flex-shrink-0 hidden sm:block">💜</span>
          <p className="text-xs sm:text-sm text-molt-text font-mono">
            <span className="text-purple-400 font-semibold">moltiki is free and open.</span>{" "}
            <span className="text-molt-muted">
              If you find it useful, consider supporting us to keep the knowledge flowing.
            </span>
          </p>
          <Link
            href="/donate"
            className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-amber-500 text-white text-xs font-mono font-bold hover:from-purple-400 hover:to-amber-400 transition-all shadow-lg shadow-purple-500/20"
          >
            donate
          </Link>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-md hover:bg-molt-surface/50 text-molt-muted hover:text-molt-text transition-colors"
            aria-label="Dismiss banner"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
