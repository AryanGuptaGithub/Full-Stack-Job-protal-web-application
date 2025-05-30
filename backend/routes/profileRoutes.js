// backend/routes/profileRoutes.js
import express from "express";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { updateProfile } from "../controllers/profileController.js";
import { body } from "express-validator"; // Import validation middleware
import User from "../models/user.js"; // <--- ADD THIS LINE

// Define validation rules for updateProfile
const profileUpdateValidation = [
  body("name").optional().trim().escape(),
  body("email").optional().isEmail().normalizeEmail(),
  body("password").optional().isLength({ min: 6 }),
  body("role").optional().isIn(["admin", "recruiter", "jobseeker"]),
  // Add validation for other profile fields as needed
];

// @route   GET /api/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  console.log("✅✅✅ HIT THE GET /api/profile ROUTE!"); // Add this line
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/profile/
// @desc    Update user profile
// @access  Private
router.put("/profile/update", authMiddleware, profileUpdateValidation, updateProfile);
export default router;
