// src/pages/EditProfile.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { UserIcon, EnvelopeIcon, DocumentIcon, LockClosedIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

const EditProfile = () => {
    const [user, setUser] = useState({ username: "", email: "" });
    const [resume, setResume] = useState(null);
    const [existingResume, setExistingResume] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      const fetchProfile = async () => {
        console.log("➡️ Starting fetchProfile...");
        try {
            const token = localStorage.getItem("jwt");
            console.log("🔑 JWT Token:", token);
            const res = await axios.get("http://localhost:5000/api/", { // Changed the URL here
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("✅ Profile fetch successful:", res.data);
            const userData = res.data;
            setUser({ username: userData.username, email: userData.email });
            setExistingResume(userData.resume || "");
            setLoading(false);
        } catch (err) {
            console.error("❌ Failed to load profile:", err);
            setError("Failed to load profile");
            setLoading(false);
        } finally {
            console.log("⬅️ fetchProfile completed.");
        }
    };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
      
        try {
            const token = localStorage.getItem("jwt");
            console.log("🔑 JWT Token for update:", token);
            const formData = new FormData();
            formData.append("username", user.username);
            formData.append("email", user.email);
            if (resume) {
                console.log("📎 New resume attached:", resume.name);
                formData.append("resume", resume);
            } else {
                console.log("📄 No new resume selected.");
            }
            if (password) {
                console.log("🔒 New password provided.");
                formData.append("password", password);
            } else {
                console.log("🔒 No new password provided.");
            }

            console.log("📤 Sending update request with FormData:", formData);
            const res = await axios.put("http://localhost:5000/api/profile/update", formData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("✅ Profile update successful:", res.data);
            setSuccessMessage("Profile updated successfully!");
            localStorage.setItem("user", JSON.stringify(res.data.updatedUser)); // Update user info in local storage
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500); // Redirect after a short delay
        } catch (err) {
            console.error("❌ Update error:", err);
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            console.log("⬅️ handleSubmit completed.");
        }
    };

    if (loading) return <div className="text-center mt-10"><p>Loading profile information...</p></div>;

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 min-h-screen py-12">
                <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
                    <div className="flex items-center justify-center mb-6">
                        <UserIcon className="h-10 w-10 text-blue-500 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline">{error}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <ExclamationCircleIcon className="h-6 w-6 fill-current" />
                            </span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline">{successMessage}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <CheckCircleIcon className="h-6 w-6 fill-current" />
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    value={user.username}
                                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                                New Resume
                            </label>
                            {existingResume && (
                                <p className="text-sm text-gray-600 mb-1">
                                    Current Resume: {existingResume.split("/").pop()}
                                </p>
                            )}
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <DocumentIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="file"
                                    id="resume"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    accept=".pdf,.doc,.docx"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Leave blank to keep same"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EditProfile;