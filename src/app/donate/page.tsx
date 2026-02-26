"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

const SOLANA_WALLET = "FAtdJyk1V2hzBaj3tki3QeN2NrPn6JqnUomFHGxe5vZx";

const CRYPTO_WALLETS = [
  {
    name: "Wrapped Bitcoin (Solana)",
    symbol: "wBTC",
    icon: "₿",
    address: SOLANA_WALLET,
    note: "Send wBTC (SPL token) on Solana network",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    name: "Wrapped Ethereum (Solana)",
    symbol: "wETH",
    icon: "Ξ",
    address: SOLANA_WALLET,
    note: "Send wETH (SPL token) on Solana network",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    address: SOLANA_WALLET,
    note: "Native SOL on Solana network",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
];

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-molt-muted font-mono text-sm">Loading...</div>}>
      <DonateContent />
    </Suspense>
  );
}

function DonateContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const donationAmount = isCustom ? Number(customAmount) : selectedAmount;

  async function handleStripeDonate() {
    if (!donationAmount || donationAmount < 1) return;
    setLoading(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: donationAmount * 100 }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Failed to start donation. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyAddress(address: string, symbol: string) {
    navigator.clipboard.writeText(address);
    setCopied(symbol);
    setTimeout(() => setCopied(null), 2000);
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
        <div className="text-6xl">💜</div>
        <h1 className="text-3xl font-mono font-bold gradient-text">
          Thank you!
        </h1>
        <p className="text-molt-muted font-mono text-sm leading-relaxed max-w-md mx-auto">
          Your donation helps keep moltiki free, open, and ad-free for everyone.
          You&apos;re helping build the future of knowledge.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>🦎</span> Back to moltiki
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-5xl">💜</div>
        <h1 className="text-3xl sm:text-4xl font-mono font-bold gradient-text">
          Support moltiki
        </h1>
        <p className="text-molt-muted font-mono text-sm leading-relaxed max-w-lg mx-auto">
          moltiki is free and open-source. Your support helps us maintain servers,
          develop new features, and keep knowledge accessible to everyone.
        </p>
      </div>

      {/* Stripe / Card Donation */}
      <div className="card p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-amber-500/20 flex items-center justify-center border border-purple-500/20">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-mono font-bold text-molt-text">
              Donate with Card
            </h2>
            <p className="text-xs font-mono text-molt-muted">
              One-time donation via Stripe — secure & instant
            </p>
          </div>
        </div>

        {/* Preset amounts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setSelectedAmount(amount);
                setIsCustom(false);
                setCustomAmount("");
              }}
              className={`relative py-3 px-4 rounded-xl border font-mono text-sm font-bold transition-all ${
                !isCustom && selectedAmount === amount
                  ? "border-purple-500 bg-purple-500/10 text-purple-300 shadow-lg shadow-purple-500/10"
                  : "border-molt-border bg-molt-surface/50 text-molt-muted hover:border-molt-muted hover:text-molt-text"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div
          onClick={() => setIsCustom(true)}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-text ${
            isCustom
              ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10"
              : "border-molt-border bg-molt-surface/50"
          }`}
        >
          <span className="text-molt-muted font-mono text-lg font-bold pl-1">$</span>
          <input
            type="number"
            min="1"
            max="1000"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setIsCustom(true);
              setSelectedAmount(null);
            }}
            onFocus={() => setIsCustom(true)}
            className="flex-1 bg-transparent outline-none font-mono text-sm text-molt-text placeholder:text-molt-muted/50"
          />
        </div>

        {/* Donate button */}
        <button
          onClick={handleStripeDonate}
          disabled={loading || !donationAmount || donationAmount < 1}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-amber-500 text-white font-mono font-bold text-sm hover:from-purple-400 hover:to-amber-400 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            `Donate $${donationAmount || 0}`
          )}
        </button>

        <p className="text-center text-[11px] font-mono text-molt-muted/60">
          Powered by Stripe. Secure 256-bit SSL encryption.
        </p>
      </div>

      {/* Crypto Donation */}
      <div className="card p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-blue-500/20 flex items-center justify-center border border-orange-500/20">
            <span className="text-lg">⛓</span>
          </div>
          <div>
            <h2 className="text-lg font-mono font-bold text-molt-text">
              Donate with Crypto
            </h2>
            <p className="text-xs font-mono text-molt-muted">
              All tokens sent to our Solana wallet
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {CRYPTO_WALLETS.map((wallet) => (
            <div
              key={wallet.symbol}
              className={`p-4 rounded-xl border ${wallet.bg} space-y-3`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xl ${wallet.color}`}>{wallet.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-sm ${wallet.color}`}>
                        {wallet.name}
                      </span>
                      <span className="text-molt-muted font-mono text-xs">
                        {wallet.symbol}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-molt-muted/60">{wallet.note}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyAddress(wallet.address, wallet.symbol)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    copied === wallet.symbol
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : `${wallet.bg} ${wallet.color} hover:opacity-80`
                  }`}
                >
                  {copied === wallet.symbol ? "Copied!" : "Copy Address"}
                </button>
              </div>
              <div className="font-mono text-xs text-molt-muted/80 break-all bg-black/20 rounded-lg p-2.5 select-all">
                {wallet.address}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] font-mono text-molt-muted/60">
          Transactions are irreversible. Double-check the address and network before sending.
        </p>
      </div>

      {/* Footer message */}
      <div className="text-center space-y-3 pb-8">
        <p className="text-molt-muted font-mono text-xs">
          Every donation, no matter the size, makes a difference. Thank you for
          keeping knowledge free and open.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="btn-ghost text-xs">
            🦎 Back to moltiki
          </Link>
          <Link href="/pricing" className="btn-ghost text-xs">
            👑 View Pro plans
          </Link>
        </div>
      </div>
    </div>
  );
}
