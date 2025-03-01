
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  adminRequired?: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ adminRequired = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminRequired && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
