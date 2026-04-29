import User from "../models/User.js";
import TrendSearch from "../models/TrendSearch.js";
import ApiUsage from "../models/ApiUsage.js";

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile
 * @access  Protected
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();

    const totalSearches = await TrendSearch.countDocuments({ userId: req.user._id });
    const uniqueKeywords = await TrendSearch.distinct("keyword", { userId: req.user._id });

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
        stats: {
          totalSearches,
          uniqueKeywords: uniqueKeywords.length,
        },
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ success: false, error: "Failed to load profile" });
  }
};

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Protected
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) {
      // Check if new email is taken
      const existing = await User.findOne({ email, _id: { $ne: user._id } });
      if (existing) {
        return res.status(400).json({ success: false, error: "Email already in use" });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};

/**
 * @route   GET /api/user/usage
 * @desc    Get user's API usage stats
 * @access  Protected
 */
export const getUsage = async (req, res) => {
  try {
    const now = new Date();
    const monthlyUsage = await ApiUsage.find({
      userId: req.user._id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    }).lean();

    const total = monthlyUsage.reduce((sum, r) => sum + r.count, 0);

    // Plan limits
    const planLimits = {
      free: 10,
      starter: 50,
      pro: 999999, // unlimited
      enterprise: 999999,
    };

    const limit = planLimits[req.user.plan] || 10;

    res.json({
      success: true,
      data: {
        current: total,
        limit,
        plan: req.user.plan,
        breakdown: monthlyUsage,
        remaining: Math.max(0, limit - total),
      },
    });
  } catch (error) {
    console.error("Usage error:", error);
    res.status(500).json({ success: false, error: "Failed to load usage" });
  }
};
