// /backend/models/Applications.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: String,
  location: String,
  salary: Number,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

// Lazy-load Application model to break circular dependency
jobSchema.pre("remove", async function (next) {
  const { Application } = await import("./Applications.js");
  await Application.deleteMany({ job: this._id });
  next();
});

// Safe model compilation
const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
export default Job;