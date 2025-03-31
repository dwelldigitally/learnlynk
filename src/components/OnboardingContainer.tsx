
import React, { useState } from "react";
import OnboardingLayout from "./OnboardingLayout";
import WelcomeScreen from "./onboarding/WelcomeScreen";
import FeatureComparisonScreen from "./onboarding/FeatureComparisonScreen";
import IntegrationScreen from "./onboarding/IntegrationScreen";
import TeamSetupScreen from "./onboarding/TeamSetupScreen";
import ResultsScreen from "./onboarding/ResultsScreen";
import CompletionScreen from "./onboarding/CompletionScreen";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const OnboardingContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      toast({
        title: "Onboarding Complete",
        description: "You've completed the onboarding process!",
      });
      navigate("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeScreen />;
      case 2:
        return <FeatureComparisonScreen />;
      case 3:
        return <IntegrationScreen />;
      case 4:
        return <TeamSetupScreen />;
      case 5:
        return <ResultsScreen />;
      case 6:
        return <CompletionScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  const getNextButtonText = () => {
    if (currentStep === totalSteps) {
      return "Complete Setup";
    }
    return "Next";
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
      nextText={getNextButtonText()}
    >
      {renderStep()}
    </OnboardingLayout>
  );
};

export default OnboardingContainer;
