// src/pages/AccountSecurity.jsx
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  KeyIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const AccountSecurity = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const payload = {};
      if (email) payload.email = email;
      if (password) payload.password = password;

      const res = await axios.put(
        "http://localhost:5000/api/users/update-security",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Account details updated successfully.");
      // Clear form fields on success if desired
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating security info:", err);
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="container mx-auto max-w-md bg-white shadow-md rounded-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <KeyIcon className="h-10 w-10 text-blue-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">
              Account Security
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

          {message && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">{message}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <CheckCircleIcon className="h-6 w-6 fill-current" />
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="new-email"
                className="block text-sm font-medium text-gray-700"
              >
                New Email
              </label>
              <input
                type="email"
                id="new-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter new email"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm new password"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Security Info
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountSecurity;
