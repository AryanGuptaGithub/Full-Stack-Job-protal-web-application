import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(
        "http://localhost:5000/api/applications/mine",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplications(res.data.applications);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications");
    }
  };

  const handleDelete = async (applicationId) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(
        `http://localhost:5000/api/applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Application deleted");
      fetchApplications();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete application");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6">My Applications</h2>

        {error && <p className="text-red-500">{error}</p>}

        {applications.length === 0 ? (
          <p>You haven't applied to any jobs yet.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((app) => (
              <li key={app._id} className="border p-4 rounded">
                <p>
                  <strong>Job:</strong> {app.title} at {app.company}
                </p>
                <p>
                  <strong>Location:</strong> {app.location}
                </p>
                <p>
                  <strong>Message:</strong> {app.message}
                </p>

                {/* ✅ Extracted skills if present */}
                {app.extractedSkills && app.extractedSkills.length > 0 && (
                  <p>
                    <strong>Extracted Skills:</strong>{" "}
                    {app.extractedSkills.join(", ")}
                  </p>
                )}

                <p>
                  <strong>Applied At:</strong>{" "}
                  {new Date(app.appliedAt).toLocaleString()}
                </p>

                <a
                  href={`http://localhost:5000/${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline block mt-1"
                >
                  Download Resume
                </a>

                <div className="mt-3 space-x-3">
                  <Link to={`/applications/edit/${app._id}`}>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyApplications;