import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ── Utility helpers ──────────────────────────────────────────────
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTrendData(keyword) {
  const score = randomBetween(42, 98);
  const growth = randomBetween(-10, 92);
  const risk = score > 75 ? "Low" : score > 50 ? "Medium" : "High";
  const sentimentScore = randomBetween(30, 95);
  const sentimentLabel =
    sentimentScore > 65 ? "Positive" : sentimentScore > 40 ? "Neutral" : "Negative";

  let recommendation;
  if (score >= 75 && growth >= 40) recommendation = "Launch Now";
  else if (score >= 50) recommendation = "Watch Closely";
  else recommendation = "Avoid Entry";

  const sources = [
    { source: "Reddit", mentions: randomBetween(1200, 18000), sentiment: randomBetween(55, 92) },
    { source: "Twitter/X", mentions: randomBetween(3000, 45000), sentiment: randomBetween(40, 88) },
    { source: "News", mentions: randomBetween(200, 5000), sentiment: randomBetween(45, 80) },
    { source: "Google Trends", mentions: randomBetween(5000, 120000), sentiment: randomBetween(50, 95) },
    { source: "YouTube", mentions: randomBetween(800, 22000), sentiment: randomBetween(60, 90) },
  ];

  const competitors = [
    { name: `${keyword.split(" ")[0]}Pro`, marketShare: randomBetween(8, 35), growth: randomBetween(-5, 30) },
    { name: `${keyword.split(" ")[0]}Hub`, marketShare: randomBetween(5, 25), growth: randomBetween(-8, 22) },
    { name: `${keyword.split(" ")[0]}AI`, marketShare: randomBetween(3, 20), growth: randomBetween(0, 40) },
  ];

  const trendHistory = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    score: Math.max(10, score - randomBetween(0, 40) + i * randomBetween(1, 5)),
    volume: randomBetween(1000, 50000),
  }));

  const opportunities = [
    `High demand spike detected in ${pickRandom(["Asia-Pacific", "North America", "Europe", "LATAM"])} region`,
    `${randomBetween(3, 12)} competitors exited this space last quarter`,
    `Search volume grew ${randomBetween(30, 150)}% month-over-month`,
    `Emerging ${pickRandom(["TikTok", "Instagram", "YouTube", "Podcast"])} content trend aligns with keyword`,
  ];

  return {
    keyword,
    trendScore: score,
    growth: `+${growth}%`,
    growthRaw: growth,
    riskLevel: risk,
    recommendation,
    sentiment: { label: sentimentLabel, score: sentimentScore },
    sources,
    competitors,
    trendHistory,
    opportunities: opportunities.slice(0, randomBetween(2, 4)),
    analysisDate: new Date().toISOString(),
    marketSize: `$${randomBetween(1, 850)}B`,
    demandSpike: score > 70,
    competitorSaturation: competitors.reduce((a, c) => a + c.marketShare, 0),
  };
}

// ── Routes ───────────────────────────────────────────────────────
app.post("/api/analyze-trend", (req, res) => {
  const { keyword } = req.body;
  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({ error: "Keyword is required" });
  }

  // Simulate processing delay
  setTimeout(() => {
    const data = generateTrendData(keyword.trim());
    res.json({ success: true, data });
  }, 1400);
});

app.get("/api/dashboard-data", (req, res) => {
  const trendingKeywords = [
    "AI wearables",
    "eco-friendly packaging",
    "vertical farming",
    "neuro gaming",
    "quantum SaaS",
  ];

  const recentAnalyses = trendingKeywords.map((kw) => generateTrendData(kw));

  const overallMetrics = {
    totalAnalyses: randomBetween(1200, 9800),
    trendsTracked: randomBetween(340, 1200),
    alertsGenerated: randomBetween(80, 450),
    accuracyRate: `${randomBetween(87, 97)}%`,
  };

  const marketOverview = [
    { name: "Technology", value: randomBetween(20, 40), color: "#6366f1" },
    { name: "Health & Wellness", value: randomBetween(10, 25), color: "#10b981" },
    { name: "Sustainability", value: randomBetween(8, 20), color: "#06b6d4" },
    { name: "Finance", value: randomBetween(8, 18), color: "#a855f7" },
    { name: "Consumer Goods", value: randomBetween(5, 15), color: "#f59e0b" },
  ];

  const weeklyActivity = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    analyses: randomBetween(30, 200),
    alerts: randomBetween(5, 60),
  }));

  res.json({
    success: true,
    data: {
      overallMetrics,
      recentAnalyses,
      marketOverview,
      weeklyActivity,
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 PredictX API server running at http://localhost:${PORT}`);
});
