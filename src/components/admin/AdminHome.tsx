import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, TrendingUp, FileText, DollarSign, CheckCircle2, Activity, MessageSquare, Calendar, Plus, StickyNote, Sparkles, AlertTriangle, Clock, Target, Mail, Phone, Building, UserPlus, Bell } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { QuickCommunicationModal } from "./QuickCommunicationModal";
import { QuickTaskModal } from "./QuickTaskModal";
import { QuickNoteModal } from "./QuickNoteModal";
import { QuickStudentLookupModal } from "./QuickStudentLookupModal";
import { OutlookCalendarWidget } from "./OutlookCalendarWidget";
import { OutlookEmailWidget } from "./OutlookEmailWidget";
import { DashboardKPICard } from "./dashboard/DashboardKPICard";
import { ActivityFeedItem, ActivityItem } from "./dashboard/ActivityFeedItem";
import { PriorityActionCard, PriorityAction } from "./dashboard/PriorityActionCard";
import { QuickInsightsChart } from "./dashboard/QuickInsightsChart";
import { AIRecommendationCard, AIRecommendation } from "./dashboard/AIRecommendationCard";
import { DashboardNotificationPanel, Notification } from "./dashboard/DashboardNotificationPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDemoDataAccess } from '@/services/demoDataService';

const AdminHome: React.FC = () => {
  const {
    profile
  } = useProfile();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const { data: hasDemoAccess, isLoading: isDemoLoading } = useDemoDataAccess();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showLookupModal, setShowLookupModal] = useState(false);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  const firstName = profile?.first_name || "there";

  // Mock Task Data
  const mockTasks = [{
    id: '1',
    title: 'Follow up with John Doe',
    description: 'Contact regarding program inquiry',
    priority: 'urgent',
    dueDate: 'Today, 2:00 PM'
  }, {
    id: '2',
    title: 'Review application documents',
    description: 'Sarah Johnson - Business Administration',
    priority: 'high',
    dueDate: 'Today, 4:00 PM'
  }, {
    id: '3',
    title: 'Approve payment request',
    description: 'Michael Chen - Semester 2 fees',
    priority: 'medium',
    dueDate: 'Tomorrow, 10:00 AM'
  }, {
    id: '4',
    title: 'Schedule meeting with advisor',
    description: 'Weekly check-in',
    priority: 'low',
    dueDate: 'Friday, 3:00 PM'
  }, {
    id: '5',
    title: 'Update student records',
    description: 'Complete data entry for new enrollments',
    priority: 'medium',
    dueDate: 'Tomorrow, 2:00 PM'
  }];

  // Empty KPI Data for new users
  const emptyKpiData = [{
    title: "New Leads",
    value: 0,
    icon: Users,
    trend: 'neutral' as const,
    onClick: () => navigate('/admin/leads')
  }, {
    title: "Active Students",
    value: 0,
    icon: Building,
    trend: 'neutral' as const,
    onClick: () => navigate('/admin/students')
  }, {
    title: "Pending Applications",
    value: 0,
    icon: FileText,
    trend: 'neutral' as const,
    onClick: () => navigate('/admin/applications')
  }, {
    title: "Revenue This Month",
    value: "$0",
    icon: DollarSign,
    trend: 'neutral' as const,
    onClick: () => navigate('/admin/financials')
  }, {
    title: "Conversion Rate",
    value: "0%",
    icon: TrendingUp,
    trend: 'neutral' as const
  }, {
    title: "Tasks Due Today",
    value: 0,
    icon: CheckCircle2,
    trend: 'neutral' as const,
    onClick: () => navigate('/admin/tasks')
  }];

  // Mock KPI Data
  const kpiData = [{
    title: "New Leads",
    value: 12,
    icon: Users,
    trend: 'up' as const,
    trendValue: '+23% from yesterday',
    onClick: () => navigate('/admin/leads')
  }, {
    title: "Active Students",
    value: 156,
    icon: Building,
    trend: 'neutral' as const,
    onClick: () => navigate('/admin/students')
  }, {
    title: "Pending Applications",
    value: 8,
    icon: FileText,
    trend: 'down' as const,
    trendValue: '-2 from last week',
    onClick: () => navigate('/admin/applicants')
  }, {
    title: "Revenue (MTD)",
    value: "$45.2K",
    icon: DollarSign,
    trend: 'up' as const,
    trendValue: '+18% vs last month',
    onClick: () => navigate('/admin/financial-management')
  }, {
    title: "Conversion Rate",
    value: "23%",
    icon: Target,
    trend: 'up' as const,
    trendValue: '+5% improvement'
  }, {
    title: "Tasks Due Today",
    value: 5,
    icon: CheckCircle2,
    trend: 'neutral' as const,
    onClick: () => navigate('/admin/sales-rep-dashboard')
  }];

  // Mock Priority Actions
  const priorityActions: PriorityAction[] = [{
    id: '1',
    title: 'Overdue Tasks',
    description: 'Complete these tasks to stay on track',
    urgency: 'critical',
    count: 3,
    icon: AlertTriangle,
    action: () => navigate('/admin/sales-rep-dashboard'),
    actionLabel: 'View Tasks'
  }, {
    id: '2',
    title: 'Follow-ups Needed',
    description: 'Leads waiting for your response',
    urgency: 'high',
    count: 5,
    icon: Phone,
    action: () => navigate('/admin/leads'),
    actionLabel: 'Contact Leads'
  }, {
    id: '3',
    title: 'Applications to Review',
    description: 'Pending applications require attention',
    urgency: 'high',
    count: 8,
    icon: FileText,
    action: () => navigate('/admin/applicants'),
    actionLabel: 'Review Applications'
  }, {
    id: '4',
    title: 'Documents Pending',
    description: 'Student documents awaiting verification',
    urgency: 'medium',
    count: 12,
    icon: FileText,
    action: () => navigate('/admin/documents'),
    actionLabel: 'Verify Documents'
  }];

  // Mock Activity Feed
  const activityFeed: ActivityItem[] = [{
    id: '1',
    type: 'lead',
    title: 'New Lead: Sarah Johnson',
    description: 'Interested in Computer Science program',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    user: {
      name: 'System',
      avatar: undefined
    },
    icon: UserPlus,
    priority: 'high'
  }, {
    id: '2',
    type: 'application',
    title: 'Application Submitted',
    description: 'Michael Chen submitted application for Business Administration',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    icon: FileText,
    priority: 'medium'
  }, {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    description: 'Emma Wilson paid $2,500 tuition fee',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    user: {
      name: 'Finance Team'
    },
    icon: DollarSign
  }, {
    id: '4',
    type: 'task',
    title: 'Task Completed',
    description: 'Follow-up call with David Martinez',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    user: {
      name: 'John Smith'
    },
    icon: CheckCircle2
  }, {
    id: '5',
    type: 'communication',
    title: 'Email Sent',
    description: 'Welcome email sent to 15 new applicants',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    icon: Mail
  }];

  // Mock AI Recommendations
  const aiRecommendations: AIRecommendation[] = [{
    id: '1',
    title: 'Re-engage Cold Leads',
    description: 'You have 5 leads from last week with no follow-up. Consider reaching out to re-engage them.',
    impact: 'high',
    category: 'Sales',
    action: () => navigate('/admin/leads'),
    actionLabel: 'View Leads'
  }, {
    id: '2',
    title: 'Document Verification Backlog',
    description: '12 student documents are waiting for verification. Clearing this will improve student satisfaction.',
    impact: 'high',
    category: 'Operations',
    action: () => navigate('/admin/documents'),
    actionLabel: 'Start Verification'
  }, {
    id: '3',
    title: 'Response Time Increased',
    description: 'Your team\'s average response time increased by 20% this week. Consider redistributing workload.',
    impact: 'medium',
    category: 'Performance',
    action: () => navigate('/admin/team-management'),
    actionLabel: 'View Team'
  }];

  // Mock Notifications
  const [notifications, setNotifications] = useState<Notification[]>([{
    id: '1',
    type: 'system',
    title: 'System Update',
    message: 'New features available in the reporting module',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    priority: 'low',
    read: false
  }, {
    id: '2',
    type: 'task',
    title: 'Task Reminder',
    message: 'Meeting with admissions team in 30 minutes',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    priority: 'high',
    read: false,
    action: () => navigate('/admin/sales-rep-dashboard')
  }, {
    id: '3',
    type: 'financial',
    title: 'Payment Received',
    message: '$5,000 payment received from Emma Wilson',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    priority: 'medium',
    read: true
  }]);

  // Mock Chart Data
  const leadSourceData = [{
    name: 'Website',
    value: 45
  }, {
    name: 'Referral',
    value: 25
  }, {
    name: 'Social Media',
    value: 20
  }, {
    name: 'Events',
    value: 10
  }];
  const applicationPipelineData = [{
    name: 'Inquiry',
    value: 120
  }, {
    name: 'Applied',
    value: 85
  }, {
    name: 'Accepted',
    value: 60
  }, {
    name: 'Enrolled',
    value: 45
  }];
  const revenueData = [{
    name: 'Jan',
    value: 32000
  }, {
    name: 'Feb',
    value: 38000
  }, {
    name: 'Mar',
    value: 42000
  }, {
    name: 'Apr',
    value: 45000
  }, {
    name: 'May',
    value: 48000
  }, {
    name: 'Jun',
    value: 45200
  }];

  // Quick Actions
  const quickActions = [{
    title: "Add Lead",
    description: "Capture new lead information",
    icon: UserPlus,
    color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    onClick: () => navigate("/admin/leads")
  }, {
    title: "Student Lookup",
    description: "Find student information",
    icon: Users,
    color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
    onClick: () => setShowLookupModal(true)
  }, {
    title: "Send Message",
    description: "Communicate with students",
    icon: MessageSquare,
    color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
    onClick: () => setShowCommunicationModal(true)
  }, {
    title: "Create Task",
    description: "Add new task or reminder",
    icon: Plus,
    color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
    onClick: () => setShowTaskModal(true)
  }, {
    title: "Add Note",
    description: "Quick note creation",
    icon: StickyNote,
    color: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
    onClick: () => setShowNoteModal(true)
  }, {
    title: "Schedule Meeting",
    description: "Book a new meeting",
    icon: Calendar,
    color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20",
    onClick: () => navigate("/admin/calendar")
  }];
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {
      ...n,
      read: true
    } : n));
  };
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({
      ...n,
      read: true
    })));
    toast({
      title: "All notifications marked as read"
    });
  };
  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`
      });
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Hero Section with Greeting and KPIs */}
      <div className="border-b bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-6 py-8">
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {getGreeting()}, {firstName}! 👋
            </h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            </p>
          </div>

          {/* Demo Mode Banner */}
          {!hasDemoAccess && !isDemoLoading && (
            <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Welcome to Your Dashboard!
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                      Your dashboard is ready. Enable Demo Mode to see what it looks 
                      like with data, or start adding your own leads and students.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/admin/profile')}
                      className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
                    >
                      Enable Demo Mode in Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {(hasDemoAccess ? kpiData : emptyKpiData).map((kpi, index) => <DashboardKPICard key={index} {...kpi} />)}
          </div>

          {/* AI Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="🔍 AI Search: How can I help you today? Try 'Show me hot leads' or 'Students with incomplete documents'" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 pr-4 h-12 bg-card border-border text-base" />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Priority Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Priority Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Today's Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="urgent" className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="urgent" className="flex-1">Urgent Actions</TabsTrigger>
                    <TabsTrigger value="schedule" className="flex-1">My Schedule</TabsTrigger>
                    <TabsTrigger value="leads" className="flex-1">Hot Leads</TabsTrigger>
                  </TabsList>

                  <TabsContent value="urgent" className="space-y-3">
                    {hasDemoAccess && priorityActions.length > 0 ? (
                      priorityActions.map(action => <PriorityActionCard key={action.id} action={action} />)
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">No urgent actions</p>
                        <p className="text-sm mt-1">You're all caught up! Great work.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="schedule">
                    <OutlookCalendarWidget />
                  </TabsContent>

                  <TabsContent value="leads">
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hot leads at the moment</p>
                      <Button variant="link" className="mt-2" onClick={() => navigate('/admin/leads')}>
                        View all leads
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              
              
            </Card>

            {/* Quick Actions Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return <Button key={index} variant="outline" className={`h-auto flex-col items-start p-4 ${action.color}`} onClick={action.onClick}>
                        <Icon className="h-5 w-5 mb-2" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">{action.title}</div>
                          <div className="text-xs opacity-80">{action.description}</div>
                        </div>
                      </Button>;
                })}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasDemoAccess && aiRecommendations.length > 0 ? (
                  <div className="space-y-3">
                    {aiRecommendations.map(rec => <AIRecommendationCard key={rec.id} recommendation={rec} />)}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="font-medium">No recommendations yet</p>
                    <p className="text-sm mt-1">AI will analyze your data and provide insights soon.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Insights */}
            {hasDemoAccess ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <QuickInsightsChart title="Lead Sources" type="pie" data={leadSourceData} />
                  <QuickInsightsChart title="Application Pipeline" type="bar" data={applicationPipelineData} />
                </div>

                <QuickInsightsChart title="Revenue Trend" type="line" data={revenueData} />
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="font-medium">No insights available</p>
                    <p className="text-sm mt-1">Start adding data to see analytics and trends.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Integration Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OutlookEmailWidget />
              
            </div>
          </div>

          {/* Right Column - Notifications, Tasks & Activity Feed */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <Tabs defaultValue="notifications" className="w-full">
                <CardHeader className="pb-3">
                  <TabsList className="grid w-full grid-cols-3 gap-1">
                    <TabsTrigger value="notifications" className="text-xs">
                      <Bell className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Alerts</span>
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="text-xs">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Tasks</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="text-xs">
                      <Activity className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Activity</span>
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent className="p-0">
                  <TabsContent value="notifications" className="mt-0">
                    <DashboardNotificationPanel notifications={notifications} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} onDismiss={handleDismiss} />
                  </TabsContent>
                  
                  <TabsContent value="tasks" className="mt-0">
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-3 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-foreground">My Tasks</h3>
                          <Badge variant="secondary">{hasDemoAccess ? mockTasks.length : 0}</Badge>
                        </div>
                        {hasDemoAccess && mockTasks.length > 0 ? (
                          mockTasks.map(task => <div key={task.id} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                              <div className="flex items-start gap-3">
                                <Checkbox className="mt-1" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className={`text-xs ${task.priority === 'urgent' ? 'bg-red-500/10 text-red-600 border-red-200' : task.priority === 'high' ? 'bg-orange-500/10 text-orange-600 border-orange-200' : task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-200' : 'bg-blue-500/10 text-blue-600 border-blue-200'}`}>
                                      {task.priority}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {task.dueDate}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>)
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="font-medium">No tasks yet</p>
                            <p className="text-sm mt-1">Create tasks to stay organized.</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="activity" className="mt-0">
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-3 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
                        </div>
                        {activityFeed.map(activity => <ActivityFeedItem key={activity.id} activity={activity} onClick={() => console.log('View activity:', activity.id)} />)}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickCommunicationModal open={showCommunicationModal} onOpenChange={setShowCommunicationModal} />
      <QuickTaskModal open={showTaskModal} onOpenChange={setShowTaskModal} />
      <QuickNoteModal open={showNoteModal} onOpenChange={setShowNoteModal} />
      <QuickStudentLookupModal open={showLookupModal} onOpenChange={setShowLookupModal} />
    </div>;
};
export default AdminHome;