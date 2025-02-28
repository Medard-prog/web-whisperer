
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";

interface RequireAuthProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const RequireAuth = ({ children, adminOnly = false }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(true);
  
  // Use a local loading state with a timeout to prevent infinite loading
  useEffect(() => {
    if (!loading) {
      setLocalLoading(false);
    }
    
    // Safety timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 3000); // 3 seconds timeout
    
    return () => clearTimeout(timer);
  }, [loading]);

  // Show loading screen but with a timeout
  if (localLoading && loading) {
    return <LoadingScreen isLoading={true} timeout={3000} />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check for admin access if required
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and meets admin requirements, show the protected content
  return <>{children}</>;
};

export default RequireAuth;
