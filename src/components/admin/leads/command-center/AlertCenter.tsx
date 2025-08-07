import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  UserX, 
  Bell,
  CheckCircle,
  XCircle,
  Brain,
  Flag,
  Mail,
  Phone,
  MessageSquare,
  Calendar
} from "lucide-react";

export function AlertCenter() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const alerts = {
    critical: [
      {
        id: "crit-1",
        type: "payment_failure",
        title: "Payment Processing Failed",
        description: "Student payment for Masters Program requires immediate attention",
        studentName: "Sarah Johnson",
        program: "MBA - Finance",
        timeAgo: "5 minutes ago",
        actions: ["Contact Finance", "Retry Payment", "Escalate"]
      },
      {
        id: "crit-2",
        type: "high_value_unresponded",
        title: "High-Value Lead Unresponded",
        description: "Premium program lead (£45K value) awaiting response for 48+ hours",
        studentName: "Michael Chen",
        program: "Executive MBA",
        timeAgo: "2 hours ago",
        actions: ["Assign to Senior Advisor", "Schedule Call", "Send Priority Email"]
      }
    ],
    slaViolations: [
      {
        id: "sla-1",
        type: "response_time",
        title: "Response Time SLA Breach",
        description: "First response exceeded 24-hour SLA",
        leads: 8,
        avgOverage: "14 hours",
        actions: ["Auto-assign", "Escalate to Manager", "AI Response"]
      },
      {
        id: "sla-2",
        type: "follow_up",
        title: "Follow-up SLA Violation",
        description: "Follow-up communications overdue by 2+ days",
        leads: 12,
        avgOverage: "3.2 days",
        actions: ["Bulk Follow-up", "Reassign", "Template Send"]
      }
    ],
    unassigned: [
      {
        id: "una-1",
        type: "high_priority",
        title: "Unassigned High-Priority Leads",
        description: "Premium program applications without advisor assignment",
        count: 5,
        totalValue: "£180K",
        programs: ["MBA", "Executive Programs", "Masters"],
        actions: ["Auto-assign", "Round Robin", "Manual Review"]
      },
      {
        id: "una-2",
        type: "international",
        title: "International Leads Pending",
        description: "Overseas applications requiring specialist attention",
        count: 8,
        countries: ["USA", "Canada", "Australia", "UAE"],
        actions: ["Assign Specialist", "Schedule Timezone Call", "Send Information Pack"]
      }
    ],
    noFollowUp: [
      {
        id: "nfu-1",
        type: "qualified_stale",
        title: "Qualified Leads - No Recent Contact",
        description: "Qualified leads with no communication in 7+ days",
        count: 23,
        avgDaysSince: 12,
        riskLevel: "Medium",
        actions: ["Re-engagement Campaign", "Phone Outreach", "Assign to AI"]
      },
      {
        id: "nfu-2",
        type: "application_incomplete",
        title: "Incomplete Applications Stalled",
        description: "Applications started but not completed for 14+ days",
        count: 31,
        avgCompletion: "65%",
        riskLevel: "High",
        actions: ["Reminder Campaign", "Document Assistance", "Phone Support"]
      }
    ]
  };

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'slaViolations': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'unassigned': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'noFollowUp': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      case 'slaViolations': return <Clock className="h-5 w-5" />;
      case 'unassigned': return <UserX className="h-5 w-5" />;
      case 'noFollowUp': return <Bell className="h-5 w-5" />;
      default: return <Flag className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <p className="text-xl font-bold text-red-900">{alerts.critical.length}</p>
              <p className="text-xs text-red-700">Critical Issues</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="flex items-center p-4">
            <Clock className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-xl font-bold text-orange-900">
                {alerts.slaViolations.reduce((sum, alert) => sum + (alert.leads || 0), 0)}
              </p>
              <p className="text-xs text-orange-700">SLA Violations</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="flex items-center p-4">
            <UserX className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-xl font-bold text-yellow-900">
                {alerts.unassigned.reduce((sum, alert) => sum + alert.count, 0)}
              </p>
              <p className="text-xs text-yellow-700">Unassigned</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="flex items-center p-4">
            <Bell className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-xl font-bold text-blue-900">
                {alerts.noFollowUp.reduce((sum, alert) => sum + alert.count, 0)}
              </p>
              <p className="text-xs text-blue-700">No Follow-up</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Categories */}
      <Tabs defaultValue="critical" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="critical" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Critical
          </TabsTrigger>
          <TabsTrigger value="sla" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            SLA Violations
          </TabsTrigger>
          <TabsTrigger value="unassigned" className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            Unassigned
          </TabsTrigger>
          <TabsTrigger value="followup" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            No Follow-up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="critical" className="space-y-4">
          {alerts.critical.map((alert) => (
            <Card key={alert.id} className="border-red-200 bg-red-50/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-red-900 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {alert.title}
                  </CardTitle>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <CardDescription className="text-red-700">{alert.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-red-900">{alert.studentName}</p>
                    <p className="text-xs text-red-700">{alert.program}</p>
                    <p className="text-xs text-red-600">{alert.timeAgo}</p>
                  </div>
                  <div className="flex gap-2">
                    {alert.actions.map((action, index) => (
                      <Button key={index} size="sm" variant="outline" className="text-red-700 border-red-300">
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sla" className="space-y-4">
          {alerts.slaViolations.map((alert) => (
            <Card key={alert.id} className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-orange-900 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {alert.title}
                  </CardTitle>
                  <Badge className="bg-orange-100 text-orange-800">{alert.leads} Leads</Badge>
                </div>
                <CardDescription className="text-orange-700">{alert.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-orange-900">
                      Average Overage: {alert.avgOverage}
                    </p>
                    <p className="text-xs text-orange-700">Affecting {alert.leads} leads</p>
                  </div>
                  <div className="flex gap-2">
                    {alert.actions.map((action, index) => (
                      <Button key={index} size="sm" variant="outline" className="text-orange-700 border-orange-300">
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="unassigned" className="space-y-4">
          {alerts.unassigned.map((alert) => (
            <Card key={alert.id} className="border-yellow-200 bg-yellow-50/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-yellow-900 flex items-center gap-2">
                    <UserX className="h-5 w-5" />
                    {alert.title}
                  </CardTitle>
                  <Badge className="bg-yellow-100 text-yellow-800">{alert.count} Leads</Badge>
                </div>
                <CardDescription className="text-yellow-700">{alert.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-yellow-900">
                      Total Value: {alert.totalValue || `${alert.count} leads`}
                    </p>
                    <p className="text-xs text-yellow-700">
                      {alert.programs ? `Programs: ${alert.programs.join(', ')}` : 
                       alert.countries ? `Countries: ${alert.countries.join(', ')}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {alert.actions.map((action, index) => (
                      <Button key={index} size="sm" variant="outline" className="text-yellow-700 border-yellow-300">
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="followup" className="space-y-4">
          {alerts.noFollowUp.map((alert) => (
            <Card key={alert.id} className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-900 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {alert.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className="bg-blue-100 text-blue-800">{alert.count} Leads</Badge>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      {alert.riskLevel} Risk
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-blue-700">{alert.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                      Avg Days Since Contact: {alert.avgDaysSince || 'N/A'}
                    </p>
                    <p className="text-xs text-blue-700">
                      {alert.avgCompletion ? `Avg Completion: ${alert.avgCompletion}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {alert.actions.map((action, index) => (
                      <Button key={index} size="sm" variant="outline" className="text-blue-700 border-blue-300">
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}