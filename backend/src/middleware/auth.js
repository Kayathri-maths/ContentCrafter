export const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Authentication required" });
};

export const requireAdmin = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const roles = req.user?.roles || [];
    if (roles.includes("admin")) return next();
  }
  return res.status(403).json({ error: "Admin only" });
};
