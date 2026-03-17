import React, { useState, useEffect } from "react";
import logo from "../../assets/images/Logo2.png";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";



const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
    const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  setUser(storedUser);
}, []);

  // Stats 
  const [stats, setStats] = useState({
  totalJobs: 0,
  totalApplicants: 0,
  shortlisted: 0
});

useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/recruiter/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setStats(data);

    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  fetchStats();
}, []);

const fetchActivity = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/recruiter/activity",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setActivity(res.data);
  } catch (error) {
    console.error("Failed to load activity", error);
  }
};

const fetchMyJobs = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/jobs/recruiter/my-jobs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setJobs(data);
  } catch (err) {
    console.error("Failed to load jobs", err);
  }
};

useEffect(() => {
  fetchMyJobs();
    fetchActivity();
}, []);


  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: '📊' },
    { id: 'postjob', name: 'Post Job', icon: '➕' },
    { id: 'jobs', name: 'My Jobs', icon: '💼' },
    { id: 'shortlisted', name: 'Shortlisted', icon: '👥' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const renderContent = () => {
    switch (activeTab) {
     case 'overview':
  return <OverviewPage stats={stats} activity={activity} />;
      case 'postjob':
        return <PostJobPage />;
      case "jobs":
  return (
    <MyJobsPage
      jobs={jobs}
      onViewDetails={handleViewJobDetails}
      toggleJobStatus={toggleJobStatus}
      navigate={navigate}
      setSelectedJobId={setSelectedJobId} 
      setActiveTab={setActiveTab}
    />
  );
 case "editjob":
  return (
    <PostJobPage
      editJobId={selectedJobId}
      goBackToJobs={() => setActiveTab("jobs")}
    />
  );
     case 'applicants':
  return (
   <ApplicantsPage
  jobId={selectedJobId}
  setShowResumeModal={setShowResumeModal}
  setSelectedCandidate={setSelectedCandidate}
  setActiveTab={setActiveTab}
/>
  );
     case "jobdetails":
  const selectedJob = jobs.find(j => j._id === selectedJobId);
  return (
    <JobDetailsPage
      job={selectedJob}
      onBack={() => setActiveTab("jobs")}
    />
  );
  case "shortlisted":
  return <ShortlistedPage />;
      default:
        return <OverviewPage stats={stats} />;
    }
  };

    const handleViewJobDetails = (jobId) => {
  setSelectedJobId(jobId);
  setActiveTab("jobdetails");
};


  const toggleJobStatus = async (jobId, currentStatus) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: currentStatus === "open" ? "closed" : "open",
      }),
    });

    fetchMyJobs(); // refresh jobs list
  } catch (error) {
    console.error(error);
    alert("Failed to update job status");
  }
};


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-br from-sky-600 to-sky-900 text-white transition-all duration-300 flex flex-col`}>
        
        <div className="p-6 border-b border-sky-800">
          {isSidebarOpen ? (
            <img src={logo}
             className="w-90 h-90 mb-4"
             alt="HIRIZE Logo"
            />
            ) : (
            <h1 className="text-2xl font-bold">H</h1>
          )}
        </div>

        <nav className="flex-1 py-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 transition-colors ${
                activeTab === item.id
                  ? 'bg-sky-800 border-l-4 border-white'
                  : 'hover:bg-sky-600'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {isSidebarOpen && <span className="ml-4 font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="p-6 border-t border-sky-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {isSidebarOpen && <span className="ml-4 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-sky-600 to-sky-900">
         {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
              {user?.name || "Recruiter"}
              </p>
              <p className="text-xs text-gray-500">
              {user?.email || ""}
              </p>
            </div>

            <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "R"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>

      {/* Resume Modal */}
      {showResumeModal && selectedCandidate && (
        <ResumeModal candidate={selectedCandidate} onClose={() => setShowResumeModal(false)} />
      )}
    </div>
  );
};

// Overview/Dashboard Page
const OverviewPage = ({ stats, activity }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Jobs Posted</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJobs}</h3>
          </div>
          <div className="text-5xl">💼</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Applicants</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplicants}</h3>
          </div>
          <div className="text-5xl">👥</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Shortlisted Candidates</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.shortlisted}</h3>
          </div>
          <div className="text-5xl">⭐</div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-6">
  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>

  {activity.length === 0 ? (
    <p className="text-gray-500 text-lg">No recent activity.</p>
  ) : (
    <div className="space-y-3">
      {activity.map((item, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-4xl">
            {item.type === "application" && "📥"}
            {item.type === "shortlisted" && "⭐"}
            {item.type === "job" && "📝"}
          </div>
          <div>
            <p className="text-lg text-gray-900">{item.message}</p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
    </div>
);


// Post Job Page
const PostJobPage = ({ editJobId, goBackToJobs }) => { 
  const isEdit = Boolean(editJobId); 

  const [formData, setFormData] = useState({
    companyName: "",
    title: "",
    location: "",
    description: "",
    skills: "",
    minimumExperience: "",
    salary: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/jobs/${editJobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const job = response.data;

        setFormData({
          companyName: job.companyName || "",
          title: job.jobTitle || "",
          description: job.jobDescription || "",
          skills: job.requiredSkills?.join(", ") || "",
          minimumExperience: job.minimumExperience || "",
          salary: job.salary || "",
        });

      } catch (error) {
        console.error("Error fetching job:", error);
        alert("Failed to load job details");
      }
    };

    fetchJob();

  }, [editJobId, isEdit]);


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const url = isEdit
        ? `http://localhost:5000/api/jobs/${editJobId}`
        : "http://localhost:5000/api/jobs";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          jobTitle: formData.title,
          jobDescription: formData.description,
          requiredSkills: formData.skills.split(",").map(s => s.trim()),
          minimumExperience: Number(formData.minimumExperience),
          salary: Number(formData.salary),
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(isEdit ? "Job updated successfully!" : "Job posted successfully!");

      if (goBackToJobs) {
        goBackToJobs();
      }

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-2xl font-bold text-sky-900 mb-6">
          {isEdit ? "Edit Job" : "New Job"}
        </h3>

        <div className="space-y-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Company Name
          </label>

          <input
            type="text"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Job Title
            </label>

            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Senior Frontend Developer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Job Description
            </label>

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Required Skills (comma-separated)
            </label>

            <input
              type="text"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Minimum Experience (years)
            </label>

            <input
              type="number"
              min="0"
              value={formData.minimumExperience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimumExperience: Number(e.target.value),
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

<div>
  <label className="block text-lg font-semibold text-gray-700 mb-2">
    Salary (LPA)
  </label>

  <input
    type="number"
    min="1"
    value={formData.salary}
    onChange={(e) =>
      setFormData({
        ...formData,
        salary: Number(e.target.value),
      })
    }
    placeholder="Example: 6"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
  />
</div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors font-semibold disabled:bg-sky-400"
          >
            {loading ? "Saving..." : isEdit ? "Update Job" : "Post Job"}
          </button>
        </div>
      </div>
    </div>
  );
};

// My Jobs Page
const MyJobsPage = ({ jobs, onViewDetails, toggleJobStatus, navigate, setSelectedJobId, setActiveTab }) => {  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-3xl text-sky-900 font-bold mb-4">My Jobs</h3>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {job.jobTitle}
                  </h3>
                  <p className="text-gray-600 mt-1">
                  {job.companyName} • {job.location}
                  </p>
                </div>

                <span
               className={`px-4 py-2 rounded-full text-sm font-medium ${
               job.status === "closed"
               ? "bg-gray-200 text-gray-700"
               : "bg-green-100 text-green-800"
               }`}>
               {job.status === "open" ? "Open" : "Closed"}
               </span>

              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.requiredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex gap-6">
                 <button
                  onClick={() => {
                  setSelectedJobId(job._id);
                  setActiveTab("applicants");
                  }}
                  className="flex items-center gap-2 text-sky-600 font-medium hover:underline"
                 >
                 👤 {job.totalApplicants || 0} Applicants
              </button>
                  <span>
                    📅 Posted:{" "}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    ⏱️ Min. {job.minimumExperience} yrs exp.
                  </span>
                </div>

               <button
               onClick={() => toggleJobStatus(job._id, job.status)}
               className={`px-4 py-1 rounded-full text-sm ${
               job.status === "open"
               ? "bg-red-100 text-red-600"
               : "bg-green-100 text-green-600"
               } font-medium hover:bg-opacity-80 transition-colors`}
               >
               {job.status === "open" ? "Close Job" : "Reopen Job"}
              </button>

               <button
               onClick={() => {
                 setSelectedJobId(job._id);
                setActiveTab("editjob");
               }}
               className="px-4 py-1 rounded-full text-sm bg-blue-100 text-blue-600 font-medium hover:bg-opacity-80 transition-colors"
               >
               Edit Job
               </button>

               <button
                 onClick={() => onViewDetails(job._id)}
                className="text-sky-700 hover:text-sky-800 font-medium">
                 View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// View Job Details
const JobDetailsPage = ({ job, onBack }) => {
  if (!job) return null;

  return (
    <div className="min-h-screen bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold mb-2">{job.jobTitle}</h2>

        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      <p className="text-gray-600 mb-4">
        📅 Posted on {new Date(job.createdAt).toLocaleDateString()}
      </p>

      <p className="mb-4 whitespace-pre-line">
        {job.jobDescription}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.requiredSkills.map((skill, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-600">
      👥 Applicants: {job.totalApplicants || 0} <br />
      ⏱ Min Experience: {job.minimumExperience} yrs <br />
      💰 Salary: {job.salary ? `${job.salary} LPA` : "Not specified"}
      </p>
    </div>
  );
};


// Applicants Page
const ApplicantsPage = ({ jobId, setShowResumeModal, setSelectedCandidate, setActiveTab }) => {
const [candidates, setCandidates] = useState([]);
const [applicants, setApplicants] = useState([]);


 useEffect(() => {
  console.log("Selected Job ID:", jobId);
}, [jobId]);

useEffect(() => {
  console.log("Candidates:", candidates);
}, [candidates]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/applications/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `http://localhost:5000/api/applications/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      setCandidates((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status } : c
        )
      );

      alert(`Candidate ${status} successfully!`);
    } 
    catch (error) {
      console.error("Error:", error);
      alert("Error updating status");
    }
  };

  const viewResume = (candidate) => {
    setSelectedCandidate(candidate);
    setShowResumeModal(true);
  };


  return (
  <div className="min-h-screen">

    
    <div className="flex justify-end">
      <button
        onClick={() => setActiveTab("jobs")}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        ← Back
      </button>
    </div>


  <div className="space-y-4">
      {candidates.length === 0 ? (
        <p className="text-gray-500">No applicants found for this job.</p>
      ) : (
        candidates.map((candidate) => (
          
          <div
            key={candidate._id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {candidate.candidateId?.name}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      candidate.status === "Shortlisted"
                        ? "bg-green-100 text-green-800"
                        : candidate.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {candidate.status}
                  </span>
                </div>

                <p className="text-gray-600">
                  {candidate.candidateId?.email}
                </p>

                <p className="text-gray-600">
                  Applied for:{" "}
                  <span className="font-medium">
                    {candidate.jobId?.title}
                  </span>
                </p>

                <p className="text-gray-600">
                  Experience:{" "}
                  <span className="font-medium">
                    {candidate.candidateId?.experience} years
                  </span>
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-sky-700">
                  {candidate.aiMatchScore}%
                </div>
                <p className="text-sm text-gray-600 mt-1">AI Match</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Skills Matched:
              </p>
              <div className="flex flex-wrap gap-2">
                {candidate.matchedSkills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {candidate.missingSkills?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Missing Skills:
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidate.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      ! {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => viewResume(candidate)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-200 font-semibold"
              >
                📄 View Resume
              </button>
              
              {candidate.status === "Applied" && (
                <>
                  <button
                    onClick={() =>
                      handleStatusChange(candidate._id, "Shortlisted")
                    }
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl shadow-sm hover:bg-emerald-700 hover:shadow-md active:scale-95 transition-all duration-200 font-semibold"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(candidate._id, "Rejected")
                    }
                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl shadow-sm hover:bg-rose-700 hover:shadow-md active:scale-95 transition-all duration-200 font-semibold"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}

    </div>
  </div>
);
};

// Shortlisted Page Component
const ShortlistedPage = () => {
   const [jobs, setJobs] = useState([]);
const [shortlisted, setShortlisted] = useState([]);
const [expandedJobId, setExpandedJobId] = useState(null);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [jobsRes, shortlistedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/recruiter/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/recruiter/shortlisted", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setJobs(jobsRes.data);
      setShortlisted(shortlistedRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, []);

const getShortlistedForJob = (jobId) => {
  return shortlisted.filter(
    (app) => app.jobId?._id === jobId
  );
};

  return (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h3 className="text-3xl text-sky-900 font-bold mb-4">
      Shortlisted Candidates
    </h3>

    {jobs.map((job) => {
      const jobShortlisted = getShortlistedForJob(job._id);
      const isExpanded = expandedJobId === job._id;

      return (
        <div
          key={job._id}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          {/* Job Header */}
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() =>
              setExpandedJobId(
                isExpanded ? null : job._id
              )
            }
          >
            <div>
              <h4 className="font-bold text-lg">
                {job.jobTitle}
              </h4>
              <p className="text-base text-gray-500">
                {jobShortlisted.length} Shortlisted
              </p>
            </div>

            <span className="text-xl">
              {isExpanded ? "▲" : "▼"}
            </span>
          </div>

          {/* Expanded Section */}
          {isExpanded && (
            <div className="mt-4 space-y-3 border-t pt-4">
              {jobShortlisted.length === 0 ? (
                <p className="text-gray-500">
                  No shortlisted candidates yet.
                </p>
              ) : (
                jobShortlisted.map((app) => (
                  <div
                    key={app._id}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <p className="text-xl font-semibold">
                      {app.candidateId?.name}
                    </p>
                    <p className="text-lg text-gray-600">
                      {app.candidateId?.email}
                    </p>
                    <p className="text-lg text-gray-600">
                      {app.candidateId?.phone}
                    </p>
                    <p className="text-lg text-gray-600">
                      Match Score: {app.aiMatchScore}%
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
};

// Resume Modal 
const ResumeModal = ({ candidate, onClose }) => {
  const user = candidate?.candidateId;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">
            {user?.name}'s Resume
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-bold text-lg mb-4">Resume Details</h4>

           <div className="bg-white p-6 rounded border border-gray-200 space-y-4">

          <div>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Experience:</strong> {user?.experience} years</p>
            <p><strong>Skills:</strong> {user?.skills?.join(', ')}</p>
          </div>

          {user?.resume ? (
          <iframe
            src={`http://localhost:5000/${user.resume}`}
            title="Resume Preview"
            className="w-full h-[500px] rounded border"
          />
          ) : (
          <p className="text-gray-500">No resume uploaded.</p>
         )}

          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;