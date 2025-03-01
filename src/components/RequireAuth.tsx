
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  adminRequired?: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ adminRequired = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  
  console.log("RequireAuth rendering with:", { 
    isAuthenticated, 
    isAdmin, 
    isLoading, 
    adminRequired,
    location: location.pathname
  });

  if (isLoading) {
    console.log("Auth is loading, showing spinner");
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminRequired && !isAdmin) {
    console.log("Admin required but user is not admin, redirecting to /dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("Auth checks passed, rendering protected content");
  return <Outlet />;
};

export default RequireAuth;
