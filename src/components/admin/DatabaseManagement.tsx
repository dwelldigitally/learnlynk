import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomFieldsManagement } from './database/CustomFieldsManagement';
import { MasterDataManagement } from './database/MasterDataManagement';
import { IntegrationHub } from './database/IntegrationHub';
import { SystemTemplates } from './database/SystemTemplates';
import { AdvancedSettings } from './database/AdvancedSettings';
import AIAgentsHub from './database/AIAgentsHub';
import BehaviorAnalytics from './database/BehaviorAnalytics';
import { Database, Settings, Link, FileText, Cog, Bot, Brain } from 'lucide-react';

export const DatabaseManagement = () => {
  const [activeTab, setActiveTab] = useState('custom-fields');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Database Management</h1>
          <p className="text-muted-foreground">Master control center for all system configurations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="custom-fields" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Custom Fields</span>
          </TabsTrigger>
          <TabsTrigger value="master-data" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Master Data</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Link className="h-4 w-4" />
            <span>Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="ai-agents" className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span>AI Agents</span>
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Behavior AI</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Cog className="h-4 w-4" />
            <span>Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="custom-fields">
          <Card>
            <CardHeader>
              <CardTitle>Custom Fields Management</CardTitle>
              <CardDescription>
                Configure custom fields for program wizard, payment forms, and lead capture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomFieldsManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="master-data">
          <Card>
            <CardHeader>
              <CardTitle>Master Data Management</CardTitle>
              <CardDescription>
                Manage campus locations, payment types, and program requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MasterDataManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Hub</CardTitle>
              <CardDescription>
                Configure external service integrations and API connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntegrationHub />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>System Templates</CardTitle>
              <CardDescription>
                Manage form templates, email templates, and document templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SystemTemplates />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-agents">
          <Card>
            <CardHeader>
              <CardTitle>AI Agents Hub</CardTitle>
              <CardDescription>
                Configure and manage autonomous AI agents for automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIAgentsHub />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle>Behavior Analytics</CardTitle>
              <CardDescription>
                AI-powered insights into student and lead behavior patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BehaviorAnalytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                System-wide configurations, data mappings, and audit settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};