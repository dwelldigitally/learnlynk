
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  showPrevious?: boolean;
  nextText?: string;
  previousText?: string;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  showPrevious = true,
  nextText = "Next",
  previousText = "Back",
}) => {
  return (
    <div className="min-h-screen bg-saas-gray-light flex items-center justify-center p-4">
      <div className="onboarding-card animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-saas-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">AI</span>
            </div>
            <span className="font-bold text-lg">adaptify</span>
          </div>
          <div className="text-saas-gray-medium text-sm">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {children}
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${
                  index + 1 <= currentStep ? "active" : ""
                }`}
              ></div>
            ))}
          </div>
          <div className="flex space-x-3">
            {showPrevious && currentStep > 1 && (
              <Button
                variant="outline"
                onClick={onPrevious}
                className="flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>{previousText}</span>
              </Button>
            )}
            <Button
              onClick={onNext}
              className="bg-saas-blue hover:bg-blue-600 flex items-center space-x-1"
            >
              <span>{nextText}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
