
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200"></div>
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center z-10">
            <motion.div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep > index + 1 
                  ? "bg-green-500 text-white" 
                  : currentStep === index + 1 
                  ? "bg-brand-600 text-white" 
                  : "bg-gray-200 text-gray-500"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: currentStep === index + 1 ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep > index + 1 ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </motion.div>
            <span className={`text-xs mt-2 ${
              currentStep === index + 1 ? "text-brand-700 font-medium" : "text-gray-500"
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
