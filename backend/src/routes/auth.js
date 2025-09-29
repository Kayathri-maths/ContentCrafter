const { Router } = require("express");
const {
  getCurrentUser,
  googleAuth,
  googleCallback,
  logoutUser,
} = require("../controllers/authController");

const router = Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/me", getCurrentUser);
router.post("/logout", logoutUser);

module.exports.router = router;
