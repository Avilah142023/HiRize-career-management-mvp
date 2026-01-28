import express from "express";
import { 
  updateCareerProfile, 
  getUserProfile, 
  updateUserProfile,
  verifyToken 
} from "../controllers/profileController.js";

const router = express.Router();

// All routes require authentication
router.post("/career", verifyToken, updateCareerProfile);
router.get("/", verifyToken, getUserProfile);
router.put("/", verifyToken, updateUserProfile);

export default router;