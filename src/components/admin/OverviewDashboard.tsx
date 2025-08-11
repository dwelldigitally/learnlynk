import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Target,
  Activity
} from "lucide-react";

export function OverviewDashboard() {
  const todayStats = {
    newLeads: 12,
    pendingApplications: 8,
    overduePayments: 3,
    scheduledMeetings: 5,
    emailsSent: 45,
    conversionRate: 23.5
  };

  const recentActivity = [
    { type: "lead", message: "New lead: Sarah Johnson applied for MBA program", time: "5 min ago" },
    { type: "payment", message: "Payment received from John Doe - $2,500", time: "12 min ago" },
    { type: "task", message: "Follow-up task completed for Biology intake", time: "25 min ago" },
    { type: "meeting", message: "Scheduled consultation with Jane Smith", time: "1 hour ago" }
  ];

  const urgentTasks = [
    { title: "Review pending applications", count: 8, priority: "high" },
    { title: "Follow up on overdue payments", count: 3, priority: "urgent" },
    { title: "Prepare for intake meeting", count: 1, priority: "medium" },
    { title: "Update student records", count: 12, priority: "low" }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Overview</h1>
          <p className="text-muted-foreground">Here's what needs your attention today</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">New Leads Today</p>
                <p className="text-2xl font-bold text-foreground">{todayStats.newLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Applications</p>
                <p className="text-2xl font-bold text-foreground">{todayStats.pendingApplications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue Items</p>
                <p className="text-2xl font-bold text-foreground">{todayStats.overduePayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">{todayStats.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Urgent Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'urgent' ? 'bg-red-500' :
                    task.priority === 'high' ? 'bg-orange-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
                <Badge variant="secondary">{task.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'lead' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                  activity.type === 'task' ? 'bg-orange-100 text-orange-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {activity.type === 'lead' && <Users className="h-4 w-4" />}
                  {activity.type === 'payment' && <CheckCircle2 className="h-4 w-4" />}
                  {activity.type === 'task' && <Clock className="h-4 w-4" />}
                  {activity.type === 'meeting' && <Mail className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}