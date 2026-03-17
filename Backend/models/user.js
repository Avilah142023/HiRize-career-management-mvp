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
      required: function () {
        return this.authProvider === "email";
      },
    },
    authProvider: {
      type: String,
      enum: ["email", "google", "linkedin"],
      default: "email",
    },
    googleId: {
      type: String,
      default: null,
    },
    linkedinId: {
      type: String,
      default: null,
    },
     systemRole: {
     type: String,
     enum: ["candidate", "recruiter", "admin"],
     default: "candidate",
     },
    
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
    jobPreferences: {
  jobTypes: [String],
  workModes: [String],
  location: String,
  availability: String,
},
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;