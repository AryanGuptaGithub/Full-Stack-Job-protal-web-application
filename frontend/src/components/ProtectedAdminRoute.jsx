// src/components/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    // Not logged in or not an admin
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedAdminRoute;