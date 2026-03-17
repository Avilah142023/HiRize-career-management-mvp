import express from "express";
import auth from "../middleware/auth.js";
import authMiddleware from "../middleware/auth.js";
import Application from "../models/Application.js";
import {
  applyJob,
  getApplicantsByJob,
  updateApplicationStatus,
  checkApplication,
  getShortlistedApplications,
  getMyApplications,
} from "../controllers/applicationController.js";
import upload from "../middleware/upload.js";


const router = express.Router();

// Candidate applies
router.post("/", auth, upload.single("resume"), applyJob);

router.get("/check/:jobId", authMiddleware, checkApplication);
// Recruiter views applicants
router.get("/job/:jobId", auth, getApplicantsByJob);

// Recruiter updates status
router.put("/:id/status", auth, updateApplicationStatus);

router.get("/check/:jobId", authMiddleware, async (req, res) => {
    try {
    const existingApplication = await Application.findOne({
      jobId: req.params.jobId,
      candidateId: req.user.id,
    });

    if (existingApplication) {
      return res.json({ applied: true });
    }

    res.json({ applied: false });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/recruiter/shortlisted", auth, getShortlistedApplications);

router.get("/my-applications", auth, getMyApplications);

export default router;
