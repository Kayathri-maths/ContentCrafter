const { Router } = require("express");
const {
  createArticle,
  getArticleBySlug,
  getArticles,
  toggleLikeArticle,
} = require("../controllers/articleController");
const { requireAuth } = require("../middleware/auth");

const router = Router();

router.get("/articles", getArticles);
router.get("/article/:slug", getArticleBySlug);
router.post("/article", createArticle);
router.post("/article/:slug/like", requireAuth, toggleLikeArticle);

module.exports.router = router;
