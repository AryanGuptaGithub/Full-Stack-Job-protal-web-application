import express from "express";
import {
  saveResume,
  getResume,
  generatePDF,
} from "../controllers/resumeController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/save", authMiddleware, saveResume);
router.get("/:applicantId", authMiddleware, getResume);
router.get("/generate-pdf/:applicantId", authMiddleware, generatePDF);

export { router };
