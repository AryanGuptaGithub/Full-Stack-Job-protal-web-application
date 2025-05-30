import express from "express";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { applyForJob, getJobApplications } from "../controllers/applicationController.js"; // Import the controller functions
import multer from 'multer';

// 1.  Multer Configuration
//     -   We configure multer to handle file uploads.  This example uses memory storage,
//         which keeps the file data in RAM.  You might want to change this to disk storage
//         (using `multer.diskStorage()`) for production, especially if you're handling large files.
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    // limits: { fileSize: 1024 * 1024 * 5 }  <---  Optional:  Limit file size to 5MB
});

// 2.  Route for Applying for a Job
//     -   This is the key route for handling job applications.
//     -   It's a POST route at /:jobId, which is RESTful and clear.
//     -   It uses authMiddleware to ensure only logged-in users can apply.
//     -   It uses upload.single('resume') to handle the resume file upload.  The 'resume'
//         field name *must* match the name you use in your FormData on the frontend.
//     -   It's handled by the applyForJob controller function.
router.post("/:jobId", authMiddleware, upload.single('resume'), applyForJob);

// 3. Route to get all applications for a job
router.get("/:jobId", authMiddleware, getJobApplications);

// 4.  Route for getting all applications.
//     -   GET /api/applications
//     -   Added route to get all applications
router.get("/", authMiddleware, getJobApplications);

export default router;
