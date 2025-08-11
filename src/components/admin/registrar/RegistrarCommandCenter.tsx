import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { 
  BookOpen,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle,
  Zap,
  FileText,
  Award,
  BarChart3,
  Settings,
  GraduationCap
} from "lucide-react";
import { RegistrarFlashReports } from "./command-center/RegistrarFlashReports";
import { RegistrarAlertCenter } from "./command-center/RegistrarAlertCenter";
import { RegistrarTeamPerformance } from "./command-center/RegistrarTeamPerformance";
import { RegistrarBenchmarkSettings } from "./command-center/RegistrarBenchmarkSettings";

export function RegistrarCommandCenter() {
  const [activeTab, setActiveTab] = useState("alert-center");
  const [criticalAlerts, setCriticalAlerts] = useState(8);
  const [showBenchmarkDialog, setShowBenchmarkDialog] = useState(false);
  
  // Mock data for demo
  const commandCenterStats = {
    applicationsToday: 47,
    documentsReviewed: 89,
    approvalsIssued: 23,
    enrollmentConfirmations: 15,
    pendingDocuments: 34,
    slaViolations: 3,
    complianceScore: 94,
    avgProcessingTime: 2.4
  };

  const urgentItems = [
    {
      id: 1,
      type: "document_missing",
      title: "Missing Critical Documents",
      description: "5 applications missing transcripts (deadline tomorrow)",
      severity: "critical",
      count: 5,
      action: "Contact students"
    },
    {
      id: 2,
      type: "sla_violation",
      title: "Processing Time Exceeded",
      description: "Applications exceed 72-hour processing SLA",
      severity: "high",
      count: 3,
      action: "Assign to reviewer"
    },
    {
      id: 3,
      type: "payment_pending",
      title: "Tuition Payment Overdue",
      description: "Enrollment at risk for payment delays",
      severity: "medium",
      count: 7,
      action: "Send payment reminder"
    },
    {
      id: 4,
      type: "compliance_alert",
      title: "Compliance Deadline",
      description: "Regulatory reporting due in 2 days",
      severity: "high",
      count: 1,
      action: "Generate report"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Registrar Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring and control of registration operations
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

      {/* Immediate Actions Required */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Zap className="h-5 w-5" />
            Immediate Actions Required
          </CardTitle>
          <CardDescription className="text-amber-700">
            Items that need immediate attention to maintain registration flow
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
          <FileText className="h-4 w-4" />
          {commandCenterStats.pendingDocuments} Pending docs
        </Badge>
        {/* Current Targets */}
        <Badge variant="secondary" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Processing: 72h SLA
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Compliance: {commandCenterStats.complianceScore}%
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Daily: 50 apps target
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
                <div className="font-semibold text-sm">Registration Analytics</div>
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
          <RegistrarFlashReports />
        </TabsContent>

        <TabsContent value="alert-center" className="space-y-4">
          <RegistrarAlertCenter />
        </TabsContent>

        <TabsContent value="team-performance" className="space-y-4">
          <RegistrarTeamPerformance />
        </TabsContent>

        <TabsContent value="workflow-automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Registration Automation
              </CardTitle>
              <CardDescription>
                Automated document processing, approval workflows, and compliance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Automation hub coming soon...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Manage document workflows, auto-approvals, and compliance triggers
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Benchmark Settings Dialog */}
      <RegistrarBenchmarkSettings 
        open={showBenchmarkDialog} 
        onOpenChange={setShowBenchmarkDialog} 
      />
    </div>
  );
}