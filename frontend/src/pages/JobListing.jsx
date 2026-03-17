import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const JobListing = () => {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
  const delaySearch = setTimeout(() => {
    handleSearch();
  }, 400);

  return () => clearTimeout(delaySearch);
}, [searchTerm]);

  const handleSearch = async () => {
  try {
    const url = searchTerm
      ? `http://localhost:5000/api/jobs?search=${searchTerm}`
      : `http://localhost:5000/api/jobs`;

    const response = await fetch(url);
    const data = await response.json();
    setJobs(data);
   
  } catch (error) {
    console.error("Search failed", error);
  }
};

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/jobs");
      const data = await response.json();
      console.log("API Response:", data);
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Browse Jobs</h1>

     <div className="mb-6 w-full">
  <input
    type="text"
    placeholder="Search jobs by title, skills, company..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
    }}
    className="w-full p-3 border border-gray-300 rounded-lg outline-none"
  />
</div>

      {loading && <p>Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p>No jobs found</p>
      )}

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-xl font-semibold">{job.jobTitle}</h2>
            <p className="text-gray-600">{job.companyName}</p>
            <p className="text-sm text-gray-500 mt-2">
            {job.minimumExperience} yrs experience
             </p>

            <button
              onClick={() => navigate(`/jobs/${job._id}/apply`)}
              className="mt-4 px-6 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-900"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListing;
