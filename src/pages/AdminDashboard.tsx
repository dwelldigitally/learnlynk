import React from "react";
import { useLocation } from "react-router-dom";
import LeadDetailPage from './LeadDetailPage';
import ModernAdminLayout from "@/components/admin/ModernAdminLayout";
import AdminOverview from "@/components/admin/AdminOverview";
import StudentManagement from "@/components/admin/StudentManagement";
import StudentDetail from "@/components/admin/StudentDetail";
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
import { LeadWorkflowHub } from "@/components/admin/leads/LeadWorkflowHub";
import { StudentPortalManagement } from "@/components/admin/StudentPortalManagement";
import AIEmailManagementPage from "./AIEmailManagementPage";
import RecruiterManagement from "@/components/admin/RecruiterManagement";
import RecruiterApplicationsManagement from "@/components/admin/RecruiterApplicationsManagement";
import { RegistrarCommandCenter } from "@/components/admin/registrar/RegistrarCommandCenter";

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  
  const renderContent = () => {
    // Check for student detail route pattern
    if (location.pathname.startsWith("/admin/students/") && location.pathname !== "/admin/students") {
      // Extract student ID from the pathname
      const studentId = location.pathname.split("/admin/students/")[1];
      return <StudentDetail studentId={studentId} />;
    }
    
    // Lead detail routes are handled separately to avoid layout wrapper
    
    switch (location.pathname) {
      case "/admin":
        return <AdminOverview />;
      case "/admin/leads":
        return <LeadOverview />;
      case "/admin/leads/workflow":
        return <LeadWorkflowHub />;
      case "/admin/registrar/command-center":
        return <RegistrarCommandCenter />;
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