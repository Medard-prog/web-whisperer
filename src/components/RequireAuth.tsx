
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import LoadingScreen from "./LoadingScreen";
import { useEffect, useState } from "react";

interface RequireAuthProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

const RequireAuth = ({ children, adminOnly = false }: RequireAuthProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  
  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 5000); // Show message after 5 seconds of loading
      
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // If taking too long, provide an escape hatch
  if (loading && showTimeoutMessage) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <LoadingScreen />
        <div className="mt-8">
          <button 
            onClick={() => window.location.href = "/auth"} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Mergi la pagina de autentificare
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect to dashboard if not admin but trying to access admin routes
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireAuth;
