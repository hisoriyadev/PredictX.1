import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protect route — requires valid JWT in Authorization header.
 * Attaches req.user (without password).
 */
export const protect = async (req, res, next) => {
  // Check if DB is connected
  if (!global.__dbConnected) {
    return res.status(503).json({
      success: false,
      error: "Authentication unavailable — database not connected",
    });
  }

  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized — no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-fallback-secret");
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authorized — user not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Not authorized — invalid token",
    });
  }
};

/**
 * Optional auth — attaches req.user if token is valid,
 * but doesn't block the request if no token is present.
 * Useful for routes that work for both logged-in and anonymous users.
 */
export const optionalAuth = async (req, res, next) => {
  if (!global.__dbConnected) {
    return next();
  }

  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-fallback-secret");
    req.user = await User.findById(decoded.id).select("-password");
  } catch {
    // Token invalid — continue as anonymous
  }

  next();
};
