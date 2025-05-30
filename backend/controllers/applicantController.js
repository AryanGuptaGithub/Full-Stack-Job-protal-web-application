// //backend/controllers/applicantController.js
const Applicant = require("../models/Applicant");

exports.getApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find();
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createApplicant = async (req, res) => {
  const { email, jobId, resume } = req.body;
  try {
    const newApplicant = new Applicant({ email, jobId, resume });
    await newApplicant.save();
    res.json({ message: "Application submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const applyForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const applicantId = req.user.id;
        // ... logic to save the application to the database
        res.status(201).json({ message: 'Application submitted successfully!' });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ message: 'Failed to submit application.' });
    }
};