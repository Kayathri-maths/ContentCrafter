const { Article } = require("../models/Article.js");
const { generateArticleForTopic } = require("../services/openai.js");
const {
  fetchTrendingTopics,
  scrapeResources,
} = require("../services/scraper.js");
const { makeSlug } = require("../utils/makeSlug.js");

// POST /api/admin/generate
const generateArticle = async (req, res, next) => {
  try {
    let { topic } = req.body;

    // If no topic is provided, fetch trending
    if (!topic) {
      const trends = await fetchTrendingTopics(1);
      topic = trends[0];
    }

    // Scrape resources & generate with OpenAI
    const resources = await scrapeResources(topic);
    const generated = await generateArticleForTopic(topic, resources);
    const slug = makeSlug(generated.title);

    const created = await Article.create({
      title: generated.title,
      slug,
      meta: generated.meta,
      media: generated.media,
      content: generated.content,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/article/:slug
const updateArticle = async (req, res) => {
  try {
    const updated = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating article:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/admin/article/:slug
const deleteArticle = async (req, res) => {
  try {
    const deleted = await Article.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  generateArticle,
  updateArticle,
  deleteArticle,
};
