import React from "react";
import { Link } from "react-router-dom";
import { Clock, FileText, Award, ClipboardCheck, Plus, AlertCircle, CheckCircle, Calendar, MapPin, User, Phone, Mail, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStudentAssignments, useStudentProgress } from "@/hooks/useStudentPracticum";
import { Skeleton } from "@/components/ui/skeleton";

export default function PracticumDashboard() {
  const { data: assignments, isLoading: assignmentsLoading } = useStudentAssignments();
  const activeAssignment = assignments?.[0]; // For demo, use first assignment
  const { data: progress, isLoading: progressLoading } = useStudentProgress(activeAssignment?.id);

  if (assignmentsLoading || progressLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Submit Attendance",
      description: "Log your daily hours",
      icon: Clock,
      path: "/student/practicum/attendance",
      color: "bg-blue-500",
      count: null
    },
    {
      title: "Weekly Journal",
      description: "Reflect on your learning",
      icon: FileText,
      path: "/student/practicum/journals",
      color: "bg-green-500",
      count: null
    },
    {
      title: "Track Competencies", 
      description: "Log skills practiced",
      icon: Award,
      path: "/student/practicum/competencies",
      color: "bg-purple-500",
      count: progress?.competencies_completed || 0
    },
    {
      title: "Self-Evaluation",
      description: "Complete evaluations",
      icon: ClipboardCheck,
      path: "/student/practicum/evaluations",
      color: "bg-orange-500",
      count: null
    }
  ];

  const pendingItems = [
    { type: 'Attendance', count: 2, status: 'pending' },
    { type: 'Journal', count: 1, status: 'pending' },
    { type: 'Competency', count: 3, status: 'pending' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Practicum Dashboard</h1>
        <p className="text-muted-foreground">
          Central hub for all your practicum submissions and progress tracking
        </p>
      </div>

      {/* Current Assignment Overview */}
      {activeAssignment && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Assignment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Current Practicum Assignment
              </CardTitle>
              <CardDescription>
                {(activeAssignment.practicum_programs as any)?.program_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Site Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{(activeAssignment.practicum_sites as any)?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(activeAssignment.practicum_sites as any)?.address}
                    </p>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Site Contact</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3" />
                      <span>{(activeAssignment.practicum_sites as any)?.contact_person}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      <a href={`mailto:${(activeAssignment.practicum_sites as any)?.contact_email}`} 
                         className="text-primary hover:underline">
                        {(activeAssignment.practicum_sites as any)?.contact_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3" />
                      <a href={`tel:${(activeAssignment.practicum_sites as any)?.contact_phone}`}
                         className="text-primary hover:underline">
                        {(activeAssignment.practicum_sites as any)?.contact_phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Instructor & Preceptor Information */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                    <h4 className="text-sm font-medium text-blue-900">Clinical Instructor</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3 w-3 text-blue-600" />
                        <span className="text-blue-800">{(activeAssignment as any)?.instructor?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-blue-600" />
                        <a href={`mailto:${(activeAssignment as any)?.instructor?.email}`} 
                           className="text-blue-700 hover:underline">
                          {(activeAssignment as any)?.instructor?.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-blue-600" />
                        <a href={`tel:${(activeAssignment as any)?.instructor?.phone}`}
                           className="text-blue-700 hover:underline">
                          {(activeAssignment as any)?.instructor?.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 space-y-2">
                    <h4 className="text-sm font-medium text-green-900">Clinical Preceptor</h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3 w-3 text-green-600" />
                        <span className="text-green-800">{(activeAssignment as any)?.preceptor?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-green-600" />
                        <a href={`mailto:${(activeAssignment as any)?.preceptor?.email}`} 
                           className="text-green-700 hover:underline">
                          {(activeAssignment as any)?.preceptor?.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-green-600" />
                        <a href={`tel:${(activeAssignment as any)?.preceptor?.phone}`}
                           className="text-green-700 hover:underline">
                          {(activeAssignment as any)?.preceptor?.phone}
                        </a>
                      </div>
                      {(activeAssignment as any)?.preceptor?.department && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          {(activeAssignment as any)?.preceptor?.department}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Progress Tracking
              </CardTitle>
              <CardDescription>
                Your current progress toward practicum completion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hours Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Clinical Hours</span>
                  <span className="text-sm text-muted-foreground">
                    {progress?.hours_approved || 0} / {(activeAssignment.practicum_programs as any)?.total_hours_required || 120}
                  </span>
                </div>
                <Progress 
                  value={
                    (activeAssignment.practicum_programs as any)?.total_hours_required 
                      ? ((progress?.hours_approved || 0) / (activeAssignment.practicum_programs as any)?.total_hours_required) * 100 
                      : 0
                  } 
                  className="h-3" 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Hours Attended: {progress?.hours_approved || 0}</span>
                  <span>Hours Left: {((activeAssignment.practicum_programs as any)?.total_hours_required || 120) - (progress?.hours_approved || 0)}</span>
                </div>
              </div>
              
              {/* Competencies Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Competencies</span>
                  <span className="text-sm text-muted-foreground">
                    {progress?.competencies_completed || 0} / {progress?.competencies_required || 15}
                  </span>
                </div>
                <Progress 
                  value={progress?.competencies_required ? (progress.competencies_completed / progress.competencies_required) * 100 : 0} 
                  className="h-3" 
                />
              </div>
              
              {/* Overall Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {progress?.overall_progress || 0}%
                  </span>
                </div>
                <Progress value={progress?.overall_progress || 0} className="h-3" />
                
                {/* Progress Status Badge */}
                <div className="flex justify-center mt-4">
                  {(progress?.overall_progress || 0) >= 100 ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (progress?.overall_progress || 0) >= 75 ? (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <Clock className="h-3 w-3 mr-1" />
                      Near Completion
                    </Badge>
                  ) : (progress?.overall_progress || 0) >= 50 ? (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                      <Clock className="h-3 w-3 mr-1" />
                      Getting Started
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.path} to={action.path}>
            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                  {action.count !== null && (
                    <div className="text-right">
                      <div className="text-2xl font-bold">{action.count}</div>
                      <div className="text-xs text-muted-foreground">completed</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pending Items & Quick Submit */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Approvals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Pending Approvals
            </CardTitle>
            <CardDescription>
              Items waiting for preceptor or instructor review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="font-medium">{item.type}</span>
                    <Badge variant="secondary">{item.count} pending</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Send Reminder
                  </Button>
                </div>
              ))}
              {pendingItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No pending items - great work!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Submit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Submit
            </CardTitle>
            <CardDescription>
              Fast access to common submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/student/practicum/attendance">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Log Today's Hours
              </Button>
            </Link>
            <Link to="/student/practicum/journals">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Weekly Reflection
              </Button>
            </Link>
            <Link to="/student/practicum/competencies">
              <Button className="w-full justify-start" variant="outline">
                <Award className="h-4 w-4 mr-2" />
                Log Competencies
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest practicum submissions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* This would be populated with real recent activity data */}
            <div className="flex items-center gap-4 p-3 rounded-lg border">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Attendance approved</p>
                <p className="text-xs text-muted-foreground">8 hours on Dec 20, 2024</p>
              </div>
              <Badge variant="secondary">Approved</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-lg border">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Weekly journal submitted</p>
                <p className="text-xs text-muted-foreground">Week of Dec 16, 2024</p>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/student/practicum/records">
              <Button variant="outline">View All Records</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}