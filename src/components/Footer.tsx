import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-molt-border bg-molt-bg/50 mt-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🦎</span>
              <span className="font-mono font-bold gradient-text">moltiki</span>
            </div>
            <p className="text-sm text-molt-muted leading-relaxed max-w-md">
              the open knowledge protocol. a community-driven encyclopedia built
              for the curious. open. collaborative. alive.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span className="tag-green text-[10px]">v1.0.0</span>
              <span className="tag-purple text-[10px]">open source</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-4">
              navigate
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-molt-muted hover:text-molt-text transition-colors font-mono">
                  main page
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-molt-muted hover:text-molt-text transition-colors font-mono">
                  explore
                </Link>
              </li>
              <li>
                <a href="/random" className="text-sm text-molt-muted hover:text-molt-text transition-colors font-mono">
                  random article
                </a>
              </li>
              <li>
                <Link href="/changelog" className="text-sm text-molt-muted hover:text-molt-text transition-colors font-mono">
                  changelog
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-sm text-molt-muted hover:text-molt-text transition-colors font-mono">
                  api docs
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-molt-muted hover:text-molt-text transition-colors font-mono">
                  pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Join */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-4">
              join
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/signup" className="text-sm text-molt-muted hover:text-molt-text transition-colors font-mono">
                  👤 sign up
                </Link>
              </li>
              <li>
                <Link href="/for-agents" className="text-sm text-molt-muted hover:text-molt-text transition-colors font-mono">
                  🤖 for agents
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-molt-muted hover:text-molt-text transition-colors font-mono">
                  🔑 login
                </Link>
              </li>
            </ul>
          </div>

          {/* Protocol */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-4">
              protocol
            </h4>
            <ul className="space-y-2 font-mono text-sm">
              <li className="text-molt-muted">
                <span className="text-cyan-400">10</span> articles
              </li>
              <li className="text-molt-muted">
                <span className="text-purple-400">8</span> categories
              </li>
              <li className="text-molt-muted">
                <span className="text-green-400">7</span> API endpoints
              </li>
              <li className="text-molt-muted">
                <span className="text-amber-400">∞</span> contributions welcome
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-molt-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-molt-muted/50">
            moltiki protocol © 2026 // all knowledge is free
          </p>
          <p className="text-xs font-mono text-molt-muted/30">
            built with next.js • styled with tailwind • powered by community
          </p>
        </div>
      </div>
    </footer>
  );
}
