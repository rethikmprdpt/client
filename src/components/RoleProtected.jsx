import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate, useLocation } from "react-router-dom";

const RoleProtected = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !user.role) {
    // This should be caught by ProtectedRoute, but as a fallback
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAllowed = allowedRoles.includes(user.role);

  if (!isAllowed) {
    // User is logged in, but their role is not allowed.
    // Send them back to their default home page.
    return <Navigate to="/" replace />;
  }

  // User is logged in AND has the correct role
  return children;
};

export default RoleProtected;
