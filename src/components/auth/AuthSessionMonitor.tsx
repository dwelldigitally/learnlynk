import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function AuthSessionMonitor() {
  const { isTokenValid, session, refreshSession, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const refreshInProgress = useRef(false);

  const handleSessionRefresh = useCallback(async () => {
    if (refreshInProgress.current) return;
    
    refreshInProgress.current = true;
    console.log('🔄 Auth session refresh initiated');
    
    try {
      const success = await refreshSession();
      if (!success) {
        console.log('❌ Session refresh failed, signing out');
        toast.error('Your session has expired. Please sign in again.');
        await signOut();
        navigate('/login');
      } else {
        console.log('✅ Session refreshed successfully');
      }
    } finally {
      refreshInProgress.current = false;
    }
  }, [refreshSession, signOut, navigate]);

  useEffect(() => {
    // Don't check on public routes
    if (location.pathname === '/login' || location.pathname === '/register') {
      return;
    }

    // Only check if we have a session and token is invalid, and not already refreshing
    if (session && !isTokenValid && !refreshInProgress.current) {
      console.log('🔍 Token validation check - invalid token detected');
      handleSessionRefresh();
    }
  }, [isTokenValid, session, location.pathname, handleSessionRefresh]);

  // Monitor for JWT expired errors in the global error handler with debouncing
  useEffect(() => {
    let errorTimeout: NodeJS.Timeout;

    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('JWT expired') || 
          event.error?.code === 'PGRST301') {
        
        // Debounce error handling to prevent rapid successive calls
        clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => {
          console.log('🚨 JWT expired error detected');
          if (!refreshInProgress.current) {
            handleSessionRefresh();
          }
        }, 1000);
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => {
      window.removeEventListener('error', handleGlobalError);
      clearTimeout(errorTimeout);
    };
  }, [handleSessionRefresh]);

  return null; // This component doesn't render anything
}