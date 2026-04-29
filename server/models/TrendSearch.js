import mongoose from "mongoose";

const trendSearchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Allow anonymous searches
    },
    keyword: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    trendScore: {
      type: Number,
      required: true,
    },
    growth: String,
    growthRaw: Number,
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    recommendation: {
      type: String,
      enum: ["Launch Now", "Watch Closely", "Avoid Entry"],
    },
    sentiment: {
      label: String,
      score: Number,
    },
    sourceData: {
      type: mongoose.Schema.Types.Mixed, // Full JSON blob from all APIs
      default: {},
    },
    sources: [
      {
        source: String,
        mentions: Number,
        sentiment: Number,
      },
    ],
    competitors: [
      {
        name: String,
        marketShare: Number,
        growth: Number,
      },
    ],
    trendHistory: [
      {
        month: String,
        score: Number,
        volume: Number,
      },
    ],
    opportunities: [String],
    marketSize: String,
    competitorSaturation: Number,
    demandSpike: Boolean,
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user history queries
trendSearchSchema.index({ userId: 1, createdAt: -1 });

const TrendSearch = mongoose.model("TrendSearch", trendSearchSchema);
export default TrendSearch;
