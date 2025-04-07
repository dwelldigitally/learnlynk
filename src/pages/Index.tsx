import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import OnboardingContainer from "@/components/OnboardingContainer";
import { isOnboardingComplete } from "@/utils/onboardingUtils";

const Index = () => {
  const { user, isLoaded } = useUser();
  
  // Show loading state while checking auth
  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-saas-blue">Loading...</div>
    </div>;
  }
  
  // If the user has completed onboarding, send them to dashboard
  if (user && isOnboardingComplete(user)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise show the onboarding flow
  return <OnboardingContainer />;
};

export default Index;
