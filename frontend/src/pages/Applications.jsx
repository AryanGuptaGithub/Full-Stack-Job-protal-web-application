// src/pages/Applications.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { DocumentArrowDownIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const Applications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(
          `http://localhost:5000/api/applications/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("📦 Applications fetched:", res.data.applications);
        setApplications(res.data.applications);
        setJobTitle(res.data.jobTitle);
      } catch (err) {
        console.error("❌ Failed to fetch applications:", err);
        setError("Failed to fetch applications or you're not authorized.");
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`http://localhost:5000/api/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(applications.filter((app) => app._id !== id));
      alert("Application deleted successfully.");
    } catch (err) {
      console.error("❌ Error deleting application:", err);
      alert("Failed to delete application.");
    }
  };

  if (error) return <div className="container mx-auto mt-10 p-6 bg-red-100 border border-red-400 text-red-700 rounded"><p>{error}</p></div>;

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Applications for: <span className="text-blue-600">{jobTitle}</span>
      </h2>

      {applications.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Info!</strong>
          <span className="block sm:inline">No applications received for this job yet.</span>
        </div>
      ) : (
        <ul className="space-y-6">
          {applications.map((app) =>
            app?._id ? (
              <li key={app._id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <div className="mb-3">
                  <strong className="text-gray-700 font-semibold">Name:</strong>{" "}
                  <span className="text-blue-500">{app.applicant?.username || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <strong className="text-gray-700 font-semibold">Email:</strong>{" "}
                  <span className="text-gray-600">{app.applicant?.email || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <strong className="text-gray-700 font-semibold">Message:</strong>{" "}
                  <p className="text-gray-600">{app.message || "No message provided."}</p>
                </div>

                {app.extractedSkills && app.extractedSkills.length > 0 && (
                  <div className="mb-3">
                    <strong className="text-gray-700 font-semibold">Extracted Skills:</strong>{" "}
                    <span className="inline-flex space-x-2">
                      {app.extractedSkills.map((skill, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-4 mt-4">
                  <a
                    href={`http://localhost:5000/${app.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:underline"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5 mr-1" />
                    Download Resume
                  </a>
                  <Link to={`/applications/edit/${app._id}`} className="inline-flex items-center text-yellow-500 hover:underline">
                    <PencilIcon className="h-5 w-5 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="inline-flex items-center text-red-500 hover:underline"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Delete
                  </button>
                </div>
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
};

export default Applications;