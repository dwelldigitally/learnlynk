
import React from "react";
import { useLocation } from "react-router-dom";
import StudentLayout from "@/components/student/StudentLayout";
import StudentDashboard from "@/components/student/StudentDashboard";
import LifeAtWCC from "./LifeAtWCC";

const StudentPortal: React.FC = () => {
  const location = useLocation();
  
  const renderContent = () => {
    switch (location.pathname) {
      case "/student/campus-life":
        return <LifeAtWCC />;
      case "/student/dashboard":
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <StudentLayout>
      {renderContent()}
    </StudentLayout>
  );
};

export default StudentPortal;
