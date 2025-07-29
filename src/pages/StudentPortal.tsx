
import React from "react";
import { useLocation } from "react-router-dom";
import StudentLayout from "@/components/student/StudentLayout";
import StudentDashboard from "@/components/student/StudentDashboard";
import StudentOverview from "@/components/student/StudentOverview";
import YourApplications from "@/components/student/YourApplications";
import PayYourFee from "@/components/student/PayYourFee";
import MessageCentre from "@/components/student/MessageCentre";
import AcademicPlanning from "@/components/student/AcademicPlanning";
import FinancialAid from "@/components/student/FinancialAid";
import CareerServices from "@/components/student/CareerServices";
import StudentCommunity from "@/components/student/StudentCommunity";
import NewsAndEvents from "./NewsAndEvents";
import LifeAtWCC from "./LifeAtWCC";

const StudentPortal: React.FC = () => {
  const location = useLocation();
  
  const renderContent = () => {
    switch (location.pathname) {
      case "/student":
        return <StudentOverview />;
      case "/student/dashboard":
        return <StudentDashboard />;
      case "/student/applications":
        return <YourApplications />;
      case "/student/academic-planning":
        return <AcademicPlanning />;
      case "/student/financial-aid":
        return <FinancialAid />;
      case "/student/career-services":
        return <CareerServices />;
      case "/student/community":
        return <StudentCommunity />;
      case "/student/fee":
        return <PayYourFee />;
      case "/student/messages":
        return <MessageCentre />;
      case "/student/news-events":
        return <NewsAndEvents />;
      case "/student/campus-life":
        return <LifeAtWCC />;
      default:
        return <StudentOverview />;
    }
  };

  return (
    <StudentLayout>
      {renderContent()}
    </StudentLayout>
  );
};

export default StudentPortal;
