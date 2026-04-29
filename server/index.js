import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import trendRoutes from "./routes/trendRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api", trendRoutes);
app.use("/api/user", userRoutes);

// ── Health Check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    dbConnected: !!global.__dbConnected,
  });
});

// ── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Server error" : err.message,
  });
});

// ── Start ───────────────────────────────────────────────────
const start = async () => {
  // Connect to MongoDB (graceful fallback if not configured)
  global.__dbConnected = await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 PredictX API server running at http://localhost:${PORT}`);
    console.log(`📊 Database: ${global.__dbConnected ? "Connected" : "Not configured (running without DB)"}`);
    console.log(`🔑 Auth: ${global.__dbConnected ? "Enabled" : "Disabled (no DB)"}`);
    console.log("");
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
