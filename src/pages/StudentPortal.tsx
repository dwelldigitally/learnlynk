
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import StudentLayout from "@/components/student/StudentLayout";
import StudentDashboard from "@/components/student/StudentDashboard";
import StudentOverview from "@/components/student/StudentOverview";
import YourApplications from "@/components/student/YourApplications";
import PayYourFee from "@/components/student/PayYourFee";
import MessageCentre from "@/components/student/MessageCentre";
import AcademicPlanning from "@/components/student/AcademicPlanning";
import FinancialAid from "@/components/student/FinancialAid";
import CareerServices from "@/components/student/CareerServices";

import NewsAndEvents from "./NewsAndEvents";
import LifeAtWCC from "./LifeAtWCC";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const StudentPortal: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [portalData, setPortalData] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  // Check for access token from webform redirect
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      validateAccessToken(token);
    }
  }, [searchParams]);
  
  const validateAccessToken = async (token: string) => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase
        .from('student_portal_access')
        .select('*')
        .eq('access_token', token)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error || !data) {
        toast({
          title: "Invalid Access",
          description: "Your access token is invalid or has expired.",
          variant: "destructive"
        });
        return;
      }
      
      setPortalData(data);
      toast({
        title: "Welcome!",
        description: `Welcome ${data.student_name}! Your application has been received.`
      });
    } catch (error) {
      console.error('Error validating token:', error);
    } finally {
      setIsValidating(false);
    }
  };
  
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
