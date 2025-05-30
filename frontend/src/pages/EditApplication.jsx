// ✅ FILE: src/pages/EditApplication.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EditApplication = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(
          `http://localhost:5000/api/applications/${applicationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessage(res.data.message || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching application:", err);
        setLoading(false);
      }
    };
    fetchApplication();
  }, [applicationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("message", message);
    if (resume) formData.append("resume", resume);

    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Application updated successfully!");
      navigate("/my-applications");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update application");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Edit Your Application</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            className="w-full border p-2"
            rows={5}
          ></textarea>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Application
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditApplication;
