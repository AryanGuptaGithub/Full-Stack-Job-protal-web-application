// ✅ FILE 3: src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import {
  UserGroupIcon,
  BriefcaseIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const usersRes = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const jobsRes = await axios.get("http://localhost:5000/api/admin/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(usersRes.data.users);
      setJobs(jobsRes.data.jobs);
    } catch (err) {
      console.error("Error fetching admin data", err);
      setError("Failed to load admin data.");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-50 to-zinc-100 min-h-screen py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
            <span className="text-purple-600">
              <svg
                className="inline h-8 w-8 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354l-2.169 3.04a4 4 0 01-2.121 1.414l-3.04-2.169A4 4 0 014.354 12l3.04 2.169a4 4 0 011.414 2.121l-2.169 3.04A4 4 0 0112 19.646l2.169-3.04a4 4 0 012.121-1.414l3.04 2.169A4 4 0 0119.646 12l-3.04-2.169a4 4 0 01-1.414-2.121l2.169-3.04A4 4 0 0112 4.354z"
                />
              </svg>
            </span>
            Admin Dashboard
          </h1>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline">{error}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <ExclamationCircleIcon className="h-6 w-6 fill-current" />
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-4">
                <UserGroupIcon className="h-8 w-8 text-purple-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Users ({users.length})
                </h2>
              </div>
              <ul className="space-y-3">
                {users.map((user) => (
                  <li
                    key={user._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                  >
                    <span className="text-gray-700">{user.username}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {user.role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-4">
                <BriefcaseIcon className="h-8 w-8 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Jobs Posted ({jobs.length})
                </h2>
              </div>
              <ul className="space-y-3">
                {jobs.map((job) => (
                  <li
                    key={job._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <p className="text-gray-700 font-semibold">{job.title}</p>
                    <p className="text-gray-600 text-sm">
                      Company: {job.company}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
