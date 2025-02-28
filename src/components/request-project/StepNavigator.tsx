
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  isLastStep: boolean;
}

const StepNavigator = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting,
  isLastStep,
}: StepNavigatorProps) => {
  return (
    <div className="flex justify-between mt-6">
      {currentStep > 1 ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Înapoi
        </Button>
      ) : (
        <div></div>
      )}
      
      <Button 
        type={isLastStep ? "submit" : "button"} 
        onClick={isLastStep ? undefined : onNext}
        disabled={isSubmitting}
        className="bg-brand-600 hover:bg-brand-700"
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Se procesează...
          </div>
        ) : isLastStep ? (
          "Trimite cererea"
        ) : (
          <div className="flex items-center">
            Continuă
            <ArrowRight className="h-4 w-4 ml-2" />
          </div>
        )}
      </Button>
    </div>
  );
};

export default StepNavigator;
