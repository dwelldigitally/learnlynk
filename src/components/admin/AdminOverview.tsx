import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GraduationCap, 
  FileCheck, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  MessageSquare,
  Eye
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AdminOverview: React.FC = () => {
  const stats = [
    { title: "Total Students", value: "1,247", change: "+12%", icon: Users, color: "text-blue-600" },
    { title: "Active Programs", value: "24", change: "+2", icon: GraduationCap, color: "text-green-600" },
    { title: "Pending Documents", value: "89", change: "-5%", icon: FileCheck, color: "text-orange-600" },
    { title: "Upcoming Events", value: "12", change: "+3", icon: Calendar, color: "text-purple-600" },
  ];

  const recentActivity = [
    { student: "Sarah Johnson", action: "Submitted HCA application", time: "2 minutes ago", status: "pending" },
    { student: "Michael Chen", action: "Payment completed - ECE Program", time: "15 minutes ago", status: "completed" },
    { student: "Emma Davis", action: "Document approved - Transcript", time: "1 hour ago", status: "approved" },
    { student: "James Wilson", action: "Registered for Info Session", time: "2 hours ago", status: "registered" },
    { student: "Lisa Brown", action: "Application submitted - Aviation", time: "3 hours ago", status: "pending" },
  ];

  const programStats = [
    { name: "Health Care Assistant", enrolled: 245, capacity: 280, percentage: 87 },
    { name: "Early Childhood Education", enrolled: 156, capacity: 180, percentage: 87 },
    { name: "Aviation Maintenance", enrolled: 89, capacity: 120, percentage: 74 },
    { name: "Education Assistant", enrolled: 67, capacity: 80, percentage: 84 },
  ];

  const atRiskStudents = [
    { name: "Alex Thompson", program: "HCA", issue: "No documents uploaded", days: 7 },
    { name: "Maria Rodriguez", program: "ECE", issue: "Payment overdue", days: 3 },
    { name: "David Kim", program: "Aviation", issue: "No response to emails", days: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button>Quick Actions</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Enrollment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Program Enrollment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {programStats.map((program, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{program.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {program.enrolled}/{program.capacity}
                  </span>
                </div>
                <Progress value={program.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* At Risk Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Students at Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {atRiskStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.program} • {student.issue}</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive">{student.days} days</Badge>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-medium">{activity.student}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    activity.status === 'completed' ? 'default' :
                    activity.status === 'approved' ? 'secondary' :
                    activity.status === 'pending' ? 'outline' : 'outline'
                  }>
                    {activity.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;