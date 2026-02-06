/**
 * Seed script: Populates MongoDB with data from data/articles.json.
 *
 * Usage:
 *   1. Make sure MONGODB_URI is set in .env.local
 *   2. Run: npx tsx src/lib/seed-db.ts
 *
 * This will:
 *   - Clear existing articles, categories, and didYouKnow collections
 *   - Insert all documents from the JSON seed file
 */
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import ArticleModel from "./models/Article";
import CategoryModel from "./models/Category";
import DidYouKnowModel from "./models/DidYouKnow";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI not found in .env.local");
  process.exit(1);
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected!\n");

  // Read seed data
  const dataPath = path.join(process.cwd(), "data", "articles.json");
  if (!fs.existsSync(dataPath)) {
    console.error("ERROR: data/articles.json not found. Run the seed.ts script first.");
    process.exit(1);
  }

  const raw = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw) as {
    articles: Record<string, unknown>[];
    categories: Record<string, unknown>[];
    didYouKnow: Record<string, unknown>[];
  };

  // Clear existing data
  console.log("Clearing existing collections...");
  await Promise.all([
    ArticleModel.deleteMany({}),
    CategoryModel.deleteMany({}),
    DidYouKnowModel.deleteMany({}),
  ]);

  // Insert articles
  console.log(`Inserting ${data.articles.length} articles...`);
  await ArticleModel.insertMany(data.articles);

  // Insert categories
  console.log(`Inserting ${data.categories.length} categories...`);
  await CategoryModel.insertMany(data.categories);

  // Insert didYouKnow facts
  console.log(`Inserting ${data.didYouKnow.length} facts...`);
  await DidYouKnowModel.insertMany(data.didYouKnow);

  // Verify
  const articleCount = await ArticleModel.countDocuments();
  const categoryCount = await CategoryModel.countDocuments();
  const factCount = await DidYouKnowModel.countDocuments();

  console.log(`\nSeed complete!`);
  console.log(`  Articles:    ${articleCount}`);
  console.log(`  Categories:  ${categoryCount}`);
  console.log(`  Facts:       ${factCount}`);

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
