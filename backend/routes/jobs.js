import express from "express";
import Job from "../models/job.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js"; // Import authorizeRoles
import User from "../models/user.js";
import { upload } from "../middlewares/uploadMiddleware.js"; // add this at the top

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { title, company, location } = req.query;
        let query = {};
        if (title) query.title = { $regex: title, $options: "i" };
        if (company) query.company = { $regex: company, $options: "i" };
        if (location) query.location = { $regex: location, $options: "i" };

        const jobs = await Job.find(query);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs" });
    }
});

router.post("/create", authMiddleware, authorizeRoles("recruiter"), async (req, res) => { // ✅ Added authorizeRoles middleware
    try {
        console.log("📢 Incoming Job Data:", req.body);
        const { title, description, company, location, salary } = req.body;

        const existingJob = await Job.findOne({ title, company, location });
        if (existingJob) {
            return res.status(400).json({ message: "Job already exists" });
        }

        const job = await Job.create({
            title,
            description,
            company,
            location,
            salary,
            postedBy: req.user.id, // ✅ Add this line to track the recruiter
        });

        console.log("✅ Job Created:", job);
        res.json(job);
    } catch (error) {
        console.error("❌ Error Creating Job:", error);
        res.status(500).json({ message: "Error creating job" });
    }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
      const jobId = req.params.id;
      const userId = req.user.id; // ID of the logged-in user

      const jobToUpdate = await Job.findById(jobId);

      if (!jobToUpdate) {
          return res.status(404).json({ message: "Job not found" });
      }

      // ✅ Authorize: Only the recruiter who posted the job can update it
      if (jobToUpdate.postedBy.toString() !== userId) {
          return res.status(403).json({ message: "Unauthorized: You are not the owner of this job." });
      }

      const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {
          new: true, // Return the updated document
          runValidators: true // Ensure schema validation is applied
      });

      if (!updatedJob) {
          return res.status(500).json({ message: "Error updating job." });
      }

      res.json(updatedJob);
  } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ message: "Error updating job" });
  }
});

router.get("/:id/applicants", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "applications.user",
      "username email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ Only the recruiter who posted the job can view applicants
    if (job.postedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Access denied: Not your job post" });
    }

    res.json({
      jobTitle: job.title,
      applicants: job.applications,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Error fetching applicants" });
  }
});

// TEMPORARY test route just for manual insertion
router.post("/:id/apply-test", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const alreadyApplied = job.applications.find(
      (app) => app.user.toString() === req.user.id
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    job.applications.push({
      user: req.user.id,
      resume: "uploads/resume_sample.pdf", // just for testing
    });

    await job.save();
    res.json({ message: "Applied successfully (test)", job });
  } catch (error) {
    console.error("Apply error:", error.message, error.stack);
    res.status(500).json({ message: "Error applying to job" });
  }
});

// Apply with resume
router.post(
  "/:id/apply",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });

      // Check for duplicate application
      const existingApp = await Application.findOne({
        job: job._id,
        applicant: req.user.id,
      });
      if (existingApp) {
        return res.status(400).json({ message: "Already applied to this job" });
      }

      const application = await Application.create({
        job: job._id,
        applicant: req.user.id,
        resume: req.file.path,
        message: req.body.message || "",
      });

      res.status(201).json({ message: "Applied successfully", application });
    } catch (error) {
      console.error("Apply error:", error);
      res.status(500).json({ message: "Error applying to job" });
    }
  }
);

// Public: fetch a single job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job" });
  }
});

export default router;
