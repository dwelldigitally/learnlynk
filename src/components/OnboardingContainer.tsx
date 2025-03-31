
import React, { useState } from "react";
import OnboardingLayout from "./OnboardingLayout";
import WelcomeScreen from "./onboarding/WelcomeScreen";
import ConnectCRMScreen from "./onboarding/ConnectCRMScreen";
import PropertyImportScreen from "./onboarding/PropertyImportScreen";
import TeamConfigScreen from "./onboarding/TeamConfigScreen";
import ConversionFactorsScreen from "./onboarding/ConversionFactorsScreen";
import ProcessingScreen from "./onboarding/ProcessingScreen";
import ResultsScreen from "./onboarding/ResultsScreen";
import PricingScreen from "./onboarding/PricingScreen";
import DashboardPreviewScreen from "./onboarding/DashboardPreviewScreen";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const OnboardingContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;
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
        return <ConnectCRMScreen />;
      case 3:
        return <PropertyImportScreen />;
      case 4:
        return <TeamConfigScreen />;
      case 5:
        return <ConversionFactorsScreen />;
      case 6:
        return <ProcessingScreen />;
      case 7:
        return <ResultsScreen />;
      case 8:
        return <PricingScreen />;
      case 9:
        return <DashboardPreviewScreen />;
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
