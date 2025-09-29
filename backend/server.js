import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import { router as adminRouter } from "./routes/admin.js";
import { router as articleRouter } from "./routes/articles.js";
import { router as authRouter } from "./routes/auth.js";
import { router as commentRouter } from "./routes/comments.js";
import "./strategies/google.js";

const app = express();

// Security & basics
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS (credentials for session cookies)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// DB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("[TrendWise] Missing MONGODB_URI");
  process.exit(1);
}
await mongoose.connect(MONGODB_URI);
console.log("[TrendWise] MongoDB connected");

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
