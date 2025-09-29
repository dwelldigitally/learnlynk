import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Users, Building, Calendar } from 'lucide-react';
import { BatchManagement } from './BatchManagement';
import { SmartAssignmentWizard } from './SmartAssignmentWizard';
import { SiteCapacityOverview } from './SiteCapacityOverview';
import { SchedulingAnalytics } from './SchedulingAnalytics';
import { useUnassignedStudents, useSiteCapacity, useStudentBatches } from '@/hooks/useScheduling';

export function SchedulingDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: unassignedStudents = [] } = useUnassignedStudents(user?.id || '');
  const { data: siteCapacity = [] } = useSiteCapacity(user?.id || '');
  const { data: batches = [] } = useStudentBatches(user?.id || '');

  const totalCapacity = siteCapacity.reduce((sum, site) => sum + site.max_capacity, 0);
  const availableCapacity = siteCapacity.reduce((sum, site) => sum + site.available_spots, 0);
  const utilizationRate = totalCapacity > 0 ? ((totalCapacity - availableCapacity) / totalCapacity) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Need site assignment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Capacity</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableCapacity}</div>
            <p className="text-xs text-muted-foreground">
              Open spots across all sites
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Utilization</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall capacity usage
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.filter(b => b.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="batches">Batch Management</TabsTrigger>
          <TabsTrigger value="assignment">Smart Assignment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <SiteCapacityOverview />
        </TabsContent>
        
        <TabsContent value="batches" className="space-y-4">
          <BatchManagement />
        </TabsContent>
        
        <TabsContent value="assignment" className="space-y-4">
          <SmartAssignmentWizard />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <SchedulingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}