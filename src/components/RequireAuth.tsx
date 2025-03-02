
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import LoadingScreen from "./LoadingScreen";

interface RequireAuthProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

const RequireAuth = ({ children, adminOnly = false }: RequireAuthProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

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
