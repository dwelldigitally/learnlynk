import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Flag,
  Award,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Brain,
  BarChart3,
  Settings,
  Filter
} from "lucide-react";
import { FlashReports } from "./command-center/FlashReports";
import { AlertCenter } from "./command-center/AlertCenter";
import { TeamPerformance } from "./command-center/TeamPerformance";
import { BenchmarkControls } from "./command-center/BenchmarkControls";

export function SalesCommandCenter() {
  const [activeTab, setActiveTab] = useState("flash-reports");
  const [criticalAlerts, setCriticalAlerts] = useState(12);
  const [teamUtilization, setTeamUtilization] = useState(78);
  
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
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Critical Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-red-900">{criticalAlerts}</p>
              <p className="text-xs text-red-700">Critical Alerts</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="flex items-center p-4">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-blue-900">
                ${(commandCenterStats.totalPipelineValue / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-blue-700">Pipeline Value</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-green-900">{commandCenterStats.conversionRate}%</p>
              <p className="text-xs text-green-700">Conversion Rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-purple-900">{commandCenterStats.teamUtilization}%</p>
              <p className="text-xs text-purple-700">Team Utilization</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Command Center Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flash-reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Flash Reports
          </TabsTrigger>
          <TabsTrigger value="alert-center" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Alert Center
          </TabsTrigger>
          <TabsTrigger value="team-performance" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Team Performance
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Benchmarks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flash-reports" className="space-y-4">
          <FlashReports />
        </TabsContent>

        <TabsContent value="alert-center" className="space-y-4">
          <AlertCenter />
        </TabsContent>

        <TabsContent value="team-performance" className="space-y-4">
          <TeamPerformance />
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <BenchmarkControls />
        </TabsContent>
      </Tabs>

      {/* Quick Action Panel */}
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
    </div>
  );
}