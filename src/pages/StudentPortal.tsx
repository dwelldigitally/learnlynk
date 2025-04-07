
import React from "react";
import StudentLayout from "@/components/student/StudentLayout";
import StudentDashboard from "@/components/student/StudentDashboard";

const StudentPortal: React.FC = () => {
  return (
    <StudentLayout>
      <StudentDashboard />
    </StudentLayout>
  );
};

export default StudentPortal;
