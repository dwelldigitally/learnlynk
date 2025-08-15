import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import hubspotService from '@/services/hubspotService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const HubSpotOAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Get the current session for proper authentication
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw new Error('Not authenticated');
        }

        // Exchange the code for an access token
        const response = await supabase.functions.invoke('hubspot-oauth', {
          body: { code },
        });

        if (response.error) {
          throw new Error(response.error.message || 'Failed to connect to HubSpot');
        }

        const data = response.data;
        console.log('HubSpot OAuth success:', data);

        // Store the connection status
        localStorage.setItem('hubspot_oauth_connected', 'true');
        
        setStatus('success');
        
        toast({
          title: "HubSpot Connected",
          description: "Successfully connected to HubSpot via OAuth",
        });

        // Close popup if this is running in a popup
        if (window.opener) {
          window.opener.postMessage({ type: 'hubspot-oauth-success' }, '*');
          window.close();
        } else {
          // Redirect to integrations page after a delay
          setTimeout(() => {
            navigate('/admin/configuration');
          }, 3000);
        }

      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('error');
        
        toast({
          title: "Connection Failed",
          description: "Failed to connect to HubSpot. Please try again.",
          variant: "destructive",
        });

        // Close popup with error if this is running in a popup
        if (window.opener) {
          window.opener.postMessage({ type: 'hubspot-oauth-error', error: err instanceof Error ? err.message : 'Unknown error' }, '*');
          window.close();
        }
      }
    };

    handleCallback();
  }, [location.search, navigate, toast]);

  const handleRetry = () => {
    navigate('/admin/configuration');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'processing' && <Loader2 className="w-5 h-5 animate-spin" />}
            {status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            HubSpot Integration
          </CardTitle>
          <CardDescription>
            {status === 'processing' && 'Processing your HubSpot connection...'}
            {status === 'success' && 'Successfully connected to HubSpot'}
            {status === 'error' && 'Failed to connect to HubSpot'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === 'processing' && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Please wait while we establish the connection with your HubSpot account...
              </AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your HubSpot account has been successfully connected! You can now sync leads, contacts, and other data.
                {!window.opener && ' Redirecting you back to the integrations page...'}
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error || 'An unexpected error occurred while connecting to HubSpot.'}
                </AlertDescription>
              </Alert>
              
              {!window.opener && (
                <Button onClick={handleRetry} className="w-full">
                  Return to Integrations
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};