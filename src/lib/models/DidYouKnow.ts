import mongoose, { Schema, Document } from "mongoose";

const DidYouKnowSchema = new Schema(
  {
    fact: { type: String, required: true },
    articleSlug: { type: String, required: true },
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

export interface DidYouKnowDocument extends Document {
  fact: string;
  articleSlug: string;
}

export default mongoose.models.DidYouKnow ||
  mongoose.model<DidYouKnowDocument>("DidYouKnow", DidYouKnowSchema);
