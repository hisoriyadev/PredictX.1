import googleTrends from "google-trends-api";

/**
 * Google Trends Service
 * Uses the unofficial google-trends-api package to fetch real trend data.
 * Includes retry logic for rate-limiting (Google sometimes returns HTML).
 */

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/**
 * Parse and validate a Google Trends API response string.
 * Throws if the response is HTML (rate-limited) or invalid JSON.
 */
function parseResponse(result) {
  if (typeof result === "string" && result.trim().startsWith("<")) {
    throw new Error("Rate-limited: Google returned HTML");
  }
  return JSON.parse(result);
}

/**
 * Get interest over time for a keyword (past 12 months).
 * Retries once with a 2s delay if rate-limited.
 */
export async function getInterestOverTime(keyword) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await googleTrends.interestOverTime({
        keyword,
        startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        granularTimeResolution: false,
      });

      const parsed = parseResponse(result);
      const timeline = parsed.default?.timelineData || [];

      // Aggregate weekly points into monthly averages
      const monthlyData = {};
      timeline.forEach((point) => {
        const date = new Date(parseInt(point.time) * 1000);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!monthlyData[key]) {
          monthlyData[key] = { month: MONTH_NAMES[date.getMonth()], scores: [] };
        }
        monthlyData[key].scores.push(point.value[0] || 0);
      });

      const trendHistory = Object.values(monthlyData)
        .map((m) => {
          const avg = Math.round(m.scores.reduce((a, b) => a + b, 0) / m.scores.length);
          return { month: m.month, score: avg, volume: avg * 500 };
        })
        .slice(-12);

      // Current interest = average of last 4 weekly data points
      const recentScores = timeline.slice(-4).map((p) => p.value[0] || 0);
      const currentScore = recentScores.length
        ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
        : 50;

      // Growth = % change between last 4 and previous 4 weeks
      const prevScores = timeline.slice(-8, -4).map((p) => p.value[0] || 0);
      const recentAvg = recentScores.reduce((a, b) => a + b, 0) / (recentScores.length || 1);
      const prevAvg   = prevScores.reduce((a, b) => a + b, 0)   / (prevScores.length   || 1);
      const growth = prevAvg > 0 ? Math.round(((recentAvg - prevAvg) / prevAvg) * 100) : 0;

      return { success: true, currentScore, growth, trendHistory, totalDataPoints: timeline.length };
    } catch (error) {
      console.warn(`Google Trends getInterestOverTime attempt ${attempt}/2: ${error.message}`);
      if (attempt < 2) await sleep(2500);
    }
  }

  // Both attempts failed — use fallback so other sources still score
  console.warn("Google Trends unavailable — using neutral fallback");
  return { success: false, currentScore: 50, growth: 0, trendHistory: generateFallbackHistory(), totalDataPoints: 0 };
}

/**
 * Get related rising queries for a keyword.
 */
export async function getRelatedQueries(keyword) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await googleTrends.relatedQueries({ keyword });
      const parsed = parseResponse(result);

      const rising = parsed.default?.rankedList?.[1]?.rankedKeyword || [];
      const top    = parsed.default?.rankedList?.[0]?.rankedKeyword || [];

      return {
        success: true,
        rising: rising.slice(0, 10).map((q) => ({ query: q.query, value: q.value })),
        top:    top.slice(0, 10).map((q)    => ({ query: q.query, value: q.value })),
      };
    } catch (error) {
      console.warn(`Google Trends getRelatedQueries attempt ${attempt}/2: ${error.message}`);
      if (attempt < 2) await sleep(2500);
    }
  }
  return { success: false, rising: [], top: [] };
}

/**
 * Get interest by region for a keyword.
 */
export async function getInterestByRegion(keyword) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await googleTrends.interestByRegion({ keyword, resolution: "COUNTRY" });
      const parsed = parseResponse(result);
      const regions = parsed.default?.geoMapData || [];

      return {
        success: true,
        regions: regions.slice(0, 20).map((r) => ({
          name:  r.geoName,
          code:  r.geoCode,
          value: r.value[0] || 0,
        })),
      };
    } catch (error) {
      console.warn(`Google Trends getInterestByRegion attempt ${attempt}/2: ${error.message}`);
      if (attempt < 2) await sleep(2500);
    }
  }
  return { success: false, regions: [] };
}

/**
 * Fallback history — neutral trending curve used when API is unavailable.
 */
function generateFallbackHistory() {
  return MONTH_NAMES.map((month, i) => ({
    month,
    score:  40 + i * 2 + Math.round(Math.random() * 8),
    volume: 5000 + i * 300 + Math.round(Math.random() * 2000),
  }));
}
