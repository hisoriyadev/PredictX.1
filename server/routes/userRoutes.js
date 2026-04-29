import { Router } from "express";
import { getProfile, updateProfile, getUsage } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// All user routes are protected
router.use(protect);

// GET /api/user/profile
router.get("/profile", getProfile);

// PUT /api/user/profile
router.put("/profile", updateProfile);

// GET /api/user/usage
router.get("/usage", getUsage);

export default router;
