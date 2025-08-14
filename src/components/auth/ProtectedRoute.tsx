import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      // Check if user has completed onboarding
      const checkOnboardingStatus = () => {
        // Check for onboarding completion in localStorage
        const onboardingCompleted = localStorage.getItem('onboarding-completed');
        const userMetadata = user.user_metadata;
        
        // If user is admin role and hasn't completed onboarding, redirect to onboarding
        const isAdmin = userMetadata?.user_role === 'admin';
        const hasOnboardingData = onboardingCompleted === 'true';
        
        setHasCompletedOnboarding(hasOnboardingData || !isAdmin);
      };

      checkOnboardingStatus();
    }
  }, [user]);

  // Show loading only when auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check if user email is verified FIRST - before any other logic
  if (!user.email_confirmed_at && !user.user_metadata?.email_verified) {
    return <Navigate to="/verify-otp" replace />;
  }

  // Now check onboarding status only if we have a verified user
  if (hasCompletedOnboarding === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  // Check if user is admin and hasn't completed onboarding
  const isAdmin = user.user_metadata?.user_role === 'admin';
  const isOnOnboardingPage = location.pathname === '/onboarding';
  
  if (isAdmin && !hasCompletedOnboarding && !isOnOnboardingPage) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user completed onboarding but is still on onboarding page, redirect to admin
  if (hasCompletedOnboarding && isOnOnboardingPage) {
    return <Navigate to="/admin" replace />;
  }

  // If user is not admin and trying to access admin routes, redirect to home
  if (!isAdmin && location.pathname.startsWith('/admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};