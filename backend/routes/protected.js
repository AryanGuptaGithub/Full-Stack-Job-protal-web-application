// /backend/models/protected.js
import express from "express";
import Job from "../models/Job.js";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Protected: Create Job
router.post("/create", authMiddleware, authorizeRoles("admin","recruiter") ,async (req, res) => {
  try {
    console.log("📢 Incoming Job Data:", req.body);
    const { title, description, company, location, salary } = req.body;

    const existingJob = await Job.findOne({ title, company, location });
    if (existingJob)
      return res.status(400).json({ message: "Job already exists" });

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
    });
    console.log("✅ Job Created:", job);
    res.json(job);
  } catch (error) {
    console.error("❌ Error Creating Job:", error);
    res.status(500).json({ message: "Error creating job" });
  }
});

// 🔒 Protected: Delete Job
router.delete("/:id", authMiddleware, authorizeRoles("admin","recruiter") ,async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
});

// 🔒 Protected: Update Job
router.put("/:id", authMiddleware, authorizeRoles("admin","recruiter") ,async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Error updating job" });
  }
});

// ✅ Basic protected route
router.get("/test", authMiddleware, (req, res) => {
  res.json({ message: `Hello, user ${req.user.id}`, role: req.user.role });
});

// ✅ Admin-only route
router.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

export default router;
