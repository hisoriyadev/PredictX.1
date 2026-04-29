import Sentiment from "sentiment";

const sentiment = new Sentiment();

/**
 * Reddit Service
 * Uses Reddit's public JSON API (no auth required for search).
 * Falls back gracefully if Reddit is unreachable.
 */

const REDDIT_BASE = "https://www.reddit.com";

/**
 * Search Reddit for a keyword and analyze results.
 * Uses Reddit's public search JSON endpoint (no API key needed).
 */
export async function searchReddit(keyword) {
  try {
    const url = `${REDDIT_BASE}/search.json?q=${encodeURIComponent(keyword)}&sort=relevance&limit=50&t=month`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": process.env.REDDIT_USER_AGENT || "PredictX/1.0 (Trend Analysis Bot)",
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit API returned ${response.status}`);
    }

    const data = await response.json();
    const posts = data?.data?.children || [];

    if (posts.length === 0) {
      return {
        success: true,
        mentions: 0,
        sentimentScore: 50,
        sentimentLabel: "Neutral",
        topPosts: [],
        subreddits: [],
      };
    }

    // Analyze sentiment from post titles and self-text
    let totalSentiment = 0;
    let sentimentCount = 0;
    const subredditMap = {};
    const topPosts = [];

    posts.forEach((post) => {
      const p = post.data;

      // Sentiment analysis on title + selftext
      const text = `${p.title || ""} ${p.selftext || ""}`.trim();
      if (text) {
        const result = sentiment.analyze(text);
        totalSentiment += result.comparative;
        sentimentCount++;
      }

      // Track subreddits
      if (p.subreddit) {
        subredditMap[p.subreddit] = (subredditMap[p.subreddit] || 0) + 1;
      }

      // Collect top posts (first 5)
      if (topPosts.length < 5) {
        topPosts.push({
          title: p.title,
          subreddit: p.subreddit,
          score: p.score,
          numComments: p.num_comments,
          url: `https://reddit.com${p.permalink}`,
          created: new Date(p.created_utc * 1000).toISOString(),
        });
      }
    });

    // Calculate sentiment score (0-100 scale)
    const avgSentiment = sentimentCount > 0 ? totalSentiment / sentimentCount : 0;
    // Map from typical range [-0.5, 0.5] to [0, 100]
    const sentimentScore = Math.max(0, Math.min(100, Math.round((avgSentiment + 0.5) * 100)));
    const sentimentLabel = sentimentScore > 60 ? "Positive" : sentimentScore > 40 ? "Neutral" : "Negative";

    // Top subreddits
    const subreddits = Object.entries(subredditMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Estimate total mentions (search returns max 50, extrapolate)
    const totalMentions = posts.length >= 50
      ? Math.round(posts.reduce((sum, p) => sum + (p.data.num_comments || 0), 0) + posts.length * 20)
      : posts.reduce((sum, p) => sum + (p.data.num_comments || 0), 0) + posts.length;

    return {
      success: true,
      mentions: totalMentions,
      sentimentScore,
      sentimentLabel,
      topPosts,
      subreddits,
      postsAnalyzed: posts.length,
    };
  } catch (error) {
    console.error("Reddit search error:", error.message);
    return {
      success: false,
      mentions: 0,
      sentimentScore: 50,
      sentimentLabel: "Neutral",
      topPosts: [],
      subreddits: [],
      error: error.message,
    };
  }
}
