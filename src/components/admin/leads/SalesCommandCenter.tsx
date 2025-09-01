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
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Conversion Rate",
      value: "14.7%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Response Time",
      value: "2.4h",
      change: "-0.6h",
      trend: "up",
      icon: Timer,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Team Utilization",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
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
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1">
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
            <CardContent className="p-6">
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
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-blue-900">
              <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              AI Agent Performance
            </CardTitle>
            <CardDescription className="text-blue-700">
              Automated tasks and AI-driven activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">Active Agents</p>
                <p className="text-2xl font-bold text-blue-900">{aiAgentStats.activeAgents}/{aiAgentStats.totalAgents}</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">Tasks Today</p>
                <p className="text-2xl font-bold text-blue-900">{aiAgentStats.tasksCompletedToday}</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">Confidence</p>
                <p className="text-2xl font-bold text-blue-900">{aiAgentStats.averageConfidence}%</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">Automation Rate</p>
                <p className="text-2xl font-bold text-blue-900">{aiAgentStats.automationRate}%</p>
              </div>
            </div>
            <div className="bg-white/50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">Automation Progress</span>
                <span className="font-medium text-blue-900">{aiAgentStats.automationRate}%</span>
              </div>
              <Progress value={aiAgentStats.automationRate} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Human Agents Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-green-900">
              <div className="p-2 rounded-lg bg-green-100 border border-green-200">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              Human Agent Performance
            </CardTitle>
            <CardDescription className="text-green-700">
              Counselor activity and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 p-4 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">Active Staff</p>
                <p className="text-2xl font-bold text-green-900">{humanAgentStats.activeCounselors}/{humanAgentStats.totalCounselors}</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">Response Time</p>
                <p className="text-2xl font-bold text-green-900">{humanAgentStats.averageResponseTime}h</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-900">{humanAgentStats.completedFollowups}</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">Conversion</p>
                <p className="text-2xl font-bold text-green-900">{humanAgentStats.conversionRate}%</p>
              </div>
            </div>
            <div className="bg-white/50 p-3 rounded-lg border border-green-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Team Utilization</span>
                <span className="font-medium text-green-900">{teamUtilization}%</span>
              </div>
              <Progress value={teamUtilization} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues & Actions */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 border-2">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-amber-900">
            <div className="p-2 rounded-lg bg-amber-100 border border-amber-200">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            Critical Issues Requiring Action
          </CardTitle>
          <CardDescription className="text-amber-700">
            High-priority items that need immediate attention to maintain performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {urgentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-amber-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                    item.severity === 'critical' ? 'bg-red-500 shadow-lg shadow-red-200' :
                    item.severity === 'high' ? 'bg-orange-500 shadow-lg shadow-orange-200' : 'bg-yellow-500 shadow-lg shadow-yellow-200'
                  }`} />
                  <div className="flex-grow">
                    <p className="font-semibold text-foreground text-lg">{item.title}</p>
                    <p className="text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-3 px-3 py-1 text-sm font-medium">{item.count}</Badge>
                </div>
                <Button size="sm" variant="outline" className="ml-4 hover:bg-amber-50">
                  {item.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators & Targets */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-900">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">SLA Breaches</p>
                <p className="text-2xl font-bold text-orange-900">{commandCenterStats.slaViolations}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Unassigned Leads</p>
                <p className="text-2xl font-bold text-blue-900">{commandCenterStats.unassignedLeads}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Targets */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-700">Current Performance Targets</CardTitle>
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
        <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 p-2 rounded-2xl border-2 border-slate-200 shadow-lg">
          <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2 h-auto p-2">
            <TabsTrigger 
              value="alert-center" 
              className="flex flex-col items-center gap-3 py-6 px-8 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-red-200 data-[state=active]:text-red-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-50 data-[state=active]:to-red-100 hover:bg-white/70 hover:shadow-md transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-red-100 data-[state=active]:bg-red-200">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">Critical Issues</div>
                <div className="text-xs text-muted-foreground mt-1">Urgent alerts & escalations</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="flash-reports" 
              className="flex flex-col items-center gap-3 py-6 px-8 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-blue-200 data-[state=active]:text-blue-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-blue-100 hover:bg-white/70 hover:shadow-md transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-blue-100 data-[state=active]:bg-blue-200">
                <PieChart className="h-6 w-6" />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">Pipeline Analytics</div>
                <div className="text-xs text-muted-foreground mt-1">Real-time metrics & forecasting</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="team-performance" 
              className="flex flex-col items-center gap-3 py-6 px-8 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-green-200 data-[state=active]:text-green-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-50 data-[state=active]:to-green-100 hover:bg-white/70 hover:shadow-md transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-green-100 data-[state=active]:bg-green-200">
                <Award className="h-6 w-6" />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">Team Dashboard</div>
                <div className="text-xs text-muted-foreground mt-1">Performance & leaderboards</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="workflow-automation" 
              className="flex flex-col items-center gap-3 py-6 px-8 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-purple-200 data-[state=active]:text-purple-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-50 data-[state=active]:to-purple-100 hover:bg-white/70 hover:shadow-md transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-purple-100 data-[state=active]:bg-purple-200">
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