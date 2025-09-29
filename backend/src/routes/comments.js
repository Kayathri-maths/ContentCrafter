const { Router } = require("express");
const {
  createComment,
  getComments,
} = require("../controllers/commentController");
const { requireAuth } = require("../middleware/auth");

const router = Router();

// Routes
router.get("/comments/:slug", getComments);
router.post("/comment", requireAuth, createComment);

module.exports.router = router;
