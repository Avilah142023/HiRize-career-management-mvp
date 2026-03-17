import { useEffect, useState } from "react";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  return (
   <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl text-sky-900 font-bold mb-6">
        My Applications
      </h2>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        applications.map((app) => (
          <div
            key={app._id}
            className="bg-white shadow-md rounded-xl p-4 mb-4"
          >
            <h3 className="text-lg font-semibold">
  {app.jobId?.jobTitle}
</h3>

<p className="text-gray-600">
  {app.jobId?.companyName}
</p>

<p className="text-green-600 font-medium mt-1">
   {app.jobId?.salary} LPA
</p>

<p className="mt-2">
    Status:
    <span className="ml-2 font-medium">
      {app.status}
    </span>
  </p>

            {app.status === "Rejected" && app.rejectionReason && (
              <p className="text-red-600 mt-1">
                Reason: {app.rejectionReason}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationsPage;