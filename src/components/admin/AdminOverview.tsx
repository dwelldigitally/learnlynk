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
import { useConditionalStudents } from "@/hooks/useConditionalStudents";
import { useConditionalCommunications } from "@/hooks/useConditionalCommunications";
import { useConditionalDocuments } from "@/hooks/useConditionalDocuments";
import { ConditionalDataWrapper } from "./ConditionalDataWrapper";

const AdminOverview: React.FC = () => {
  const { data: students, isLoading: loadingStudents, showEmptyState: studentsEmpty, hasDemoAccess, hasRealData } = useConditionalStudents();
  const { data: communications, isLoading: loadingComms } = useConditionalCommunications();
  const { data: documents, isLoading: loadingDocs } = useConditionalDocuments();

  const stats = [
    { 
      title: "Total Students", 
      value: students.length.toString(), 
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
      value: documents.filter(d => d.status === 'pending').length.toString(), 
      change: { value: 5, type: "decrease" as const, period: "last week" }, 
      icon: FileCheck, 
      description: "Awaiting review"
    },
    { 
      title: "Recent Communications", 
      value: communications.length.toString(), 
      change: { value: 25, type: "increase" as const, period: "last month" }, 
      icon: Calendar, 
      description: "Active communications"
    },
  ];

  // Get recent activity from communications
  const recentActivity = communications.slice(0, 5).map(comm => ({
    student: comm.studentId || "Student",
    action: `${comm.type}: ${comm.subject}`,
    time: new Date(comm.sentAt || Date.now()).toLocaleDateString(),
    status: comm.status
  }));

  // Program stats based on students data
  const programStats = students.reduce((acc: any[], student) => {
    const existing = acc.find(p => p.name === student.program);
    if (existing) {
      existing.enrolled++;
    } else {
      acc.push({
        name: student.program,
        enrolled: 1,
        capacity: 100, // Default capacity
        percentage: 0
      });
    }
    return acc;
  }, []).map(p => ({
    ...p,
    percentage: Math.round((p.enrolled / p.capacity) * 100)
  }));

  // At-risk students from students data
  const atRiskStudents = students.filter(s => s.riskLevel === 'high').slice(0, 3).map(student => ({
    name: `${student.firstName} ${student.lastName}`,
    program: student.program,
    issue: "Requires attention",
    days: Math.floor(Math.random() * 14) + 1
  }));

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
            <ConditionalDataWrapper
              isLoading={loadingStudents}
              showEmptyState={studentsEmpty}
              hasDemoAccess={hasDemoAccess}
              hasRealData={hasRealData}
              emptyTitle="No Programs Available"
              emptyDescription="Add students to see program enrollment statistics."
              loadingRows={3}
            >
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
            </ConditionalDataWrapper>
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
            <ConditionalDataWrapper
              isLoading={loadingStudents}
              showEmptyState={studentsEmpty}
              hasDemoAccess={hasDemoAccess}
              hasRealData={hasRealData}
              emptyTitle="No At-Risk Students"
              emptyDescription="Students requiring attention will appear here."
              loadingRows={3}
            >
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
            </ConditionalDataWrapper>
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
          <ConditionalDataWrapper
            isLoading={loadingComms}
            showEmptyState={recentActivity.length === 0 && !loadingComms}
            hasDemoAccess={hasDemoAccess}
            hasRealData={hasRealData}
            emptyTitle="No Recent Activity"
            emptyDescription="Student communications and activities will appear here."
            loadingRows={5}
          >
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
                      activity.status === 'completed' || activity.status === 'sent' ? 'default' :
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
          </ConditionalDataWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;