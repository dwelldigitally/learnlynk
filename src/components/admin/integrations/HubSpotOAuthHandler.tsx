import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Shield, Zap, CheckCircle, ArrowRight, Copy } from 'lucide-react';
import hubspotService from '@/services/hubspotService';
import { useToast } from '@/hooks/use-toast';

interface HubSpotOAuthHandlerProps {
  onConnectionSuccess?: () => void;
}

export const HubSpotOAuthHandler: React.FC<HubSpotOAuthHandlerProps> = ({ onConnectionSuccess }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();

  // HubSpot OAuth configuration
  const HUBSPOT_OAUTH_URL = `https://app.hubspot.com/oauth/authorize`;
  const CLIENT_ID = 'your-hubspot-client-id'; // This should be configured
  const REDIRECT_URI = `${window.location.origin}/admin/integrations/hubspot/callback`;
  const SCOPES = [
    'contacts',
    'content',
    'reports',
    'social',
    'automation',
    'timeline',
    'business-intelligence',
    'forms',
    'files',
    'hubdb',
    'integration-sync',
    'tickets',
    'e-commerce',
    'accounting',
    'sales-email-read',
    'crm.objects.contacts.read',
    'crm.objects.contacts.write',
    'crm.objects.companies.read',
    'crm.objects.companies.write',
    'crm.objects.deals.read',
    'crm.objects.deals.write',
    'crm.objects.owners.read'
  ].join(' ');

  const handleOAuthInstall = () => {
    setIsConnecting(true);
    const authUrl = `${HUBSPOT_OAUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&response_type=code`;
    
    // Open HubSpot OAuth in new window
    const popup = window.open(authUrl, 'hubspot-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes');
    
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