import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // New fields for profile
    title: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: null,
    },
    // Career profile fields
    role: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: '',
    },
    experienceLevel: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;