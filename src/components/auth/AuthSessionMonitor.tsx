import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function AuthSessionMonitor() {
  const { isTokenValid, session, refreshSession, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't check on public routes
    if (location.pathname === '/login' || location.pathname === '/register') {
      return;
    }

    // If we have a session but token is invalid, try to refresh
    if (session && !isTokenValid) {
      console.log('Token is invalid, attempting to refresh session...');
      refreshSession().then((success) => {
        if (!success) {
          toast.error('Your session has expired. Please sign in again.');
          signOut().then(() => {
            navigate('/login');
          });
        } else {
          toast.success('Session refreshed successfully');
        }
      });
    }
  }, [isTokenValid, session, refreshSession, signOut, location.pathname, navigate]);

  // Monitor for JWT expired errors in the global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('JWT expired') || 
          event.error?.code === 'PGRST301') {
        console.log('JWT expired error detected, attempting session refresh...');
        refreshSession().then((success) => {
          if (!success) {
            toast.error('Your session has expired. Please sign in again.');
            signOut().then(() => {
              navigate('/login');
            });
          }
        });
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, [refreshSession, signOut, navigate]);

  return null; // This component doesn't render anything
}