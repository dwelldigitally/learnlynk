import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Shield, Zap, CheckCircle, ArrowRight, Copy } from 'lucide-react';
import hubspotService from '@/services/hubspotService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface HubSpotOAuthHandlerProps {
  onConnectionSuccess?: () => void;
}

export const HubSpotOAuthHandler: React.FC<HubSpotOAuthHandlerProps> = ({ onConnectionSuccess }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();

  const handleOAuthInstall = async () => {
    setIsConnecting(true);
    
    try {
      // Get current user session for authentication
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast({
          title: "Authentication Error",
          description: "Please log in to connect HubSpot",
          variant: "destructive"
        });
        setIsConnecting(false);
        return;
      }

      // Get OAuth configuration from edge function using GET request
      const response = await fetch(`https://rpxygdaimdiarjpfmswl.supabase.co/functions/v1/hubspot-oauth`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionData.session.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJweHlnZGFpbWRpYXJqcGZtc3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTY1MDcsImV4cCI6MjA2OTQ5MjUwN30.sR7gSV1I9CCtibU6sdk5FRH6r5m9Y1ZGrQ6ivRhNEcM',
        },
      });

      if (!response.ok) {
        console.error('Response not ok:', response.status, response.statusText);
        toast({
          title: "Connection Error",
          description: `Failed to get HubSpot OAuth configuration (${response.status})`,
          variant: "destructive"
        });
        setIsConnecting(false);
        return;
      }

      const data = await response.json();

      if (!data?.authUrl) {
        console.error('No authUrl in response:', data);
        toast({
          title: "Configuration Error", 
          description: "HubSpot OAuth not properly configured",
          variant: "destructive"
        });
        setIsConnecting(false);
        return;
      }

      // Open HubSpot OAuth in new window
      const popup = window.open(data.authUrl, 'hubspot-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes');
      
      // Listen for popup to close or receive message
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          // Check if connection was successful by testing the service
          if (hubspotService.isConnected()) {
            toast({
              title: "HubSpot Connected",
              description: "Successfully connected to HubSpot via OAuth",
            });
            onConnectionSuccess?.();
          }
        }
      }, 1000);
    } catch (error) {
      console.error('OAuth initiation error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate HubSpot connection",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  const handleManualApiKey = () => {
    setShowInstructions(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const requiredScopes = [
    'Read contacts, companies, and deals',
    'Write contacts, companies, and deals', 
    'Read and write custom objects',
    'Access owner information',
    'Read forms and submissions',
    'Access automation and workflows'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Connect HubSpot Integration
          </CardTitle>
          <CardDescription>
            Choose how you want to connect Learnlynk with your HubSpot account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OAuth Installation Option */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Recommended</Badge>
                  <h3 className="font-medium">Install as Private App</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Secure OAuth connection with automatic setup and token management
                </p>
              </div>
              <Button 
                onClick={handleOAuthInstall}
                disabled={isConnecting}
                className="flex items-center gap-2"
              >
                {isConnecting ? (
                  <>Connecting...</>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Install App
                  </>
                )}
              </Button>
            </div>

            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                This will open HubSpot in a new window where you can authorize Learnlynk as a private app. 
                You'll need admin access to your HubSpot account.
              </AlertDescription>
            </Alert>
          </div>

          <Separator />

          {/* Manual API Key Option */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">Manual API Key Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Connect using an existing private app's API key
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={handleManualApiKey}
              >
                Configure Manually
              </Button>
            </div>
          </div>

          {showInstructions && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Manual Setup Instructions</CardTitle>
                <CardDescription>
                  Follow these steps to create a private app in HubSpot and get your API key
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">1</Badge>
                    <div className="space-y-1">
                      <p className="font-medium">Go to HubSpot Developer Portal</p>
                      <p className="text-sm text-muted-foreground">
                        Navigate to Settings → Integrations → Private Apps in your HubSpot account
                      </p>
                      <Button variant="link" size="sm" asChild className="p-0 h-auto">
                        <a href="https://app.hubspot.com/private-apps" target="_blank" rel="noopener noreferrer">
                          Open HubSpot Private Apps <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">2</Badge>
                    <div className="space-y-2">
                      <p className="font-medium">Create Private App</p>
                      <p className="text-sm text-muted-foreground">Click "Create a private app" and fill in:</p>
                      <div className="bg-muted p-3 rounded space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono">App Name: Learnlynk</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard('Learnlynk')}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono">Description: Lead management integration</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard('Lead management integration')}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">3</Badge>
                    <div className="space-y-2">
                      <p className="font-medium">Configure Scopes</p>
                      <p className="text-sm text-muted-foreground">Enable these scopes in the "Scopes" tab:</p>
                      <div className="grid gap-2">
                        {requiredScopes.map((scope, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {scope}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">4</Badge>
                    <div className="space-y-1">
                      <p className="font-medium">Get API Key</p>
                      <p className="text-sm text-muted-foreground">
                        After creating the app, copy the API key and paste it in the HubSpot integration settings
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <ArrowRight className="h-4 w-4" />
                  <AlertDescription>
                    Once you have the API key, go to Admin → Configuration → Integrations to enter it.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};