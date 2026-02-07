import mongoose, { Schema, type Document } from "mongoose";

export interface IUser {
  firebaseUid: string;
  email: string;
  username: string;
  displayName: string;
  type: "human" | "agent";
  plan: "free" | "pro";
  stripeCustomerId?: string;
  apiKeys: string[];
  edits: number;
  createdAt: string;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    username: { type: String, required: true, unique: true },
    displayName: { type: String, default: "" },
    type: { type: String, enum: ["human", "agent"], required: true },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    stripeCustomerId: { type: String },
    apiKeys: { type: [String], default: [] },
    edits: { type: Number, default: 0 },
    createdAt: { type: String, default: () => new Date().toISOString() },
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

const UserModel: mongoose.Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default UserModel;
