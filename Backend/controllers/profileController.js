import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Middleware to verify token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Update career profile
export const updateCareerProfile = async (req, res) => {
  try {
    const { role, industry, experienceLevel } = req.body;
    const userId = req.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        role, 
        industry, 
        experienceLevel,
        title: role // Set title as role
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Career profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        role: user.role,
        industry: user.industry,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (error) {
    console.error("Update career profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        profileImage: user.profileImage,
        role: user.role,
        industry: user.industry,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updateData = req.body;

   
    delete updateData.password;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};