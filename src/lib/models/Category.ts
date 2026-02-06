import mongoose, { Schema, Document } from "mongoose";

const CategorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    emoji: { type: String, required: true },
    description: { type: String, required: true },
    articleCount: { type: Number, default: 0 },
  },
  {
    timestamps: false,
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

export interface CategoryDocument extends Document {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  articleCount: number;
}

export default mongoose.models.Category ||
  mongoose.model<CategoryDocument>("Category", CategorySchema);
