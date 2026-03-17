import Application from "../models/Application.js";
import Job from "../models/Job.js";
import fs from "fs";
import { createRequire } from "module";
import File from "../models/File.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Candidate applies for a job
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate application
const existingApplication = await Application.findOne({
  jobId,
  candidateId,
});

if (existingApplication) {
  return res.status(400).json({
    message: "You have already applied for this job",
  });
}

    const dataBuffer = fs.readFileSync(req.file.path);
   const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text.toLowerCase();

const resumeText = extractedText.toLowerCase();

const skillAliases = {
  react: ["reactjs", "react.js"],
  node: ["nodejs", "node.js"],
  javascript: ["js"],
};

const matchedSkills = job.requiredSkills.filter((skill) => {
  const normalizedSkill = skill.toLowerCase();

  // direct match
  if (resumeText.includes(normalizedSkill)) return true;

  // alias match
  if (skillAliases[normalizedSkill]) {
    return skillAliases[normalizedSkill].some((alias) =>
      resumeText.includes(alias)
    );
  }

  return false;
});

    const missingSkills = job.requiredSkills.filter(
      skill => !matchedSkills.includes(skill)
    );
  
    const skillScore =
      (matchedSkills.length / job.requiredSkills.length) * 70;
      
    // Experience scoring
    const expPattern = new RegExp(`${job.minimumExperience}\\+?\\s*years?`, "i");

const experienceScore = expPattern.test(extractedText) ? 30 : 10;
    const aiMatchScore = Math.min(
      100,
      Math.round(skillScore + experienceScore)
    );

    const application = await Application.create({
      jobId,
      candidateId,
      resumeUrl: req.file.path,
      extractedText,
      matchedSkills,
      missingSkills,
      aiMatchScore,
    });

    await Job.findByIdAndUpdate(jobId, {
  $inc: { totalApplicants: 1 }
});

    res.status(201).json({
      message: "Job applied successfully",
      application,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to apply job" });
  }
};
export const checkApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const candidateId = req.user.id;

    const existingApplication = await Application.findOne({
      jobId,
      candidateId,
    });

    res.json({ applied: !!existingApplication });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Recruiter views applicants for a job
export const getApplicantsByJob = async (req, res) => {
  try {
    const applications = await Application.find({
      jobId: req.params.jobId,
    })
      .populate("candidateId", "name email skills experience")
      .populate("jobId", "title")
      .sort({ aiMatchScore: -1 });

    const applicationsWithResume = await Promise.all(
      applications.map(async (app) => {
        if (!app.candidateId) return app;

        const resumeFile = await File.findOne({
          userId: app.candidateId._id,
          fileType: "resume",
        });

        return {
          ...app.toObject(),
          candidateId: {
            ...app.candidateId.toObject(),
            resume: resumeFile ? resumeFile.filePath : null,
          },
        };
      })
    );

    res.json(applicationsWithResume);
  } catch (err) {
    console.error(err);   
    res.status(500).json({ message: err.message });
  }
};

// Recruiter updates status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Shortlisted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id)
      .populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Recruiter ownership check
    if (application.jobId.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Prevent rejected → shortlisted
    if (application.status === "Rejected") {
      return res.status(400).json({ message: "Cannot modify rejected application" });
    }

    application.status = status;
    await application.save();

    res.json({ message: `Candidate ${status} successfully`, application });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Shortlisted Applicants
export const getShortlistedApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id });

    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({
      jobId: { $in: jobIds },
      status: "Shortlisted",
    })
      .populate("candidateId", "name email skills experience")
      .populate("jobId", "title")
      .sort({ aiMatchScore: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get applications for logged-in candidate
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidateId: req.user.id,
    })
      .populate("jobId", "jobTitle companyName salary")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};