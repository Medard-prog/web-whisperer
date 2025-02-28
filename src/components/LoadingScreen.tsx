
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading?: boolean;
  timeout?: number;
}

const LoadingScreen = ({ isLoading = true, timeout = 10000 }: LoadingScreenProps) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  
  useEffect(() => {
    if (!isLoading) return;
    
    // Show timeout message after specified time
    const timer = setTimeout(() => {
      setShowTimeoutMessage(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [isLoading, timeout]);
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Se încarcă...</h2>
        <p className="text-muted-foreground">Vă rugăm așteptați</p>
        
        {showTimeoutMessage && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
            Încărcarea durează mai mult decât de obicei. Reîmprospătați pagina sau încercați din nou mai târziu.
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
