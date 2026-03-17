import express from "express";
import { updateJobPreferences } from "../controllers/CandidateController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.put("/preferences", auth, updateJobPreferences);

export default router;