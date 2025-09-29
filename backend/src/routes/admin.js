const { Router } = require("express");
const {
  deleteArticle,
  generateArticle,
  updateArticle,
} = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");

const router = Router();

router.post("/generate", requireAdmin, generateArticle);
router.patch("/article/:slug", requireAdmin, updateArticle);
router.delete("/article/:slug", requireAdmin, deleteArticle);

module.exports.router = router;
