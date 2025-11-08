import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { MyDayCalendar } from '@/components/admin/sales-rep/MyDayCalendar';
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

  return (
    <div className="space-y-6">
      {/* Daily Header */}
      <DailyHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="today" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Today's Focus</span>
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Leads & Calls</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Finance</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Priority Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>My Schedule</span>
                  </CardTitle>
                  <CardDescription>
                    Today's calendar and available time slots - Click events for details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MyDayCalendar />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>New Assignments</span>
                  </CardTitle>
                  <CardDescription>
                    Leads that need your immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NewlyAssignedLeads />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Quick Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckSquare className="h-5 w-5 text-green-600" />
                    <span>Today's Tasks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TodaysTasks />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-orange-600" />
                    <span>Communications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UnreadCommunications />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <QuickActions />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-red-600" />
                  <span>Hot Leads</span>
                </CardTitle>
                <CardDescription>
                  High-priority leads requiring immediate action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HotLeadsToday />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>Call List</span>
                </CardTitle>
                <CardDescription>
                  Scheduled calls and follow-ups for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TodaysCallList />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Re-enquiry Students</span>
                </CardTitle>
                <CardDescription>
                  Students showing renewed interest
                </CardDescription>
              </CardHeader>
              <CardContent>
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