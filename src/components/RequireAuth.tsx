
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
  
  // Use effect to handle loading state with a timeout
  useEffect(() => {
    // If auth context is not loading anymore, update local state
    if (!loading) {
      setLocalLoading(false);
      return;
    }
    
    // Safety timeout to prevent infinite loading
    const timer = setTimeout(() => {
      console.log("RequireAuth safety timeout triggered");
      setLocalLoading(false);
    }, 2000); // 2 seconds timeout is usually enough
    
    return () => clearTimeout(timer);
  }, [loading]);

  // Show loading screen with timeout only if both localLoading and context loading are true
  if (localLoading && loading) {
    return <LoadingScreen isLoading={true} timeout={3000} message="Verificare autentificare..." />;
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
