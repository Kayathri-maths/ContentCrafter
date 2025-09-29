const { Comment } = require("../models/Comment.js");

// GET /api/comments/:slug
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ slug: req.params.slug })
      .sort({ createdAt: -1 })
      .populate("user", "name avatar email")
      .lean();

    res.json({ items: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/comment
const createComment = async (req, res) => {
  try {
    const { slug, content } = req.body;
    if (!slug || !content) {
      return res.status(400).json({ error: "Missing slug/content" });
    }

    const created = await Comment.create({
      slug,
      content,
      user: req.user._id,
    });

    await created.populate("user", "name avatar email");
    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getComments,
  createComment,
};
