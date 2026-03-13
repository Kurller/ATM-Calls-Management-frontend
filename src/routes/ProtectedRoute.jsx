// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // OTP not verified → redirect to login
  if (!user.otpVerified) return <Navigate to="/login" replace />;

  // Role restriction
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}