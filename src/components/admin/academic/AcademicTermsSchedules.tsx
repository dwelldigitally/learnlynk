import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AcademicTermsTab } from './AcademicTermsTab';
import { ScheduleTemplatesTab } from './ScheduleTemplatesTab';
import { IntakePipelineManagement } from '../intake/IntakePipelineManagement';
import { CalendarViewTab } from './CalendarViewTab';
import { PageHeader } from '@/components/modern/PageHeader';
import { useMvpMode } from '@/contexts/MvpModeContext';
import { useIsMobile } from '@/hooks/use-mobile';

export function AcademicTermsSchedules() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('terms');
  const { isMvpMode } = useMvpMode();

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl">
      <PageHeader
        title="Academic Terms & Schedules"
        subtitle={isMvpMode ? "Manage academic terms and intake scheduling" : "Manage academic terms, schedule templates, and intake scheduling"}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={isMobile ? "flex flex-col h-auto w-full gap-1" : `grid w-full ${isMvpMode ? 'grid-cols-3' : 'grid-cols-4'} bg-muted/50 p-1`}>
          <TabsTrigger value="terms" className={isMobile ? "w-full justify-start" : ""}>Academic Terms</TabsTrigger>
          {!isMvpMode && <TabsTrigger value="schedules" className={isMobile ? "w-full justify-start" : ""}>Schedule Templates</TabsTrigger>}
          <TabsTrigger value="intake-scheduling" className={isMobile ? "w-full justify-start" : ""}>Intake Scheduling</TabsTrigger>
          <TabsTrigger value="calendar" className={isMobile ? "w-full justify-start" : ""}>Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-6">
          <AcademicTermsTab />
        </TabsContent>

        {!isMvpMode && (
          <TabsContent value="schedules" className="space-y-6">
            <ScheduleTemplatesTab />
          </TabsContent>
        )}

        <TabsContent value="intake-scheduling" className="space-y-6">
          <IntakePipelineManagement />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <CalendarViewTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}