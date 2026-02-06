import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getCategoryBySlug, getCategories } from "@/lib/store";
import { TableOfContents } from "@/components/TableOfContents";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleActions } from "@/components/ArticleActions";
import type { Section } from "@/lib/types";
import type { Metadata } from "next";

function extractPlainText(sections: Section[]): string {
  let text = "";
  for (const s of sections) {
    text += `## ${s.title}\n\n`;
    text += s.content.replace(/<[^>]*>/g, "").trim() + "\n\n";
    if (s.subsections) {
      for (const sub of s.subsections) {
        text += `### ${sub.title}\n\n`;
        text += sub.content.replace(/<[^>]*>/g, "").trim() + "\n\n";
      }
    }
  }
  return text;
}

interface PageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found | moltiki" };
  return {
    title: `${article.title} | moltiki`,
    description: article.summary,
  };
}

function SectionContent({ section, depth = 2 }: { section: Section; depth?: number }) {
  const HeadingTag = depth === 2 ? "h2" : "h3";
  const headingClass =
    depth === 2
      ? "font-mono font-bold text-xl text-molt-text mb-4 flex items-center gap-3"
      : "font-mono font-semibold text-base text-molt-text/90 mb-3 flex items-center gap-2";

  return (
    <div className="mb-8">
      <HeadingTag id={section.id} className={headingClass}>
        {depth === 2 && <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full" />}
        {depth === 3 && <span className="text-cyan-500 text-xs font-mono">#</span>}
        {section.title}
      </HeadingTag>
      {section.content && (
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      )}
      {section.subsections?.map((sub) => (
        <SectionContent key={sub.id} section={sub} depth={3} />
      ))}
    </div>
  );
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // Fetch related articles in parallel
  const relatedArticles = (
    await Promise.all(
      article.relatedArticles.map((slug) => getArticleBySlug(slug))
    )
  ).filter(Boolean);

  // Fetch category names for breadcrumbs and tags
  const categoryMap = new Map<string, { name: string; emoji: string }>();
  const allCategories = await getCategories();
  for (const cat of allCategories) {
    categoryMap.set(cat.slug, { name: cat.name, emoji: cat.emoji });
  }

  const firstCat = article.categories[0]
    ? categoryMap.get(article.categories[0])
    : undefined;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-molt-muted mb-6">
        <Link href="/" className="hover:text-molt-text transition-colors">
          moltiki
        </Link>
        <span className="text-molt-border">/</span>
        {article.categories[0] && (
          <>
            <Link
              href={`/category/${article.categories[0]}`}
              className="hover:text-molt-text transition-colors"
            >
              {firstCat?.name || article.categories[0]}
            </Link>
            <span className="text-molt-border">/</span>
          </>
        )}
        <span className="text-molt-text">{article.title}</span>
      </nav>

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Article header */}
          <header className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{article.emoji}</span>
              <div>
                <h1 className="font-mono font-bold text-3xl text-molt-text mb-2">
                  {article.title}
                </h1>
                <p className="text-molt-muted leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>

            {/* Action bar */}
            <ArticleActions
              slug={article.slug}
              title={article.title}
              emoji={article.emoji}
              lastEdited={article.lastEdited}
              editors={article.editors}
              views={article.views}
              articleContent={extractPlainText(article.sections)}
            />

            <div className="h-px bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-transparent mt-4" />
          </header>

          {/* Infobox (mobile: above content) */}
          {article.infobox && (
            <div className="xl:hidden mb-8">
              <div className="card rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 px-4 py-2 border-b border-molt-border">
                  <h3 className="font-mono text-sm font-semibold text-molt-text flex items-center gap-2">
                    <span>{article.emoji}</span>
                    {article.title}
                  </h3>
                </div>
                <div className="p-4">
                  <dl className="space-y-2">
                    {Object.entries(article.infobox).map(([key, value]) => (
                      <div key={key} className="flex gap-3">
                        <dt className="font-mono text-xs text-molt-muted min-w-[100px] flex-shrink-0">
                          {key}
                        </dt>
                        <dd className="font-mono text-xs text-molt-text">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* TOC (mobile) */}
          <div className="xl:hidden mb-8">
            <TableOfContents sections={article.sections} />
          </div>

          {/* Article sections */}
          <div className="space-y-2">
            {article.sections.map((section) => (
              <SectionContent key={section.id} section={section} />
            ))}
          </div>

          {/* Categories */}
          <div className="mt-8 pt-6 border-t border-molt-border">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-3">
              categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.categories.map((catSlug) => {
                const cat = categoryMap.get(catSlug);
                return (
                  <Link
                    key={catSlug}
                    href={`/category/${catSlug}`}
                    className="tag-purple"
                  >
                    {cat?.emoji} {cat?.name || catSlug}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* References */}
          {article.references.length > 0 && (
            <div className="mt-8 pt-6 border-t border-molt-border">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-3">
                references
              </h3>
              <ol className="space-y-2">
                {article.references.map((ref) => (
                  <li key={ref.id} className="flex gap-2 text-xs">
                    <span className="font-mono text-purple-400 flex-shrink-0">
                      [{ref.id}]
                    </span>
                    <span className="text-molt-muted">
                      {ref.text}
                      {ref.url && (
                        <span className="text-cyan-400 ml-1">↗</span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-8 pt-6 border-t border-molt-border">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-3">
                related articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.map(
                  (related) =>
                    related && (
                      <ArticleCard
                        key={related.slug}
                        article={related}
                        variant="compact"
                      />
                    )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar - TOC + Infobox (desktop) */}
        <div className="hidden xl:block w-72 flex-shrink-0 space-y-6">
          {article.infobox && (
            <div className="card rounded-lg overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 px-4 py-2 border-b border-molt-border">
                <h3 className="font-mono text-xs font-semibold text-molt-text flex items-center gap-2">
                  <span>{article.emoji}</span>
                  {article.title}
                </h3>
              </div>
              <div className="p-4">
                <dl className="space-y-2">
                  {Object.entries(article.infobox).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-mono text-[10px] text-molt-muted uppercase tracking-wider">
                        {key}
                      </dt>
                      <dd className="font-mono text-xs text-molt-text mt-0.5">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          <TableOfContents sections={article.sections} />
        </div>
      </div>
    </div>
  );
}
