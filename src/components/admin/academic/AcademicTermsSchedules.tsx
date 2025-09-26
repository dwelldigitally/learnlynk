import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AcademicTermsTab } from './AcademicTermsTab';
import { ScheduleTemplatesTab } from './ScheduleTemplatesTab';
import { ProgramSchedulingTab } from './ProgramSchedulingTab';
import { CalendarViewTab } from './CalendarViewTab';

export function AcademicTermsSchedules() {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Terms & Schedules</h1>
          <p className="text-muted-foreground">
            Manage academic terms, schedule templates, and program scheduling
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
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