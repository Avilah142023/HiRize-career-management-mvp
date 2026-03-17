import express from "express";
import auth from "../middleware/auth.js";
import { 
      getRecruiterStats,
      getApplicantsForJob,
     getShortlistedCandidates,
     getRecruiterJobs,
     getRecruiterActivity,
} from "../controllers/recruiterController.js";

const router = express.Router();

router.get("/stats", auth, getRecruiterStats);

router.get("/jobs/:jobId/applicants", auth, getApplicantsForJob);

router.get("/shortlisted", auth, getShortlistedCandidates);

router.get("/jobs", auth, getRecruiterJobs);

router.get("/activity", auth, getRecruiterActivity);

export default router;