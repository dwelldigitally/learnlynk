import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthSessionMonitor } from "@/components/auth/AuthSessionMonitor";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "./pages/Home";
import ModernSignIn from "./pages/ModernSignIn";
import ModernSignUp from "./pages/ModernSignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ComprehensiveOnboarding from "./components/onboarding/ComprehensiveOnboarding";
import { EmailVerificationScreen } from "./components/auth/EmailVerificationScreen";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import StudentPortal from "./pages/StudentPortal";
import { ScholarshipApplications } from "./pages/ScholarshipApplications";
import OldLeadDetailPage from "./pages/LeadDetailPage";
import LeadDetailPage from "./pages/LeadDetailTestPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import { UniversalBuilderPage } from "./pages/UniversalBuilderPage";
import { FormBuilderPage } from "./pages/FormBuilderPage";
import { WorkflowBuilderPage } from "./pages/WorkflowBuilderPage";
import { CampaignBuilderPage } from "./pages/CampaignBuilderPage";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterSubmitApplication from "./pages/RecruiterSubmitApplication";
import ApplicantManagementPage from "./pages/ApplicantManagementPage";

import SalesRepDashboard from "./pages/SalesRepDashboard";
import ApplicantDetailPage from "./pages/ApplicantDetailPage";
import { FullScreenReviewLayout } from "./components/admin/applicants/review/FullScreenReviewLayout";
import { HubSpotOAuthCallback } from "./pages/HubSpotOAuthCallback";
import { DataInitializer } from "./components/enrollment/DataInitializer";
import StudentApplication from "./pages/StudentApplication";
import EmbedDocumentForm from "./pages/EmbedDocumentForm";
import EmbedWebForm from "./pages/EmbedWebForm";
import WebForm from "./pages/WebForm";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthSessionMonitor />
            <ScrollToTop />
            <DataInitializer>
              <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/sign-in" element={<ModernSignIn />} />
               <Route path="/sign-up" element={<ModernSignUp />} />
               <Route path="/verify-email" element={<EmailVerificationScreen />} />
               <Route path="/forgot-password" element={<ForgotPassword />} />
               <Route path="/reset-password" element={<ResetPassword />} />
               
                  {/* Webform Routes */}
                  <Route path="/webform" element={<WebForm />} />
                  <Route path="/apply" element={<WebForm />} />
                 
                 {/* Embeddable Form Routes */}
                 <Route path="/embed/document-form" element={<EmbedDocumentForm />} />
                 <Route path="/embed/webform" element={<EmbedWebForm />} />
              <Route path="/onboarding" element={<ProtectedRoute element={<ComprehensiveOnboarding />} />} />
              <Route path="/dashboard" element={<Navigate to="/admin/setup" replace />} />
              
              {/* HubSpot OAuth callback route - matches what HubSpot sends */}
              <Route path="/hubspot/oauth/callback" element={<HubSpotOAuthCallback />} />
              
              {/* Specific admin routes first */}
              <Route path="/admin/scholarships/:scholarshipId/applications" element={<ProtectedRoute element={<ScholarshipApplications />} />} />
              
              {/* Lead detail routes - New design is now default */}
              <Route path="/admin/leads/detail/:leadId" element={<ProtectedRoute element={<LeadDetailPage />} />} />
              <Route path="/admin/leads/test/:leadId" element={<ProtectedRoute element={<OldLeadDetailPage />} />} />
              
              {/* Student detail route - use a specific pattern to avoid conflicts */}
              <Route path="/admin/students/detail/:studentId" element={<ProtectedRoute element={<StudentDetailPage />} />} />
              
              {/* Universal Builder routes */}
              <Route path="/admin/builder" element={<ProtectedRoute element={<UniversalBuilderPage />} />} />
               <Route path="/admin/builder/forms" element={<ProtectedRoute element={<FormBuilderPage />} />} />
               <Route path="/admin/builder/forms/:formId" element={<ProtectedRoute element={<FormBuilderPage />} />} />
               <Route path="/admin/builder/forms/:formId/edit" element={<ProtectedRoute element={<FormBuilderPage />} />} />
               <Route path="/admin/builder/forms/embed" element={<ProtectedRoute element={<FormBuilderPage />} />} />
              <Route path="/admin/builder/workflows" element={<ProtectedRoute element={<WorkflowBuilderPage />} />} />
              <Route path="/admin/builder/workflows/:workflowId" element={<ProtectedRoute element={<WorkflowBuilderPage />} />} />
              <Route path="/admin/builder/workflows/:workflowId/edit" element={<ProtectedRoute element={<WorkflowBuilderPage />} />} />
              <Route path="/admin/builder/campaigns" element={<ProtectedRoute element={<CampaignBuilderPage />} />} />
              <Route path="/admin/builder/campaigns/:campaignId" element={<ProtectedRoute element={<CampaignBuilderPage />} />} />
              <Route path="/admin/builder/campaigns/:campaignId/edit" element={<ProtectedRoute element={<CampaignBuilderPage />} />} />
              
              {/* Recruiter specific routes */}
              <Route path="/recruiter" element={<ProtectedRoute element={<RecruiterDashboard />} />} />
              <Route path="/recruiter/dashboard" element={<ProtectedRoute element={<RecruiterDashboard />} />} />
              <Route path="/recruiter/submit-application" element={<ProtectedRoute element={<RecruiterSubmitApplication />} />} />
              <Route path="/recruiter/applications" element={<ProtectedRoute element={<RecruiterDashboard />} />} />
              <Route path="/recruiter/applications/:id" element={<ProtectedRoute element={<RecruiterDashboard />} />} />
              <Route path="/recruiter/documents" element={<ProtectedRoute element={<RecruiterDashboard />} />} />
              <Route path="/recruiter/students" element={<ProtectedRoute element={<RecruiterDashboard />} />} />
              
              
              <Route path="/admin/applicants" element={<ProtectedRoute element={<ApplicantManagementPage />} />} />
              <Route path="/admin/applicants/detail/:applicantId" element={<ProtectedRoute element={<ApplicantDetailPage />} />} />
              <Route path="/admin/applicants/review/:applicantId" element={<ProtectedRoute element={<FullScreenReviewLayout />} />} />
              
              {/* Lead routing and scoring pages - remove these since they're now in configuration */}
              
              {/* Sales rep dashboard is now handled by AdminDashboard */}
              
              {/* General admin routes - this handles all /admin/* static routes including enrollment optimization */}
              <Route path="/admin/*" element={<ProtectedRoute element={<AdminDashboard />} />} />
              
               {/* Token-Based Student Portal Routes (No Auth Required) */}
               <Route path="/student-portal" element={<StudentPortal />} />
               <Route path="/student-portal/dashboard" element={<StudentPortal />} />
               <Route path="/student-portal/applications" element={<StudentPortal />} />
               <Route path="/student-portal/academic-planning" element={<StudentPortal />} />
               <Route path="/student-portal/documents" element={<StudentPortal />} />
               <Route path="/student-portal/fee" element={<StudentPortal />} />
               <Route path="/student-portal/messages" element={<StudentPortal />} />
               <Route path="/student-portal/news-events" element={<StudentPortal />} />
               <Route path="/student-portal/news-events/blog/:blogId" element={<StudentPortal />} />
               <Route path="/student-portal/campus-life" element={<StudentPortal />} />

              {/* Authenticated Student Portal Routes (For Admin Users) */}
              
               <Route path="/student" element={<ProtectedRoute element={<StudentPortal />} />} />
               <Route path="/student/dashboard" element={<ProtectedRoute element={<StudentPortal />} />} />
               <Route path="/student/applications" element={<ProtectedRoute element={<StudentPortal />} />} />
               <Route path="/student/academic-planning" element={<ProtectedRoute element={<StudentPortal />} />} />
               <Route path="/student/financial-aid" element={<ProtectedRoute element={<StudentPortal />} />} />
               <Route path="/student/career-services" element={<ProtectedRoute element={<StudentPortal />} />} />
               <Route path="/student/fee" element={<ProtectedRoute element={<StudentPortal />} />} />
               <Route path="/student/messages" element={<ProtectedRoute element={<StudentPortal />} />} />
               <Route path="/student/news-events" element={<ProtectedRoute element={<StudentPortal />} />} />
               <Route path="/student/news-events/blog/:blogId" element={<ProtectedRoute element={<StudentPortal />} />} />
               <Route path="/student/campus-life" element={<ProtectedRoute element={<StudentPortal />} />} />
              
              <Route path="*" element={<NotFound />} />
              </Routes>
            </DataInitializer>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;