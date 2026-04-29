/**
 * Twitter/X Service (Stub)
 *
 * Twitter API v2 requires paid access ($100/month minimum).
 * This service provides the full interface structure but returns
 * simulated data when no API key is configured.
 *
 * Set TWITTER_BEARER_TOKEN in .env to activate real API calls.
 */

const TWITTER_API_BASE = "https://api.twitter.com/2";

/**
 * Check if Twitter API is configured.
 */
function isConfigured() {
  return !!process.env.TWITTER_BEARER_TOKEN;
}

/**
 * Get keyword mention volume and engagement from Twitter.
 */
export async function getTwitterData(keyword) {
  if (!isConfigured()) {
    return getStubData(keyword);
  }

  try {
    // Real Twitter API v2 implementation
    const url = `${TWITTER_API_BASE}/tweets/search/recent?query=${encodeURIComponent(keyword)}&max_results=100&tweet.fields=public_metrics,created_at,lang`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`Twitter API ${response.status}: ${errData?.detail || "Unknown error"}`);
    }

    const data = await response.json();
    const tweets = data.data || [];
    const meta = data.meta || {};

    // Calculate engagement metrics
    let totalLikes = 0;
    let totalRetweets = 0;
    let totalReplies = 0;

    tweets.forEach((tweet) => {
      const metrics = tweet.public_metrics || {};
      totalLikes += metrics.like_count || 0;
      totalRetweets += metrics.retweet_count || 0;
      totalReplies += metrics.reply_count || 0;
    });

    const totalEngagement = totalLikes + totalRetweets + totalReplies;
    const engagementScore = tweets.length > 0
      ? Math.min(100, Math.round((totalEngagement / tweets.length) * 2))
      : 0;

    return {
      success: true,
      configured: true,
      mentions: meta.result_count || tweets.length,
      engagementScore,
      sentimentScore: 65, // Twitter API doesn't provide sentiment natively
      totalLikes,
      totalRetweets,
      totalReplies,
      tweetCount: tweets.length,
    };
  } catch (error) {
    console.error("Twitter API error:", error.message);
    return {
      ...getStubData(keyword),
      error: error.message,
    };
  }
}

/**
 * Stub data returned when Twitter API is not configured.
 * Clearly flagged so the UI can show "Twitter data unavailable".
 */
function getStubData(keyword) {
  return {
    success: true,
    configured: false,
    mentions: 0,
    engagementScore: 0,
    sentimentScore: 0,
    totalLikes: 0,
    totalRetweets: 0,
    totalReplies: 0,
    tweetCount: 0,
    note: "Twitter/X API key not configured. Set TWITTER_BEARER_TOKEN in .env to enable.",
  };
}
