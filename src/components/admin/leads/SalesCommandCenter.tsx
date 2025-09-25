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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Modern Hero Header with Glass Morphism */}
      <div className="relative overflow-hidden aurora-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
          <div className="container mx-auto px-2 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <div className="relative glass-card p-4 rounded-2xl">
                      <Target className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                      Sales Command Center
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2 font-medium">
                      Real-time monitoring and control of enrollment operations
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="glass-card px-4 py-2 rounded-xl">
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10 px-3 py-1 text-sm font-semibold">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    System Operational
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowBenchmarkDialog(true)} 
                  className="glass-button border-white/30 hover:bg-white/20 px-4 py-2 text-sm font-semibold"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 py-4 space-y-6">


        {/* Critical Issues & Actions - Glass Morphism */}
        <div className="glass-card border border-warning/30 bg-gradient-to-br from-warning/10 via-warning/5 to-transparent backdrop-blur-xl rounded-2xl shadow-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-warning/30 blur-lg rounded-full" />
                <div className="relative glass-card p-3 rounded-2xl">
                  <Zap className="h-7 w-7 text-warning" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Critical Issues Requiring Action</h2>
                <p className="text-muted-foreground mt-1">
                  High-priority items that need immediate attention to maintain performance
                </p>
              </div>
            </div>
            
            <div className="grid gap-3">
              {urgentItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group glass-card p-4 rounded-xl border border-white/20 hover:border-white/40 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`absolute inset-0 blur-md rounded-full ${
                          item.severity === 'critical' ? 'bg-destructive/40' :
                          item.severity === 'high' ? 'bg-warning/40' : 'bg-warning/20'
                        }`} />
                        <div className={`relative w-5 h-5 rounded-full ${
                          item.severity === 'critical' ? 'bg-destructive' :
                          item.severity === 'high' ? 'bg-warning' : 'bg-warning/60'
                        }`} />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
                      </div>
                      
                      <div className="glass-card px-3 py-1 rounded-lg">
                        <Badge variant="secondary" className="text-sm font-bold px-2 py-1">
                          {item.count}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-button border-primary/30 hover:bg-primary/10 hover:border-primary/50 ml-4 px-4 py-2 font-semibold"
                    >
                      {item.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Main Command Center Interface - Glass Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="glass-card p-2 rounded-2xl border border-white/20 backdrop-blur-xl shadow-xl">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-transparent gap-2 h-auto p-0">
              <TabsTrigger 
                value="alert-center" 
                className="group flex flex-col items-center gap-3 py-4 px-4 rounded-xl data-[state=active]:glass-card data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-destructive/30 data-[state=active]:text-destructive data-[state=active]:bg-gradient-to-br data-[state=active]:from-destructive/10 data-[state=active]:to-destructive/5 hover:glass-card hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-destructive/20 blur-md rounded-full group-data-[state=active]:bg-destructive/40" />
                  <div className="relative glass-card p-3 rounded-xl">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">Critical Issues</div>
                  <div className="text-xs text-muted-foreground mt-1">Urgent alerts & escalations</div>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="flash-reports" 
                className="group flex flex-col items-center gap-3 py-4 px-4 rounded-xl data-[state=active]:glass-card data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-primary/30 data-[state=active]:text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-primary/5 hover:glass-card hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-data-[state=active]:bg-primary/40" />
                  <div className="relative glass-card p-3 rounded-xl">
                    <PieChart className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">Pipeline Analytics</div>
                  <div className="text-xs text-muted-foreground mt-1">Real-time metrics & forecasting</div>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="team-performance" 
                className="group flex flex-col items-center gap-3 py-4 px-4 rounded-xl data-[state=active]:glass-card data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-success/30 data-[state=active]:text-success data-[state=active]:bg-gradient-to-br data-[state=active]:from-success/10 data-[state=active]:to-success/5 hover:glass-card hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-success/20 blur-md rounded-full group-data-[state=active]:bg-success/40" />
                  <div className="relative glass-card p-3 rounded-xl">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">Team Dashboard</div>
                  <div className="text-xs text-muted-foreground mt-1">Performance & leaderboards</div>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="workflow-automation" 
                className="group flex flex-col items-center gap-3 py-4 px-4 rounded-xl data-[state=active]:glass-card data-[state=active]:shadow-xl data-[state=active]:border-2 data-[state=active]:border-accent/30 data-[state=active]:text-accent data-[state=active]:bg-gradient-to-br data-[state=active]:from-accent/10 data-[state=active]:to-accent/5 hover:glass-card hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/20 blur-md rounded-full group-data-[state=active]:bg-accent/40" />
                  <div className="relative glass-card p-3 rounded-xl">
                    <Brain className="h-6 w-6" />
                  </div>
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
            <div className="glass-card border border-white/20 backdrop-blur-xl rounded-3xl shadow-2xl">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/30 blur-lg rounded-full" />
                    <div className="relative glass-card p-3 rounded-2xl">
                      <Zap className="h-7 w-7 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Workflow Automation</h2>
                    <p className="text-muted-foreground text-lg mt-1">
                      Automated sequences, lead routing, and task management
                    </p>
                  </div>
                </div>
                
                <div className="glass-card p-12 rounded-2xl border border-white/10 bg-gradient-to-br from-accent/5 to-transparent">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-20 h-20 glass-card rounded-2xl flex items-center justify-center">
                      <Brain className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Automation Hub Coming Soon</h3>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                      Manage lead sequences, auto-assignments, and workflow triggers from a unified interface
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
      </Tabs>

        {/* Benchmark Settings Dialog */}
        <BenchmarkSettingsDialog 
          open={showBenchmarkDialog} 
          onOpenChange={setShowBenchmarkDialog} 
        />
      </div>
    </div>
  );
}