
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
import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-react";

const OnboardingContainer: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const stepParam = searchParams.get('step');
  
  const [currentStep, setCurrentStep] = useState(stepParam ? parseInt(stepParam) : 1);
  const totalSteps = 9;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSignedIn } = useAuth();

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

  const handleNext = () => {
    // If user is trying to proceed from step 1 and isn't signed in, redirect to sign up
    if (currentStep === 1 && !isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign up or log in to continue.",
      });
      navigate("/sign-up");
      return;
    }

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

  // For the welcome screen (step 1), we render it directly without the OnboardingLayout
  if (currentStep === 1) {
    return (
      <>
        <WelcomeScreen />
        {isSignedIn && (
          <div className="fixed bottom-10 right-10 z-50">
            <button
              onClick={handleNext}
              className="bg-saas-blue hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2"
            >
              <span>Continue Onboarding</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </>
    );
  }

  // For all other steps, render with the OnboardingLayout
  // But first check if the user is authenticated
  const renderStep = () => {
    switch (currentStep) {
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
        return <ConnectCRMScreen />;
    }
  };

  const getNextButtonText = () => {
    if (currentStep === totalSteps) {
      return "Complete Setup";
    }
    return "Next";
  };

  return (
    <>
      <SignedIn>
        <OnboardingLayout
          currentStep={currentStep - 1}  // Adjust the step number since we're bypassing step 1
          totalSteps={totalSteps - 1}    // Adjust the total steps count
          onNext={handleNext}
          onPrevious={handlePrevious}
          nextText={getNextButtonText()}
        >
          {renderStep()}
        </OnboardingLayout>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
          <div className="text-center max-w-md">
            <img 
              src="/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png" 
              alt="Learnlynk Logo" 
              className="h-10 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold">Authentication Required</h1>
            <p className="text-gray-600 mt-2 mb-6">
              Please sign up or log in to continue with the onboarding process.
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => navigate('/sign-in')}
                className="bg-white hover:bg-gray-50 text-saas-blue px-6 py-3 rounded-lg border border-saas-blue"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/sign-up')}
                className="bg-saas-blue hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
};

export default OnboardingContainer;
