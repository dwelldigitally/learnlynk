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
import { useHubSpotConnection } from '@/hooks/useHubSpotConnection';

interface HubSpotOAuthHandlerProps {
  onConnectionSuccess?: () => void;
}

export const HubSpotOAuthHandler: React.FC<HubSpotOAuthHandlerProps> = ({ onConnectionSuccess }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();
  const { refreshConnection } = useHubSpotConnection();

  // Test edge function connectivity
  const testConnection = async () => {
    try {
      console.log('🧪 Testing edge function connectivity...');
      const { data, error } = await supabase.functions.invoke('hubspot-oauth/test');
      
      if (error) {
        console.error('❌ Edge function test failed:', error);
        return false;
      }
      
      console.log('✅ Edge function test successful:', data);
      return true;
    } catch (error) {
      console.error('❌ Edge function test error:', error);
      return false;
    }
  };

  const handleOAuthInstall = async () => {
    try {
      setIsConnecting(true);
      console.log('🚀 Starting HubSpot OAuth flow...');

      // First test the edge function
      const isConnected = await testConnection();
      if (!isConnected) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to HubSpot service. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Get OAuth configuration from our edge function
      console.log('📋 Getting OAuth configuration...');
      const { data, error } = await supabase.functions.invoke('hubspot-oauth', {
        method: 'GET'
      });

      console.log('📊 OAuth config response:', { data, error });
      
      if (error) {
        console.error('❌ Error getting OAuth config:', error);
        toast({
          title: "Configuration Error",
          description: `Failed to get HubSpot OAuth configuration: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!data?.authUrl) {
        console.error('❌ No auth URL received:', data);
        toast({
          title: "Configuration Error", 
          description: "Invalid OAuth configuration received.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ OAuth URL generated successfully');

      // Open HubSpot OAuth in a popup
      const popup = window.open(
        data.authUrl,
        'hubspot-oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups for this site and try again.",
          variant: "destructive",
        });
        return;
      }

      // Listen for the OAuth callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'HUBSPOT_OAUTH_SUCCESS') {
          console.log('✅ OAuth success message received:', event.data);
          
          try {
            console.log('🔄 Exchanging authorization code for tokens...');
            
            // Exchange the authorization code for tokens
            const { data: tokenData, error: tokenError } = await supabase.functions.invoke('hubspot-oauth', {
              method: 'POST',
              body: { code: event.data.code }
            });

            console.log('📊 Token exchange response:', { tokenData, tokenError });

            if (tokenError) {
              console.error('❌ Token exchange error:', tokenError);
              toast({
                title: "Authentication Failed",
                description: `Failed to complete authentication: ${tokenError.message}`,
                variant: "destructive",
              });
              return;
            }

            if (!tokenData?.success) {
              console.error('❌ Token exchange failed:', tokenData);
              toast({
                title: "Authentication Failed",
                description: "Failed to complete the authentication process.",
                variant: "destructive",
              });
              return;
            }

            console.log('✅ Token exchange successful');
            
            toast({
              title: "Connected Successfully",
              description: "Your HubSpot account has been connected successfully!",
            });

            // Refresh the connection status
            onConnectionSuccess?.();
            refreshConnection();
            
          } catch (err) {
            console.error('❌ Error during token exchange:', err);
            toast({
              title: "Connection Failed",
              description: "Failed to complete the connection process.",
              variant: "destructive",
            });
          } finally {
            popup.close();
            window.removeEventListener('message', handleMessage);
          }
        } else if (event.data.type === 'HUBSPOT_OAUTH_ERROR') {
          console.error('❌ OAuth error:', event.data.error);
          toast({
            title: "Authentication Failed",
            description: event.data.error || "Authentication was cancelled or failed.",
            variant: "destructive",
          });
          popup.close();
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          console.log('🚪 OAuth popup was closed');
        }
      }, 1000);
    } catch (error) {
      console.error('❌ OAuth flow error:', error);
      toast({
        title: "Connection Failed",
        description: "An unexpected error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
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