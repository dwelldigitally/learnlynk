import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Calendar, 
  CreditCard, 
  Phone, 
  MessageSquare, 
  Building2,
  ExternalLink,
  CheckCircle2,
  Plus,
  Settings,
  Users,
  Globe,
  Database,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'communication' | 'payments' | 'marketing' | 'analytics' | 'productivity';
  isConnected: boolean;
  isRequired?: boolean;
  setupUrl?: string;
  hasCustomSetup?: boolean;
}

interface IntegrationsSetupScreenProps {
  data?: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Connect your Outlook email and calendar for seamless communication',
    icon: Mail,
    category: 'communication',
    isConnected: false,
    isRequired: true,
    hasCustomSetup: true
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync events and appointments with Google Calendar',
    icon: Calendar,
    category: 'communication',
    isConnected: false,
    hasCustomSetup: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept payments and manage subscriptions',
    icon: CreditCard,
    category: 'payments',
    isConnected: false,
    isRequired: true,
    hasCustomSetup: true
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM integration for lead management and sales tracking',
    icon: Building2,
    category: 'marketing',
    isConnected: false,
    hasCustomSetup: true
  },
  {
    id: 'aircall',
    name: 'Aircall',
    description: 'Cloud-based phone system for sales and support',
    icon: Phone,
    category: 'communication',
    isConnected: false,
    hasCustomSetup: true
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS messaging and voice communications',
    icon: MessageSquare,
    category: 'communication',
    isConnected: false,
    hasCustomSetup: true
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automate workflows between different applications',
    icon: Settings,
    category: 'productivity',
    isConnected: false,
    hasCustomSetup: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Enterprise CRM and sales management platform',
    icon: Users,
    category: 'marketing',
    isConnected: false,
    hasCustomSetup: true
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track website performance and user behavior',
    icon: BarChart3,
    category: 'analytics',
    isConnected: false,
    hasCustomSetup: true
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing and automation platform',
    icon: Mail,
    category: 'marketing',
    isConnected: false,
    hasCustomSetup: true
  }
];

const IntegrationsSetupScreen: React.FC<IntegrationsSetupScreenProps> = ({
  data,
  onComplete,
  onNext,
  onSkip
}) => {
  const [integrations, setIntegrations] = useState<Integration[]>(
    data?.integrations || AVAILABLE_INTEGRATIONS
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Integrations', count: integrations.length },
    { id: 'communication', name: 'Communication', count: integrations.filter(i => i.category === 'communication').length },
    { id: 'payments', name: 'Payments', count: integrations.filter(i => i.category === 'payments').length },
    { id: 'marketing', name: 'Marketing & CRM', count: integrations.filter(i => i.category === 'marketing').length },
    { id: 'analytics', name: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length },
    { id: 'productivity', name: 'Productivity', count: integrations.filter(i => i.category === 'productivity').length }
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory);

  const connectedCount = integrations.filter(i => i.isConnected).length;
  const requiredConnected = integrations.filter(i => i.isRequired && i.isConnected).length;
  const requiredTotal = integrations.filter(i => i.isRequired).length;

  const handleConnect = (integrationId: string) => {
    const updatedIntegrations = integrations.map(integration =>
      integration.id === integrationId
        ? { ...integration, isConnected: !integration.isConnected }
        : integration
    );
    setIntegrations(updatedIntegrations);

    const integration = integrations.find(i => i.id === integrationId);
    if (integration && !integration.isConnected) {
      toast.success(`${integration.name} connected successfully!`);
    }
  };

  const handleComplete = () => {
    const integrationsData = {
      integrations,
      connectedCount,
      requiredConnected,
      completedAt: new Date().toISOString()
    };
    
    onComplete(integrationsData);
    onNext();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication': return Mail;
      case 'payments': return CreditCard;
      case 'marketing': return Users;
      case 'analytics': return BarChart3;
      case 'productivity': return Settings;
      default: return Globe;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'payments': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'marketing': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'analytics': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'productivity': return 'bg-cyan-500/10 text-cyan-600 border-cyan-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{connectedCount}</p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{integrations.length}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{requiredConnected}/{requiredTotal}</p>
                <p className="text-sm text-muted-foreground">Required Setup</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.id);
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      <Separator />

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(integration.category)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <span>{integration.name}</span>
                        {integration.isRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {integration.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {integration.isConnected && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    <Switch
                      checked={integration.isConnected}
                      onCheckedChange={() => handleConnect(integration.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              
              {integration.isConnected && (
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                    </div>
                    
                    {integration.hasCustomSetup && (
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
              
              {!integration.isConnected && integration.hasCustomSetup && (
                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleConnect(integration.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect {integration.name}
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Setup Instructions */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center space-x-2">
            <ExternalLink className="h-5 w-5" />
            <span>Integration Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-amber-700">
            <p className="mb-4">
              You can connect these integrations now or set them up later from the admin dashboard. 
              Required integrations help ensure your institution runs smoothly from day one.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Quick Setup Tips:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Outlook:</strong> Connect for email and calendar synchronization</li>
                <li><strong>Stripe:</strong> Essential for processing student payments</li>
                <li><strong>HubSpot:</strong> Recommended for lead management</li>
                <li><strong>Twilio:</strong> Enable SMS notifications to students</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <div className="text-sm text-muted-foreground">
          {connectedCount > 0 ? (
            <span className="text-green-600 font-medium">
              ✓ {connectedCount} integration{connectedCount !== 1 ? 's' : ''} connected
            </span>
          ) : (
            <span>No integrations connected yet</span>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onSkip}>
            Skip for Now
          </Button>
          <Button onClick={handleComplete}>
            {connectedCount > 0 ? 'Continue with Integrations' : 'Continue Without Integrations'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSetupScreen;