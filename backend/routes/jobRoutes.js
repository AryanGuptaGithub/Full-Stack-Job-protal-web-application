// /backend/routes/jobRoutes.js
import express from "express";
import Job from "./models/Job.js";
import authMiddleware, {
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Recruiters/Admins can create jobs
router.post(
  "/", // Change this line from "/create" to "/"
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  async (req, res) => {
    try {
      const { title, description, company, location, salary } = req.body;
      const job = await Job.create({
        title,
        description,
        company,
        location,
        salary,
      });
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Error creating job" });
    }
  }
);

// 🔒 Recruiters/Admins can update jobs
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  async (req, res) => {
    try {
      const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(updatedJob);
    } catch (error) {
      res.status(500).json({ message: "Error updating job" });
    }
  }
);

// 🔒 Recruiters/Admins can delete jobs
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  async (req, res) => {
    try {
      await Job.findByIdAndDelete(req.params.id);
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting job" });
    }
  }
);

export default router;
