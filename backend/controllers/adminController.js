// ✅ FILE 2: backend/controllers/adminController.js
import User from "../models/User.js";
import Job from "../models/Job.js";

// Get all users
export const getAllUsers = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied." });

  const users = await User.find().select("-password");
  res.json({ users });
};

// Get all jobs
export const getAllJobs = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied." });

  const jobs = await Job.find();
  res.json({ jobs });
};

// Delete a user
export const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied." });

  await User.findByIdAndDelete(req.params.userId);
  res.json({ message: "User deleted successfully." });
};

// Delete a job
export const deleteJob = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied." });

  await Job.findByIdAndDelete(req.params.jobId);
  res.json({ message: "Job deleted successfully." });
};
