const mongoose = require("mongoose");

const MetaSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    keywords: [String],
  },
  { _id: false }
);

const MediaSchema = new mongoose.Schema(
  {
    images: [String],
    videos: [String], // URLs
    tweets: [String], // tweet URLs
  },
  { _id: false }
);

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    meta: MetaSchema,
    media: MediaSchema,
    content: { type: String, required: true }, // HTML
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    likesCount: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", ArticleSchema);

module.exports = { Article };
