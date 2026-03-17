import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const JobPanel = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobs");
      const data = await res.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

 const handleSearch = async (e) => {
  const keyword = e.target.value;
  setSearch(keyword);

  try {
    const url = keyword
      ? `http://localhost:5000/api/jobs?search=${keyword}`
      : `http://localhost:5000/api/jobs`;

    console.log("API URL:", url);

    const res = await fetch(url);
    const data = await res.json();

    setFilteredJobs(data);
  } catch (err) {
    console.error("Search failed", err);
  }
};

useEffect(() => {
  const delay = setTimeout(() => {
    handleSearch({ target: { value: search } });
  }, 400);

  return () => clearTimeout(delay);
}, [search]);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl text-sky-900 font-bold mb-4">Browse Jobs</h2>

      {/* Search */}
      <input
        type="text"
       placeholder="Search jobs by title, skills, company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700"
      />

      {loading && <p>Loading jobs...</p>}

      {!loading && filteredJobs.length === 0 && (
        <p className="text-gray-500">No jobs found</p>
      )}

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
               <p className="text-gray-600">{job.companyName}</p>
              <p className="text-sm text-gray-600">
                Skills: {job.requiredSkills.join(", ")}
              </p>
              <p className="text-sm text-gray-500">
                Experience: {job.minimumExperience}+ years
              </p>
            </div>

            <button
              onClick={() => navigate(`/apply-job/${job._id}`)}
              className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-900"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobPanel;
