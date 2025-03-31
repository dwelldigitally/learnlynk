
import React, { useState, useEffect } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import hubspotService from "@/services/hubspotService";

const OnboardingContainer: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const stepParam = searchParams.get('step');
  
  const [currentStep, setCurrentStep] = useState(stepParam ? parseInt(stepParam) : 1);
  const [bypassHubspot, setBypassHubspot] = useState(false);
  const totalSteps = 9;
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  // Check HubSpot connection on mount
  useEffect(() => {
    const storedKey = hubspotService.getStoredApiKey();
    if (storedKey && currentStep > 2) {
      hubspotService.testConnection().then(valid => {
        if (!valid && currentStep > 2 && !bypassHubspot) {
          toast.error("HubSpot connection lost", {
            description: "Please reconnect to continue."
          });
          navigate("/?step=2", { replace: true });
        }
      });
    }
  }, []);

  // Update state when URL changes
  useEffect(() => {
    const newStepParam = new URLSearchParams(location.search).get('step');
    if (newStepParam) {
      setCurrentStep(parseInt(newStepParam));
    } else {
      setCurrentStep(1);
    }
  }, [location.search]);

  // Update URL when step changes
  useEffect(() => {
    if (currentStep === 1) {
      navigate('/', { replace: true });
    } else {
      navigate(`/?step=${currentStep}`, { replace: true });
    }
  }, [currentStep, navigate]);

  const handleNext = async () => {
    // If moving past the HubSpot connection step, validate connection
    if (currentStep === 2 && !bypassHubspot) {
      const isConnected = await hubspotService.testConnection();
      if (!isConnected) {
        toast.error("Please connect to HubSpot before proceeding", {
          description: "A valid HubSpot connection is required for the next steps."
        });
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      uiToast({
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
  
  const handleBypassHubspot = () => {
    setBypassHubspot(true);
    // Use a demo API key to fake a connection
    hubspotService.setApiKey("demo-key-for-testing");
    handleNext();
  };

  // For the welcome screen (step 1), we render it directly without the OnboardingLayout
  if (currentStep === 1) {
    return <WelcomeScreen onGetStarted={handleNext} />;
  }

  // For all other steps, render with the OnboardingLayout
  const renderStep = () => {
    switch (currentStep) {
      case 2:
        return <ConnectCRMScreen onBypass={handleBypassHubspot} />;
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
        return <ConnectCRMScreen onBypass={handleBypassHubspot} />;
    }
  };

  const getNextButtonText = () => {
    if (currentStep === totalSteps) {
      return "Complete Setup";
    }
    // Customize the button text based on the current step
    if (currentStep === 2) {
      return "Continue to Data Import";
    }
    if (currentStep === 3) {
      return "Continue to Team Setup";
    }
    return "Next";
  };

  return (
    <OnboardingLayout
      currentStep={currentStep - 1}  // Adjust the step number since we're bypassing step 1
      totalSteps={totalSteps - 1}    // Adjust the total steps count
      onNext={handleNext}
      onPrevious={handlePrevious}
      nextText={getNextButtonText()}
    >
      {renderStep()}
    </OnboardingLayout>
  );
};

export default OnboardingContainer;
