    // ✅ FILE 1: backend/routes/adminRoutes.js
import express from "express";
import { getAllUsers, getAllJobs, deleteUser, deleteJob } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes are protected and admin-only
router.get("/users", authMiddleware, getAllUsers);
router.get("/jobs", authMiddleware, getAllJobs);
router.delete("/user/:userId", authMiddleware, deleteUser);
router.delete("/job/:jobId", authMiddleware, deleteJob);

export default router;