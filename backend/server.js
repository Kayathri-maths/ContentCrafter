const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");

// Routes
const { router: adminRouter } = require("./src/routes/admin");
const { router: articleRouter } = require("./src/routes/article");
const { router: authRouter } = require("./src/routes/auth");
const { router: commentRouter } = require("./src/routes/comments");

// Passport strategy
require("./src/strategies/google");

const app = express();

// Security & basics
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("[TrendWise] Missing MONGODB_URI");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("[TrendWise] MongoDB connected"))
  .catch((err) => {
    console.error("[TrendWise] MongoDB connection error:", err);
    process.exit(1);
  });

// Sessions
const sessionStore = MongoStore.create({
  mongoUrl: MONGODB_URI,
  collectionName: "sessions",
});

app.use(
  session({
    name: "trendwise.sid",
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRouter);
app.use("/api", articleRouter);
app.use("/api", commentRouter);
app.use("/api", adminRouter);

// Errors
app.use((err, _req, res, _next) => {
  console.error("[TrendWise] Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[TrendWise] Server listening on :${PORT}`);
});
