import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {useUserStore} from "./Store/useAuthStore"; 
import LoadingSpinner from "./Components/LoadingSpinner";// Ensure this has user role data
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, checkingAuth } = useUserStore();

  if (checkingAuth) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};


export default ProtectedRoute;
