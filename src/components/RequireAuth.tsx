
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";

interface RequireAuthProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const RequireAuth = ({ children, adminOnly = false }: RequireAuthProps) => {
  const { user, loading, session, refreshUser } = useAuth();
  const location = useLocation();
  const [longLoading, setLongLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Set a timer to detect long loading times, but only on initial load
  useEffect(() => {
    if (loading && initialLoad) {
      const timer = setTimeout(() => {
        setLongLoading(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setLongLoading(false);
      if (!loading) {
        setInitialLoad(false);
      }
    }
  }, [loading, initialLoad]);

  // Handle retry action
  const handleRetry = () => {
    refreshUser();
    window.location.reload();
  };

  // Show loading screen while checking auth state, but only on initial load
  if (loading && initialLoad) {
    return <LoadingScreen 
      isLoading={true} 
      timeout={5000} 
      message={longLoading ? "Autentificare în curs..." : "Se încarcă..."}
      onRetry={longLoading ? handleRetry : undefined}
    />;
  }

  // If no session or user, redirect to login
  if (!session || !user) {
    console.log("No authenticated user found, redirecting to auth page");
    
    // Show a toast message about being redirected
    if (location.pathname !== '/auth') {
      toast.info("Sesiune expirată", {
        description: "Te rugăm să te autentifici din nou"
      });
    }
    
    // Redirect to login page, but save the current location to redirect back
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not an admin
  if (adminOnly && !user.isAdmin) {
    console.log("User is not admin, redirecting to dashboard");
    toast.error("Acces restricționat", {
      description: "Nu ai permisiuni de administrator"
    });
    return <Navigate to="/dashboard" replace />;
  }

  console.log("User is authenticated, rendering protected content");
  return <>{children}</>;
};

export default RequireAuth;
