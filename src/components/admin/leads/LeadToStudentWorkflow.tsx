import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadHandoverQueue } from "./LeadHandoverQueue";
import { LeadWorkflowAutomation } from "./LeadWorkflowAutomation";
import { TeamCapacityDashboard } from "../TeamCapacityDashboard";
import { AdvancedRoutingEngine } from "../AdvancedRoutingEngine";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Users, 
  GraduationCap, 
  Zap, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export function LeadToStudentWorkflow() {
  const [activeView, setActiveView] = useState<'overview' | 'queue' | 'automation' | 'capacity' | 'routing'>('overview');

  const workflowStats = {
    totalLeads: 1247,
    qualifiedLeads: 89,
    readyForConversion: 23,
    studentsCreated: 156,
    conversionRate: 12.5,
    averageTimeToConvert: 14,
    automationRules: 4,
    activeAutomations: 3
  };

  if (activeView === 'queue') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className="text-sm"
          >
            ← Back to Workflow Overview
          </Button>
        </div>
        <LeadHandoverQueue />
      </div>
    );
  }

  if (activeView === 'automation') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className="text-sm"
          >
            ← Back to Workflow Overview
          </Button>
        </div>
        <LeadWorkflowAutomation />
      </div>
    );
  }

  if (activeView === 'capacity') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className="text-sm"
          >
            ← Back to Workflow Overview
          </Button>
        </div>
        <TeamCapacityDashboard />
      </div>
    );
  }

  if (activeView === 'routing') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setActiveView('overview')}
            className="text-sm"
          >
            ← Back to Workflow Overview
          </Button>
        </div>
        <AdvancedRoutingEngine />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Lead-to-Student Workflow</h2>
          <p className="text-sm text-muted-foreground">
            Manage the transition process from qualified leads to enrolled students
          </p>
        </div>
      </div>

      {/* Workflow Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold text-foreground">{workflowStats.totalLeads}</p>
              <p className="text-xs text-muted-foreground">In pipeline</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Ready for Conversion</p>
              <p className="text-2xl font-bold text-foreground">{workflowStats.readyForConversion}</p>
              <p className="text-xs text-muted-foreground">Qualified leads</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <GraduationCap className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Students Created</p>
              <p className="text-2xl font-bold text-foreground">{workflowStats.studentsCreated}</p>
              <p className="text-xs text-green-600">+{workflowStats.conversionRate}% this month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-foreground">{workflowStats.conversionRate}%</p>
              <p className="text-xs text-muted-foreground">Lead to student</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Process Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Workflow Process Overview
          </CardTitle>
          <CardDescription>
            Visual representation of the lead-to-student conversion process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-foreground">Lead Generation</h3>
              <p className="text-sm text-muted-foreground">{workflowStats.totalLeads} leads</p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">Active</Badge>
            </div>
            
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-medium text-foreground">Qualification</h3>
              <p className="text-sm text-muted-foreground">{workflowStats.qualifiedLeads} qualified</p>
              <Badge className="mt-2 bg-yellow-100 text-yellow-800">Processing</Badge>
            </div>
            
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium text-foreground">Ready for Handover</h3>
              <p className="text-sm text-muted-foreground">{workflowStats.readyForConversion} ready</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Ready</Badge>
            </div>
            
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium text-foreground">Student Creation</h3>
              <p className="text-sm text-muted-foreground">{workflowStats.studentsCreated} students</p>
              <Badge className="mt-2 bg-purple-100 text-purple-800">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('queue')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Handover Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{workflowStats.readyForConversion}</p>
                <p className="text-xs text-muted-foreground">Ready for conversion</p>
              </div>
              <Button size="sm" className="w-full" onClick={() => setActiveView('queue')}>
                Manage Queue
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('automation')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-blue-600" />
              Automation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{workflowStats.activeAutomations}</p>
                <p className="text-xs text-muted-foreground">Active rules</p>
              </div>
              <Button size="sm" className="w-full" onClick={() => setActiveView('automation')}>
                Manage Rules
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('capacity')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-purple-600" />
              Team Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">78%</p>
                <p className="text-xs text-muted-foreground">Utilization rate</p>
              </div>
              <Button size="sm" className="w-full" onClick={() => setActiveView('capacity')}>
                View Capacity
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('routing')}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              Smart Routing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">89%</p>
                <p className="text-xs text-muted-foreground">Assignment accuracy</p>
              </div>
              <Button size="sm" className="w-full" onClick={() => setActiveView('routing')}>
                Configure Rules
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Workflow Activity</CardTitle>
          <CardDescription>Latest lead conversions and automation executions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Lead converted to student</p>
                <p className="text-xs text-muted-foreground">John Smith → Student ID: BSC240108</p>
              </div>
              <span className="text-xs text-muted-foreground">2 minutes ago</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Zap className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Automation rule executed</p>
                <p className="text-xs text-muted-foreground">High-Score Lead Conversion processed 3 leads</p>
              </div>
              <span className="text-xs text-muted-foreground">15 minutes ago</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Manual review required</p>
                <p className="text-xs text-muted-foreground">Lead qualification needs verification for 2 leads</p>
              </div>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}