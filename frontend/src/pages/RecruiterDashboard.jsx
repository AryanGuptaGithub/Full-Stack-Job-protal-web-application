import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  BriefcaseIcon,
  UserIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline"; // Import some cool icons

const RecruiterDashboard = () => {
  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const postedJobs = res.data.filter(
          (job) => job.postedBy === storedUser._id
        );
        setJobs(postedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
              👋 Welcome, <span className="text-blue-600">{user?.username || "Recruiter"}</span>!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link
                to="/jobs"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow rounded-lg p-6 flex flex-col items-center justify-center transition-shadow duration-300 ease-in-out"
              >
                <BriefcaseIcon className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-semibold mb-1 text-center">📢 All Jobs</h2>
                <p className="text-gray-600 text-sm text-center">
                  Browse your posted jobs or others in the system.
                </p>
              </Link>

              <Link
                to="/edit-profile"
                className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 shadow rounded-lg p-6 flex flex-col items-center justify-center transition-shadow duration-300 ease-in-out"
              >
                <UserIcon className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-semibold mb-1 text-center">👤 Edit Profile</h2>
                <p className="text-gray-600 text-sm text-center">
                  Update your information and company profile.
                </p>
              </Link>

              <Link
                to="/create-job"
                className="bg-green-50 hover:bg-green-100 text-green-700 shadow rounded-lg p-6 flex flex-col items-center justify-center transition-shadow duration-300 ease-in-out"
              >
                <PlusCircleIcon className="h-10 w-10 mb-2" />
                <h2 className="text-xl font-semibold mb-1 text-center">➕ Post New Job</h2>
                <p className="text-gray-600 text-sm text-center">
                  Open up a new opportunity for job seekers.
                </p>
              </Link>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📂 Your Posted Jobs
            </h2>
            {jobs.length === 0 ? (
              <p className="text-gray-600">You haven't posted any jobs yet.</p>
            ) : (
              <ul className="space-y-4">
                {jobs.map((job) => (
                  <li
                    key={job._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 ease-in-out"
                  >
                    <h3 className="text-lg font-semibold text-blue-700 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-700 mb-1">
                      <strong className="font-semibold">Company:</strong>{" "}
                      {job.company}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong className="font-semibold">Location:</strong>{" "}
                      {job.location}
                    </p>
                    <Link
                      to={`/applications/${job._id}`}
                      className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200 ease-in-out"
                    >
                      <svg
                        className="h-5 w-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057-1.176 8-5.042 8-3.866 0-7.657-3.943-8.93-8z"
                        />
                      </svg>
                      View Applications
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

export default RecruiterDashboard;