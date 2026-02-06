import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20 animate-fade-in">
      <span className="text-6xl mb-6 block">🦎</span>
      <h1 className="font-mono text-4xl font-bold gradient-text mb-4">404</h1>
      <h2 className="font-mono text-xl text-molt-text mb-2">
        page not found
      </h2>
      <p className="text-sm text-molt-muted max-w-md mx-auto mb-8">
        this article doesn&apos;t exist yet in the moltiki knowledge base. maybe
        you&apos;d like to explore what&apos;s available?
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          ← main page
        </Link>
        <Link href="/search" className="btn-secondary">
          🔍 search articles
        </Link>
        <a href="/random" className="btn-secondary">
          🎲 random
        </a>
      </div>
    </div>
  );
}
