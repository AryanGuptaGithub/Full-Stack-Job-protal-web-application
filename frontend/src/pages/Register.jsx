import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Register = () => {
const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "jobseeker",
});
const [error, setError] = useState("");
const navigate = useNavigate();

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await axios.post("http://localhost:5000/api/auth/register", formData);
    alert("Registration successful! Please login.");
    navigate("/login");
    } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Registration failed.");
    }
};

return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left side image / info */}
        <div className="bg-blue-600 text-white flex flex-col justify-center items-center p-8">
            <h2 className="text-3xl font-bold mb-4">Join JobPortal 🚀</h2>
            <p className="text-center">
            Find your dream job or hire top talent.
            <br />
            Let's get you started!
            </p>
            <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Register"
            className="w-48 h-48 mt-6"
            />
        </div>

        {/* Right side form */}
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">
            Create Account
            </h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
            />

            <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                <option value="jobseeker">Jobseeker</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
            </select>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            >
                Register
            </button>

            <p className="text-center mt-4 text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 hover:underline"><strong>Login</strong></Link>
            </p>
            </form>
        </div>
        </div>
    </div>
    <Footer />
    </>
);
};

export default Register;