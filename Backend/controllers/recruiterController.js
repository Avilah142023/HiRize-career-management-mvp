import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getRecruiterStats = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({ recruiterId });

    const jobIds = jobs.map(job => job._id);


    const applications = await Application.find({
      jobId: { $in: jobIds }
    });

     const totalJobs = jobs.length;
    const totalApplicants = applications.length;

    const shortlisted = applications.filter(
      app => app.status === "Shortlisted"
    ).length;


    res.json({ totalJobs, totalApplicants, shortlisted });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate("applicantId", "name email resume skills experience")
      .populate("jobId", "title");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Shortlisted candidates
export const getShortlistedCandidates = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Get all jobs posted by this recruiter
    const jobs = await Job.find({ recruiterId }).select("_id");

    const jobIds = jobs.map(job => job._id);

    // Get shortlisted applications for those jobs
    const shortlisted = await Application.find({
      jobId: { $in: jobIds },
      status: "Shortlisted",
    })
      .populate("candidateId", "name email phone")
      .populate("jobId", "jobTitle");

    res.json(shortlisted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const jobs = await Job.find({ recruiterId })
      .select("_id jobTitle status");

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getRecruiterActivity = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Get recruiter's jobs
    const jobs = await Job.find({ recruiterId });
    const jobIds = jobs.map(job => job._id);

    // Recent Applications
    const applications = await Application.find({
      jobId: { $in: jobIds }
    })
      .populate("candidateId", "name")
      .populate("jobId", "jobTitle")
      .sort({ createdAt: -1 });

    // Recently Shortlisted
    const shortlisted = await Application.find({
      jobId: { $in: jobIds },
      status: "Shortlisted"
    })
      .populate("candidateId", "name")
      .populate("jobId", "jobTitle")
      .sort({ updatedAt: -1 });

    // Recently Posted Jobs
    const recentJobs = await Job.find({ recruiterId })
      .sort({ createdAt: -1 });

    let activity = [];

    // Applications
    applications.forEach(app => {
      activity.push({
        type: "application",
        message: `${app.candidateId?.name} applied for ${app.jobId?.jobTitle}`,
        date: app.createdAt,
      });
    });

    // Shortlisted
    shortlisted.forEach(app => {
      activity.push({
        type: "shortlisted",
        message: `${app.candidateId?.name} shortlisted for ${app.jobId?.jobTitle}`,
        date: app.updatedAt,
      });
    });

    // Jobs Posted
    recentJobs.forEach(job => {
      activity.push({
        type: "job",
        message: `${job.jobTitle} job posted`,
        date: job.createdAt,
      });
    });

    // Sort all activity by date (latest first)
    activity.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Return only latest 5
    res.json(activity.slice(0, 5));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching activity" });
  }
};