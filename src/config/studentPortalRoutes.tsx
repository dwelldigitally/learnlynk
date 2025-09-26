import React from "react";
import StudentOverview from "@/components/student/StudentOverview";
import StudentDashboard from "@/components/student/StudentDashboard";
import YourApplications from "@/components/student/YourApplications";
import MessageCentre from "@/components/student/MessageCentre";
import AcademicPlanning from "@/components/student/AcademicPlanning";
import DocumentUpload from "@/components/student/DocumentUpload";
import PayYourFee from "@/components/student/PayYourFee";
import FinancialAid from "@/components/student/FinancialAid";
import { FinancialAidApplications } from '@/components/student/financial-aid/FinancialAidApplications';
import { FinancialAidCalculator } from '@/components/student/financial-aid/FinancialAidCalculator';
import { FinancialAidDocuments } from '@/components/student/financial-aid/FinancialAidDocuments';
import { FinancialAidAwards } from '@/components/student/financial-aid/FinancialAidAwards';
import { FinancialAidAppeals } from '@/components/student/financial-aid/FinancialAidAppeals';
import CareerServices from "@/components/student/CareerServices";
import NewsAndEvents from "@/pages/NewsAndEvents";
import LifeAtWCC from "@/pages/LifeAtWCC";
import CourseCatalog from "@/components/student/CourseCatalog";
import StudentGrades from "@/components/student/StudentGrades";
import StudentSupport from "@/components/student/StudentSupport";
import EmergencyContacts from "@/components/student/EmergencyContacts";
import Housing from "@/components/student/Housing";
import StudentServices from "@/components/student/StudentServices";

// Route configuration for student portal
// Maps paths to their corresponding components for cleaner routing logic
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
}

export const studentPortalRoutes: RouteConfig[] = [
  // Overview/Dashboard routes
  { path: "/student", component: StudentOverview },
  { path: "/student-portal", component: StudentOverview },
  { path: "/student/dashboard", component: StudentDashboard },
  { path: "/student-portal/dashboard", component: StudentDashboard },
  
  // Application routes
  { path: "/student/applications", component: YourApplications },
  { path: "/student-portal/applications", component: YourApplications },
  
  // Academic planning
  { path: "/student/academic-planning", component: AcademicPlanning },
  { path: "/student-portal/academic-planning", component: AcademicPlanning },
  
  // Financial aid main page
  { path: "/student/financial-aid", component: FinancialAid },
  { path: "/student-portal/financial-aid", component: FinancialAid },
  
  // Financial aid sub-pages
  { path: "/student/financial-aid/applications", component: FinancialAidApplications },
  { path: "/student/financial-aid/calculator", component: FinancialAidCalculator },
  { path: "/student/financial-aid/documents", component: FinancialAidDocuments },
  { path: "/student/financial-aid/awards", component: FinancialAidAwards },
  { path: "/student/financial-aid/appeals", component: FinancialAidAppeals },
  
  // Other services
  { path: "/student/career-services", component: CareerServices },
  { path: "/student-portal/career-services", component: CareerServices },
  { path: "/student/documents", component: DocumentUpload },
  { path: "/student-portal/documents", component: DocumentUpload },
  { path: "/student/fee", component: PayYourFee },
  { path: "/student-portal/fee", component: PayYourFee },
  { path: "/student/messages", component: MessageCentre },
  { path: "/student-portal/messages", component: MessageCentre },
  { path: "/student/news-events", component: NewsAndEvents },
  { path: "/student-portal/news-events", component: NewsAndEvents },
  { path: "/student/campus-life", component: LifeAtWCC },
  { path: "/student-portal/campus-life", component: LifeAtWCC },
  
  // Practicum routes
  { path: "/student/practicum", component: React.lazy(() => import('@/components/student/practicum/PracticumDashboard')) },
  { path: "/student/practicum/attendance", component: React.lazy(() => import('@/components/student/practicum/AttendanceSubmission')) },
  { path: "/student/practicum/competencies", component: React.lazy(() => import('@/components/student/practicum/CompetencyTracker')) },
  { path: "/student/practicum/journals", component: React.lazy(() => import('@/components/student/practicum/WeeklyJournal')) },
  { path: "/student/practicum/evaluations", component: React.lazy(() => import('@/components/student/practicum/SelfEvaluation')) },
  { path: "/student/practicum/progress", component: React.lazy(() => import('@/components/student/practicum/ProgressTracker')) },
  { path: "/student/practicum/records", component: React.lazy(() => import('@/components/student/practicum/RecordsList')) },
  
  // Student Services (main page with links to sub-services)
  { path: "/student/services", component: StudentServices },
  
  // Individual service pages (accessible from Student Services)
  { path: "/student/support", component: StudentSupport },
  { path: "/student/emergency-contacts", component: EmergencyContacts },
  { path: "/student/housing", component: Housing },
];

/**
 * Finds the appropriate component for the current pathname
 * Handles both static routes and dynamic blog routes
 */
export const getRouteComponent = (pathname: string): React.ComponentType | null => {
  // Handle blog detail routes with lazy loading
  if (pathname.includes('/news-events/blog/')) {
    return React.lazy(() => import('@/components/student/BlogDetailPage'));
  }

  // Find matching static route
  const route = studentPortalRoutes.find(route => route.path === pathname);
  return route ? route.component : StudentOverview; // Default to overview
};
