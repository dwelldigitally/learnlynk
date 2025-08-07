import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Database, Workflow, Users, Filter } from "lucide-react";
import { CustomFieldsManagement } from "./database/CustomFieldsManagement";
import StageManagement from "./workflow/StageManagement";
import { TeamManagement } from "./routing/TeamManagement";

export const ConfigurationManagement = () => {
  const [activeTab, setActiveTab] = useState('stages');

  const configurationSections = [
    {
      id: 'stages',
      label: 'Stage Configuration',
      icon: Workflow,
      description: 'Configure stages and substages for leads, applicants, and students',
      component: <StageManagement />
    },
    {
      id: 'fields',
      label: 'Custom Fields',
      icon: Database,
      description: 'Manage custom fields for each stage',
      component: <CustomFieldsManagement />
    },
    {
      id: 'teams',
      label: 'Team Management',
      icon: Users,
      description: 'Configure teams and assignments',
      component: <TeamManagement />
    },
    {
      id: 'workflows',
      label: 'Workflow Rules',
      icon: Settings,
      description: 'Set up automated stage transitions and rules',
      component: <div className="p-6 text-center text-muted-foreground">Workflow rules coming soon...</div>
    },
    {
      id: 'filters',
      label: 'Filter Configuration',
      icon: Filter,
      description: 'Configure custom filters for each stage',
      component: <div className="p-6 text-center text-muted-foreground">Filter configuration coming soon...</div>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuration Management</h2>
        <p className="text-muted-foreground">
          Configure stages, fields, teams, and workflows for your CRM
        </p>
      </div>

      {/* Configuration Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configurationSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card 
              key={section.id} 
              className={`cursor-pointer transition-colors ${
                activeTab === section.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
              }`}
              onClick={() => setActiveTab(section.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="w-5 h-5" />
                  {section.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {configurationSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                className="flex items-center gap-2"
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {configurationSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="w-5 h-5" />
                  {section.label}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </CardHeader>
              <CardContent>
                {section.component}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};