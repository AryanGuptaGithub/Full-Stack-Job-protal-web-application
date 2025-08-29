// frontend/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // helpful if you're using cookies for auth
});

export const getJobs = async () => {
  try {
    const res = await api.get("/api/jobs");
    return res.data;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
};

export default api;
