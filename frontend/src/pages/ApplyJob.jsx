import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [newResume, setNewResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
  const checkApplicationStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/applications/check/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setAlreadyApplied(data.applied);
    } catch (error) {
      console.error(error);
    }
  };

  checkApplicationStatus();
}, [jobId]);

  useEffect(() => {
    fetchJob();
    fetchResumes();
  }, []);

  // fetch job details
const fetchJob = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/jobs/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch job");
    }

    const data = await res.json();
    setJob(data);
  } catch (error) {
    console.error("Error fetching job:", error);
  }
};

//fetch user resumes
const fetchResumes = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/upload", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  const resumeFiles = data.files.filter(
    (file) => file.fileType === "resume"
  );

  setResumes(resumeFiles);
};

useEffect(() => {
  const checkIfApplied = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/applications/check/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setAlreadyApplied(data.applied);
  };

  checkIfApplied();
}, [jobId]);


const handleApply = async () => {
  if (!selectedResume && !newResume) {
    alert("Please select or upload a resume");
    return;
  }

  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("jobId", jobId);

  if (newResume) {
    formData.append("resume", newResume);
  } else {
    const blob = await fetch(
      `http://localhost:5000/${selectedResume.filePath}`
    ).then((r) => r.blob());

    formData.append("resume", blob, selectedResume.originalName);
  }

  setLoading(true);

  const response = await fetch("http://localhost:5000/api/applications", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const data = await response.json();

if (!response.ok) {
  alert(data.message || "Failed to apply");
  setLoading(false);
  return;
}
setAlreadyApplied(true); 
  setLoading(false);
  alert("Job applied successfully!");
  setAlreadyApplied(true);
};


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Apply for Job</h1>
      <div className="mb-4">
</div>
      {/* Job Details */}
      {job && (
  <div className="bg-white p-6 rounded-xl shadow mb-6">
    <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold">{job.jobTitle}</h2>

  <button
    onClick={() => navigate("/dashboard?tab=jobs")}
    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium"
  >
    ← Back
  </button>
</div>

    <p className="text-gray-600 mt-2 whitespace-pre-line">
      {job.jobDescription}
    </p>

    <p className="mt-2 text-sm text-gray-500">
      Skills: {job?.requiredSkills?.join(", ")}
    </p>
  </div>
)}
      {/* Resume card */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
  <h3 className="text-xl font-semibold mb-4">Select Resume</h3>

  <div className="grid md:grid-cols-2 gap-4">
    {resumes.map((resume) => (
      <div
        key={resume._id}
        onClick={() => setSelectedResume(resume)}
        className={`border rounded-lg p-4 cursor-pointer transition
        ${
          selectedResume?._id === resume._id
            ? "border-sky-700 bg-sky-50"
            : "hover:border-gray-400"
        }`}
      >
        <p className="font-medium">📄 {resume.originalName}</p>

        <a
          href={`http://localhost:5000/${resume.filePath}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-sky-700 underline mt-2 inline-block"
        >
          Preview Resume
        </a>
      </div>
    ))}
  </div>
</div>

 {/* Upload New Resume */}
 <div className="bg-white p-6 rounded-xl shadow mb-6">
  <h3 className="text-xl font-semibold mb-2">
    Or Upload New Resume
  </h3>

  <input
    type="file"
    accept=".pdf"
    onChange={(e) => setNewResume(e.target.files[0])}
  />
</div>

      {/* Apply Button */}
<div className="mt-6">
  {alreadyApplied ? (
    <button
      disabled
      className="w-full py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
    >
      Applied
    </button>
  ) : (
    <button
      onClick={handleApply}
      disabled={loading}
      className="w-full py-3 bg-sky-700 text-white rounded-lg hover:bg-sky-900"
    >
      {loading ? "Applying..." : "Apply Job"}
    </button>
  )}
</div>

    </div>
  );
};

export default ApplyJob;
