import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export function useAuthRetry(options: UseAuthRetryOptions = {}) {
  const { maxRetries = 2, retryDelay = 1000 } = options;
  const { refreshSession, isTokenValid } = useAuth();

  const executeWithRetry = async <T>(
    operation: () => Promise<T>,
    retryCount = 0
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error: any) {
      const isAuthError = error?.code === 'PGRST301' || 
                         error?.message?.includes('JWT expired') ||
                         error?.message?.includes('invalid JWT');

      if (isAuthError && retryCount < maxRetries) {
        console.log(`Auth error detected, attempting retry ${retryCount + 1}/${maxRetries}`);
        
        // Try to refresh the session
        const refreshSuccess = await refreshSession();
        
        if (refreshSuccess) {
          // Wait a moment for the new token to be available
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return executeWithRetry(operation, retryCount + 1);
        } else {
          // If refresh failed, throw a more user-friendly error
          throw new Error('Your session has expired. Please refresh the page and log in again.');
        }
      }
      
      // If it's not an auth error or we've exhausted retries, throw the original error
      throw error;
    }
  };

  return { executeWithRetry, isTokenValid };
}