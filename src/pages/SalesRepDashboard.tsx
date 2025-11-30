import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Bot, 
  CheckSquare,
  MessageCircle,
  Phone,
  Target,
  Clock,
  FileText,
  DollarSign
} from 'lucide-react';

import { DailyHeader } from '@/components/admin/sales-rep/DailyHeader';
import { NewlyAssignedLeads } from '@/components/admin/sales-rep/NewlyAssignedLeads';
import { UnreadCommunications } from '@/components/admin/sales-rep/UnreadCommunications';
import { TodaysCallList } from '@/components/admin/sales-rep/TodaysCallList';
import { ReenquiryStudents } from '@/components/admin/sales-rep/ReenquiryStudents';
import { TodaysTasks } from '@/components/admin/sales-rep/TodaysTasks';
import { EnhancedCalendar } from '@/components/admin/sales-rep/EnhancedCalendar';
import { HotLeadsToday } from '@/components/admin/sales-rep/HotLeadsToday';
import { PerformanceTracker } from '@/components/admin/sales-rep/PerformanceTracker';
import { AIActionCenter } from '@/components/admin/sales-rep/AIActionCenter';
import { QuickActions } from '@/components/admin/sales-rep/QuickActions';
import { AISequenceCard } from '@/components/admin/sales-rep/AISequenceCard';
import { GoalsPerformanceTracker } from '@/components/admin/sales-rep/GoalsPerformanceTracker';
import { DocumentsTrackerTab } from '@/components/admin/sales-rep/DocumentsTrackerTab';
import { FinanceTrackerTab } from '@/components/admin/sales-rep/FinanceTrackerTab';

export default function SalesRepDashboard() {
  const [activeTab, setActiveTab] = useState('today');
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 p-4 sm:p-6 md:p-9">
      {/* Daily Header */}
      <DailyHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation - HotSheet style pill tabs */}
        <TabsList className={`w-full bg-muted/50 p-1.5 rounded-2xl border border-border ${isMobile ? 'flex flex-col h-auto gap-1' : 'grid grid-cols-2 lg:grid-cols-5'}`}>
          <TabsTrigger 
            value="today" 
            className="flex items-center space-x-2 w-full justify-center text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Clock className="h-4 w-4" />
            <span>Today's Focus</span>
          </TabsTrigger>
          <TabsTrigger 
            value="leads" 
            className="flex items-center space-x-2 w-full justify-center text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            <span>Leads & Calls</span>
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className="flex items-center space-x-2 w-full justify-center text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger 
            value="finance" 
            className="flex items-center space-x-2 w-full justify-center text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <DollarSign className="h-4 w-4" />
            <span>Finance</span>
          </TabsTrigger>
          <TabsTrigger 
            value="performance" 
            className="flex items-center space-x-2 w-full justify-center text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Priority Items */}
            <div className="lg:col-span-2 space-y-6">
              <EnhancedCalendar />

              <Card className="rounded-2xl border-border shadow-none">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <div className="p-1.5 bg-[hsl(245,90%,94%)] rounded-lg">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <span>New Assignments</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Leads that need your immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                  <NewlyAssignedLeads />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Quick Info */}
            <div className="space-y-6">
              <Card className="rounded-2xl border-border shadow-none">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <div className="p-1.5 bg-[hsl(158,64%,90%)] rounded-lg">
                      <CheckSquare className="h-4 w-4 text-[hsl(158,64%,40%)]" />
                    </div>
                    <span>Today's Tasks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                  <TodaysTasks />
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border shadow-none">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <div className="p-1.5 bg-[hsl(24,95%,92%)] rounded-lg">
                      <MessageCircle className="h-4 w-4 text-[hsl(24,95%,45%)]" />
                    </div>
                    <span>Communications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                  <UnreadCommunications />
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border shadow-none">
                <CardContent className="p-6">
                  <QuickActions />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border shadow-none">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <div className="p-1.5 bg-[hsl(24,95%,92%)] rounded-lg">
                    <Users className="h-4 w-4 text-[hsl(24,95%,45%)]" />
                  </div>
                  <span>Hot Leads</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  High-priority leads requiring immediate action
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <HotLeadsToday />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border shadow-none">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <div className="p-1.5 bg-[hsl(200,80%,92%)] rounded-lg">
                    <Phone className="h-4 w-4 text-[hsl(200,80%,40%)]" />
                  </div>
                  <span>Call List</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Scheduled calls and follow-ups for today
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <TodaysCallList />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 rounded-2xl border-border shadow-none">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <div className="p-1.5 bg-[hsl(245,90%,94%)] rounded-lg">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span>Re-enquiry Students</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Students showing renewed interest
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <ReenquiryStudents />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentsTrackerTab />
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          <FinanceTrackerTab />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <GoalsPerformanceTracker />
        </TabsContent>

      </Tabs>
    </div>
  );
}