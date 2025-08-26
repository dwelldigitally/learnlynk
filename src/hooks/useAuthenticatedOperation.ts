import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthenticatedOperationOptions {
  maxRetries?: number;
  retryDelay?: number;
  requireValidToken?: boolean;
}

export function useAuthenticatedOperation(options: UseAuthenticatedOperationOptions = {}) {
  const { maxRetries = 3, retryDelay = 1000, requireValidToken = true } = options;
  const { refreshSession, isTokenValid, session } = useAuth();

  const executeWithAuth = async <T>(
    operation: () => Promise<T>,
    retryCount = 0
  ): Promise<T> => {
    try {
      // Check if we have a valid session and token
      if (requireValidToken && (!session || !isTokenValid)) {
        console.log('Token invalid, attempting refresh before operation...');
        const refreshSuccess = await refreshSession();
        
        if (!refreshSuccess && retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retryCount)));
          return executeWithAuth(operation, retryCount + 1);
        } else if (!refreshSuccess) {
          throw new Error('Authentication failed: Unable to refresh session');
        }
        
        // Wait for token propagation
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      return await operation();
    } catch (error: any) {
      const isAuthError = error?.code === 'PGRST301' || 
                         error?.message?.includes('JWT expired') ||
                         error?.message?.includes('invalid JWT') ||
                         error?.message?.includes('token has invalid claims');

      if (isAuthError && retryCount < maxRetries) {
        console.log(`Auth error detected (${error.message}), attempting retry ${retryCount + 1}/${maxRetries}`);
        
        // Try to refresh the session
        const refreshSuccess = await refreshSession();
        
        if (refreshSuccess) {
          // Wait with exponential backoff
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retryCount)));
          return executeWithAuth(operation, retryCount + 1);
        } else if (retryCount < maxRetries - 1) {
          // If refresh failed but we have retries left, try again
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retryCount)));
          return executeWithAuth(operation, retryCount + 1);
        }
      }
      
      // If it's not an auth error or we've exhausted retries, throw the original error
      throw error;
    }
  };

  return { executeWithAuth, isTokenValid, hasValidSession: !!session };
}