
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { getOnboardingStatus, setOnboardingStatus, getRedirectPathAfterLogin } from "./utils/onboardingUtils";

const queryClient = new QueryClient();

// Protected route component that checks if user is authenticated and handles onboarding redirect
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isSignedIn, isLoaded, user } = useUser();
  
  useEffect(() => {
    // Check onboarding status when user is loaded
    if (isLoaded && isSignedIn && user) {
      const redirectPath = getRedirectPathAfterLogin(user);
      
      // If we're not already on the correct path, redirect
      if (window.location.pathname !== redirectPath && 
          !(window.location.pathname.startsWith("/dashboard") && redirectPath === "/dashboard")) {
        window.location.href = redirectPath;
      }
    }
  }, [isLoaded, isSignedIn, user]);
  
  if (!isLoaded) return <div>Loading...</div>;
  
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <>{element}</>;
};

// Onboarding route component that checks onboarding status
const OnboardingRoute = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  
  useEffect(() => {
    // Only check onboarding status if user is signed in
    if (isLoaded && isSignedIn && user) {
      const onboardingStatus = getOnboardingStatus(user);
      
      // If user hasn't started onboarding yet, initialize it
      if (onboardingStatus === -1) {
        setOnboardingStatus(user, 1);
      }
    }
  }, [isLoaded, isSignedIn, user]);
  
  if (!isLoaded) return <div>Loading...</div>;
  
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OnboardingRoute />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          {/* Direct step navigation routes with onboarding status check */}
          <Route 
            path="/step/:stepNumber" 
            element={<OnboardingRoute />} 
          />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute element={<Dashboard />} />} 
          />
          <Route 
            path="/manager" 
            element={<ProtectedRoute element={<ManagerDashboard />} />} 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
