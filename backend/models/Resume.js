import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicant',
    required: true,
    unique: true
  },
  data: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Change this line:
// module.exports = mongoose.model('Resume', resumeSchema);

// To this:
const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;