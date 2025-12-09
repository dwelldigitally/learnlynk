import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Workflow } from 'lucide-react';
import { SystemRoleManagement } from '@/components/admin/team/SystemRoleManagement';
import { PermissionMatrix } from '@/components/admin/team/PermissionMatrix';
import { UserDirectory } from '@/components/admin/team/UserDirectory';
import { PageHeader } from '@/components/modern/PageHeader';

interface TeamManagementProps {
  onTeamCreated?: () => void;
}

export function TeamManagement({ onTeamCreated }: TeamManagementProps) {
  const [activeTab, setActiveTab] = useState('directory');

  return (
    <div className="px-4 sm:px-6 md:px-[100px] py-4 sm:py-6 md:py-[50px] space-y-8">
      <PageHeader title="Team Management" subtitle="Comprehensive team organization, roles, and permissions" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="directory" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-4 w-4" />
            User Directory
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="h-4 w-4" />
            Role Management
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Workflow className="h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          <UserDirectory />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <SystemRoleManagement />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <PermissionMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
}
