import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
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
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── API Routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api", trendRoutes);
app.use("/api/user", userRoutes);

// ── Health Check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    dbConnected: !!global.__dbConnected,
    env: isProd ? "production" : "development",
  });
});

// ── Serve Frontend (Production / Render) ────────────────────
// The dist/ folder lives at the project root (one level above server/).
const distPath = path.resolve(__dirname, "..", "dist");

if (fs.existsSync(distPath)) {
  console.log(`✅ Found frontend build at: ${distPath}`);
  
  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(distPath));

  // SPA fallback — any non-API route returns index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.log(`⚠️ Frontend build not found at: ${distPath}`);
  
  app.get("*", (req, res) => {
    res.status(404).send(`
      <h2>PredictX API is running!</h2>
      <p>But the frontend build was not found at <code>${distPath}</code>.</p>
      <p>Make sure Render ran the build command: <code>npm run render:build</code></p>
    `);
  });
}

// ── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: isProd ? "Server error" : err.message,
  });
});

// ── Start ───────────────────────────────────────────────────
const start = async () => {
  global.__dbConnected = await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 PredictX running at http://localhost:${PORT}`);
    console.log(`📊 Database: ${global.__dbConnected ? "Connected" : "Not configured"}`);
    console.log(`🔑 Auth: ${global.__dbConnected ? "Enabled" : "Disabled"}`);
    console.log(`🌐 Mode: ${isProd ? "Production (serving dist/)" : "Development"}`);
    console.log("");
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
