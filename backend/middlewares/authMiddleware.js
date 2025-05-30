// File: job-portal/backend/middlewares/authmiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("📢 Decoded User :", req.user);
    console.log("🔑 JWT Secret (Middleware):", process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
    console.error("❌ Token verification error:", error);
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to perform this action",
      });
    }
    next();
  };
};