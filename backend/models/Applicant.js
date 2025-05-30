// backend/models/Applicant.js
import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  name: String,
  email: String,
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  resume: String,
});

export default mongoose.model("Applicant", applicantSchema);  