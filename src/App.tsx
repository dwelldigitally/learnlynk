import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Home from "./pages/Home";
import ModernSignIn from "./pages/ModernSignIn";
import ModernSignUp from "./pages/ModernSignUp";
import ModernOnboarding from "./components/onboarding/ModernOnboarding";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import StudentPortal from "./pages/StudentPortal";
import { ScholarshipApplications } from "./pages/ScholarshipApplications";
import LeadDetailPage from "./pages/LeadDetailPage";
import StudentDetailPage from "./pages/StudentDetailPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<ModernSignIn />} />
              <Route path="/sign-up" element={<ModernSignUp />} />
              <Route path="/onboarding" element={<ProtectedRoute element={<ModernOnboarding />} />} />
              <Route path="/dashboard" element={<Navigate to="/admin" replace />} /> 
              
              {/* Specific admin routes first */}
              <Route path="/admin/scholarships/:scholarshipId/applications" element={<ProtectedRoute element={<ScholarshipApplications />} />} />
              
              {/* Lead detail route - use a specific pattern to avoid conflicts */}
              <Route path="/admin/leads/detail/:leadId" element={<ProtectedRoute element={<LeadDetailPage />} />} />
              
              {/* Student detail route - use a specific pattern to avoid conflicts */}
              <Route path="/admin/students/detail/:studentId" element={<ProtectedRoute element={<StudentDetailPage />} />} />
              
              {/* General admin routes - this handles all /admin/leads/* static routes */}
              <Route path="/admin/*" element={<ProtectedRoute element={<AdminDashboard />} />} />
              
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
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;