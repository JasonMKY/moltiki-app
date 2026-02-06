import mongoose, { Schema, Document } from "mongoose";

// Sub-schemas
const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    subsections: {
      type: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          content: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

const ReferenceSchema = new Schema(
  {
    id: { type: Number },
    text: { type: String },
    title: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const HistoryEntrySchema = new Schema(
  {
    date: { type: String, required: true },
    editor: { type: String, required: true },
    summary: { type: String, required: true },
    diff: { type: String, required: true },
  },
  { _id: false }
);

// Main Article schema
const ArticleSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    emoji: { type: String, required: true },
    summary: { type: String, required: true },
    sections: { type: [SectionSchema], default: [] },
    categories: { type: [String], default: [] },
    lastEdited: { type: String, required: true },
    editors: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    references: { type: [ReferenceSchema], default: [] },
    relatedArticles: { type: [String], default: [] },
    infobox: { type: Schema.Types.Mixed },
    featured: { type: Boolean, default: false },
    history: { type: [HistoryEntrySchema], default: [] },
  },
  {
    timestamps: false,
    // Return plain objects without __v and _id
    toJSON: {
      transform(_doc, ret) {
        const { _id, __v, ...rest } = ret;
        return rest;
      },
    },
    toObject: {
      transform(_doc, ret) {
        const { _id, __v, ...rest } = ret;
        return rest;
      },
    },
  }
);

// Text index for full-text search
ArticleSchema.index({ title: "text", summary: "text" });

export interface ArticleDocument extends Document {
  slug: string;
  title: string;
  emoji: string;
  summary: string;
  sections: {
    id: string;
    title: string;
    content: string;
    subsections?: { id: string; title: string; content: string }[];
  }[];
  categories: string[];
  lastEdited: string;
  editors: number;
  views: number;
  references: { id?: number; text?: string; title?: string; url?: string }[];
  relatedArticles: string[];
  infobox?: Record<string, string>;
  featured?: boolean;
  history: { date: string; editor: string; summary: string; diff: string }[];
}

export default mongoose.models.Article ||
  mongoose.model<ArticleDocument>("Article", ArticleSchema);
