import React, { useContext, useState, useEffect, createContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optionally, restore user from token here
    if (token) {
      // You might want to decode token or fetch user profile
      setUser({}); // set a basic user object or fetch from API
    }
    setLoading(false);
  }, [token]);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };

  if (loading) return null; // Optionally return a loader

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
