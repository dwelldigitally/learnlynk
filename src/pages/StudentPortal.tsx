
import React, { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import StudentLayout from "@/components/student/StudentLayout";
import WelcomeOnboarding from "@/components/student/WelcomeOnboarding";
import { useStudentSession, useStudentPortalRealtime, useActivityTracking } from "@/hooks/useStudentPortalIntegration";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import { useWelcomeFlow } from "@/hooks/useWelcomeFlow";
import { getRouteComponent } from "@/config/studentPortalRoutes";
import { PortalLoadingState, AccessDeniedState } from "@/components/student/portal/LoadingStates";
import type { StudentPortalContextType } from "@/types/studentPortal";

// Student Portal Context
const StudentPortalContext = createContext<StudentPortalContextType>({
  session: null,
  accessToken: null,
  leadId: null,
  sessionId: null,
  isLoading: true,
});

export const useStudentPortalContext = () => useContext(StudentPortalContext);

/**
 * Student Portal main component
 * Manages authentication, routing, and context for the entire student portal experience
 */
const StudentPortal: React.FC = () => {
  const location = useLocation();
  
  // Token validation and portal data management
  const { accessToken, portalData, isValidating } = useTokenValidation();
  
  // Get session data using the integration hook
  const { data: session, isLoading: sessionLoading } = useStudentSession(accessToken);
  
  // Set up real-time updates and activity tracking
  const { isConnected } = useStudentPortalRealtime(session?.lead_id || null);
  useActivityTracking(session?.id || null);
  
  // Welcome flow management
  const { showWelcome, handleWelcomeComplete } = useWelcomeFlow(portalData);
  
  /**
   * Renders the appropriate content component based on current route
   * Uses the route configuration for cleaner maintenance
   */
  const renderContent = () => {
    const Component = getRouteComponent(location.pathname);
    
    if (!Component) {
      return <div className="flex items-center justify-center h-64">Component not found</div>;
    }

    // Handle lazy-loaded components (blog details and practicum routes)
    if (location.pathname.includes('/news-events/blog/') || location.pathname.includes('/student/practicum')) {
      return (
        <React.Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
          <Component />
        </React.Suspense>
      );
    }

    return <Component />;
  };

  // Memoized context value to prevent unnecessary re-renders
  const contextValue: StudentPortalContextType = useMemo(() => ({
    session,
    accessToken,
    leadId: session?.lead_id || null,
    sessionId: session?.id || null,
    isLoading: sessionLoading || isValidating,
  }), [session, accessToken, sessionLoading, isValidating]);

  // Loading state - show while validating token or loading session
  if (isValidating || sessionLoading) {
    return <PortalLoadingState isConnected={isConnected} />;
  }

  // Access denied state - token exists but session is invalid
  if (!session && accessToken) {
    return <AccessDeniedState />;
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
