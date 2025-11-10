import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [setupProgress, setSetupProgress] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      // Check if user has completed onboarding and setup status
      const checkOnboardingStatus = async () => {
        try {
          // Check database for onboarding and setup completion
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed_at, setup_progress')
            .eq('user_id', user.id)
            .maybeSingle();

          if (profile?.onboarding_completed_at) {
            // User has completed onboarding
            setHasCompletedOnboarding(true);
            setSetupProgress(profile.setup_progress ?? 0);
            // Sync with localStorage for future performance
            localStorage.setItem('onboarding-completed', 'true');
            return;
          }

          // Fallback to localStorage if database doesn't have the info
          const onboardingCompleted = localStorage.getItem('onboarding-completed');
          const userMetadata = user.user_metadata;
          
          // For OAuth users, assume they should have admin access and onboarding
          const isOAuthUser = user.app_metadata?.providers?.includes('google') || user.app_metadata?.providers?.includes('azure');
          const isAdmin = userMetadata?.user_role === 'admin' || isOAuthUser;
          const hasOnboardingData = onboardingCompleted === 'true';
          
          setHasCompletedOnboarding(hasOnboardingData || !isAdmin);
          setSetupProgress(0);
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          // Fallback to localStorage on error
          const onboardingCompleted = localStorage.getItem('onboarding-completed');
          setHasCompletedOnboarding(onboardingCompleted === 'true');
          setSetupProgress(0);
        }
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

  // Check if user email is verified using Supabase's built-in confirmation
  if (!user.email_confirmed_at) {
    return <Navigate to="/verify-email" replace />;
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
  const isOnSetupPage = location.pathname === '/admin/setup';
  
  // If admin hasn't completed onboarding, redirect to onboarding
  if (isAdmin && !hasCompletedOnboarding && !isOnOnboardingPage) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user completed onboarding but is still on onboarding page, redirect to setup
  if (hasCompletedOnboarding && isOnOnboardingPage) {
    return <Navigate to="/admin/setup" replace />;
  }

  // If user completed onboarding but hasn't completed setup and is accessing dashboard
  // Redirect to setup page (but allow access to other admin pages)
  if (hasCompletedOnboarding && !isOnSetupPage && location.pathname === '/admin' && setupProgress !== null && setupProgress < 100) {
    return <Navigate to="/admin/setup" replace />;
  }

  // If user is not admin and trying to access admin routes, redirect to home
  if (!isAdmin && location.pathname.startsWith('/admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};