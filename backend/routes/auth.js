import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config.js"; // Import secret key
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ User Signup Route
router.post("/register", async (req, res) => {
  // console.log("📢 Incoming Registration Data:", req.body); // Debugging log

  try {
    const { username, email, password, role } = req.body;
    console.log("📢 Incoming Registration Data:", req.body); // Debugging log

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username, // ✅ Include username
      email,
      password: hashedPassword,
      role,
    });
    console.log("🔑 JWT Secret (Login):", JWT_SECRET);  
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("📢 User created:", user); // Debugging log
    console.log("📢 Registration successful, token:", token); // Debugging log

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ User Login Route
router.post("/login", async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  console.log("📢 Incoming Login Data:", req.body); // Debugging log

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  console.log("📢 Login successful, token:", token); // Debugging log

  res.json({
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select("-password"); // Exclude password
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          // Add any other relevant user information you want to send
      });
  } catch (error) {
      console.error("❌ Error fetching profile:", error);
      res.status(500).json({ message: "Error fetching profile" });
  }
});


export default router;
