
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeadsDashboard } from '@/components/admin/LeadsDashboard';
import { CommunicationManagement } from '@/components/admin/CommunicationManagement';
import { FormManagement } from '@/components/admin/FormManagement';
import { StudentPortalsDashboard } from '@/components/admin/StudentPortalsDashboard';

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your institution's operations</p>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="portals">Student Portals</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          <LeadsDashboard />
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <CommunicationManagement />
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <FormManagement />
        </TabsContent>

        <TabsContent value="portals" className="space-y-4">
          <StudentPortalsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
