/**
 * Scoring Engine
 *
 * Aggregates data from all sources (Google Trends, Reddit, Twitter, News)
 * into a unified trend analysis with actionable scores and recommendations.
 */

/**
 * Calculate the composite trend analysis from all source data.
 *
 * @param {string} keyword
 * @param {object} googleData  — from googleTrends service
 * @param {object} redditData  — from redditService
 * @param {object} twitterData — from twitterService
 * @param {object} newsData    — from newsService
 * @returns {object} Full trend analysis result
 */
export function calculateTrendScore(keyword, googleData, redditData, twitterData, newsData) {
  // ── Weighted Trend Score ────────────────────────────────────
  // Google Trends carries the most weight (direct search interest)
  const googleScore = googleData.currentScore || 50;
  const redditSentiment = redditData.sentimentScore || 50;
  const twitterSentiment = twitterData.configured ? (twitterData.sentimentScore || 50) : null;
  const newsSentiment = newsData.sentimentScore || 50;

  // Weights: Google 40%, Reddit 25%, News 20%, Twitter 15%
  let totalWeight = 0;
  let weightedSum = 0;

  weightedSum += googleScore * 0.40;
  totalWeight += 0.40;

  weightedSum += redditSentiment * 0.25;
  totalWeight += 0.25;

  weightedSum += newsSentiment * 0.20;
  totalWeight += 0.20;

  if (twitterSentiment !== null) {
    weightedSum += twitterSentiment * 0.15;
    totalWeight += 0.15;
  }

  // Normalize to 0-100
  const trendScore = Math.round(weightedSum / totalWeight);

  // ── Growth Potential ────────────────────────────────────────
  const googleGrowth = googleData.growth || 0;
  const mentionVelocity = redditData.mentions > 500 ? 15 : redditData.mentions > 100 ? 8 : 0;
  const newsBoost = (newsData.mentionCount || 0) > 100 ? 10 : (newsData.mentionCount || 0) > 20 ? 5 : 0;

  const growthPotential = Math.max(-50, Math.min(100, googleGrowth + mentionVelocity + newsBoost));

  // ── Risk Level ──────────────────────────────────────────────
  // Based on sentiment spread, growth volatility, and competition signals
  const sentimentSpread = Math.abs(redditSentiment - newsSentiment);
  const isVolatile = Math.abs(googleGrowth) > 40;
  const lowEngagement = redditData.mentions < 20 && (newsData.mentionCount || 0) < 5;

  let riskLevel;
  if (trendScore > 70 && sentimentSpread < 25 && !isVolatile) {
    riskLevel = "Low";
  } else if (trendScore < 35 || sentimentSpread > 40 || lowEngagement) {
    riskLevel = "High";
  } else {
    riskLevel = "Medium";
  }

  // ── Competition Level ───────────────────────────────────────
  const totalMentions = (redditData.mentions || 0) + (newsData.mentionCount || 0) + (twitterData.mentions || 0);
  const competitionLevel = totalMentions > 5000 ? "High" : totalMentions > 500 ? "Medium" : "Low";

  // Generate competitor data from related queries
  const competitors = generateCompetitorData(keyword, googleData);
  const competitorSaturation = competitors.reduce((a, c) => a + c.marketShare, 0);

  // ── Market Sentiment ────────────────────────────────────────
  const activeSources = [redditSentiment, newsSentiment];
  if (twitterSentiment !== null) activeSources.push(twitterSentiment);
  const marketSentiment = Math.round(activeSources.reduce((a, b) => a + b, 0) / activeSources.length);
  const sentimentLabel = marketSentiment > 60 ? "Positive" : marketSentiment > 40 ? "Neutral" : "Negative";

  // ── Recommendation ──────────────────────────────────────────
  let recommendation;
  if (trendScore >= 70 && growthPotential >= 20 && riskLevel !== "High") {
    recommendation = "Launch Now";
  } else if (trendScore >= 45 && riskLevel !== "High") {
    recommendation = "Watch Closely";
  } else {
    recommendation = "Avoid Entry";
  }

  // ── Market Size Estimate ────────────────────────────────────
  const marketMultiplier = trendScore > 70 ? 5 : trendScore > 50 ? 2 : 1;
  const marketSize = `$${Math.round((totalMentions * marketMultiplier) / 1000) || 1}B`;

  // ── Sources summary ────────────────────────────────────────
  const sources = [
    {
      source: "Google Trends",
      mentions: googleData.totalDataPoints ? googleData.totalDataPoints * 1000 : 50000,
      sentiment: googleScore,
    },
    {
      source: "Reddit",
      mentions: redditData.mentions || 0,
      sentiment: redditSentiment,
    },
    {
      source: "Twitter/X",
      mentions: twitterData.mentions || 0,
      sentiment: twitterData.configured ? (twitterData.sentimentScore || 50) : 0,
    },
    {
      source: "News",
      mentions: newsData.mentionCount || 0,
      sentiment: newsSentiment,
    },
  ];

  // ── Opportunities ──────────────────────────────────────────
  const opportunities = generateOpportunities(keyword, googleData, redditData, newsData, trendScore, growthPotential);

  // ── Trend History ──────────────────────────────────────────
  const trendHistory = googleData.trendHistory || [];

  return {
    keyword,
    trendScore,
    growth: `${growthPotential >= 0 ? "+" : ""}${growthPotential}%`,
    growthRaw: growthPotential,
    riskLevel,
    recommendation,
    sentiment: { label: sentimentLabel, score: marketSentiment },
    sources,
    competitors,
    trendHistory,
    opportunities,
    analysisDate: new Date().toISOString(),
    marketSize,
    demandSpike: trendScore > 70 && growthPotential > 30,
    competitorSaturation,
    competitionLevel,

    // Raw source data for debugging / detailed reports
    sourceData: {
      google: {
        score: googleScore,
        growth: googleGrowth,
        relatedQueries: googleData.relatedQueries || [],
        regions: googleData.regions || [],
      },
      reddit: {
        mentions: redditData.mentions,
        sentiment: redditSentiment,
        topPosts: redditData.topPosts || [],
        subreddits: redditData.subreddits || [],
      },
      twitter: {
        configured: twitterData.configured,
        mentions: twitterData.mentions,
        engagement: twitterData.engagementScore,
      },
      news: {
        configured: newsData.configured !== false,
        mentionCount: newsData.mentionCount,
        sentiment: newsSentiment,
        topHeadlines: newsData.topHeadlines || [],
      },
    },
  };
}

/**
 * Generate competitor data based on related queries and keyword patterns.
 */
function generateCompetitorData(keyword, googleData) {
  const baseWord = keyword.split(" ")[0];
  const relatedQueries = googleData.relatedQueries?.rising || [];

  // Use real related queries as "competitors" when available
  if (relatedQueries.length >= 3) {
    return relatedQueries.slice(0, 3).map((q, i) => ({
      name: q.query || `${baseWord}${["Pro", "Hub", "AI"][i]}`,
      marketShare: Math.max(5, Math.min(35, Math.round(100 / (i + 3)))),
      growth: typeof q.value === "number" ? Math.min(q.value, 100) : 10 + i * 5,
    }));
  }

  // Fallback competitor generation
  return [
    { name: `${baseWord}Pro`, marketShare: Math.round(15 + Math.random() * 15), growth: Math.round(Math.random() * 25) },
    { name: `${baseWord}Hub`, marketShare: Math.round(10 + Math.random() * 12), growth: Math.round(Math.random() * 18) },
    { name: `${baseWord}AI`, marketShare: Math.round(5 + Math.random() * 15), growth: Math.round(Math.random() * 35) },
  ];
}

/**
 * Generate opportunity alerts from analyzed data.
 */
function generateOpportunities(keyword, googleData, redditData, newsData, trendScore, growth) {
  const opportunities = [];

  // Google Trends based
  if (growth > 30) {
    opportunities.push(`Search volume grew ${growth}% month-over-month — strong upward momentum.`);
  }

  // Regional opportunities
  const topRegion = googleData.regions?.[0];
  if (topRegion) {
    opportunities.push(`Highest interest detected in ${topRegion.name} region (score: ${topRegion.value}).`);
  }

  // Reddit based
  if (redditData.mentions > 500) {
    opportunities.push(`High Reddit buzz: ${redditData.mentions.toLocaleString()} mentions across ${redditData.subreddits?.length || 0} subreddits.`);
  }

  if (redditData.sentimentScore > 70) {
    opportunities.push(`Very positive community sentiment on Reddit (${redditData.sentimentScore}/100).`);
  }

  // News based
  if ((newsData.mentionCount || 0) > 50) {
    opportunities.push(`Trending in news: ${newsData.mentionCount} articles published recently.`);
  }

  // Trend score based
  if (trendScore > 75) {
    opportunities.push(`Trend Score ${trendScore}/100 — this keyword is in high-demand territory.`);
  }

  // Rising queries
  const risingQueries = googleData.relatedQueries?.rising || [];
  if (risingQueries.length > 0) {
    opportunities.push(`Related rising queries: "${risingQueries.slice(0, 3).map(q => q.query).join('", "')}"`);
  }

  // Always return at least 2
  if (opportunities.length < 2) {
    opportunities.push(`Moderate interest detected — consider niche positioning for "${keyword}".`);
    opportunities.push("Monitor for 2–4 weeks before committing significant resources.");
  }

  return opportunities.slice(0, 5);
}
