import { Router } from "express";
import {
  analyzeTrend,
  getDashboardData,
  getSearchHistory,
  getReport,
  saveReport,
  getSavedReports,
  deleteSearchHistory,
} from "../controllers/trendController.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/analyze-trend (works for both logged-in and anonymous users)
router.post("/analyze-trend", optionalAuth, analyzeTrend);

// GET /api/dashboard-data (works for both logged-in and anonymous users)
router.get("/dashboard-data", optionalAuth, getDashboardData);

// GET /api/history (protected — requires login)
router.get("/history", protect, getSearchHistory);

// DELETE /api/history/:id (protected)
router.delete("/history/:id", protect, deleteSearchHistory);

// GET /api/report/:id (protected)
router.get("/report/:id", protect, getReport);

// POST /api/report/save (protected)
router.post("/report/save", protect, saveReport);

// GET /api/reports (protected — saved/bookmarked reports)
router.get("/reports", protect, getSavedReports);

export default router;
