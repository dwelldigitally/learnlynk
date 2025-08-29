
import React, { useEffect, useState, createContext, useContext } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import StudentLayout from "@/components/student/StudentLayout";
import StudentDashboard from "@/components/student/StudentDashboard";
import StudentOverview from "@/components/student/StudentOverview";
import YourApplications from "@/components/student/YourApplications";
import MessageCentre from "@/components/student/MessageCentre";
import AcademicPlanning from "@/components/student/AcademicPlanning";
import DocumentUpload from "@/components/student/DocumentUpload";
import PayYourFee from "@/components/student/PayYourFee";
import WelcomeOnboarding from "@/components/student/WelcomeOnboarding";

import NewsAndEvents from "./NewsAndEvents";
import LifeAtWCC from "./LifeAtWCC";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useStudentSession, useStudentPortalRealtime, useActivityTracking } from "@/hooks/useStudentPortalIntegration";

// Student Portal Context
interface StudentPortalContextType {
  session: any;
  accessToken: string | null;
  leadId: string | null;
  sessionId: string | null;
  isLoading: boolean;
}

const StudentPortalContext = createContext<StudentPortalContextType>({
  session: null,
  accessToken: null,
  leadId: null,
  sessionId: null,
  isLoading: true,
});

export const useStudentPortalContext = () => useContext(StudentPortalContext);

const StudentPortal: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [portalData, setPortalData] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Get session data using the integration hook
  const { data: session, isLoading: sessionLoading } = useStudentSession(accessToken);
  
  // Set up real-time updates and activity tracking
  const { isConnected } = useStudentPortalRealtime(session?.lead_id || null);
  useActivityTracking(session?.id || null);
  
  // Check for access token from webform redirect or URL params
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setAccessToken(token);
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
      
      // Check if this is first time visiting
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${data.access_token}`);
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
      
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

  const handleWelcomeComplete = () => {
    if (portalData?.access_token) {
      localStorage.setItem(`welcome_seen_${portalData.access_token}`, 'true');
    }
    setShowWelcome(false);
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
      case "/student/documents":
        return <DocumentUpload />;
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

  // Create context value
  const contextValue: StudentPortalContextType = {
    session,
    accessToken,
    leadId: session?.lead_id || null,
    sessionId: session?.id || null,
    isLoading: sessionLoading || isValidating,
  };

  if (isValidating || sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your portal...</p>
          {isConnected && (
            <p className="mt-2 text-sm text-emerald-600">🔄 Real-time updates connected</p>
          )}
        </div>
      </div>
    );
  }

  if (!session && accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
          <p className="mt-2 text-muted-foreground">Your session has expired or is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <StudentPortalContext.Provider value={contextValue}>
      <StudentLayout>
        {renderContent()}
      </StudentLayout>
      
      <WelcomeOnboarding 
        open={showWelcome}
        onComplete={handleWelcomeComplete}
        studentName={portalData?.student_name || session?.student_name || "Student"}
      />
    </StudentPortalContext.Provider>
  );
};

export default StudentPortal;
