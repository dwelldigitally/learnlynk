import { useState, useEffect } from 'react';
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
import { QuickActions } from '@/components/admin/sales-rep/QuickActions';
import { AISequenceCard } from '@/components/admin/sales-rep/AISequenceCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function SalesRepDashboard() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-muted/30">
      <DailyHeader />
      
      <div className={cn("px-4 lg:px-6 xl:px-8", isMobile ? "py-4" : "py-6")}>
        {/* Card Grid Layout */}
        <div className={cn(
          "grid gap-6",
          isMobile 
            ? "grid-cols-1" 
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}>
          
          {/* Row 1 - Essential Actions */}
          <div className={cn(isMobile ? "col-span-1" : "md:col-span-2")}>
            <NewlyAssignedLeads />
          </div>
          
          <div className={cn(isMobile ? "col-span-1" : "lg:col-span-1")}>
            <TodaysTasks />
          </div>
          
          <div className={cn(isMobile ? "col-span-1" : "lg:col-span-1")}>
            <QuickActions />
          </div>

          {/* Row 2 - Communications & Hot Leads */}
          <div className={cn(isMobile ? "col-span-1" : "md:col-span-1")}>
            <UnreadCommunications />
          </div>
          
          <div className={cn(isMobile ? "col-span-1" : "md:col-span-1")}>
            <HotLeadsToday />
          </div>
          
          <div className={cn(isMobile ? "col-span-1" : "lg:col-span-2")}>
            <TodaysCallList />
          </div>

          {/* Row 3 - AI Sequences & Performance */}
          <div className={cn(isMobile ? "col-span-1" : "md:col-span-2")}>
            <AISequenceCard />
          </div>
          
          <div className={cn(isMobile ? "col-span-1" : "lg:col-span-1")}>
            <ReenquiryStudents />
          </div>
          
          <div className={cn(isMobile ? "col-span-1" : "lg:col-span-1")}>
            <PerformanceTracker />
          </div>

          {/* Row 4 - Calendar & AI Actions */}
          <div className={cn(isMobile ? "col-span-1" : "md:col-span-2 lg:col-span-3")}>
            <MyDayCalendar />
          </div>
          
          <div className={cn(isMobile ? "col-span-1" : "md:col-span-2 lg:col-span-1")}>
            <AIActionCenter />
          </div>
        </div>
      </div>
    </div>
  );
}