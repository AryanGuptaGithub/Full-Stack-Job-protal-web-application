// File: job-portal/backend/routes/application.js
import express from "express";
import multer from "multer";
import Application from "../models/Applications.js";
import Job from "../models/Job.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { parseResume } from "../utils/parseResume.js";
import { sendEmail } from "../utils/sendEmail.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/resumes/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "resume-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Apply to Job (POST /api/applications/:jobId)
router.post(
  "/:jobId",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      const { jobId } = req.params;
      const { message } = req.body;

      console.log("req.user:", req.user);

      if (!req.file) {
        return res.status(400).json({ error: "No resume file uploaded" });
      }

      const job = await Job.findById(jobId).populate("postedBy");
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      let resumeSkills = [];
      // ✅ Bypass parseResume if it's the dummy file
      if (req.file.originalname && !req.file.originalname.includes("Dummy")) {
        try {
          resumeSkills = await parseResume(req.file.path);
        } catch (parseError) {
          console.error("Error parsing resume:", parseError);
          // Optionally, you can still proceed with the application
          // even if resume parsing fails, or return an error.
          // For now, we'll log the error and continue.
        }
      } else {
        console.log(
          "⚠️ Skipping resume parsing for dummy or non-existent file."
        );
      }

      const application = new Application({
        job: jobId,
        applicant: req.user._id,
        resume: req.file.path,
        message,
        extractedSkills: resumeSkills,
        status: "pending",
      });

      await application.save();

      // Send email notifications
      try {
        await sendEmail(
          req.user.email,
          "Application Submitted",
          `You've successfully applied for ${job.title} at ${job.company}`
        );

        await sendEmail(
          job.postedBy.email,
          "New Application Received",
          `You have a new applicant for ${job.title}`
        );
      } catch (emailError) {
        console.error("Error sending emails:", emailError);
        // Optionally handle email sending failures
      }

      res.status(201).json({
        success: true,
        application,
        message: "Application submitted successfully",
      });
    } catch (error) {
      console.error("Application error:", error);
      res.status(500).json({
        error: "Server error",
        message: error.message,
      });
    }
  }
);

// Get Applications for a Job (GET /api/applications/job/:jobId)
router.get(
  "/job/:jobId",
  authMiddleware,
  authorizeRoles("recruiter"),
  async (req, res) => {
    try {
      const applications = await Application.find({ job: req.params.jobId })
        .populate("applicant", "username email")
        .populate("job", "title company");

      res.json({
        success: true,
        count: applications.length,
        applications,
      });
    } catch (error) {
      res.status(500).json({
        error: "Server error",
        message: error.message,
      });
    }
  }
);

// Get User's Applications (GET /api/applications/mine)
router.get(
  "/mine",
  authMiddleware,
  authorizeRoles("jobseeker"),
  async (req, res) => {
    try {
      const applications = await Application.find({ applicant: req.user._id })
        .populate("job", "title company location")
        .sort("-createdAt");

      res.json({
        success: true,
        count: applications.length,
        applications,
      });
    } catch (error) {
      res.status(500).json({
        error: "Server error",
        message: error.message,
      });
    }
  }
);

// Download Resume (GET /api/applications/:id/download)
router.get("/:id/download", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Verify access rights
    if (
      application.applicant.toString() !== req.user._id.toString() &&
      req.user.role !== "recruiter"
    ) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const filePath = path.join(__dirname, "../", application.resume);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
});

// Update Application Status (PATCH /api/applications/:id/status)
router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("recruiter"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const application = await Application.findById(req.params.id).populate(
        "job"
      );

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Verify recruiter owns the job
      if (application.job.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      application.status = status;
      await application.save();

      res.json({
        success: true,
        application,
        message: "Status updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: "Server error",
        message: error.message,
      });
    }
  }
);

// Delete Application (DELETE /api/applications/:id)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Verify ownership
    if (
      application.applicant.toString() !== req.user._id.toString() &&
      req.user.role !== "recruiter"
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await application.remove();
    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
});

export default router;
