
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
import IntegrationChoiceScreen from "./onboarding/IntegrationChoiceScreen";
import OrganizationSetupScreen from "./onboarding/OrganizationSetupScreen";
import HubSpotInstallScreen from "./onboarding/HubSpotInstallScreen";
import HubSpotLinkScreen from "./onboarding/HubSpotLinkScreen";
import OrganizationPreviewScreen from "./onboarding/OrganizationPreviewScreen";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import hubspotService from "@/services/hubspotService";

const OnboardingContainer: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const stepParam = params.stepNumber || new URLSearchParams(location.search).get('step');
  
  const [currentStep, setCurrentStep] = useState(parseInt(stepParam || "1") || 1);
  const [bypassHubspot, setBypassHubspot] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean | null>(null);
  const [showOrgSetup, setShowOrgSetup] = useState(false);
  const [showOrgPreview, setShowOrgPreview] = useState(false);
  const [orgData, setOrgData] = useState<any>(null);
  
  const totalSteps = 9;
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  // Update URL when step changes
  React.useEffect(() => {
    // Update URL
    if (currentStep === 1) {
      navigate('/', { replace: true });
    } else {
      navigate(`/step/${currentStep}`, { replace: true });
    }
  }, [currentStep, navigate]);

  const handleNext = async () => {
    // If moving past the HubSpot connection step, validate connection
    if (currentStep === 2 && !bypassHubspot && isFirstTimeUser === null) {
      const isConnected = await hubspotService.testConnection();
      if (!isConnected) {
        toast.error("Please choose a connection option before proceeding", {
          description: "Select if you're connecting for the first time or already have the app installed."
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
  
  const handleFirstTimeChoice = () => {
    setIsFirstTimeUser(true);
    setShowOrgSetup(true);
  };
  
  const handleExistingUserChoice = () => {
    setIsFirstTimeUser(false);
    setCurrentStep(currentStep + 1);
  };
  
  const handleOrgSetupComplete = (data: any) => {
    setOrgData(data);
    setShowOrgSetup(false);
    setShowOrgPreview(true);
  };

  const handleOrgPreviewComplete = () => {
    setShowOrgPreview(false);
    setCurrentStep(currentStep + 1);
  };

  // For the welcome screen (step 1), we render it directly without the OnboardingLayout
  if (currentStep === 1) {
    return <WelcomeScreen onGetStarted={handleNext} />;
  }

  // For all other steps, render with the OnboardingLayout
  const renderStep = () => {
    if (currentStep === 2) {
      if (isFirstTimeUser === null) {
        return <IntegrationChoiceScreen 
          onFirstTime={handleFirstTimeChoice} 
          onExistingUser={handleExistingUserChoice} 
        />;
      } else if (isFirstTimeUser && showOrgSetup) {
        return <OrganizationSetupScreen onComplete={handleOrgSetupComplete} />;
      } else if (isFirstTimeUser && showOrgPreview) {
        return <OrganizationPreviewScreen 
          organizationData={orgData} 
          onConfirm={handleOrgPreviewComplete} 
          onEdit={() => setShowOrgSetup(true)}
        />;
      } else if (isFirstTimeUser) {
        return <HubSpotInstallScreen onComplete={handleNext} />;
      } else {
        return <HubSpotLinkScreen onComplete={handleNext} />;
      }
    }
    
    switch (currentStep) {
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
    
    // Customize the button text based on the current step and user type
    if (currentStep === 2) {
      if (isFirstTimeUser === null) {
        return "Continue";
      } else if (isFirstTimeUser && showOrgSetup) {
        return "Preview Organization";
      } else if (isFirstTimeUser && showOrgPreview) {
        return "Continue to HubSpot Install";
      } else if (isFirstTimeUser) {
        return "Continue to Data Import";
      } else {
        return "Continue to Data Import";
      }
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
