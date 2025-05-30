import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import {
    BriefcaseIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    DocumentPlusIcon,
    EyeIcon,
    PencilSquareIcon, // Import the edit icon
    TrashIcon, // Import the delete icon
} from "@heroicons/react/24/outline";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchJob = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/jobs/${id}`
                );
                setJob(response.data);
            } catch (err) {
                setError("Job not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    const handleApply = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            toast.warn("Please log in to apply.");
            navigate("/login");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("message", "Looking forward to this role!");
            const dummyFile = new File(["Dummy Resume"], "resume.pdf", {
                type: "application/pdf",
            });
            formData.append("resume", dummyFile);
            formData.append("applicant", storedUser._id);

            const response = await axios.post(
                `http://localhost:5000/api/applications/${job._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success(
                response.data.message || "Application submitted successfully!"
            );
            console.log("JOB Applied Successfully", response.data);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to apply.");
        }
    };

    const handleEditJob = () => {
        navigate(`/edit-job/${job._id}`); // Navigate to the edit job page
    };

    const handleDeleteJob = async () => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                await axios.delete(`http://localhost:5000/api/jobs/${job._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });
                toast.success("Job deleted successfully!");
                navigate("/recruiter/dashboard"); // Redirect to recruiter dashboard after deletion
            } catch (error) {
                console.error("Error deleting job:", error);
                toast.error(
                    error.response?.data?.message || "Failed to delete job."
                );
            }
        }
    };

    if (loading)
        return (
            <div className="container mx-auto mt-10 text-center">
                <p>Loading job details...</p>
            </div>
        );
    if (error)
        return (
            <div className="container mx-auto mt-10 text-center text-red-500">
                <p>{error}</p>
            </div>
        );

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.title}</h1>

                <div className="mb-4">
                    <p className="text-lg text-gray-700 flex items-center mb-1">
                        <BriefcaseIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <strong>Company:</strong> {job.company}
                    </p>
                    <p className="text-lg text-gray-700 flex items-center mb-1">
                        <MapPinIcon className="h-5 w-5 mr-2 text-green-500" />
                        <strong>Location:</strong> {job.location}
                    </p>
                    <p className="text-lg text-gray-700 flex items-center">
                        <CurrencyDollarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                        <strong>Salary:</strong> ₹{job.salary}
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>

                <button
                    onClick={handleApply}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                >
                    <DocumentPlusIcon className="h-5 w-5 mr-2" />
                    Apply Now
                </button>

                {/* ✅ Show only if recruiter and they posted the job */}
                {JSON.parse(localStorage.getItem("user"))?.role === "recruiter" &&
                    JSON.parse(localStorage.getItem("user"))._id === job.postedBy && (
                        <div className="mt-4 flex space-x-2">
                            <Link to={`/applications/${job._id}`} className="inline-block">
                                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center">
                                    <EyeIcon className="h-5 w-5 mr-2" />
                                    View Applications
                                </button>
                            </Link>
                            <button
                                onClick={handleEditJob}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                            >
                                <PencilSquareIcon className="h-5 w-5 mr-2" />
                                Edit Job
                            </button>
                            <button
                                onClick={handleDeleteJob}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                            >
                                <TrashIcon className="h-5 w-5 mr-2" />
                                Delete Job
                            </button>
                        </div>
                    )}
            </div>
            <Footer />
        </>
    );
};

export default JobDetails;