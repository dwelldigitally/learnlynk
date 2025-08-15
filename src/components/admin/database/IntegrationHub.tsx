import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  CreditCard, 
  Phone, 
  Mail, 
  Building, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { HubSpotOwnerManagement } from "@/components/admin/integrations/HubSpotOwnerManagement";
import { HubSpotIntegrationStatus } from "@/components/admin/integrations/HubSpotIntegrationStatus";
import { HubSpotOAuthHandler } from "@/components/admin/integrations/HubSpotOAuthHandler";
import { HubSpotConnectionTest } from "@/components/admin/integrations/HubSpotConnectionTest";

export const IntegrationHub = () => {
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({});

  const toggleApiKeyVisibility = (integration: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [integration]: !prev[integration]
    }));
  };

  const integrations = [
    {
      id: 'microsoft',
      name: 'Microsoft Office 365',
      description: 'Connect with Teams, Outlook, and Office apps',
      icon: Building,
      status: 'connected',
      lastSync: '2 hours ago',
      fields: [
        { key: 'tenant_id', label: 'Tenant ID', type: 'text' },
        { key: 'client_id', label: 'Client ID', type: 'text' },
        { key: 'client_secret', label: 'Client Secret', type: 'password' }
      ]
    },
    {
      id: 'hubspot',
      name: 'HubSpot CRM',
      description: 'Sync leads and contacts with HubSpot',
      icon: Building,
      status: 'connected',
      lastSync: '15 minutes ago',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password' },
        { key: 'portal_id', label: 'Portal ID', type: 'text' }
      ]
    },
    {
      id: 'twilio',
      name: 'Twilio SMS',
      description: 'Send SMS notifications and alerts',
      icon: MessageSquare,
      status: 'disconnected',
      lastSync: 'Never',
      fields: [
        { key: 'account_sid', label: 'Account SID', type: 'text' },
        { key: 'auth_token', label: 'Auth Token', type: 'password' },
        { key: 'phone_number', label: 'Phone Number', type: 'text' }
      ]
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      description: 'Process online payments securely',
      icon: CreditCard,
      status: 'connected',
      lastSync: '1 hour ago',
      fields: [
        { key: 'publishable_key', label: 'Publishable Key', type: 'text' },
        { key: 'secret_key', label: 'Secret Key', type: 'password' },
        { key: 'webhook_secret', label: 'Webhook Secret', type: 'password' }
      ]
    },
    {
      id: 'sendgrid',
      name: 'SendGrid Email',
      description: 'Email delivery and marketing campaigns',
      icon: Mail,
      status: 'disconnected',
      lastSync: 'Never',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password' },
        { key: 'sender_email', label: 'Sender Email', type: 'email' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'connected') {
      return (
        <Badge variant="default" className="flex items-center space-x-1">
          <CheckCircle className="h-3 w-3" />
          <span>Connected</span>
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="flex items-center space-x-1">
        <AlertCircle className="h-3 w-3" />
        <span>Disconnected</span>
      </Badge>
    );
  };

  const IntegrationCard = ({ integration }: { integration: any }) => (
    <Card key={integration.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <integration.icon className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <CardDescription>{integration.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(integration.status)}
            <Switch checked={integration.status === 'connected'} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {integration.status === 'connected' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Last synchronized: {integration.lastSync}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4">
          {integration.fields.map((field: any) => (
            <div key={field.key}>
              <Label htmlFor={`${integration.id}-${field.key}`}>{field.label}</Label>
              <div className="flex space-x-2">
                <Input
                  id={`${integration.id}-${field.key}`}
                  type={field.type === 'password' && !showApiKeys[`${integration.id}-${field.key}`] ? 'password' : 'text'}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="flex-1"
                />
                {field.type === 'password' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleApiKeyVisibility(`${integration.id}-${field.key}`)}
                  >
                    {showApiKeys[`${integration.id}-${field.key}`] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2 pt-4">
          <Button className="flex-1">
            {integration.status === 'connected' ? 'Update' : 'Connect'}
          </Button>
          <Button variant="outline">Test Connection</Button>
          {integration.status === 'connected' && (
            <Button variant="destructive">Disconnect</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const crmIntegrations = integrations.filter(i => ['microsoft', 'hubspot'].includes(i.id));
  const communicationIntegrations = integrations.filter(i => ['twilio', 'sendgrid'].includes(i.id));
  const paymentIntegrations = integrations.filter(i => ['stripe'].includes(i.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">External Integrations</h3>
          <p className="text-sm text-muted-foreground">
            Connect your external services and manage API configurations
          </p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Global Settings</span>
        </Button>
      </div>

      <Tabs defaultValue="crm" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crm">CRM & Business</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="crm" className="space-y-4">
          <HubSpotConnectionTest />
          <HubSpotIntegrationStatus />
          <HubSpotOAuthHandler onConnectionSuccess={() => window.location.reload()} />
          <HubSpotOwnerManagement />
          {crmIntegrations.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          {communicationIntegrations.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {paymentIntegrations.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};