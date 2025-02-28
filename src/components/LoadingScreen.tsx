
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  isLoading?: boolean;
}

const LoadingScreen = ({ isLoading = true }: LoadingScreenProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Se încarcă...</h2>
        <p className="text-muted-foreground">Vă rugăm așteptați</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
