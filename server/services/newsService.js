import Sentiment from "sentiment";

const sentimentAnalyzer = new Sentiment();

/**
 * News Service
 * Uses NewsAPI.org to fetch real news articles and analyze sentiment.
 */

const NEWS_API_BASE = "https://newsapi.org/v2";

/**
 * Fetch latest news articles for a keyword and analyze sentiment.
 */
export async function getNewsData(keyword) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.warn("⚠️  NEWS_API_KEY not set — news data unavailable");
    return {
      success: false,
      configured: false,
      articles: [],
      mentionCount: 0,
      sentimentScore: 50,
      sentimentLabel: "Neutral",
      topHeadlines: [],
      note: "News API key not configured. Get a free key at newsapi.org",
    };
  }

  try {
    // Fetch everything endpoint for broader results
    const url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(keyword)}&sortBy=publishedAt&pageSize=50&language=en&apiKey=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`NewsAPI ${response.status}: ${errData?.message || "Unknown error"}`);
    }

    const data = await response.json();
    const articles = data.articles || [];

    if (articles.length === 0) {
      return {
        success: true,
        configured: true,
        articles: [],
        mentionCount: 0,
        sentimentScore: 50,
        sentimentLabel: "Neutral",
        topHeadlines: [],
      };
    }

    // Analyze sentiment from headlines and descriptions
    let totalSentiment = 0;
    let sentimentCount = 0;

    const topHeadlines = [];

    articles.forEach((article) => {
      const text = `${article.title || ""} ${article.description || ""}`.trim();
      if (text) {
        const result = sentimentAnalyzer.analyze(text);
        totalSentiment += result.comparative;
        sentimentCount++;
      }

      if (topHeadlines.length < 8) {
        topHeadlines.push({
          title: article.title,
          source: article.source?.name || "Unknown",
          url: article.url,
          publishedAt: article.publishedAt,
          description: article.description?.substring(0, 200),
          image: article.urlToImage,
        });
      }
    });

    // Calculate sentiment score (0-100 scale)
    const avgSentiment = sentimentCount > 0 ? totalSentiment / sentimentCount : 0;
    const sentimentScore = Math.max(0, Math.min(100, Math.round((avgSentiment + 0.5) * 100)));
    const sentimentLabel = sentimentScore > 60 ? "Positive" : sentimentScore > 40 ? "Neutral" : "Negative";

    return {
      success: true,
      configured: true,
      articles: articles.length,
      mentionCount: data.totalResults || articles.length,
      sentimentScore,
      sentimentLabel,
      topHeadlines,
    };
  } catch (error) {
    console.error("News API error:", error.message);
    return {
      success: false,
      configured: true,
      articles: [],
      mentionCount: 0,
      sentimentScore: 50,
      sentimentLabel: "Neutral",
      topHeadlines: [],
      error: error.message,
    };
  }
}
