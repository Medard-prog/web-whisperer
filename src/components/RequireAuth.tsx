
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

interface RequireAuthProps {
  children?: React.ReactNode;
  adminRequired?: boolean;
}

const RequireAuth = ({ children, adminRequired = false }: RequireAuthProps) => {
  const { user, loading, session } = useAuth();
  const location = useLocation();
  
  console.log("RequireAuth rendering:", { 
    location: location.pathname,
    userExists: !!user,
    isLoading: loading,
    sessionExists: !!session,
    adminRequired
  });

  // Show loading screen while checking auth state
  if (loading) {
    console.log("Auth is loading, showing LoadingScreen");
    return <LoadingScreen />;
  }

  // If no session or user, redirect to login
  if (!session || !user) {
    console.log("No authenticated user found, redirecting to auth page");
    // Redirect to login page, but save the current location to redirect back
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not an admin
  if (adminRequired && !user.isAdmin) {
    console.log("User is not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("User is authenticated, rendering protected content");
  
  // If using React Router v6's Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default RequireAuth;
