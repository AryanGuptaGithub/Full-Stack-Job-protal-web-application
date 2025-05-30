import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import protectedRoutes from "./routes/protected.js";
import applicantRoutes from "./routes/applicants.js";
import applicationRoutes from "./routes/application.js";
import { router as resumeRoutes } from "./routes/resume.js";
import multer from "multer";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import profileRoutes from "./routes/profileRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const upload = multer();
app.use(upload.any());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected...");
    app.listen(5000, () => console.log("✅ Server running on port 5000"));
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

app.use((req, res, next) => {
  console.log(`📢 Incoming Request: ${req.method} ${req.url}`);
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to the Job Portal API!");
});

app.use("/api", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/protected", authMiddleware, protectedRoutes);
app.use("/api/applicants", applicantRoutes);
app.use("/api/applications", applicationRoutes);
// app.use("/api/resume", resumeRoutes);
