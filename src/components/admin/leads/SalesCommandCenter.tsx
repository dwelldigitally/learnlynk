import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { 
  Target,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle,
  Zap,
  Flag,
  Award,
  BarChart3,
  Settings,
  Bot,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Brain,
  Activity,
  Shield,
  PieChart,
  Timer,
  MessageSquare
} from "lucide-react";
import { FlashReports } from "./command-center/FlashReports";
import { AlertCenter } from "./command-center/AlertCenter";
import { TeamPerformance } from "./command-center/TeamPerformance";
import { BenchmarkSettingsDialog } from "./command-center/BenchmarkSettingsDialog";
import { useBenchmarkSettings } from "@/hooks/useBenchmarkSettings";

export function SalesCommandCenter() {
  const [activeTab, setActiveTab] = useState("alert-center");
  const [criticalAlerts, setCriticalAlerts] = useState(12);
  const [teamUtilization, setTeamUtilization] = useState(78);
  const [showBenchmarkDialog, setShowBenchmarkDialog] = useState(false);
  const { settings } = useBenchmarkSettings();
  
  // Enhanced mock data for comprehensive dashboard
  const commandCenterStats = {
    totalPipelineValue: 2840000,
    conversionRate: 14.7,
    responseCompliance: 87,
    teamUtilization: 78,
    unassignedLeads: 23,
    overdueFollowups: 8,
    slaViolations: 5,
    paymentIssues: 3
  };

  // AI Agent Performance Data
  const aiAgentStats = {
    totalAgents: 8,
    activeAgents: 6,
    tasksCompletedToday: 156,
    averageConfidence: 94.2,
    automationRate: 78.5,
    interventionsRequired: 3,
    messagesGenerated: 89,
    leadsProcessed: 67
  };

  // Human Agent Performance Data
  const humanAgentStats = {
    totalCounselors: 12,
    activeCounselors: 10,
    averageResponseTime: 2.4,
    completedFollowups: 45,
    scheduledCalls: 18,
    conversionRate: 16.8,
    messagesSent: 134,
    leadsContacted: 78
  };

  // Key Performance Metrics
  const performanceMetrics = [
    {
      title: "Pipeline Value",
      value: "$2.84M",
      change: "+12.3%",
      trend: "up",
      icon: BarChart3,
      color: "text-success",
      bgColor: "bg-success/5",
      borderColor: "border-success/20"
    },
    {
      title: "Conversion Rate",
      value: "14.7%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/20"
    },
    {
      title: "Response Time",
      value: "2.4h",
      change: "-0.6h",
      trend: "up",
      icon: Timer,
      color: "text-accent",
      bgColor: "bg-accent/5",
      borderColor: "border-accent/20"
    },
    {
      title: "Team Utilization",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: Activity,
      color: "text-warning",
      bgColor: "bg-warning/5",
      borderColor: "border-warning/20"
    }
  ];

  const urgentItems = [
    {
      id: 1,
      type: "sla_violation",
      title: "Response SLA Breach",
      description: "3 leads exceed 24-hour response time",
      severity: "high",
      count: 3,
      action: "Assign to available advisor"
    },
    {
      id: 2,
      type: "payment_issue",
      title: "Payment Processing Failed",
      description: "Student payment requires immediate attention",
      severity: "critical",
      count: 1,
      action: "Contact finance team"
    },
    {
      id: 3,
      type: "unassigned",
      title: "Unassigned High-Value Leads",
      description: "Premium program leads awaiting assignment",
      severity: "medium",
      count: 5,
      action: "Auto-assign to top performers"
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <Target className="h-8 w-8 text-primary" />
            </div>
            Sales Command Center
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Real-time monitoring and control of enrollment operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-success border-success/20 bg-success/5 px-3 py-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            System Operational
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowBenchmarkDialog(true)} className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className={`${metric.bgColor} ${metric.borderColor} border-2 hover:shadow-lg transition-all duration-300`}>
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</p>
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  <div className={`flex items-center gap-1 mt-2 ${metric.color}`}>
                    {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${metric.bgColor} border ${metric.borderColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI & Human Agent Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Agents Card */}
        <Card className="bg-gradient-subtle border-primary/20 border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-foreground">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              AI Agent Performance
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Automated tasks and AI-driven activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/70 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground font-medium">Active Agents</p>
                <p className="text-2xl font-bold text-foreground">{aiAgentStats.activeAgents}/{aiAgentStats.totalAgents}</p>
              </div>
              <div className="bg-card/70 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground font-medium">Tasks Today</p>
                <p className="text-2xl font-bold text-foreground">{aiAgentStats.tasksCompletedToday}</p>
              </div>
              <div className="bg-card/70 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground font-medium">Confidence</p>
                <p className="text-2xl font-bold text-foreground">{aiAgentStats.averageConfidence}%</p>
              </div>
              <div className="bg-card/70 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground font-medium">Automation Rate</p>
                <p className="text-2xl font-bold text-foreground">{aiAgentStats.automationRate}%</p>
              </div>
            </div>
            <div className="bg-card/50 p-3 rounded-lg border border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Automation Progress</span>
                <span className="font-medium text-foreground">{aiAgentStats.automationRate}%</span>
              </div>
              <Progress value={aiAgentStats.automationRate} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Human Agents Card */}
        <Card className="bg-gradient-subtle border-secondary/20 border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-foreground">
              <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                <UserCheck className="h-5 w-5 text-secondary" />
              </div>
              Human Agent Performance
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Counselor activity and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/70 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground font-medium">Active Staff</p>
                <p className="text-2xl font-bold text-foreground">{humanAgentStats.activeCounselors}/{humanAgentStats.totalCounselors}</p>
              </div>
              <div className="bg-card/70 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground font-medium">Response Time</p>
                <p className="text-2xl font-bold text-foreground">{humanAgentStats.averageResponseTime}h</p>
              </div>
              <div className="bg-card/70 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground font-medium">Completed</p>
                <p className="text-2xl font-bold text-foreground">{humanAgentStats.completedFollowups}</p>
              </div>
              <div className="bg-card/70 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground font-medium">Conversion</p>
                <p className="text-2xl font-bold text-foreground">{humanAgentStats.conversionRate}%</p>
              </div>
            </div>
            <div className="bg-card/50 p-3 rounded-lg border border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Team Utilization</span>
                <span className="font-medium text-foreground">{teamUtilization}%</span>
              </div>
              <Progress value={teamUtilization} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues & Actions */}
      <Card className="border-warning/20 bg-warning/5 border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-foreground">
            <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
              <Zap className="h-5 w-5 text-warning" />
            </div>
            Critical Issues Requiring Action
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            High-priority items that need immediate attention to maintain performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {urgentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-card/80 rounded-xl border border-border hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                    item.severity === 'critical' ? 'bg-destructive shadow-lg shadow-destructive/20' :
                    item.severity === 'high' ? 'bg-warning shadow-lg shadow-warning/20' : 'bg-warning/60 shadow-lg shadow-warning/10'
                  }`} />
                  <div className="flex-grow">
                    <p className="font-semibold text-foreground text-lg">{item.title}</p>
                    <p className="text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-3 px-3 py-1 text-sm font-medium">{item.count}</Badge>
                </div>
                <Button size="sm" variant="outline" className="ml-4">
                  {item.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators & Targets */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-foreground">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">SLA Breaches</p>
                <p className="text-2xl font-bold text-foreground">{commandCenterStats.slaViolations}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unassigned Leads</p>
                <p className="text-2xl font-bold text-foreground">{commandCenterStats.unassignedLeads}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Targets */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">Current Performance Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">SLA Target</p>
                <p className="font-semibold text-foreground">{settings.responseTime.slaTarget}h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Conversion Target</p>
                <p className="font-semibold text-foreground">{settings.conversion.overallTarget}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Daily Contacts</p>
                <p className="font-semibold text-foreground">{settings.activity.dailyContacts}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Command Center Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="bg-gradient-subtle p-2 rounded-2xl border-2 border-border shadow-lg">
          <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2 h-auto p-2">
            <TabsTrigger 
              value="alert-center" 
              className="flex flex-col items-center gap-3 py-6 px-8 rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-destructive/20 data-[state=active]:text-destructive data-[state=active]:bg-destructive/5 hover:bg-card/70 hover:shadow-md transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-destructive/10 data-[state=active]:bg-destructive/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">Critical Issues</div>
                <div className="text-xs text-muted-foreground mt-1">Urgent alerts & escalations</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="flash-reports" 
              className="flex flex-col items-center gap-3 py-6 px-8 rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-primary/20 data-[state=active]:text-primary data-[state=active]:bg-primary/5 hover:bg-card/70 hover:shadow-md transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-primary/10 data-[state=active]:bg-primary/20">
                <PieChart className="h-6 w-6" />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">Pipeline Analytics</div>
                <div className="text-xs text-muted-foreground mt-1">Real-time metrics & forecasting</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="team-performance" 
              className="flex flex-col items-center gap-3 py-6 px-8 rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-success/20 data-[state=active]:text-success data-[state=active]:bg-success/5 hover:bg-card/70 hover:shadow-md transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-success/10 data-[state=active]:bg-success/20">
                <Award className="h-6 w-6" />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">Team Dashboard</div>
                <div className="text-xs text-muted-foreground mt-1">Performance & leaderboards</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="workflow-automation" 
              className="flex flex-col items-center gap-3 py-6 px-8 rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-accent/20 data-[state=active]:text-accent data-[state=active]:bg-accent/5 hover:bg-card/70 hover:shadow-md transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-accent/10 data-[state=active]:bg-accent/20">
                <Brain className="h-6 w-6" />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">AI Automation</div>
                <div className="text-xs text-muted-foreground mt-1">Workflow & agent management</div>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="flash-reports" className="space-y-4">
          <FlashReports />
        </TabsContent>

        <TabsContent value="alert-center" className="space-y-4">
          <AlertCenter />
        </TabsContent>

        <TabsContent value="team-performance" className="space-y-4">
          <TeamPerformance />
        </TabsContent>

        <TabsContent value="workflow-automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Workflow Automation
              </CardTitle>
              <CardDescription>
                Automated sequences, lead routing, and task management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Automation hub coming soon...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Manage lead sequences, auto-assignments, and workflow triggers
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Benchmark Settings Dialog */}
      <BenchmarkSettingsDialog 
        open={showBenchmarkDialog} 
        onOpenChange={setShowBenchmarkDialog} 
      />
    </div>
  );
}