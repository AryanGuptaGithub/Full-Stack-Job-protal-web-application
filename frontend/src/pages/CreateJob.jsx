// src/pages/CreateJob.jsx
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TagIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    category: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post("http://localhost:5000/api/jobs/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) { // Check for a 200 status
        setSuccessMessage("Job posted successfully!");
        setFormData({
          title: "",
          company: "",
          location: "",
          salary: "",
          category: "",
          description: "",
        }); // Clear form
        setTimeout(() => {
          navigate("/jobs");
        }, 1500);
      } else {
        setError("Failed to post job: Server responded with an error.");
      }

    } catch (err) {
      console.error("Failed to post job", err);
      setError(
        err.response?.data?.message ||
          "Failed to post job. Make sure you're logged in as a recruiter."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="container mx-auto max-w-2xl bg-white shadow-md rounded-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <BriefcaseIcon className="h-10 w-10 text-blue-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">
              Create a New Job
            </h2>
          </div>

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

          {successMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">{successMessage}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <CheckCircleIcon className="h-6 w-6 fill-current" />
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields... */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Job Title
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <BriefcaseIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="e.g., Software Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <BuildingOfficeIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="company"
                  id="company"
                  placeholder="e.g., Tech Innovations Inc."
                  value={formData.company}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MapPinIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="e.g., Mumbai, India"
                  value={formData.location}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="salary"
                className="block text-sm font-medium text-gray-700"
              >
                Salary (₹)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <CurrencyDollarIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="number"
                  name="salary"
                  id="salary"
                  placeholder="e.g., 50000"
                  value={formData.salary}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <TagIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="e.g., IT, HR, Finance"
                  value={formData.category}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Job Description
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <DocumentTextIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Describe the job role and responsibilities"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateJob;
