import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String, // PDF stored in cloud or server
      required: true,
    },

    extractedText: {
      type: String, // Parsed resume text for AI
    },

    experience: {
      type: Number,
    },

    skills: {
      type: [String],
    },

    aiMatchScore: {
      type: Number,
      default: 0,
    },

    matchedSkills: {
      type: [String],
    },

    missingSkills: {
    type: [String], 
    },
     
    aiSummary: {
    type: String, 
    },

    appliedAt: {
    type: Date,
    default: Date.now,
     },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected"],
      default: "Applied",
    },
    rejectionReason: {
  type: String,
}
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
