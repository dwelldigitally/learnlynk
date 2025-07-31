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
      case "/admin/communications":
        return <CommunicationCenter />;
      case "/admin/finance":
        return <FinancialManagement />;
      case "/admin/team":
        return <TeamManagement />;
      case "/admin/analytics":
        return <AnalyticsReporting />;
      case "/admin/settings":
        return <SystemConfiguration />;
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