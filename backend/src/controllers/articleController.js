const { Article } = require("../models/Article.js");
const { makeSlug } = require("../utils/makeSlug.js");

// GET /api/articles?q=&page=&limit=
const getArticles = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 20 } = req.query;

    const find = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { "meta.description": { $regex: q, $options: "i" } },
            { "meta.keywords": { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Article.find(find)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Article.countDocuments(find),
    ]);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/article/:slug
const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).lean();
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/article
const createArticle = async (req, res) => {
  try {
    const { title, content, meta = {}, media = {} } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Missing title/content" });
    }

    const slug = makeSlug(title);

    const created = await Article.create({
      title,
      slug,
      content,
      meta,
      media,
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/article/:slug/like
const toggleLikeArticle = async (req, res) => {
  try {
    const slug = req.params.slug;
    const userId = req.user._id;

    const article = await Article.findOne({ slug });
    if (!article) return res.status(404).json({ error: "Not found" });

    const hasLiked = article.likedBy.some((id) => id.equals(userId));
    if (hasLiked) {
      article.likedBy = article.likedBy.filter((id) => !id.equals(userId));
    } else {
      article.likedBy.push(userId);
    }

    article.likesCount = article.likedBy.length;
    await article.save();

    res.json({ likesCount: article.likesCount, liked: !hasLiked });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getArticles,
  getArticleBySlug,
  createArticle,
  toggleLikeArticle,
};
