import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import {
  getCategories,
  getCategoryBySlug,
  getArticlesByCategory,
} from "@/lib/store";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found | moltiki" };
  return {
    title: `${category.name} | moltiki`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, categoryArticles, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getArticlesByCategory(slug),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-molt-muted">
        <Link href="/" className="hover:text-molt-text transition-colors">
          moltiki
        </Link>
        <span className="text-molt-border">/</span>
        <span className="text-molt-text">categories</span>
        <span className="text-molt-border">/</span>
        <span className="text-molt-text">{category.name}</span>
      </nav>

      {/* Header */}
      <header>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">{category.emoji}</span>
          <div>
            <h1 className="font-mono font-bold text-2xl text-molt-text">
              {category.name}
            </h1>
            <p className="text-sm text-molt-muted">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="tag-purple text-[10px]">
            {categoryArticles.length} articles
          </span>
          <div className="flex-1 h-px bg-molt-border" />
        </div>
      </header>

      {/* Articles */}
      {categoryArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">📭</span>
          <h3 className="font-mono text-lg text-molt-text mb-2">
            no articles yet
          </h3>
          <p className="text-sm text-molt-muted">
            this category is waiting for contributions
          </p>
        </div>
      )}

      {/* Other categories */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-mono font-bold text-lg text-molt-text">
            📁 other categories
          </h2>
          <div className="flex-1 h-px bg-molt-border" />
        </div>
        <div className="flex flex-wrap gap-2">
          {allCategories
            .filter((c) => c.slug !== slug)
            .map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="tag-cyan">
                {cat.emoji} {cat.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
