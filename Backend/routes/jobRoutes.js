import express from "express";
import {
  createJob,
  getRecruiterJobs,
  updateJobStatus,
  updateJob,          
  getAllJobs,
  getJobById,
} from "../controllers/jobController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Recruiter posts a job
router.post("/", auth, createJob);


router.get("/recruiter/my-jobs", auth, getRecruiterJobs);

//Edit Job
router.put("/:id", auth, updateJob);

// Job status toggle
router.patch("/:id/status", auth, updateJobStatus);

// view job details
router.get("/:id", auth, getJobById);

// Public / candidate routes
router.get("/", getAllJobs);


export default router;
