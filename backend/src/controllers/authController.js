const passport = require("passport");

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

const googleCallback = [
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth`,
  }),
  (req, res) => {
    // Success: redirect to frontend
    res.redirect(process.env.FRONTEND_URL || "/");
  },
];

const getCurrentUser = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const { _id, email, name, avatar, roles } = req.user;
    return res.json({ id: _id, email, name, avatar, roles });
  }
  return res.status(200).json(null);
};

const logoutUser = (req, res) => {
  req.logout?.((err) => {
    if (err) return res.status(500).json({ error: "Failed to logout" });
    req.session?.destroy?.(() => {
      res.clearCookie("trendwise.sid");
      res.json({ ok: true });
    });
  });
};

module.exports = {
  googleAuth,
  googleCallback,
  getCurrentUser,
  logoutUser,
};
