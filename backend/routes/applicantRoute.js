const express = require("express");
const router = express.Router();
const applicantController = require("../controllers/applicantController");
const authenticate = require("../middleware/authMiddleware");

// Protected GET route
router.get("/", authenticate, applicantController.getApplicants);

// Public POST route to apply for a job
router.post("/", applicantController.createApplicant);

module.exports = router;