import mongoose from "mongoose";

/**
 * Connect to MongoDB with retry logic.
 * Falls back gracefully if MONGO_URI is not set — the app still runs
 * but database-dependent features (auth, history, saved reports) are disabled.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("⚠️  MONGO_URI not set — running without database. Auth & history features disabled.");
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Mongoose 8 uses these by default, but being explicit
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting reconnect…");
    });

    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.warn("⚠️  Continuing without database — auth & history features disabled.");
    return false;
  }
};

export default connectDB;
