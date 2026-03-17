import Job from "../models/Job.js";
import Application from "../models/Application.js";

// POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      recruiterId: req.user.id,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/jobs
export const getAllJobs = async (req, res) => {
  try {

    const search = req.query.search;

    let query = {};

    if (search) {
  query = { $or: [ 
    { jobTitle: { $regex: search, $options: "i" } }, 
    { companyName: { $regex: search, $options: "i" } }, 
    { requiredSkills: { $regex: search, $options: "i" } } 
  ]
  };

}
    console.log("Mongo Query:", query); // test log
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    console.log("Jobs from DB:", jobs); // test log
    res.json(jobs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    res.json(job);
  } catch (err) {
    res.status(404).json({ message: "Job not found" });
  }
};

//getRecruiterJobs
export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id })
      .sort({ createdAt: -1 });

    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({
          jobId: job._id,
        });

        return {
          ...job._doc,
          totalApplicants: applicantCount,
        };
      })
    );

    res.json(jobsWithCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recruiter jobs" });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Recruiter ownership check
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // If already closed
    if (job.status === "closed") {
      return res.status(400).json({ message: "Job already closed" });
    }

    job.status = status;
    await job.save();

    // AUTO REJECT LOGIC
    if (status === "closed") {
      await Application.updateMany(
        {
          jobId: id,
          status: "Applied",
        },
        {
          $set: {
            status: "Rejected",
            rejectionReason: "Position filled",
          },
        }
      );
    }

    res.json({ message: "Job status updated successfully", job });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only recruiter who posted can edit
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
  companyName,
  jobTitle,
  jobDescription,
  requiredSkills,
  minimumExperience,
  salary
} = req.body;

job.companyName = companyName || job.companyName;
job.jobTitle = jobTitle || job.jobTitle;
job.jobDescription = jobDescription || job.jobDescription;
job.requiredSkills = requiredSkills || job.requiredSkills;
job.minimumExperience = minimumExperience ?? job.minimumExperience;
job.salary = salary ?? job.salary;

    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
