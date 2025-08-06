import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomFieldsManagement } from './database/CustomFieldsManagement';
import { MasterDataManagement } from './database/MasterDataManagement';
import { IntegrationHub } from './database/IntegrationHub';
import { SystemTemplates } from './database/SystemTemplates';
import { AdvancedSettings } from './database/AdvancedSettings';
import AIAgentsHub from './database/AIAgentsHub';
import BehaviorAnalytics from './database/BehaviorAnalytics';
import { LeadRoutingRules } from './LeadRoutingRules';
import { LeadScoringEngine } from './LeadScoringEngine';
import { CompanySettings } from './CompanySettings';
import SystemConfiguration from './SystemConfiguration';
import { Settings, Database, Link, FileText, Cog, Bot, Brain, Route, Target, Building, Server } from 'lucide-react';

export const ConfigurationManagement = () => {
  const [activeTab, setActiveTab] = useState('custom-fields');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuration</h1>
          <p className="text-muted-foreground">Master control center for all system configurations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="custom-fields" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Custom Fields</span>
          </TabsTrigger>
          <TabsTrigger value="master-data" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Master Data</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Link className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="ai-agents" className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI Agents</span>
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Behavior AI</span>
          </TabsTrigger>
          <TabsTrigger value="routing" className="flex items-center space-x-2">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Routing Rules</span>
          </TabsTrigger>
          <TabsTrigger value="scoring" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Scoring Engine</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="custom-fields">
          <CustomFieldsManagement />
        </TabsContent>

        <TabsContent value="master-data">
          <MasterDataManagement />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationHub />
        </TabsContent>

        <TabsContent value="templates">
          <SystemTemplates />
        </TabsContent>

        <TabsContent value="ai-agents">
          <AIAgentsHub />
        </TabsContent>

        <TabsContent value="behavior">
          <BehaviorAnalytics />
        </TabsContent>

        <TabsContent value="routing">
          <LeadRoutingRules />
        </TabsContent>

        <TabsContent value="scoring">
          <LeadScoringEngine />
        </TabsContent>

        <TabsContent value="company">
          <CompanySettings />
        </TabsContent>

        <TabsContent value="system">
          <SystemConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  );
};