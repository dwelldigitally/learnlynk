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
  CheckCircle,
  Zap,
  Award,
  Settings,
  Bot,
  UserCheck,
  Brain,
  Activity,
  Shield,
  PieChart,
  MessageSquare
} from "lucide-react";
import { FlashReports } from "./command-center/FlashReports";
import { AlertCenter } from "./command-center/AlertCenter";
import { TeamPerformance } from "./command-center/TeamPerformance";
import { BenchmarkSettingsDialog } from "./command-center/BenchmarkSettingsDialog";
import { useBenchmarkSettings } from "@/hooks/useBenchmarkSettings";

export function SalesCommandCenter() {
  const [activeTab, setActiveTab] = useState("alert-center");
  const [showBenchmarkDialog, setShowBenchmarkDialog] = useState(false);
  const { settings } = useBenchmarkSettings();


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