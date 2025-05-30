import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BriefcaseIcon, DocumentMagnifyingGlassIcon, UserIcon, ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";

const JobseekerDashboard = () => {
  const [user, setUser] = useState({});
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const token = localStorage.getItem("jwt");

    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/applications/mine",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(res.data.applications.slice(0, 3)); // Show latest 3
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const appliedJobIds = new Set(applications.map((a) => a.job)); // Use 'a.job' assuming your application object has 'job' which is the jobId
        const filtered = res.data.filter((job) => !appliedJobIds.has(job._id));
        setRecommendations(filtered.slice(0, 4)); // top 4 recommendations
      } catch (err) {
        console.error("Error fetching job recommendations", err);
      }
    };

    fetchApplications().then(fetchRecommendations);
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
              👋 Welcome, <span className="text-indigo-600">{user?.username || "Jobseeker"}</span>!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Link
                to="/jobs"
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 shadow rounded-lg p-6 flex flex-col items-center justify-center transition-shadow duration-300 ease-in-out"
              >
                <BriefcaseIcon className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-semibold mb-1 text-center">🔍 Browse Jobs</h2>
                <p className="text-gray-600 text-sm text-center">Explore all available job listings.</p>
              </Link>

              <Link
                to="/my-applications"
                className="bg-green-50 hover:bg-green-100 text-green-700 shadow rounded-lg p-6 flex flex-col items-center justify-center transition-shadow duration-300 ease-in-out"
              >
                <DocumentMagnifyingGlassIcon className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-semibold mb-1 text-center">📄 My Applications</h2>
                <p className="text-gray-600 text-sm text-center">Track your submitted applications.</p>
              </Link>

              <Link
                to="/edit-profile"
                className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 shadow rounded-lg p-6 flex flex-col items-center justify-center transition-shadow duration-300 ease-in-out"
              >
                <UserIcon className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-semibold mb-1 text-center">👤 Edit Profile</h2>
                <p className="text-gray-600 text-sm text-center">Update your profile details.</p>
              </Link>
              <Link
                to="/account-security"
                className="bg-red-50 hover:bg-red-100 text-red-700 shadow rounded-lg p-6 flex flex-col items-center justify-center transition-shadow duration-300 ease-in-out"
              >
                <ShieldCheckIcon className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-semibold mb-1 text-center">🔐 Account Security</h2>
                <p className="text-gray-600 text-sm text-center">Manage your account security.</p>
              </Link>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📌 Recent Applications
            </h2>
            {applications.length === 0 ? (
              <p className="text-gray-600">You haven't applied to any jobs yet.</p>
            ) : (
              <ul className="space-y-4">
                {applications.map((app) => (
                  <li
                    key={app._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 ease-in-out"
                  >
                    <h3 className="text-lg font-semibold text-indigo-700 mb-1">
                      {app.job?.title || "Job Title Unavailable"}
                    </h3>
                    <p className="text-gray-700 mb-1">
                      <strong className="font-semibold">Company:</strong>{" "}
                      {app.job?.company || "Company Unavailable"}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong className="font-semibold">Status:</strong>{" "}
                      {app.status || "Pending"}
                    </p>
                    <p className="text-gray-700 text-sm">
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/applications/edit/${app._id}`}
                      className="inline-flex items-center text-indigo-500 hover:text-indigo-700 transition-colors duration-200 ease-in-out mt-2"
                    >
                      <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Application
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              <SparklesIcon className="inline-block h-6 w-6 mr-2 text-yellow-500" /> Recommended Jobs
            </h2>
            {recommendations.length === 0 ? (
              <p className="text-gray-600">No job recommendations yet.</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((job) => (
                  <li
                    key={job._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 ease-in-out"
                  >
                    <h3 className="text-lg font-semibold text-indigo-700 mb-1">{job.title}</h3>
                    <p className="text-gray-700 mb-1">
                      <strong className="font-semibold">{job.company}</strong> - {job.location}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-flex items-center text-indigo-500 hover:text-indigo-700 transition-colors duration-200 ease-in-out mt-2"
                    >
                      View Details
                      <svg className="h-5 w-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobseekerDashboard;