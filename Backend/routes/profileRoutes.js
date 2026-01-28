import express from "express";
import { 
  updateCareerProfile, 
  getUserProfile, 
  updateUserProfile,
  verifyToken 
} from "../controllers/profileController.js";

const router = express.Router();

// Career profile routes
router.post("/career", verifyToken, updateCareerProfile);
router.get("/", verifyToken, getUserProfile);
router.put("/", verifyToken, updateUserProfile);

export default router;