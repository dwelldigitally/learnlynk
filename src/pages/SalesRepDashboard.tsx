import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Layout } from 'react-grid-layout';
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
  DollarSign,
  Lock,
  Unlock,
  RotateCcw
} from 'lucide-react';

import { DailyHeader } from '@/components/admin/sales-rep/DailyHeader';
import { HotLeadsToday } from '@/components/admin/sales-rep/HotLeadsToday';
import { TodaysCallList } from '@/components/admin/sales-rep/TodaysCallList';
import { ReenquiryStudents } from '@/components/admin/sales-rep/ReenquiryStudents';
import { GoalsPerformanceTracker } from '@/components/admin/sales-rep/GoalsPerformanceTracker';
import { DocumentsTrackerTab } from '@/components/admin/sales-rep/DocumentsTrackerTab';
import { FinanceTrackerTab } from '@/components/admin/sales-rep/FinanceTrackerTab';
import { CustomizableTabLayout } from '@/components/admin/sales-rep/CustomizableTabLayout';
import { CalendarWidget } from '@/components/admin/sales-rep/widgets/CalendarWidget';
import { NewAssignmentsWidget } from '@/components/admin/sales-rep/widgets/NewAssignmentsWidget';
import { TasksWidget } from '@/components/admin/sales-rep/widgets/TasksWidget';
import { CommunicationsWidget } from '@/components/admin/sales-rep/widgets/CommunicationsWidget';
import { QuickActionsWidget } from '@/components/admin/sales-rep/widgets/QuickActionsWidget';
import { todayDefaultLayout, STORAGE_KEYS } from '@/config/salesRepDashboardLayouts';

export default function SalesRepDashboard() {
  const [activeTab, setActiveTab] = useState('today');
  const [isLocked, setIsLocked] = useState(true);
  const [todayLayout, setTodayLayout] = useState<Layout[]>(todayDefaultLayout);

  // Load saved layout and lock state from localStorage
  useEffect(() => {
    const savedLock = localStorage.getItem(STORAGE_KEYS.LAYOUT_LOCKED);
    if (savedLock !== null) {
      setIsLocked(savedLock === 'true');
    }

    const savedLayout = localStorage.getItem(STORAGE_KEYS.TODAY_LAYOUT);
    if (savedLayout) {
      try {
        setTodayLayout(JSON.parse(savedLayout));
      } catch (error) {
        console.error('Failed to parse saved layout:', error);
        setTodayLayout(todayDefaultLayout);
      }
    }
  }, []);

  // Save layout to localStorage when it changes
  const handleLayoutChange = (newLayout: Layout[]) => {
    setTodayLayout(newLayout);
    localStorage.setItem(STORAGE_KEYS.TODAY_LAYOUT, JSON.stringify(newLayout));
  };

  // Toggle lock state
  const toggleLock = () => {
    const newLockState = !isLocked;
    setIsLocked(newLockState);
    localStorage.setItem(STORAGE_KEYS.LAYOUT_LOCKED, String(newLockState));
  };

  // Reset to default layout
  const resetLayout = () => {
    setTodayLayout(todayDefaultLayout);
    localStorage.setItem(STORAGE_KEYS.TODAY_LAYOUT, JSON.stringify(todayDefaultLayout));
  };

  // Widget mapping for customizable layout
  const todayWidgets = {
    calendar: <CalendarWidget />,
    'new-assignments': <NewAssignmentsWidget />,
    tasks: <TasksWidget />,
    communications: <CommunicationsWidget />,
    'quick-actions': <QuickActionsWidget />,
  };

  return (
    <div className="space-y-4">
      {/* Daily Header */}
      <DailyHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
        <TabsContent value="today" className="space-y-4">
          {/* Layout Controls */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            {isLocked ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Dashboard locked - viewing mode</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Unlock className="h-4 w-4" />
                <span>Customize your dashboard - drag to move, resize from corners</span>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={toggleLock} 
                variant={isLocked ? "outline" : "default"} 
                size="sm"
              >
                {isLocked ? (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Edit Layout
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Lock Layout
                  </>
                )}
              </Button>
              <Button 
                onClick={resetLayout} 
                variant="outline" 
                size="sm" 
                disabled={isLocked}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Customizable Grid Layout */}
          <CustomizableTabLayout
            layout={todayLayout}
            widgets={todayWidgets}
            isLocked={isLocked}
            onLayoutChange={handleLayoutChange}
          />
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="p-5">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-red-600" />
                  <span>Hot Leads</span>
                </CardTitle>
                <CardDescription>
                  High-priority leads requiring immediate action
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <HotLeadsToday />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-5">
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>Call List</span>
                </CardTitle>
                <CardDescription>
                  Scheduled calls and follow-ups for today
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <TodaysCallList />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="p-5">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Re-enquiry Students</span>
                </CardTitle>
                <CardDescription>
                  Students showing renewed interest
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
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