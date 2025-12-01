import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Search, Users, TrendingUp, FileText, DollarSign, CheckCircle2, Activity, MessageSquare, Calendar, Plus, StickyNote, Sparkles, AlertTriangle, Clock, Target, Mail, Phone, Building, UserPlus, Bell } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuickCommunicationModal } from "./QuickCommunicationModal";
import { QuickTaskModal } from "./QuickTaskModal";
import { QuickNoteModal } from "./QuickNoteModal";
import { QuickStudentLookupModal } from "./QuickStudentLookupModal";
import { OutlookCalendarWidget } from "./OutlookCalendarWidget";
import { DashboardKPICard } from "./dashboard/DashboardKPICard";
import { ActivityFeedItem, ActivityItem } from "./dashboard/ActivityFeedItem";
import { PriorityActionCard, PriorityAction } from "./dashboard/PriorityActionCard";
import { QuickInsightsChart } from "./dashboard/QuickInsightsChart";
import { AIRecommendationCard, AIRecommendation } from "./dashboard/AIRecommendationCard";
import { DashboardNotificationPanel, Notification } from "./dashboard/DashboardNotificationPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDemoDataAccess } from '@/services/demoDataService';
import { 
  HotSheetCard, 
  IconContainer, 
  PastelBadge, 
  PillButton, 
  HotSheetTabsList, 
  HotSheetTabsTrigger,
  HotSheetTabsTriggerCompact,
  getPriorityColor
} from '@/components/hotsheet';

const AdminHome: React.FC = () => {
  const { profile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
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
    priority: 'urgent' as const,
    dueDate: 'Today, 2:00 PM'
  }, {
    id: '2',
    title: 'Review application documents',
    description: 'Sarah Johnson - Business Administration',
    priority: 'high' as const,
    dueDate: 'Today, 4:00 PM'
  }, {
    id: '3',
    title: 'Approve payment request',
    description: 'Michael Chen - Semester 2 fees',
    priority: 'medium' as const,
    dueDate: 'Tomorrow, 10:00 AM'
  }, {
    id: '4',
    title: 'Schedule meeting with advisor',
    description: 'Weekly check-in',
    priority: 'low' as const,
    dueDate: 'Friday, 3:00 PM'
  }, {
    id: '5',
    title: 'Update student records',
    description: 'Complete data entry for new enrollments',
    priority: 'medium' as const,
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
    color: "sky" as const,
    onClick: () => navigate("/admin/leads")
  }, {
    title: "Student Lookup",
    description: "Find student information",
    icon: Users,
    color: "emerald" as const,
    onClick: () => setShowLookupModal(true)
  }, {
    title: "Send Message",
    description: "Communicate with students",
    icon: MessageSquare,
    color: "violet" as const,
    onClick: () => setShowCommunicationModal(true)
  }, {
    title: "Create Task",
    description: "Add new task or reminder",
    icon: Plus,
    color: "peach" as const,
    onClick: () => setShowTaskModal(true)
  }, {
    title: "Add Note",
    description: "Quick note creation",
    icon: StickyNote,
    color: "amber" as const,
    onClick: () => setShowNoteModal(true)
  }, {
    title: "Schedule Meeting",
    description: "Book a new meeting",
    icon: Calendar,
    color: "rose" as const,
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

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'rose';
      case 'high': return 'peach';
      case 'medium': return 'amber';
      default: return 'sky';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Greeting and KPIs */}
      <div className="border-b border-border/40 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Greeting */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
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
            <HotSheetCard className="mb-6 border-sky-200 bg-sky-50/50 dark:bg-sky-950/50 dark:border-sky-800">
              <div className="flex items-start gap-3">
                <IconContainer color="sky" size="md">
                  <Sparkles />
                </IconContainer>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Welcome to Your Dashboard!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your dashboard is ready. Enable Demo Mode to see what it looks 
                    like with data, or start adding your own leads and students.
                  </p>
                  <PillButton 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/admin/profile')}
                  >
                    Enable Demo Mode in Settings
                  </PillButton>
                </div>
              </div>
            </HotSheetCard>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {(hasDemoAccess ? kpiData : emptyKpiData).map((kpi, index) => (
              <DashboardKPICard key={index} {...kpi} />
            ))}
          </div>

          {/* AI Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
            <Input 
              placeholder={isMobile ? "🔍 AI Search..." : "🔍 AI Search: How can I help you today? Try 'Show me hot leads' or 'Students with incomplete documents'"} 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="pl-10 sm:pl-12 pr-10 sm:pr-4 h-11 sm:h-12 bg-card border-border/40 text-sm sm:text-base rounded-xl" 
            />
            <Sparkles className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-primary" />
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Priority Dashboard */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Priority Actions */}
            <HotSheetCard padding="none">
              <div className="p-6 pb-4 flex items-center gap-2">
                <IconContainer color="peach" size="md">
                  <AlertTriangle />
                </IconContainer>
                <h2 className="text-xl font-semibold">Today's Focus</h2>
              </div>
              <div className="px-6 pb-6">
                <Tabs defaultValue="urgent" className="w-full">
                  <HotSheetTabsList className={`w-full mb-4 ${isMobile ? 'grid grid-cols-1 h-auto gap-1' : 'grid grid-cols-3'}`}>
                    <HotSheetTabsTrigger value="urgent" className="flex-1 text-xs sm:text-sm">Urgent Actions</HotSheetTabsTrigger>
                    <HotSheetTabsTrigger value="schedule" className="flex-1 text-xs sm:text-sm">My Schedule</HotSheetTabsTrigger>
                    <HotSheetTabsTrigger value="leads" className="flex-1 text-xs sm:text-sm">Hot Leads</HotSheetTabsTrigger>
                  </HotSheetTabsList>

                  <TabsContent value="urgent" className="space-y-3">
                    {hasDemoAccess && priorityActions.length > 0 ? (
                      priorityActions.map(action => (
                        <PriorityActionCard key={action.id} action={action} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <IconContainer color="emerald" size="xl" className="mx-auto mb-2">
                          <CheckCircle2 />
                        </IconContainer>
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
                      <IconContainer color="sky" size="xl" className="mx-auto mb-2">
                        <Users />
                      </IconContainer>
                      <p>No hot leads at the moment</p>
                      <PillButton 
                        variant="ghost" 
                        className="mt-2" 
                        onClick={() => navigate('/admin/leads')}
                      >
                        View all leads
                      </PillButton>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </HotSheetCard>

            {/* Quick Actions Grid */}
            <HotSheetCard padding="none">
              <div className="p-4 sm:p-6 pb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Quick Actions</h2>
              </div>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <HotSheetCard 
                        key={index} 
                        hover 
                        interactive 
                        padding="md"
                        onClick={action.onClick}
                        className="min-h-[80px]"
                      >
                        <div className="flex items-start gap-3">
                          <IconContainer color={action.color} size="md">
                            <Icon />
                          </IconContainer>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-xs sm:text-sm">{action.title}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">{action.description}</div>
                          </div>
                        </div>
                      </HotSheetCard>
                    );
                  })}
                </div>
              </div>
            </HotSheetCard>

            {/* AI Recommendations */}
            <HotSheetCard padding="none">
              <div className="p-6 pb-4 flex items-center gap-2">
                <IconContainer color="violet" size="md">
                  <Sparkles />
                </IconContainer>
                <h2 className="text-xl font-semibold">AI Recommendations</h2>
              </div>
              <div className="px-6 pb-6">
                {hasDemoAccess && aiRecommendations.length > 0 ? (
                  <div className="space-y-3">
                    {aiRecommendations.map(rec => (
                      <AIRecommendationCard key={rec.id} recommendation={rec} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <IconContainer color="violet" size="xl" className="mx-auto mb-2">
                      <Sparkles />
                    </IconContainer>
                    <p className="font-medium">No recommendations yet</p>
                    <p className="text-sm mt-1">AI will analyze your data and provide insights soon.</p>
                  </div>
                )}
              </div>
            </HotSheetCard>

            {/* Quick Insights */}
            {hasDemoAccess ? (
              <QuickInsightsChart title="Revenue Trend" type="line" data={revenueData} />
            ) : (
              <HotSheetCard padding="none">
                <div className="p-6 pb-4">
                  <h2 className="text-xl font-semibold">Quick Insights</h2>
                </div>
                <div className="px-6 pb-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <IconContainer color="emerald" size="xl" className="mx-auto mb-2">
                      <TrendingUp />
                    </IconContainer>
                    <p className="font-medium">No insights available</p>
                    <p className="text-sm mt-1">Start adding data to see analytics and trends.</p>
                  </div>
                </div>
              </HotSheetCard>
            )}
          </div>

          {/* Right Column - Notifications, Tasks & Activity Feed */}
          <div className="lg:col-span-1">
            <HotSheetCard padding="none" className="sticky top-6">
              <Tabs defaultValue="notifications" className="w-full">
                <div className="p-6 pb-3">
                  <HotSheetTabsList className="grid w-full grid-cols-3 gap-1">
                    <HotSheetTabsTriggerCompact value="notifications" className="text-xs">
                      <Bell className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Alerts</span>
                    </HotSheetTabsTriggerCompact>
                    <HotSheetTabsTriggerCompact value="tasks" className="text-xs">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Tasks</span>
                    </HotSheetTabsTriggerCompact>
                    <HotSheetTabsTriggerCompact value="activity" className="text-xs">
                      <Activity className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Activity</span>
                    </HotSheetTabsTriggerCompact>
                  </HotSheetTabsList>
                </div>
                
                <TabsContent value="notifications" className="mt-0 p-0">
                  <DashboardNotificationPanel 
                    notifications={notifications} 
                    onMarkAsRead={handleMarkAsRead} 
                    onMarkAllAsRead={handleMarkAllAsRead} 
                    onDismiss={handleDismiss} 
                  />
                </TabsContent>
                
                <TabsContent value="tasks" className="mt-0">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-3 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground">My Tasks</h3>
                        <PastelBadge color="slate" size="sm">
                          {hasDemoAccess ? mockTasks.length : 0}
                        </PastelBadge>
                      </div>
                      {hasDemoAccess && mockTasks.length > 0 ? (
                        mockTasks.map(task => (
                          <div 
                            key={task.id} 
                            className="p-3 rounded-xl border border-border/40 bg-card hover:bg-muted/5 hover:border-primary/20 transition-all duration-200 cursor-pointer"
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox className="mt-1" />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <PastelBadge 
                                    color={getTaskPriorityColor(task.priority) as any} 
                                    size="sm"
                                  >
                                    {task.priority}
                                  </PastelBadge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {task.dueDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <IconContainer color="emerald" size="xl" className="mx-auto mb-2">
                            <CheckCircle2 />
                          </IconContainer>
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
                      {activityFeed.map(activity => (
                        <ActivityFeedItem 
                          key={activity.id} 
                          activity={activity} 
                          onClick={() => console.log('View activity:', activity.id)} 
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </HotSheetCard>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickCommunicationModal open={showCommunicationModal} onOpenChange={setShowCommunicationModal} />
      <QuickTaskModal open={showTaskModal} onOpenChange={setShowTaskModal} />
      <QuickNoteModal open={showNoteModal} onOpenChange={setShowNoteModal} />
      <QuickStudentLookupModal open={showLookupModal} onOpenChange={setShowLookupModal} />
    </div>
  );
};

export default AdminHome;
