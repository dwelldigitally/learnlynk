import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent } from "@/components/ui/card";
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
import { PageHeader } from "@/components/modern/PageHeader";
import { ModernCard } from "@/components/modern/ModernCard";
import { InfoBadge } from "@/components/modern/InfoBadge";

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Sales Command Center"
        subtitle="Real-time monitoring and control of enrollment operations"
      />

      <div className="mb-6 flex justify-end gap-3">
        <InfoBadge variant="success">
          <CheckCircle className="h-3 w-3 mr-1.5" />
          System Operational
        </InfoBadge>
        <Button 
          variant="outline"
          onClick={() => setShowBenchmarkDialog(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure Settings
        </Button>
      </div>

      {/* Critical Issues & Actions */}
      <ModernCard className="border-warning/30 bg-warning/5 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-warning-light flex items-center justify-center">
              <Zap className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Critical Issues Requiring Action</h2>
              <p className="text-sm text-muted-foreground">
                High-priority items that need immediate attention
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {urgentItems.map((item) => (
              <ModernCard key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full ${
                        item.severity === 'critical' ? 'bg-destructive' :
                        item.severity === 'high' ? 'bg-warning' : 'bg-warning/60'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      
                      <InfoBadge variant="secondary">
                        {item.count}
                      </InfoBadge>
                    </div>
                    
                    <Button size="sm" variant="outline">
                      {item.action}
                    </Button>
                  </div>
                </CardContent>
              </ModernCard>
            ))}
          </div>
        </CardContent>
      </ModernCard>
      {/* Main Command Center Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-card border shadow-sm rounded-lg p-1">
          <TabsTrigger 
            value="alert-center" 
            className="flex flex-col items-center gap-2 py-3 px-2 rounded-md"
          >
            <AlertTriangle className="h-5 w-5" />
            <div className="text-center">
              <div className="font-semibold text-xs">Critical Issues</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="flash-reports" 
            className="flex flex-col items-center gap-2 py-3 px-2 rounded-md"
          >
            <PieChart className="h-5 w-5" />
            <div className="text-center">
              <div className="font-semibold text-xs">Pipeline Analytics</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="team-performance" 
            className="flex flex-col items-center gap-2 py-3 px-2 rounded-md"
          >
            <Award className="h-5 w-5" />
            <div className="text-center">
              <div className="font-semibold text-xs">Team Dashboard</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="workflow-automation" 
            className="flex flex-col items-center gap-2 py-3 px-2 rounded-md"
          >
            <Brain className="h-5 w-5" />
            <div className="text-center">
              <div className="font-semibold text-xs">AI Automation</div>
            </div>
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

        <TabsContent value="workflow-automation" className="space-y-4">
          <ModernCard>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Workflow Automation</h2>
                  <p className="text-sm text-muted-foreground">
                    Automated sequences, lead routing, and task management
                  </p>
                </div>
              </div>
              
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <div className="mx-auto w-16 h-16 rounded-lg bg-accent-light flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Automation Hub Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Manage lead sequences, auto-assignments, and workflow triggers from a unified interface
                </p>
              </div>
            </CardContent>
          </ModernCard>
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