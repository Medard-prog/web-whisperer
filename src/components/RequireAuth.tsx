import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import LoadingScreen from "./LoadingScreen";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface RequireAuthProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

const RequireAuth = ({ children, adminOnly = false }: RequireAuthProps) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  
  useEffect(() => {
    setLocalLoading(true);
    const initialTimer = setTimeout(() => {
      if (!loading) {
        setLocalLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(initialTimer);
  }, []);
  
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowTimeoutMessage(true);
        console.warn("Auth loading timed out after 5 seconds");
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(false);
      setShowTimeoutMessage(false);
    }
  }, [loading]);
  
  useEffect(() => {
    console.log("RequireAuth state:", { 
      isAuthenticated, 
      isAdmin, 
      loading, 
      showTimeoutMessage, 
      localLoading,
      pathname: location.pathname,
      user: user ? "exists" : "null"
    });
  }, [isAuthenticated, isAdmin, loading, showTimeoutMessage, localLoading, location, user]);
  
  useEffect(() => {
    const forceRedirectTimer = setTimeout(() => {
      if (loading) {
        console.error("Force redirecting to auth after 10s timeout");
        toast.error("Sesiunea a expirat", { 
          description: "Vă redirecționăm către pagina de autentificare" 
        });
        
        setLocalLoading(false);
      }
    }, 10000);
    
    return () => clearTimeout(forceRedirectTimer);
  }, [loading]);
  
  if ((loading || localLoading) && showTimeoutMessage) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <LoadingScreen timeout={1000} />
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Reîmprospătează pagina
          </Button>
          <Button 
            onClick={() => {
              localStorage.removeItem("supabase.auth.token");
              window.location.href = "/auth";
            }}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Mergi la pagina de autentificare
          </Button>
        </div>
      </div>
    );
  }

  if (loading || localLoading) {
    return <LoadingScreen timeout={3000} />;
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    console.log("Not admin, redirecting to /dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireAuth;
