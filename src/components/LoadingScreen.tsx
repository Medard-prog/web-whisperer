
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Se încarcă...</h2>
        <p className="text-muted-foreground">Vă rugăm așteptați</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
