/**
 * Seed script: Run with `npx tsx src/lib/seed.ts` to generate data/articles.json
 * from the static article data.
 */
import * as fs from "fs";
import * as path from "path";
import { articles, categories, didYouKnow } from "./articles";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const payload = { articles, categories, didYouKnow };
fs.writeFileSync(
  path.join(dataDir, "articles.json"),
  JSON.stringify(payload, null, 2),
  "utf-8"
);

console.log(`Seeded ${articles.length} articles, ${categories.length} categories to data/articles.json`);
