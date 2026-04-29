import jwt from "jsonwebtoken";

/**
 * Generate a signed JWT token for a user.
 * @param {string} id — MongoDB user _id
 * @returns {string} JWT token (30-day expiry)
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "dev-fallback-secret", {
    expiresIn: "30d",
  });
};

export default generateToken;
