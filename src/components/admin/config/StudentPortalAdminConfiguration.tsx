import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Menu, Shield, MessageSquare, FolderOpen } from "lucide-react";
import { BrandingCustomization } from './portal/BrandingCustomization';
import { NavigationBuilder } from './portal/NavigationBuilder';
import { RoleManagement } from './portal/RoleManagement';
import { CommunicationTemplates } from './portal/CommunicationTemplates';
import { ContentManagement } from './portal/ContentManagement';

export const StudentPortalAdminConfiguration = () => {
  const [activeTab, setActiveTab] = useState('branding');

  const tabs = [
    {
      id: 'branding',
      label: 'Branding',
      icon: Palette,
      component: <BrandingCustomization />
    },
    {
      id: 'navigation',
      label: 'Navigation',
      icon: Menu,
      component: <NavigationBuilder />
    },
    {
      id: 'roles',
      label: 'Roles & Access',
      icon: Shield,
      component: <RoleManagement />
    },
    {
      id: 'templates',
      label: 'Communication',
      icon: MessageSquare,
      component: <CommunicationTemplates />
    },
    {
      id: 'content',
      label: 'Content & Media',
      icon: FolderOpen,
      component: <ContentManagement />
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Student Portal Administration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure all aspects of your student portal including branding, navigation, access control, and communication templates.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                {tab.component}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
