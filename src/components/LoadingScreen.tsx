
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface LoadingScreenProps {
  isLoading?: boolean;
  timeout?: number;
  message?: string;
  onRetry?: () => void;
}

const LoadingScreen = ({ 
  isLoading = true, 
  timeout = 10000,
  message = "Se încarcă...",
  onRetry
}: LoadingScreenProps) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const initialLoadRef = useRef(true);
  
  useEffect(() => {
    // Initial state - only show on first load, not when switching tabs
    if (isLoading && !document.hidden && initialLoadRef.current) {
      setShouldRender(true);
      initialLoadRef.current = false;
    } else if (!isLoading) {
      setShouldRender(false);
      // Reset initial load ref when loading is complete
      initialLoadRef.current = true;
    }
    
    // Handle visibility changes, but don't show loading screen when coming back to tab
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Do nothing when tab is hidden
      } else if (isLoading && initialLoadRef.current) {
        // Only show loading when genuinely loading and not just returning to tab
        setShouldRender(true);
        initialLoadRef.current = false;
      }
    };
    
    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoading]);
  
  useEffect(() => {
    if (!isLoading || !shouldRender) {
      setShowTimeoutMessage(false);
      return;
    }
    
    // Show timeout message after specified time
    const timer = setTimeout(() => {
      setShowTimeoutMessage(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [isLoading, timeout, shouldRender]);
  
  // Don't render anything if not loading or tab is inactive
  if (!shouldRender) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold">{message}</h2>
        <p className="text-muted-foreground">Vă rugăm așteptați</p>
        
        {showTimeoutMessage && (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
              Încărcarea durează mai mult decât de obicei. Reîmprospătați pagina sau încercați din nou mai târziu.
            </div>
            
            {onRetry && (
              <Button 
                variant="outline" 
                onClick={onRetry}
                className="w-full"
              >
                Încearcă din nou
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
