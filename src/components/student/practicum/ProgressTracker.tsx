import React from "react";
import { ArrowLeft, TrendingUp, Clock, Award, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useStudentAssignments, useStudentProgress, useStudentRecords } from "@/hooks/useStudentPracticum";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressTracker() {
  const { data: assignments, isLoading: assignmentsLoading } = useStudentAssignments();
  const activeAssignment = assignments?.[0];
  const { data: progress, isLoading: progressLoading } = useStudentProgress(activeAssignment?.id);
  const { data: records, isLoading: recordsLoading } = useStudentRecords(activeAssignment?.id);

  if (assignmentsLoading || progressLoading || recordsLoading) {
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

  const totalHoursProgress = progress?.hours_required ? 
    (progress.hours_approved / progress.hours_required) * 100 : 0;
  
  const competencyProgress = progress?.competencies_required ? 
    (progress.competencies_completed / progress.competencies_required) * 100 : 0;

  const recentAttendance = records?.attendance.slice(0, 5) || [];
  const recentJournals = records?.journals.slice(0, 3) || [];
  const recentCompetencies = records?.competencies.slice(0, 5) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/student/practicum">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progress Tracker</h1>
          <p className="text-muted-foreground">Monitor your practicum completion and performance</p>
        </div>
      </div>

      {/* Current Assignment Info */}
      {activeAssignment && (
        <Card>
          <CardHeader>
            <CardTitle>Current Practicum Assignment</CardTitle>
            <CardDescription>
              {(activeAssignment.practicum_programs as any)?.program_name} • {(activeAssignment.practicum_sites as any)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <p className="text-lg">{new Date(activeAssignment.start_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">End Date</p>
                <p className="text-lg">{new Date(activeAssignment.end_date).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{progress?.hours_approved || 0}</p>
                <p className="text-xs text-muted-foreground">of {progress?.hours_required || 0} required</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={totalHoursProgress} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(totalHoursProgress)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Competencies</p>
                <p className="text-2xl font-bold">{progress?.competencies_completed || 0}</p>
                <p className="text-xs text-muted-foreground">of {progress?.competencies_required || 0} required</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={competencyProgress} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(competencyProgress)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Items</p>
                <p className="text-2xl font-bold">{progress?.forms_pending || 0}</p>
                <p className="text-xs text-muted-foreground">awaiting approval</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{progress?.overall_progress || 0}%</p>
                <p className="text-xs text-muted-foreground">completion rate</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={progress?.overall_progress || 0} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.length > 0 ? (
                recentAttendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <p className="text-sm font-medium">{new Date(record.date).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">{record.total_hours} hours</p>
                      </div>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No attendance records yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Competencies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Competencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCompetencies.length > 0 ? (
                recentCompetencies.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(record.completion_status)}
                      <div>
                        <p className="text-sm font-medium">
                          Competency {record.competency_id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(record.completion_status)}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No competency records yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Journals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Journals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentJournals.length > 0 ? (
              recentJournals.map((journal) => (
                <div key={journal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(journal.status)}
                    <div>
                      <p className="text-sm font-medium">
                        Week of {new Date(journal.week_of).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {journal.learning_objectives.length} learning objectives
                      </p>
                      {journal.instructor_feedback && (
                        <p className="text-xs text-blue-600 mt-1">Feedback received</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(journal.status === 'reviewed' ? 'approved' : 'pending')}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No journal entries yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Strengths</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {totalHoursProgress >= 75 && <li>• Excellent attendance record</li>}
                {competencyProgress >= 50 && <li>• Good competency completion rate</li>}
                {(progress?.forms_pending || 0) <= 2 && <li>• Staying on top of submissions</li>}
                <li>• Consistent journal reflections</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">Areas to Focus</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {totalHoursProgress < 50 && <li>• Increase daily hour submissions</li>}
                {competencyProgress < 30 && <li>• Focus on competency completion</li>}
                {(progress?.forms_pending || 0) > 3 && <li>• Follow up on pending approvals</li>}
                <li>• Set weekly learning goals</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}