import mongoose from "mongoose";

const savedReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    searchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrendSearch",
      required: true,
    },
    keyword: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    reportData: {
      type: mongoose.Schema.Types.Mixed, // Full analysis snapshot
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savedReportSchema.index({ userId: 1, createdAt: -1 });

const SavedReport = mongoose.model("SavedReport", savedReportSchema);
export default SavedReport;
