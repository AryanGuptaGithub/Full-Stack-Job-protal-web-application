import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true } // if using cookies
      );

      localStorage.setItem("jwt", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/jobs");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left side image / info (Inspired by Register) */}
          <div className="bg-green-600 text-white flex flex-col justify-center items-center p-8">
            <h2 className="text-3xl font-bold mb-4">Welcome Back! 👋</h2>
            <p className="text-center">
              Sign in to access your personalized job search experience.
              <br />
              Let's find your next opportunity!
            </p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3390/3390472.png"
              alt="Login"
              className="w-48 h-48 mt-6"
            />
          </div>

          {/* Right side form (Inspired by Register) */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Sign In</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
              >
                Login
              </button>

              <p className="text-center mt-4 text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline ">
                  <strong>Register</strong>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
