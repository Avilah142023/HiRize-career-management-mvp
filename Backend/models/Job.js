import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    requiredSkills: {
      type: [String], 
      required: true,
    },

    minimumExperience: {
      type: Number, 
      required: true,
    },

    totalApplicants: {
      type: Number,
      default: 0,
    },

    shortlistedCount: {
      type: Number,
      default: 0,
    },

    status: {
  type: String,
  enum: ["open", "closed"],
  default: "open",
},
    companyName: {
  type: String,
  required: true,
},

location: {
  type: String,
},

jobType: {
  type: String,
  enum: ["Full-time", "Internship", "Contract"],
  default: "Full-time",
},

salary: {
  type: Number,
  default: 0
},

jobType: {
  type: String,
  enum: ["Full-time", "Part-time", "Internship", "Contract"],
},

workMode: {
  type: String,
  enum: ["Remote", "Hybrid", "Onsite"],
},

requiredAvailability: {
  type: String,
  enum: ["Immediate", "1 Month", "3 Months"],
},

  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
