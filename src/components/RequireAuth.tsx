
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
  const [initialCheck, setInitialCheck] = useState(true);
  
  // Effect to handle initial loading state
  useEffect(() => {
    // If auth context is no longer loading, mark initial check as complete
    if (!loading) {
      setInitialCheck(false);
    }
    
    // Safety timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setInitialCheck(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [loading]);

  // Show loading screen only during initial check
  if (initialCheck && loading) {
    return <LoadingScreen isLoading={true} timeout={3000} message="Verificare autentificare..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    // Store the current location to redirect back after login
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
