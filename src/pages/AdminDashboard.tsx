import React from "react";
import { useLocation } from "react-router-dom";
import LeadDetailPage from './LeadDetailPage';
import ModernAdminLayout from "@/components/admin/ModernAdminLayout";
import AdminOverview from "@/components/admin/AdminOverview";
import StudentManagement from "@/components/admin/StudentManagement";
import StudentDetailPage from "@/pages/StudentDetailPage";
import ProgramManagement from "@/components/admin/ProgramManagement";
import WorkflowManagement from "@/components/admin/WorkflowManagement";
import EnhancedDocumentManagement from "@/components/admin/EnhancedDocumentManagement";
import EventManagement from "@/components/admin/EventManagement";
import CommunicationHub from "@/components/admin/CommunicationHub";
import FinancialManagement from "@/components/admin/FinancialManagement";
import TeamManagement from "@/components/admin/TeamManagement";
import AnalyticsReporting from "@/components/admin/AnalyticsReporting";
import SystemConfiguration from "@/components/admin/SystemConfiguration";
import ProfilePage from "@/components/admin/ProfilePage";
import CompanyPage from "@/components/admin/CompanyPage";
import { LeadManagement } from "@/components/admin/LeadManagement";
import { LeadOverview } from "@/components/admin/leads/LeadOverview";
import { LeadAIFeatures } from "@/components/admin/leads/LeadAIFeatures";
import { LeadForms } from "@/components/admin/leads/LeadForms";
import { LeadRoutingRules } from "@/components/admin/leads/LeadRoutingRules";
import { LeadScoringEngine } from "@/components/admin/leads/LeadScoringEngine";
import { LeadTemplates } from "@/components/admin/leads/LeadTemplates";
import { LeadAnalytics } from "@/components/admin/leads/LeadAnalytics";
import { LeadAdvancedAnalytics } from "@/components/admin/leads/LeadAdvancedAnalytics";
import { LeadBulkOperations } from "@/components/admin/leads/LeadBulkOperations";
import { ConfigurationManagement } from "@/components/admin/ConfigurationManagement";
import { DemoDataManagement } from "@/components/admin/DemoDataManagement";
import { CampaignManagement } from "@/components/admin/CampaignManagement";

import { RequirementsManagement } from "@/components/admin/database/RequirementsManagement";
import { DocumentTemplatesManagement } from "@/components/admin/DocumentTemplatesManagement";
import { ReportsManagement } from "@/components/admin/ReportsManagement";
import { CompanySettings } from "@/components/admin/CompanySettings";
import { IntakeManagementStandalone } from "@/components/admin/IntakeManagementStandalone";
import { IntegrationHub } from "@/components/admin/database/IntegrationHub";
import { LeadWorkflowHub } from "@/components/admin/leads/LeadWorkflowHub";
import { StudentPortalManagement } from "@/components/admin/StudentPortalManagement";
import AIEmailManagementPage from "./AIEmailManagementPage";
import { HubSpotOAuthCallback } from "@/pages/HubSpotOAuthCallback";
import RecruiterManagement from "@/components/admin/RecruiterManagement";
import RecruiterApplicationsManagement from "@/components/admin/RecruiterApplicationsManagement";
import { RegistrarCommandCenter } from "@/components/admin/registrar/RegistrarCommandCenter";
import { RegistrarAIFeatures } from "@/components/admin/registrar/RegistrarAIFeatures";
import { RegistrarIntelligence } from "@/components/admin/registrar/RegistrarIntelligence";
import { OverviewDashboard } from "@/components/admin/OverviewDashboard";
import { HelpCenter } from "@/components/admin/HelpCenter";
import { PersonalAssignments } from "@/components/admin/PersonalAssignments";
import SalesRepDashboard from "./SalesRepDashboard";
import { AIFeaturesPage } from "./AIFeaturesPage";
import { EnrollmentCommandCenter } from "@/components/enrollment/EnrollmentCommandCenter";
import { SpeedToLeadPolicy } from "@/components/enrollment/SpeedToLeadPolicy";
import { PlaybookOrchestrator } from "@/components/enrollment/PlaybookOrchestrator";
import { WasteRadarDashboard } from "@/components/enrollment/WasteRadarDashboard";
import { OutcomesDashboard } from "@/components/enrollment/OutcomesDashboard";
import { IntegrationsDashboard } from "@/components/enrollment/IntegrationsDashboard";
import { StudentProgressTracker } from "@/components/enrollment/StudentProgressTracker";
import { EnrollmentPipelineAnalytics } from "@/components/enrollment/EnrollmentPipelineAnalytics";
import { EnrollmentAutomationRules } from "@/components/enrollment/EnrollmentAutomationRules";
import { AIIntelligenceDashboard } from "@/components/ai-intelligence/AIIntelligenceDashboard";

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  
  console.log('AdminDashboard rendering, pathname:', location.pathname);
  
  const renderContent = () => {
    // Check for student detail route pattern - use new StudentDetailPage
    if (location.pathname.startsWith("/admin/students/") && location.pathname !== "/admin/students") {
      // Extract student ID from the pathname and render StudentDetailPage directly (no layout wrapper)
      return <StudentDetailPage />;
    }
    
    // Check for lead detail route pattern - use LeadDetailPage
    if (location.pathname.startsWith("/admin/leads/detail/")) {
      // Extract lead ID from the pathname and render LeadDetailPage directly (no layout wrapper)
      return <LeadDetailPage />;
    }
    
    switch (location.pathname) {
      case "/admin":
        return <AdminOverview />;
      case "/admin/overview":
        return <OverviewDashboard />;
      case "/admin/help":
        return <HelpCenter />;
      case "/admin/assignments":
        return <PersonalAssignments />;
      case "/admin/ai-features":
        return <AIFeaturesPage />;
      case "/admin/sales-rep-dashboard":
        return <SalesRepDashboard />;
      case "/admin/leads":
        return <LeadOverview />;
      case "/admin/leads/workflow":
        return <LeadWorkflowHub />;
      case "/admin/registrar/command-center":
        return <RegistrarCommandCenter />;
      case "/admin/registrar/intelligence":
        return <RegistrarIntelligence />;
      case "/admin/registrar/ai-features":
        return <RegistrarAIFeatures />;
      case "/admin/leads/ai":
        return <LeadAIFeatures />;
      case "/admin/leads/forms":
        return <LeadForms />;
      case "/admin/configuration":
      case "/admin/configuration/custom-fields":
      case "/admin/configuration/master-data":
      case "/admin/configuration/integrations":
      case "/admin/configuration/templates":
      case "/admin/configuration/ai-agents":
      case "/admin/configuration/behavior":
      case "/admin/configuration/routing":
      case "/admin/configuration/scoring":
      case "/admin/configuration/company":
      case "/admin/configuration/system":
        return <ConfigurationManagement />;
      case "/admin/leads/templates":
        // Redirect to unified communication hub
        window.history.replaceState(null, '', '/admin/communication');
        return <CommunicationHub />;
      case "/admin/leads/analytics":
        return <LeadAnalytics />;
      case "/admin/leads/advanced-analytics":
        return <LeadAdvancedAnalytics />;
      case "/admin/leads/bulk":
        return <LeadBulkOperations />;
      case "/admin/students":
        return <StudentManagement />;
      case "/admin/student-portal":
        return <StudentPortalManagement />;
      case "/admin/programs":
        return <ProgramManagement />;
      case "/admin/workflows":
        return <WorkflowManagement />;
      case "/admin/documents":
        return <EnhancedDocumentManagement />;
      case "/admin/events":
        return <EventManagement />;
      case "/admin/communication":
        return <CommunicationHub />;
      case "/admin/communication/ai-emails":
        return <AIEmailManagementPage />;
      case "/admin/financial":
        return <FinancialManagement />;
      case "/admin/team":
        return <TeamManagement />;
      case "/admin/analytics":
        return <AnalyticsReporting />;
      case "/admin/settings":
        return <ProfilePage />;
      case "/admin/database":
        // Redirect old database route to configuration
        window.history.replaceState(null, '', '/admin/configuration');
        return <ConfigurationManagement />;
      case "/admin/database/integrations":
        return <IntegrationHub />;
      case "/admin/integrations/hubspot/callback":
        return <HubSpotOAuthCallback />;
      case "/admin/demo-data":
        return <DemoDataManagement />;
      case "/admin/profile":
        return <ProfilePage />;
      case "/admin/campaigns":
        return <CampaignManagement />;
      case "/admin/intake":
        return <IntakeManagementStandalone />;
      case "/admin/requirements":
        return <RequirementsManagement />;
      case "/admin/document-templates":
        return <DocumentTemplatesManagement />;
      case "/admin/reports":
        return <ReportsManagement />;
      case "/admin/company":
        return <CompanySettings />;
      case "/admin/recruiters":
        return <RecruiterManagement />;
      case "/admin/recruiter-applications":
        return <RecruiterApplicationsManagement />;
      case "/admin/enrollment/today":
        return <EnrollmentCommandCenter />;
      case "/admin/enrollment/speed-policy":
        return <SpeedToLeadPolicy />;
      case "/admin/enrollment/playbooks":
        return <PlaybookOrchestrator />;
      case "/admin/enrollment/waste-radar":
        return <WasteRadarDashboard />;
      case "/admin/enrollment/outcomes":
        return <OutcomesDashboard />;
      case "/admin/enrollment/integrations":
        return <IntegrationsDashboard />;
      case "/admin/enrollment/student-progress":
        return <StudentProgressTracker />;
      case "/admin/enrollment/pipeline-analytics":
        return <EnrollmentPipelineAnalytics />;
      case "/admin/enrollment/automation-rules":
        return <EnrollmentAutomationRules />;
      case "/admin/ai-intelligence":
        return <AIIntelligenceDashboard />;
      default:
        return <AdminOverview />;
    }
  };

  // Use modern layout only
  return (
    <ModernAdminLayout>
      {renderContent()}
    </ModernAdminLayout>
  );
};

export default AdminDashboard;