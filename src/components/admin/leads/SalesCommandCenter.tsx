import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  Settings
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
  
  // Mock data for demo
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            Sales Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring and control of sales operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            System Operational
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowBenchmarkDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Immediate Actions Required - Moved to Top */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Zap className="h-5 w-5" />
            Immediate Actions Required
          </CardTitle>
          <CardDescription className="text-amber-700">
            Items that need immediate attention to maintain performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {urgentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.severity === 'critical' ? 'bg-red-500' :
                    item.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2">{item.count}</Badge>
                </div>
                <Button size="sm" variant="outline">
                  {item.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Issue Chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {criticalAlerts} Critical
        </Badge>
        <Badge variant="outline" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {commandCenterStats.slaViolations} SLA breaches
        </Badge>
        <Badge variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {commandCenterStats.unassignedLeads} Unassigned
        </Badge>
        {/* Current Targets */}
        <Badge variant="secondary" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          SLA: {settings.responseTime.slaTarget}h
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Target: {settings.conversion.overallTarget}%
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Daily: {settings.activity.dailyContacts}
        </Badge>
      </div>

      {/* Main Command Center Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-1 rounded-xl border shadow-sm">
          <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1 h-auto p-1">
            <TabsTrigger 
              value="alert-center" 
              className="flex flex-col items-center gap-2 py-4 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:text-red-600 hover:bg-white/50 transition-all duration-200"
            >
              <AlertTriangle className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold text-sm">Critical Issues</div>
                <div className="text-xs text-muted-foreground">Urgent alerts</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="flash-reports" 
              className="flex flex-col items-center gap-2 py-4 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:text-blue-600 hover:bg-white/50 transition-all duration-200"
            >
              <BarChart3 className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold text-sm">Pipeline Analytics</div>
                <div className="text-xs text-muted-foreground">Real-time metrics</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="team-performance" 
              className="flex flex-col items-center gap-2 py-4 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:text-green-600 hover:bg-white/50 transition-all duration-200"
            >
              <Award className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold text-sm">Team Dashboard</div>
                <div className="text-xs text-muted-foreground">Performance tracking</div>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="workflow-automation" 
              className="flex flex-col items-center gap-2 py-4 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:text-purple-600 hover:bg-white/50 transition-all duration-200"
            >
              <Zap className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold text-sm">Automation Hub</div>
                <div className="text-xs text-muted-foreground">Workflow management</div>
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