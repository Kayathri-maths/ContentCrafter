import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", CommentSchema);
