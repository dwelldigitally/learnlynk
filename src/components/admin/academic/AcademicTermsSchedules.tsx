import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AcademicTermsTab } from './AcademicTermsTab';
import { ScheduleTemplatesTab } from './ScheduleTemplatesTab';
import { ProgramSchedulingTab } from './ProgramSchedulingTab';
import { CalendarViewTab } from './CalendarViewTab';
import { PageHeader } from '@/components/modern/PageHeader';

export function AcademicTermsSchedules() {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Academic Terms & Schedules"
        subtitle="Manage academic terms, schedule templates, and program scheduling"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
          <TabsTrigger value="terms">Academic Terms</TabsTrigger>
          <TabsTrigger value="schedules">Schedule Templates</TabsTrigger>
          <TabsTrigger value="program-scheduling">Program Scheduling</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-6">
          <AcademicTermsTab />
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <ScheduleTemplatesTab />
        </TabsContent>

        <TabsContent value="program-scheduling" className="space-y-6">
          <ProgramSchedulingTab />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <CalendarViewTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}