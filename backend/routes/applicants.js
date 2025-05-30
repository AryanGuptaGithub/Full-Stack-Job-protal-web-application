// backend/routes/applicants.js
import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import Applicant from "../models/Applicant.js"; // (we'll create this next)

const router = express.Router();

// 🧾 Apply to job (send resume)
router.post("/:jobId/apply", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const jobId = req.params.jobId;
    const resumePath = req.file.path;

    const applicant = await Applicant.create({
      name,
      email,
      jobId,
      resume: resumePath,
    });

    res.status(200).json({ message: "Applied successfully!", applicant });
  } catch (error) {
    console.error("❌ Error applying to job:", error);
    res.status(500).json({ message: "Error applying to job" });
  }
});

export default router;