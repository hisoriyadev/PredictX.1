import mongoose from "mongoose";

const apiUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  month: {
    type: Number, // 1-12
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

// One record per user/endpoint/month/year
apiUsageSchema.index({ userId: 1, endpoint: 1, month: 1, year: 1 }, { unique: true });

/**
 * Increment usage count for a user/endpoint.
 * Creates the record if it doesn't exist (upsert).
 */
apiUsageSchema.statics.incrementUsage = async function (userId, endpoint) {
  const now = new Date();
  return this.findOneAndUpdate(
    {
      userId,
      endpoint,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
};

/**
 * Get total usage for a user this month.
 */
apiUsageSchema.statics.getMonthlyUsage = async function (userId) {
  const now = new Date();
  const records = await this.find({
    userId,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
  return records.reduce((sum, r) => sum + r.count, 0);
};

const ApiUsage = mongoose.model("ApiUsage", apiUsageSchema);
export default ApiUsage;
