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
import ModernStatsCard from "./ModernStatsCard";

const AdminOverview: React.FC = () => {
  const stats = [
    { 
      title: "Total Students", 
      value: "1,247", 
      change: { value: 12, type: "increase" as const, period: "last month" }, 
      icon: Users, 
      description: "Active enrolled students"
    },
    { 
      title: "Active Programs", 
      value: "24", 
      change: { value: 8, type: "increase" as const, period: "last quarter" }, 
      icon: GraduationCap, 
      description: "Available programs"
    },
    { 
      title: "Pending Documents", 
      value: "89", 
      change: { value: 5, type: "decrease" as const, period: "last week" }, 
      icon: FileCheck, 
      description: "Awaiting review"
    },
    { 
      title: "Upcoming Events", 
      value: "12", 
      change: { value: 25, type: "increase" as const, period: "last month" }, 
      icon: Calendar, 
      description: "Scheduled events"
    },
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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-soft">Export Report</Button>
          <Button className="shadow-soft">Quick Actions</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <ModernStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Program Enrollment */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-primary" />
              Program Enrollment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {programStats.map((program, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{program.name}</span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {program.enrolled}/{program.capacity}
                  </span>
                </div>
                <Progress value={program.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {program.percentage}% capacity
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* At Risk Students */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Students at Risk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {atRiskStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.program} • {student.issue}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                    {student.days} days
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <MessageSquare className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-all duration-200 group">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform"></div>
                  <div>
                    <p className="font-medium text-foreground">{activity.student}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    activity.status === 'completed' ? 'default' :
                    activity.status === 'approved' ? 'secondary' :
                    activity.status === 'pending' ? 'outline' : 'outline'
                  } className="text-xs font-medium">
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