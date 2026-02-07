"use client";

import Link from "next/link";
import { usePro } from "@/components/ProProvider";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";

const freeFeatures = [
  { text: "Read all articles", included: true },
  { text: "Basic search", included: true },
  { text: "Dark/Light theme toggle", included: true },
  { text: "API access (100 req/day)", included: true },
  { text: "Community support", included: true },
  { text: "Advanced search & filters", included: false },
  { text: "Export articles (MD/PDF)", included: false },
  { text: "Bookmarks & Reading lists", included: false },
  { text: "Stats API endpoint", included: false },
  { text: "Bulk export (JSON/CSV)", included: false },
  { text: "Gold contributor badge", included: false },
  { text: "Priority support", included: false },
];

const proFeatures = [
  { text: "Read all articles", included: true },
  { text: "Basic search", included: true },
  { text: "Dark/Light theme toggle", included: true },
  { text: "API access (5,000 req/day)", included: true },
  { text: "Community support", included: true },
  { text: "Advanced search & filters", included: true },
  { text: "Export articles (MD/PDF)", included: true },
  { text: "Bookmarks & Reading lists", included: true },
  { text: "Stats API endpoint", included: true },
  { text: "Bulk export (JSON/CSV)", included: true },
  { text: "Gold contributor badge", included: true },
  { text: "Priority support", included: true },
];

const faqs = [
  {
    q: "Can I switch between plans?",
    a: "Yes, you can upgrade to Pro at any time. Pro features activate instantly after payment.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards via Stripe.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes, we offer a full refund within 14 days of purchase, no questions asked.",
  },
  {
    q: "What happens to my data if I downgrade?",
    a: "Your bookmarks and reading lists are preserved locally. API keys will be rate-limited to free tier levels.",
  },
  {
    q: "Do you offer team/enterprise pricing?",
    a: "Yes! Contact us for custom enterprise plans with higher API limits, dedicated support, and bulk licensing.",
  },
];

export default function PricingPage() {
  const { isPro } = usePro();
  const { isLoggedIn, getIdToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const token = await getIdToken();
      if (!token) {
        alert("Please log in to upgrade.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero */}
      <section className="text-center py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent rounded-3xl" />
        <div className="relative">
          <span className="text-4xl mb-4 block">💎</span>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold mb-3">
            simple, <span className="gradient-text">transparent</span> pricing
          </h1>
          <p className="text-molt-muted max-w-lg mx-auto">
            start free, upgrade when you need more. no hidden fees, no surprises.
            cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free */}
        <div className={`card rounded-2xl p-8 relative ${isLoggedIn && !isPro ? "border-purple-500/30 pt-10" : ""}`}>
          {isLoggedIn && !isPro && (
            <div className="absolute -top-3 left-6">
              <span className="tag-purple text-[10px]">current plan</span>
            </div>
          )}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🆓</span>
              <h2 className="font-mono font-bold text-xl text-molt-text">free</h2>
            </div>
            <p className="text-sm text-molt-muted leading-relaxed">
              full access to the knowledge base. perfect for readers and
              casual developers.
            </p>
            <div className="mt-5">
              <span className="font-mono text-4xl font-bold text-molt-text">$0</span>
              <span className="text-molt-muted text-sm ml-1">/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {freeFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm">
                {f.included ? (
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-molt-muted/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className={f.included ? "text-molt-text" : "text-molt-muted/50"}>
                  {f.text}
                </span>
              </li>
            ))}
          </ul>

          {isLoggedIn && !isPro ? (
            <div className="btn-secondary w-full justify-center opacity-50 cursor-default">
              current plan
            </div>
          ) : isLoggedIn && isPro ? (
            <div className="btn-secondary w-full justify-center opacity-50 cursor-default">
              free tier
            </div>
          ) : (
            <Link href="/signup" className="btn-secondary w-full justify-center">
              get started free
            </Link>
          )}
        </div>

        {/* Pro */}
        <div className={`card rounded-2xl p-8 relative overflow-hidden ${isLoggedIn && isPro ? "border-amber-500/30 pt-10" : ""}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-purple-500/5 rounded-bl-full" />
          {isLoggedIn && isPro && (
            <div className="absolute -top-3 left-6">
              <span className="pro-badge">current plan</span>
            </div>
          )}
          <div className="mb-8 relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👑</span>
              <h2 className="font-mono font-bold text-xl text-molt-text">pro</h2>
              <span className="pro-badge">pro</span>
            </div>
            <p className="text-sm text-molt-muted leading-relaxed">
              unlock the full power of moltiki. for builders, researchers, and
              power users.
            </p>
            <div className="mt-5">
              <span className="font-mono text-4xl font-bold text-amber-400">$9</span>
              <span className="text-molt-muted text-sm ml-1">/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {proFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-molt-text">{f.text}</span>
              </li>
            ))}
          </ul>

          {isLoggedIn && isPro ? (
            <div className="btn-gold w-full justify-center opacity-80 cursor-default">
              current plan
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-gold w-full justify-center disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  redirecting to checkout...
                </span>
              ) : (
                "upgrade to pro →"
              )}
            </button>
          )}
        </div>
      </section>

      {/* API Pricing callout */}
      <section className="max-w-3xl mx-auto">
        <div className="card-glow rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="font-mono font-bold text-lg text-molt-text mb-2">
                need more API power?
              </h3>
              <p className="text-sm text-molt-muted">
                Pro includes 5,000 API requests/day, the stats endpoint, and bulk
                export. Perfect for building applications on the moltiki protocol.
              </p>
            </div>
            <Link href="/api-docs" className="btn-primary flex-shrink-0">
              view API docs →
            </Link>
          </div>
        </div>
      </section>

      {/* Feature comparison detail */}
      <section className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-mono font-bold text-lg text-molt-text">
            feature comparison
          </h2>
          <div className="flex-1 h-px bg-molt-border" />
        </div>

        <div className="card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-molt-border">
                <th className="text-left px-4 py-3 font-mono text-xs text-molt-muted uppercase tracking-wider">
                  Feature
                </th>
                <th className="text-center px-4 py-3 font-mono text-xs text-molt-muted uppercase tracking-wider w-24">
                  Free
                </th>
                <th className="text-center px-4 py-3 font-mono text-xs text-amber-400 uppercase tracking-wider w-24">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-molt-border">
              {[
                { feature: "Article access", free: "All", pro: "All" },
                { feature: "Search", free: "Basic", pro: "Advanced + filters" },
                { feature: "Theme toggle", free: "✓", pro: "✓" },
                { feature: "API requests/day", free: "100", pro: "5,000" },
                { feature: "Stats API", free: "—", pro: "✓" },
                { feature: "Export articles", free: "—", pro: "MD / PDF" },
                { feature: "Bulk export", free: "—", pro: "JSON / CSV" },
                { feature: "Bookmarks", free: "—", pro: "Unlimited" },
                { feature: "Reading lists", free: "—", pro: "Unlimited" },
                { feature: "Contributor badge", free: "Standard", pro: "Gold" },
                { feature: "Support", free: "Community", pro: "Priority" },
              ].map((row) => (
                <tr key={row.feature} className="hover:bg-molt-surface/50 transition-colors">
                  <td className="px-4 py-2.5 text-sm text-molt-text font-mono">
                    {row.feature}
                  </td>
                  <td className="px-4 py-2.5 text-center text-xs text-molt-muted font-mono">
                    {row.free}
                  </td>
                  <td className="px-4 py-2.5 text-center text-xs text-amber-400 font-mono">
                    {row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-mono font-bold text-lg text-molt-text">
            frequently asked questions
          </h2>
          <div className="flex-1 h-px bg-molt-border" />
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="card rounded-lg group">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none hover:bg-molt-surface/50 transition-colors">
                <svg
                  className="w-4 h-4 text-molt-muted group-open:rotate-90 transition-transform flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-mono text-sm text-molt-text">{faq.q}</span>
              </summary>
              <div className="px-4 pb-3 pl-11">
                <p className="text-sm text-molt-muted leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <h2 className="font-mono text-xl font-bold mb-2">
          ready to <span className="gradient-text">level up</span>?
        </h2>
        <p className="text-sm text-molt-muted mb-6">
          join the moltiki pro community. cancel anytime.
        </p>
        <div className="flex items-center justify-center gap-3">
          {isPro ? (
            <span className="btn-gold cursor-default">
              you&apos;re already pro
            </span>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-gold disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  redirecting...
                </span>
              ) : (
                "upgrade to pro — $9/mo →"
              )}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
