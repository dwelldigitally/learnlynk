import React from "react";
import { useLocation } from "react-router-dom";
import ModernAdminLayout from "@/components/admin/ModernAdminLayout";
import AdminOverview from "@/components/admin/AdminOverview";
import StudentManagement from "@/components/admin/StudentManagement";
import StudentDetail from "@/components/admin/StudentDetail";
import ProgramManagement from "@/components/admin/ProgramManagement";
import WorkflowManagement from "@/components/admin/WorkflowManagement";
import EnhancedDocumentManagement from "@/components/admin/EnhancedDocumentManagement";
import EventManagement from "@/components/admin/EventManagement";
import CommunicationCenter from "@/components/admin/CommunicationCenter";
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
import { DatabaseManagement } from "@/components/admin/DatabaseManagement";
import { DemoDataManagement } from "@/components/admin/DemoDataManagement";

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  
  const renderContent = () => {
    // Check for student detail route pattern
    if (location.pathname.startsWith("/admin/students/") && location.pathname !== "/admin/students") {
      return <StudentDetail />;
    }
    
    switch (location.pathname) {
      case "/admin":
        return <AdminOverview />;
      case "/admin/leads":
        return <LeadOverview />;
      case "/admin/leads/ai":
        return <LeadAIFeatures />;
      case "/admin/leads/forms":
        return <LeadForms />;
      case "/admin/leads/routing":
        return <LeadRoutingRules />;
      case "/admin/leads/scoring":
        return <LeadScoringEngine />;
      case "/admin/leads/templates":
        return <LeadTemplates />;
      case "/admin/leads/analytics":
        return <LeadAnalytics />;
      case "/admin/leads/advanced-analytics":
        return <LeadAdvancedAnalytics />;
      case "/admin/leads/bulk":
        return <LeadBulkOperations />;
      case "/admin/students":
        return <StudentManagement />;
      case "/admin/programs":
        return <ProgramManagement />;
      case "/admin/workflows":
        return <WorkflowManagement />;
      case "/admin/documents":
        return <EnhancedDocumentManagement />;
      case "/admin/events":
        return <EventManagement />;
      case "/admin/communication":
        return <CommunicationCenter />;
      case "/admin/financial":
        return <FinancialManagement />;
      case "/admin/team":
        return <TeamManagement />;
      case "/admin/analytics":
        return <AnalyticsReporting />;
      case "/admin/settings":
        return <SystemConfiguration />;
      case "/admin/database":
        return <DatabaseManagement />;
      case "/admin/demo-data":
        return <DemoDataManagement />;
      case "/admin/profile":
        return <ProfilePage />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <ModernAdminLayout>
      {renderContent()}
    </ModernAdminLayout>
  );
};

export default AdminDashboard;