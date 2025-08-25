import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, AlertCircle, RefreshCw } from 'lucide-react';
import { AIIntelligenceTestData } from '@/utils/aiIntelligenceTestData';
import { AIDecisionService } from '@/services/aiDecisionService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AIInitializerProps {
  onInitialized: () => void;
}

export function AIInitializer({ onInitialized }: AIInitializerProps) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();
  const { refreshSession, isTokenValid } = useAuth();

  useEffect(() => {
    checkExistingData();
  }, []);

  const checkExistingData = async (skipErrorHandling = false) => {
    try {
      const configs = await AIDecisionService.getConfigurations();
      setHasData(configs.length > 0);
      setError(null); // Clear any previous errors on success
      if (configs.length > 0) {
        onInitialized();
      }
    } catch (err: any) {
      if (!skipErrorHandling) {
        if (err.message.includes('Authentication expired') || err.message.includes('session has expired')) {
          setError('Your session has expired. Please try refreshing your session below.');
        } else {
          setError('Failed to check existing data');
        }
        console.error('Error checking AI data:', err);
      }
    }
  };

  const handleRetryWithRefresh = async () => {
    setIsRetrying(true);
    setError(null);
    
    try {
      const refreshSuccess = await refreshSession();
      if (refreshSuccess) {
        await checkExistingData(true);
        toast({
          title: "Session Refreshed",
          description: "Successfully refreshed your session",
        });
      } else {
        setError('Failed to refresh session. Please reload the page.');
      }
    } catch (err: any) {
      setError('Failed to refresh session. Please reload the page.');
      console.error('Error refreshing session:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const initializeSampleData = async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      await AIIntelligenceTestData.createSampleData();
      setHasData(true);
      toast({
        title: "Success",
        description: "AI Intelligence sample data has been created successfully",
      });
      onInitialized();
    } catch (err: any) {
      console.error('Error initializing AI data:', err);
      if (err.message.includes('Authentication expired')) {
        setError('Your session has expired. Please refresh the page and log in again.');
      } else {
        setError('Failed to initialize sample data. Please try again.');
      }
      toast({
        title: "Error",
        description: err.message || "Failed to initialize sample data",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Authentication Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button 
                onClick={handleRetryWithRefresh}
                disabled={isRetrying}
                className="w-full"
                variant="outline"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing Session...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Session
                  </>
                )}
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasData) {
    return null; // Data exists, let parent component render
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Initialize AI Intelligence</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No AI configurations found. Initialize the AI Intelligence Center with sample data to get started.
          </p>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This will create sample AI logic configurations, decision logs, scenario tests, and performance baselines.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={initializeSampleData} 
            disabled={isInitializing}
            className="w-full"
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Initialize Sample Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}