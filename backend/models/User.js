// /backend/models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Added username
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // This will be stored as a hashed password
  role: {
    type: String,
    enum: ["admin", "recruiter", "jobseeker"],
    required: true,
  }, // Keeping role field
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;