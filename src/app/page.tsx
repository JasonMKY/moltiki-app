import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { HomeCTA } from "@/components/HomeCTA";
import {
  getArticles,
  getDidYouKnow,
  getFeaturedArticles,
  getTotalStats,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [articles, didYouKnow, featured, stats] = await Promise.all([
    getArticles(),
    getDidYouKnow(),
    getFeaturedArticles(),
    getTotalStats(),
  ]);

  const recentArticles = [...articles]
    .sort((a, b) => b.lastEdited.localeCompare(a.lastEdited))
    .slice(0, 5);
  const randomFacts = [...didYouKnow].sort(() => Math.random() - 0.5).slice(0, 4);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <section className="text-center py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent rounded-3xl" />
        <div className="relative">
          <span className="text-5xl mb-4 block">🦎</span>
          <h1 className="text-4xl sm:text-5xl font-mono font-bold mb-3">
            welcome to <span className="gradient-text">moltiki</span>
          </h1>
          <p className="text-lg text-molt-muted font-mono mb-2">
            the open knowledge protocol
          </p>
          <p className="text-sm text-molt-muted/60 max-w-lg mx-auto mb-8">
            a community-driven encyclopedia for the technically curious.
            decentralized knowledge, collaboratively maintained, freely accessible.
          </p>

          {/* Stats bar */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-purple-400">
                {stats.articles}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-molt-muted">
                articles
              </div>
            </div>
            <div className="w-px h-8 bg-molt-border" />
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-cyan-400">
                {stats.categories}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-molt-muted">
                categories
              </div>
            </div>
            <div className="w-px h-8 bg-molt-border" />
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-green-400">
                {stats.totalEditors}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-molt-muted">
                contributors
              </div>
            </div>
            <div className="w-px h-8 bg-molt-border" />
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-amber-400">
                {stats.totalEdits}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-molt-muted">
                total edits
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Register CTAs / Dashboard */}
      <HomeCTA />

      {/* Featured Articles */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-mono font-bold text-lg text-molt-text">
            ⭐ featured articles
          </h2>
          <div className="flex-1 h-px bg-molt-border" />
        </div>
        <div className="space-y-3">
          {featured.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              variant="featured"
            />
          ))}
        </div>
      </section>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Did you know */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-mono font-bold text-lg text-molt-text">
              💡 did you know
            </h2>
            <div className="flex-1 h-px bg-molt-border" />
          </div>
          <div className="card rounded-xl p-6">
            <ul className="space-y-4">
              {randomFacts.map((fact, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-purple-400 font-mono text-sm mt-0.5 flex-shrink-0">
                    →
                  </span>
                  <div>
                    <p className="text-sm text-molt-text/80 leading-relaxed">
                      {fact.fact}
                    </p>
                    <Link
                      href={`/article/${fact.articleSlug}`}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mt-1 inline-block"
                    >
                      read more →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent changes */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-mono font-bold text-lg text-molt-text">
              🕐 recent
            </h2>
            <div className="flex-1 h-px bg-molt-border" />
          </div>
          <div className="card rounded-xl p-4">
            <ul className="space-y-1">
              {recentArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/article/${article.slug}`}
                    className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-molt-surface transition-colors group"
                  >
                    <span className="text-sm">{article.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-molt-text group-hover:text-purple-400 transition-colors truncate">
                        {article.title}
                      </p>
                      <p className="text-[10px] text-molt-muted">
                        {article.lastEdited}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* All Articles */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-mono font-bold text-lg text-molt-text">
            📋 all articles
          </h2>
          <div className="flex-1 h-px bg-molt-border" />
          <span className="font-mono text-xs text-molt-muted">
            {articles.length} total
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-10">
        <div className="card-glow rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5" />
          <div className="relative">
            <h2 className="font-mono text-xl font-bold gradient-text mb-3">
              knowledge wants to be free
            </h2>
            <p className="text-sm text-molt-muted max-w-md mx-auto mb-6">
            moltiki is an open protocol. every article is maintained by the
            community. contribute, edit, and help build the knowledge layer.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/search" className="btn-primary">
                explore articles →
              </Link>
              <a href="/random" className="btn-secondary">
                🎲 random article
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
