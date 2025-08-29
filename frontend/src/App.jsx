// ✅ FILE: frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Applications from "./pages/Applications";
import EditApplication from "./pages/EditApplication";
import MyApplications from "./pages/MyApplications";
import JobseekerDashboard from "./pages/JobseekerDashboard";
import EditProfile from "./pages/EditProfile";
import AccountSecurity from "./pages/AccountSecurity";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Register from "./pages/Register";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import { AuthProvider } from "./context/AuthContext";


const App = () => {
 
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="api/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/applications/:jobId" element={<Applications />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/dashboard" element={<JobseekerDashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/edit-job/:id" element={<EditJob />} />
        <Route path="/account-security" element={<AccountSecurity />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/applications/edit/:applicationId"
          element={<EditApplication />}
        />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/register" element={<Register />} />
      </Routes>
  </AuthProvider>
    </Router>
  );
};

export default App;
