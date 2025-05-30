import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    type: String, // This can be a file URL or path
    required: true,
  },
  message: {
    type: String, // Optional cover letter or message
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "shortlisted", "rejected", "hired"],
    default: "pending",
  },
});

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export default Application;