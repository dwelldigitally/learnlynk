import React, { useEffect, useState, useRef } from 'react';
import { enrollmentSeedService } from '@/services/enrollmentSeedService';
import { enrollmentDemoSeedService } from '@/services/enrollmentDemoSeedService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthRetry } from '@/hooks/useAuthRetry';

interface DataInitializerProps {
  children: React.ReactNode;
}

export function DataInitializer({ children }: DataInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const initializationAttempted = useRef(false);
  const { toast } = useToast();
  const { user, loading: authLoading, isTokenValid, refreshSession } = useAuth();
  const { executeWithRetry } = useAuthRetry();

  useEffect(() => {
    const initializeData = async () => {
      // Prevent multiple initialization attempts
      if (initializationAttempted.current) {
        console.log('📊 DataInitializer: Skipping - already attempted');
        return;
      }

      console.log('📊 DataInitializer: Starting initialization check', {
        user: !!user,
        authLoading,
        isTokenValid,
        userId: user?.id
      });

      try {
        // If no user, just mark as initialized
        if (!user) {
          console.log('📊 DataInitializer: No user, skipping initialization');
          setIsInitialized(true);
          return;
        }

        // If token is invalid, try to refresh first with enhanced retry
        if (!isTokenValid) {
          console.log('📊 DataInitializer: Token invalid, attempting refresh...');
          const refreshSuccess = await refreshSession();
          if (!refreshSuccess) {
            console.log('📊 DataInitializer: Token refresh failed, skipping initialization');
            setIsInitialized(true);
            return;
          }
          // Wait longer for the new token to propagate
          console.log('📊 DataInitializer: Waiting for token propagation...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Verify token is now valid
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.access_token) {
            console.log('📊 DataInitializer: Session not available after refresh, skipping');
            setIsInitialized(true);
            return;
          }
        }

        initializationAttempted.current = true;
        console.log('📊 DataInitializer: User authenticated, checking existing data...');

        // Use auth retry wrapper for all database operations
        const checkExistingData = async () => {
          const [existingActionsResponse, existingPlaysResponse] = await Promise.all([
            supabase
              .from('student_actions')
              .select('id')
              .eq('user_id', user.id)
              .limit(1),
            supabase
              .from('plays')
              .select('id')
              .eq('user_id', user.id)
              .limit(1)
          ]);

          return {
            existingActions: existingActionsResponse.data,
            existingPlays: existingPlaysResponse.data,
            hasError: existingActionsResponse.error || existingPlaysResponse.error
          };
        };

        const { existingActions, existingPlays, hasError } = await executeWithRetry(checkExistingData);

        if (hasError) {
          throw new Error('Failed to check existing data after retry attempts');
        }

        const hasExistingData = (existingActions && existingActions.length > 0) || 
                              (existingPlays && existingPlays.length > 0);

        if (!hasExistingData) {
          console.log('📊 DataInitializer: No existing data found, seeding demo data...');
          
          // Seed data with auth retry protection
          const seedData = async () => {
            await enrollmentDemoSeedService.seedAllDemoData();
            await enrollmentSeedService.seedAll();
          };

          await executeWithRetry(seedData);
          
          console.log('📊 DataInitializer: Demo data seeded successfully');
          toast({
            title: "Demo Data Loaded",
            description: "Starter plays, policies, and student actions are ready",
          });
        } else {
          console.log('📊 DataInitializer: Existing data found, skipping seed');
        }
        
        setIsInitialized(true);
        setInitializationError(null);
      } catch (error: any) {
        console.error('📊 DataInitializer: Initialization failed:', error);
        
        const errorMessage = error?.message?.includes('JWT expired') || error?.message?.includes('invalid JWT')
          ? 'Authentication session expired. Please refresh the page.'
          : 'Failed to initialize demo data. Some features may not be available.';
        
        setInitializationError(errorMessage);
        setIsInitialized(true); // Still show the app even if seeding fails
        
        toast({
          title: "Initialization Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };

    // Only initialize when auth is ready AND we have a valid token
    if (!authLoading && !initializationAttempted.current) {
      initializeData();
    }
  }, [user, authLoading, isTokenValid, toast, executeWithRetry]);

  // Handle token refresh when needed
  const handleRetryInitialization = async () => {
    console.log('📊 DataInitializer: Retrying initialization...');
    setInitializationError(null);
    initializationAttempted.current = false;
    setIsInitialized(false);
    
    try {
      const refreshSuccess = await refreshSession();
      if (!refreshSuccess) {
        throw new Error('Failed to refresh session');
      }
      // The useEffect will trigger initialization again
    } catch (error) {
      console.error('📊 DataInitializer: Failed to refresh session:', error);
      toast({
        title: "Session Refresh Failed",
        description: "Please refresh the page to continue",
        variant: "destructive"
      });
    }
  };

  if (authLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">
            {authLoading ? 'Authenticating...' : initializationError ? 'Initialization failed' : 'Initializing enrollment optimization data...'}
          </p>
          {initializationError && (
            <div className="space-y-2">
              <p className="text-sm text-destructive">{initializationError}</p>
              <button 
                onClick={handleRetryInitialization}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Retry Initialization
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}