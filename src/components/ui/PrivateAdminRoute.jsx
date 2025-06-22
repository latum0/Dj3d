import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PrivateAdminRoute() {
  const { user } = useAuth();

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") {
    // logged in but not admin
    return <Navigate to="/" replace />;
  }
  // authorized: render the nested routes
  return <Outlet />;
}
