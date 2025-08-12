import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, requireVerification = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires verification but user is not verified
  if (requireVerification && user && !user.emailVerified) {
    return <Navigate to="/verify-otp" state={{ 
      email: user.email, 
      verificationType: 'signup' 
    }} replace />;
  }

  // If user is authenticated but trying to access auth pages, redirect to home
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/turfs" replace />;
  }

  return children;
};

export default ProtectedRoute;
