
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [documentHidden, setDocumentHidden] = useState(false);
  
  useEffect(() => {
    if (!isLoading) {
      setShowTimeoutMessage(false);
      return;
    }
    
    // Handle document visibility changes
    const handleVisibilityChange = () => {
      setDocumentHidden(document.hidden);
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Only show timeout message if document is visible and still loading after timeout
    const timer = setTimeout(() => {
      if (!document.hidden) {
        setShowTimeoutMessage(true);
      }
    }, timeout);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoading, timeout]);
  
  // Don't show loading screen if document is not visible (tab switched)
  if (!isLoading || documentHidden) return null;
  
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
