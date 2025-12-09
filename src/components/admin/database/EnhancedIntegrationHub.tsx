import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, CreditCard, Phone, Mail, Building, Settings, CheckCircle, AlertCircle, Eye, EyeOff, Calendar, FileText, BarChart3, Users, Video, Zap, Bot, BookOpen, GraduationCap, Shield, Workflow, Share2, MessageCircle, DollarSign, Cloud, Brain, TestTube, RefreshCw, Database } from 'lucide-react';
import { StripeSyncDashboard } from '../stripe/StripeSyncDashboard';
import { useStripeSyncStatus } from '@/services/stripeDataService';
import { useIsMobile } from '@/hooks/use-mobile';
import { PageHeader } from '@/components/modern/PageHeader';
interface IntegrationField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'url' | 'select';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}
interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  category: string;
  fields: IntegrationField[];
  webhookUrl?: string;
  documentation?: string;
  isPopular?: boolean;
}
export const EnhancedIntegrationHub = () => {
  const isMobile = useIsMobile();
  const [showApiKeys, setShowApiKeys] = useState<{
    [key: string]: boolean;
  }>({});
  const [integrationStates, setIntegrationStates] = useState<{
    [key: string]: any;
  }>({});
  const toggleApiKeyVisibility = (integrationField: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [integrationField]: !prev[integrationField]
    }));
  };
  const integrations: Integration[] = [
  // Microsoft Ecosystem
  {
    id: 'sharepoint',
    name: 'SharePoint',
    description: 'Document management and collaboration platform',
    icon: Cloud,
    status: 'disconnected',
    category: 'microsoft',
    isPopular: true,
    fields: [{
      key: 'site_url',
      label: 'Site URL',
      type: 'url',
      required: true
    }, {
      key: 'client_id',
      label: 'Client ID',
      type: 'text',
      required: true
    }, {
      key: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      required: true
    }, {
      key: 'tenant_id',
      label: 'Tenant ID',
      type: 'text',
      required: true
    }]
  }, {
    id: 'powerbi',
    name: 'Power BI',
    description: 'Business analytics and reporting platform',
    icon: BarChart3,
    status: 'disconnected',
    category: 'microsoft',
    fields: [{
      key: 'workspace_id',
      label: 'Workspace ID',
      type: 'text',
      required: true
    }, {
      key: 'client_id',
      label: 'Client ID',
      type: 'text',
      required: true
    }, {
      key: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      required: true
    }, {
      key: 'tenant_id',
      label: 'Tenant ID',
      type: 'text',
      required: true
    }]
  }, {
    id: 'outlook',
    name: 'Outlook',
    description: 'Email and calendar integration',
    icon: Mail,
    status: 'connected',
    lastSync: '5 minutes ago',
    category: 'microsoft',
    isPopular: true,
    fields: [{
      key: 'client_id',
      label: 'Client ID',
      type: 'text',
      required: true
    }, {
      key: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      required: true
    }, {
      key: 'tenant_id',
      label: 'Tenant ID',
      type: 'text',
      required: true
    }]
  }, {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Team collaboration and communication',
    icon: Video,
    status: 'disconnected',
    category: 'microsoft',
    fields: [{
      key: 'tenant_id',
      label: 'Tenant ID',
      type: 'text',
      required: true
    }, {
      key: 'bot_id',
      label: 'Bot ID',
      type: 'text',
      required: true
    }, {
      key: 'bot_password',
      label: 'Bot Password',
      type: 'password',
      required: true
    }, {
      key: 'webhook_url',
      label: 'Webhook URL',
      type: 'url'
    }]
  }, {
    id: 'outlook-calendar',
    name: 'Outlook Calendar',
    description: 'Calendar scheduling and management',
    icon: Calendar,
    status: 'connected',
    lastSync: '10 minutes ago',
    category: 'microsoft',
    fields: [{
      key: 'client_id',
      label: 'Client ID',
      type: 'text',
      required: true
    }, {
      key: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      required: true
    }, {
      key: 'tenant_id',
      label: 'Tenant ID',
      type: 'text',
      required: true
    }]
  }, {
    id: 'azuread',
    name: 'Azure AD',
    description: 'Identity and access management',
    icon: Shield,
    status: 'connected',
    lastSync: '2 hours ago',
    category: 'microsoft',
    fields: [{
      key: 'directory_id',
      label: 'Directory ID',
      type: 'text',
      required: true
    }, {
      key: 'application_id',
      label: 'Application ID',
      type: 'text',
      required: true
    }, {
      key: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      required: true
    }]
  },
  // CRM & Business
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    description: 'Sync leads and contacts with HubSpot',
    icon: Building,
    status: 'connected',
    lastSync: '15 minutes ago',
    category: 'crm',
    isPopular: true,
    fields: [{
      key: 'api_key',
      label: 'API Key',
      type: 'password',
      required: true
    }, {
      key: 'portal_id',
      label: 'Portal ID',
      type: 'text',
      required: true
    }],
    documentation: 'https://developers.hubspot.com/docs/api/overview'
  }, {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Financial management and accounting',
    icon: DollarSign,
    status: 'disconnected',
    category: 'crm',
    fields: [{
      key: 'client_id',
      label: 'Client ID',
      type: 'text',
      required: true
    }, {
      key: 'client_secret',
      label: 'Client Secret',
      type: 'password',
      required: true
    }, {
      key: 'sandbox_mode',
      label: 'Sandbox Mode',
      type: 'select',
      options: ['true', 'false']
    }]
  }, {
    id: 'custom-sis',
    name: 'Custom SIS',
    description: 'Student Information System integration',
    icon: GraduationCap,
    status: 'disconnected',
    category: 'crm',
    fields: [{
      key: 'api_endpoint',
      label: 'API Endpoint',
      type: 'url',
      required: true
    }, {
      key: 'api_key',
      label: 'API Key',
      type: 'password',
      required: true
    }, {
      key: 'institution_id',
      label: 'Institution ID',
      type: 'text',
      required: true
    }]
  },
  // Communication & Scheduling
  {
    id: 'twilio',
    name: 'Twilio SMS',
    description: 'Send SMS notifications and alerts',
    icon: MessageSquare,
    status: 'disconnected',
    category: 'communication',
    fields: [{
      key: 'account_sid',
      label: 'Account SID',
      type: 'text',
      required: true
    }, {
      key: 'auth_token',
      label: 'Auth Token',
      type: 'password',
      required: true
    }, {
      key: 'phone_number',
      label: 'Phone Number',
      type: 'text',
      required: true
    }]
  }, {
    id: 'calendly',
    name: 'Calendly',
    description: 'Appointment scheduling and booking',
    icon: Calendar,
    status: 'disconnected',
    category: 'communication',
    fields: [{
      key: 'api_key',
      label: 'API Key',
      type: 'password',
      required: true
    }, {
      key: 'webhook_signing_key',
      label: 'Webhook Signing Key',
      type: 'password'
    }]
  },
  // Payments & Finance
  {
    id: 'stripe',
    name: 'Stripe Payments',
    description: 'Process online payments securely',
    icon: CreditCard,
    status: 'connected',
    lastSync: '1 hour ago',
    category: 'payments',
    isPopular: true,
    fields: [{
      key: 'publishable_key',
      label: 'Publishable Key',
      type: 'text',
      required: true
    }, {
      key: 'secret_key',
      label: 'Secret Key',
      type: 'password',
      required: true
    }, {
      key: 'webhook_secret',
      label: 'Webhook Secret',
      type: 'password'
    }]
  }, {
    id: 'flywire',
    name: 'Flywire',
    description: 'International payment platform for education',
    icon: DollarSign,
    status: 'disconnected',
    category: 'payments',
    fields: [{
      key: 'partner_id',
      label: 'Partner ID',
      type: 'text',
      required: true
    }, {
      key: 'secret_key',
      label: 'Secret Key',
      type: 'password',
      required: true
    }, {
      key: 'environment',
      label: 'Environment',
      type: 'select',
      options: ['sandbox', 'production']
    }]
  },
  // Learning Management
  {
    id: 'moodle',
    name: 'Moodle',
    description: 'Learning management system integration',
    icon: BookOpen,
    status: 'disconnected',
    category: 'learning',
    fields: [{
      key: 'base_url',
      label: 'Base URL',
      type: 'url',
      required: true
    }, {
      key: 'api_token',
      label: 'API Token',
      type: 'password',
      required: true
    }, {
      key: 'service_name',
      label: 'Service Name',
      type: 'text',
      required: true
    }]
  }, {
    id: 'canvas',
    name: 'Canvas',
    description: 'Canvas LMS integration',
    icon: BookOpen,
    status: 'disconnected',
    category: 'learning',
    fields: [{
      key: 'domain',
      label: 'Canvas Domain',
      type: 'text',
      required: true
    }, {
      key: 'access_token',
      label: 'Access Token',
      type: 'password',
      required: true
    }, {
      key: 'client_id',
      label: 'Client ID',
      type: 'text'
    }]
  },
  // AI & Automation
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'AI-powered content generation and analysis',
    icon: Brain,
    status: 'connected',
    lastSync: '5 minutes ago',
    category: 'ai',
    isPopular: true,
    fields: [{
      key: 'api_key',
      label: 'API Key',
      type: 'password',
      required: true
    }, {
      key: 'organization_id',
      label: 'Organization ID',
      type: 'text'
    }, {
      key: 'model_selection',
      label: 'Default Model',
      type: 'select',
      options: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']
    }]
  }, {
    id: 'make',
    name: 'Make.com',
    description: 'Visual automation platform',
    icon: Workflow,
    status: 'disconnected',
    category: 'ai',
    fields: [{
      key: 'api_key',
      label: 'API Key',
      type: 'password',
      required: true
    }, {
      key: 'scenario_webhooks',
      label: 'Scenario Webhooks',
      type: 'text'
    }]
  }, {
    id: 'wonderchat',
    name: 'Wonderchat',
    description: 'AI chatbot for customer support',
    icon: MessageCircle,
    status: 'disconnected',
    category: 'ai',
    fields: [{
      key: 'api_key',
      label: 'API Key',
      type: 'password',
      required: true
    }, {
      key: 'chat_widget_id',
      label: 'Chat Widget ID',
      type: 'text',
      required: true
    }]
  },
  // Document Management
  {
    id: 'docusign',
    name: 'DocuSign',
    description: 'Digital signature and document management',
    icon: FileText,
    status: 'disconnected',
    category: 'documents',
    fields: [{
      key: 'integration_key',
      label: 'Integration Key',
      type: 'text',
      required: true
    }, {
      key: 'user_id',
      label: 'User ID',
      type: 'text',
      required: true
    }, {
      key: 'account_id',
      label: 'Account ID',
      type: 'text',
      required: true
    }, {
      key: 'private_key',
      label: 'Private Key',
      type: 'password',
      required: true
    }, {
      key: 'environment',
      label: 'Environment',
      type: 'select',
      options: ['demo', 'production']
    }]
  }];
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Connected</span>
          </Badge>;
      case 'error':
        return <Badge variant="destructive" className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Error</span>
          </Badge>;
      default:
        return <Badge variant="secondary" className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Disconnected</span>
          </Badge>;
    }
  };
  const HubSpotCard = ({
    integration
  }: {
    integration: Integration;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const handleInstallApp = () => {
      const hubspotAuthUrl = `https://app.hubspot.com/oauth/authorize?client_id=your-client-id&redirect_uri=${encodeURIComponent(window.location.origin + '/admin/integrations/hubspot/callback')}&scope=contacts%20content%20reports&response_type=code`;
      window.open(hubspotAuthUrl, 'hubspot-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes');
    };
    return <Card key={integration.id} className="group relative border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
        {integration.isPopular && <Badge className="absolute -top-2 -right-2 z-10 shadow-md" variant="default">
            Popular
          </Badge>}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <integration.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold">{integration.name}</CardTitle>
                </div>
                <CardDescription className="text-sm mt-0.5">{integration.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(integration.status)}
              <Switch checked={integration.status === 'connected'} onCheckedChange={() => setIsExpanded(!isExpanded)} />
            </div>
          </div>
        </CardHeader>
        
        {(isExpanded || integration.status === 'connected') && <CardContent className="space-y-5 pt-0 border-t border-border/50">
            {integration.status === 'connected' && integration.lastSync && <Alert className="bg-green-500/5 border-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  Last synchronized: {integration.lastSync}
                </AlertDescription>
              </Alert>}
            
            {/* HubSpot-specific connection options */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all">
                  <div>
                    <h4 className="font-semibold text-foreground">Install as Private App</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Recommended: OAuth connection with automatic setup</p>
                  </div>
                  <Button onClick={handleInstallApp} className="flex items-center gap-2 shadow-sm">
                    <Settings className="w-4 h-4" />
                    Install App
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                
                <div className="p-4 border border-border/50 rounded-xl space-y-4 bg-muted/20">
                  <h4 className="font-semibold text-foreground">Manual API Key Setup</h4>
                  <div className="grid gap-4">
                    {integration.fields.map(field => <div key={field.key} className="space-y-2">
                        <Label htmlFor={`${integration.id}-${field.key}`} className="text-sm font-medium">
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <div className="flex space-x-2">
                          <Input id={`${integration.id}-${field.key}`} type={field.type === 'password' && !showApiKeys[`${integration.id}-${field.key}`] ? 'password' : 'text'} placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} className="flex-1 bg-background" />
                          {field.type === 'password' && <Button type="button" variant="outline" size="icon" onClick={() => toggleApiKeyVisibility(`${integration.id}-${field.key}`)}>
                              {showApiKeys[`${integration.id}-${field.key}`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>}
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button className="flex-1 shadow-sm">
                {integration.status === 'connected' ? 'Update Configuration' : 'Connect Integration'}
              </Button>
              <Button variant="outline">Test Connection</Button>
              {integration.status === 'connected' && <Button variant="destructive">Disconnect</Button>}
            </div>
          </CardContent>}
      </Card>;
  };
  const StripeCard = ({
    integration
  }: {
    integration: Integration;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const {
      data: syncStatus
    } = useStripeSyncStatus();
    const getSyncStatusBadge = () => {
      if (!syncStatus) return null;
      switch (syncStatus.status) {
        case 'in_progress':
          return <Badge variant="secondary" className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Syncing...
            </Badge>;
        case 'completed':
          return <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Synced
            </Badge>;
        case 'failed':
          return <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Failed
            </Badge>;
        default:
          return null;
      }
    };
    return <>
        <Card key={integration.id} className="group relative border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
          {integration.isPopular && <Badge className="absolute -top-2 -right-2 z-10 shadow-md" variant="default">
              Popular
            </Badge>}
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <integration.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-semibold">{integration.name}</CardTitle>
                    {getSyncStatusBadge()}
                  </div>
                  <CardDescription className="text-sm mt-0.5">{integration.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(integration.status)}
                <Switch checked={integration.status === 'connected'} onCheckedChange={() => setIsExpanded(!isExpanded)} />
              </div>
            </div>
          </CardHeader>
          
          {(isExpanded || integration.status === 'connected') && <CardContent className="space-y-5 pt-0 border-t border-border/50">
              {integration.status === 'connected' && syncStatus && <Alert className="bg-blue-500/5 border-blue-500/20">
                  <Database className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <div className="flex items-center justify-between text-sm">
                      <span>Auto-sync enabled (every 5 minutes)</span>
                      <Button variant="link" size="sm" onClick={() => setShowDashboard(true)} className="h-auto p-0 text-blue-600 hover:text-blue-700">
                        View Sync Dashboard →
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>}
              
              <div className="grid gap-4">
                {integration.fields.map(field => <div key={field.key} className="space-y-2">
                    <Label htmlFor={`${integration.id}-${field.key}`} className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <div className="flex space-x-2">
                      <Input id={`${integration.id}-${field.key}`} type={field.type === 'password' && !showApiKeys[`${integration.id}-${field.key}`] ? 'password' : 'text'} placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} className="flex-1 bg-background" />
                      {field.type === 'password' && <Button type="button" variant="outline" size="icon" onClick={() => toggleApiKeyVisibility(`${integration.id}-${field.key}`)}>
                          {showApiKeys[`${integration.id}-${field.key}`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>}
                    </div>
                  </div>)}
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button className="flex-1 shadow-sm">
                  {integration.status === 'connected' ? 'Update Configuration' : 'Connect Integration'}
                </Button>
                <Button variant="outline">Test Connection</Button>
                {integration.status === 'connected' && <Button variant="destructive">Disconnect</Button>}
              </div>
            </CardContent>}
        </Card>

        <Dialog open={showDashboard} onOpenChange={setShowDashboard}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Stripe Data Sync Dashboard</DialogTitle>
              <DialogDescription>
                Manage Stripe data synchronization, view sync history, and monitor linked customers.
              </DialogDescription>
            </DialogHeader>
            <StripeSyncDashboard />
          </DialogContent>
        </Dialog>
      </>;
  };
  const IntegrationCard = ({
    integration
  }: {
    integration: Integration;
  }) => {
    // Use special card for special integrations
    if (integration.id === 'hubspot') {
      return <HubSpotCard integration={integration} />;
    }
    if (integration.id === 'stripe') {
      return <StripeCard integration={integration} />;
    }
    const [isExpanded, setIsExpanded] = useState(false);
    return <Card key={integration.id} className="group relative border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
        {integration.isPopular && <Badge className="absolute -top-2 -right-2 z-10 shadow-md" variant="default">
            Popular
          </Badge>}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <integration.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold">{integration.name}</CardTitle>
                </div>
                <CardDescription className="text-sm mt-0.5">{integration.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(integration.status)}
              <Switch checked={integration.status === 'connected'} onCheckedChange={() => setIsExpanded(!isExpanded)} />
            </div>
          </div>
        </CardHeader>
        
        {(isExpanded || integration.status === 'connected') && <CardContent className="space-y-5 pt-0 border-t border-border/50">
            {integration.status === 'connected' && integration.lastSync && <Alert className="bg-green-500/5 border-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm">
                  Last synchronized: {integration.lastSync}
                </AlertDescription>
              </Alert>}
            
            <div className="grid gap-4">
              {integration.fields.map(field => <div key={field.key} className="space-y-2">
                  <Label htmlFor={`${integration.id}-${field.key}`} className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <div className="flex space-x-2">
                    {field.type === 'select' ? <Select>
                        <SelectTrigger className="flex-1 bg-background">
                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map(option => <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>)}
                        </SelectContent>
                      </Select> : <Input id={`${integration.id}-${field.key}`} type={field.type === 'password' && !showApiKeys[`${integration.id}-${field.key}`] ? 'password' : 'text'} placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} className="flex-1 bg-background" />}
                    {field.type === 'password' && <Button type="button" variant="outline" size="icon" onClick={() => toggleApiKeyVisibility(`${integration.id}-${field.key}`)}>
                        {showApiKeys[`${integration.id}-${field.key}`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>}
                  </div>
                </div>)}
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button className="flex-1 shadow-sm">
                {integration.status === 'connected' ? 'Update Configuration' : 'Connect Integration'}
              </Button>
              <Button variant="outline">Test Connection</Button>
              {integration.status === 'connected' && <Button variant="destructive">Disconnect</Button>}
            </div>
          </CardContent>}
      </Card>;
  };

  // Group integrations by category
  const microsoftIntegrations = integrations.filter(i => i.category === 'microsoft');
  const crmIntegrations = integrations.filter(i => i.category === 'crm');
  const communicationIntegrations = integrations.filter(i => i.category === 'communication');
  const paymentIntegrations = integrations.filter(i => i.category === 'payments');
  const learningIntegrations = integrations.filter(i => i.category === 'learning');
  const aiIntegrations = integrations.filter(i => i.category === 'ai');
  const documentIntegrations = integrations.filter(i => i.category === 'documents');
  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalCount = integrations.length;

  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-[100px] py-4 sm:py-6 md:py-[50px] space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <PageHeader 
              title="External Integrations" 
              subtitle="Connect your favorite tools and services"
              className="text-left"
            />
            <div className="flex items-center gap-4">
              <div className="bg-card border border-border rounded-lg px-4 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">{connectedCount}/{totalCount} Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{connectedCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold text-foreground mt-1">7</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Sync</p>
                  <p className="text-2xl font-bold text-foreground mt-1">5m</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="microsoft" className="space-y-6">
          <TabsList className="inline-flex h-12 items-center justify-start rounded-lg bg-muted/50 p-1 text-muted-foreground w-full overflow-x-auto">
            <TabsTrigger value="microsoft" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <Cloud className="h-4 w-4 mr-2" />
              Microsoft
            </TabsTrigger>
            <TabsTrigger value="crm" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <Building className="h-4 w-4 mr-2" />
              CRM
            </TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Learning
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <Brain className="h-4 w-4 mr-2" />
              AI
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

        <TabsContent value="microsoft" className="space-y-4">
          {microsoftIntegrations.map(integration => <IntegrationCard key={integration.id} integration={integration} />)}
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          {crmIntegrations.map(integration => <IntegrationCard key={integration.id} integration={integration} />)}
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          {communicationIntegrations.map(integration => <IntegrationCard key={integration.id} integration={integration} />)}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {paymentIntegrations.map(integration => <IntegrationCard key={integration.id} integration={integration} />)}
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          {learningIntegrations.map(integration => <IntegrationCard key={integration.id} integration={integration} />)}
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          {aiIntegrations.map(integration => <IntegrationCard key={integration.id} integration={integration} />)}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {documentIntegrations.map(integration => <IntegrationCard key={integration.id} integration={integration} />)}
        </TabsContent>
      </Tabs>
      </div>
    </div>;
};