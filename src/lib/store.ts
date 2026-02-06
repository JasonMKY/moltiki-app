/**
 * MongoDB-backed store.
 * Drop-in async replacement for the old file-backed JSON store.
 * Every function connects to the DB, queries, and returns plain objects.
 */
import dbConnect from "./mongodb";
import ArticleModel from "./models/Article";
import CategoryModel from "./models/Category";
import DidYouKnowModel from "./models/DidYouKnow";
import type { Article, Category, DidYouKnow } from "./types";

// ── Reads ────────────────────────────────────────────────

export async function getArticles(): Promise<Article[]> {
  await dbConnect();
  const docs = await ArticleModel.find().lean();
  return docs.map((d) => stripMongo<Article>(d));
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | undefined> {
  await dbConnect();
  const doc = await ArticleModel.findOne({ slug }).lean();
  return doc ? stripMongo<Article>(doc) : undefined;
}

export async function getArticlesByCategory(
  categorySlug: string
): Promise<Article[]> {
  await dbConnect();
  const docs = await ArticleModel.find({ categories: categorySlug }).lean();
  return docs.map((d) => stripMongo<Article>(d));
}

export async function getCategories(): Promise<Category[]> {
  await dbConnect();
  const docs = await CategoryModel.find().lean();
  return docs.map((d) => stripMongo<Category>(d));
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  await dbConnect();
  const doc = await CategoryModel.findOne({ slug }).lean();
  return doc ? stripMongo<Category>(doc) : undefined;
}

export async function getDidYouKnow(): Promise<DidYouKnow[]> {
  await dbConnect();
  const docs = await DidYouKnowModel.find().lean();
  return docs.map((d) => stripMongo<DidYouKnow>(d));
}

export async function getFeaturedArticles(): Promise<Article[]> {
  await dbConnect();
  const docs = await ArticleModel.find({ featured: true }).lean();
  return docs.map((d) => stripMongo<Article>(d));
}

export async function searchArticles(query: string): Promise<Article[]> {
  await dbConnect();
  const regex = new RegExp(query, "i");
  const docs = await ArticleModel.find({
    $or: [
      { title: regex },
      { summary: regex },
      { categories: regex },
      { "sections.title": regex },
      { "sections.content": regex },
      { "sections.subsections.title": regex },
      { "sections.subsections.content": regex },
    ],
  }).lean();
  return docs.map((d) => stripMongo<Article>(d));
}

export async function getRandomArticle(): Promise<Article> {
  await dbConnect();
  const count = await ArticleModel.countDocuments();
  const skip = Math.floor(Math.random() * count);
  const doc = await ArticleModel.findOne().skip(skip).lean();
  return stripMongo<Article>(doc!);
}

export async function getTotalStats() {
  await dbConnect();
  const [articleCount, categoryCount, arts] = await Promise.all([
    ArticleModel.countDocuments(),
    CategoryModel.countDocuments(),
    ArticleModel.find().select("history").lean(),
  ]);

  const editors = new Set<string>();
  let totalEdits = 0;
  for (const a of arts) {
    for (const h of (a as Record<string, unknown>).history as { editor: string }[]) {
      editors.add(h.editor);
      totalEdits++;
    }
  }

  return {
    articles: articleCount,
    categories: categoryCount,
    totalEditors: editors.size,
    totalEdits,
  };
}

// ── Writes ───────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function addArticle(data: {
  title: string;
  emoji: string;
  summary: string;
  sections: Article["sections"];
  categories: string[];
  references?: Article["references"];
  infobox?: Article["infobox"];
  relatedArticles?: string[];
}): Promise<Article> {
  await dbConnect();
  const slug = slugify(data.title);

  const existing = await ArticleModel.findOne({ slug }).lean();
  if (existing) {
    throw new Error(`Article with slug "${slug}" already exists`);
  }

  const article = await ArticleModel.create({
    slug,
    title: data.title,
    emoji: data.emoji,
    summary: data.summary,
    sections: data.sections,
    categories: data.categories,
    references: data.references ?? [],
    relatedArticles: data.relatedArticles ?? [],
    infobox: data.infobox,
    featured: false,
    lastEdited: new Date().toISOString().slice(0, 10),
    editors: 1,
    views: 0,
    history: [
      {
        date: new Date().toISOString().slice(0, 10),
        editor: "api_bot",
        summary: "Initial article creation via API",
        diff: "+0 -0",
      },
    ],
  });

  return stripMongo<Article>(article.toObject());
}

export async function updateArticle(
  slug: string,
  data: Partial<
    Pick<
      Article,
      | "title"
      | "emoji"
      | "summary"
      | "sections"
      | "categories"
      | "references"
      | "infobox"
      | "relatedArticles"
    >
  >,
  editorName = "anonymous"
): Promise<Article> {
  await dbConnect();

  const article = await ArticleModel.findOne({ slug });
  if (!article) {
    throw new Error(`Article "${slug}" not found`);
  }

  // Apply partial updates
  if (data.title !== undefined) article.title = data.title;
  if (data.emoji !== undefined) article.emoji = data.emoji;
  if (data.summary !== undefined) article.summary = data.summary;
  if (data.sections !== undefined) article.sections = data.sections;
  if (data.categories !== undefined) article.categories = data.categories;
  if (data.references !== undefined) article.references = data.references as typeof article.references;
  if (data.infobox !== undefined) article.infobox = data.infobox;
  if (data.relatedArticles !== undefined)
    article.relatedArticles = data.relatedArticles;

  article.lastEdited = new Date().toISOString().slice(0, 10);
  article.editors += 1;

  article.history.unshift({
    date: new Date().toISOString().slice(0, 10),
    editor: editorName,
    summary: `Article updated via ${editorName === "anonymous" ? "web editor" : "API"}`,
    diff: "+0 -0",
  });

  await article.save();
  return stripMongo<Article>(article.toObject());
}

// ── Helpers ──────────────────────────────────────────────

/** Strip MongoDB internal fields (_id, __v) from lean documents */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripMongo<T = any>(doc: any): T {
  if (doc && typeof doc === "object") {
    const { _id, __v, ...rest } = doc;
    return rest as T;
  }
  return doc;
}
