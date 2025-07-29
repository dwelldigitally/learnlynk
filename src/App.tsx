
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ManagerDashboard from "./pages/ManagerDashboard";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import StudentPortal from "./pages/StudentPortal";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// Simplified ProtectedRoute without clerk dependency
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  // For demo purposes, we'll assume the user is always authenticated
  return <>{element}</>;
};

// Simplified OnboardingRoute without clerk dependency
const OnboardingRoute = () => {
  return <Index />;
};

const App = () => {
  // Use state to prevent infinite loading
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading completion after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show a simple loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-saas-blue">Loading...</div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<OnboardingRoute />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/step/:stepNumber" element={<OnboardingRoute />} />
            <Route path="/dashboard" element={<Navigate to="/manager" replace />} /> 
            <Route path="/manager" element={<ProtectedRoute element={<ManagerDashboard />} />} />
            
            {/* Student Portal Routes */}
            <Route path="/student" element={<ProtectedRoute element={<StudentPortal />} />} />
            <Route path="/student/dashboard" element={<ProtectedRoute element={<StudentPortal />} />} />
            <Route path="/student/applications" element={<ProtectedRoute element={<StudentPortal />} />} />
            <Route path="/student/academic-planning" element={<ProtectedRoute element={<StudentPortal />} />} />
            <Route path="/student/financial-aid" element={<ProtectedRoute element={<StudentPortal />} />} />
            <Route path="/student/career-services" element={<ProtectedRoute element={<StudentPortal />} />} />
            
            <Route path="/student/fee" element={<ProtectedRoute element={<StudentPortal />} />} />
            <Route path="/student/messages" element={<ProtectedRoute element={<StudentPortal />} />} />
            <Route path="/student/news-events" element={<ProtectedRoute element={<StudentPortal />} />} />
            <Route path="/student/campus-life" element={<ProtectedRoute element={<StudentPortal />} />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
