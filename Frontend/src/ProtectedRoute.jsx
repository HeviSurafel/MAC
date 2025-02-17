import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./Store/useAuthStore"; // Ensure this has user role data

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
