import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyHeader } from '@/components/admin/sales-rep/DailyHeader';
import { NewlyAssignedLeads } from '@/components/admin/sales-rep/NewlyAssignedLeads';
import { UnreadCommunications } from '@/components/admin/sales-rep/UnreadCommunications';
import { TodaysCallList } from '@/components/admin/sales-rep/TodaysCallList';
import { ReenquiryStudents } from '@/components/admin/sales-rep/ReenquiryStudents';
import { TodaysTasks } from '@/components/admin/sales-rep/TodaysTasks';
import { MyDayCalendar } from '@/components/admin/sales-rep/MyDayCalendar';
import { HotLeadsToday } from '@/components/admin/sales-rep/HotLeadsToday';
import { PerformanceTracker } from '@/components/admin/sales-rep/PerformanceTracker';
import { AIActionCenter } from '@/components/admin/sales-rep/AIActionCenter';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function SalesRepDashboard() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <DailyHeader />
      
      <div className={cn("px-4 lg:px-6 xl:px-8", isMobile ? "py-4" : "py-6")}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={cn("grid w-full mb-6", isMobile ? "grid-cols-2" : "grid-cols-4")}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calendar">My Day</TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="ai-actions">AI Actions</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3")}>
              <div className="space-y-6">
                <NewlyAssignedLeads />
                <TodaysTasks />
              </div>
              
              <div className="space-y-6">
                <UnreadCommunications />
                <TodaysCallList />
              </div>
              
              <div className="space-y-6">
                <HotLeadsToday />
                <ReenquiryStudents />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <MyDayCalendar />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceTracker />
          </TabsContent>

          <TabsContent value="ai-actions" className="space-y-6">
            <AIActionCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}