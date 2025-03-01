
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

interface RequireAuthProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const RequireAuth = ({ children, adminOnly = false }: RequireAuthProps) => {
  const { user, loading, session } = useAuth();
  const location = useLocation();

  // Show loading screen while checking auth state
  if (loading) {
    return <LoadingScreen />;
  }

  // If no session or user, redirect to login
  if (!session || !user) {
    console.log("No authenticated user found, redirecting to auth page");
    // Redirect to login page, but save the current location to redirect back
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not an admin
  if (adminOnly && !user.isAdmin) {
    console.log("User is not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("User is authenticated, rendering protected content");
  return <>{children}</>;
};

export default RequireAuth;
