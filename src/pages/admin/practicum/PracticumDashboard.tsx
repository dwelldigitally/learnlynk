import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  MapPin, 
  Clock, 
  FileText, 
  Users, 
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Award
} from 'lucide-react';
import { usePracticumOverview } from '@/hooks/usePracticum';
import { useAuth } from '@/contexts/AuthContext';

export function PracticumDashboard() {
  const { session } = useAuth();
  const { data: overview, isLoading } = usePracticumOverview(session?.user?.id || '');

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Ready to End",
      count: overview?.ready_to_end?.length || 0,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Practicum placements ending soon"
    },
    {
      title: "Ready to Begin", 
      count: overview?.ready_to_begin?.length || 0,
      icon: <Calendar className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Students starting practicum soon"
    },
    {
      title: "Missing Documents",
      count: overview?.missing_documents?.length || 0,
      icon: <FileText className="h-4 w-4" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Students with incomplete documentation"
    },
    {
      title: "Pending Approvals",
      count: overview?.pending_approvals?.length || 0,
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Records awaiting review"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Practicum Management</h1>
          <p className="text-muted-foreground">Monitor student placements and progress</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Assign Students
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-md ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Views */}
      <Tabs defaultValue="ready-to-end" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ready-to-end">Ready to End</TabsTrigger>
          <TabsTrigger value="ready-to-begin">Ready to Begin</TabsTrigger>
          <TabsTrigger value="missing-docs">Missing Documents</TabsTrigger>
          <TabsTrigger value="pending-approvals">Pending Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="ready-to-end" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Students Ready to Complete Practicum
              </CardTitle>
              <CardDescription>
                Practicum placements ending within the next 2 weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overview?.ready_to_end?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No students ready to complete practicum</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {overview?.ready_to_end?.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {assignment.leads?.first_name} {assignment.leads?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {assignment.practicum_programs?.program_name} • {assignment.practicum_sites?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ends: {new Date(assignment.end_date!).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={assignment.completion_percentage || 0} className="w-20" />
                        <Badge variant="outline">{assignment.completion_percentage || 0}%</Badge>
                        <Button size="sm" variant="outline">
                          View Progress
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ready-to-begin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Students Ready to Begin Practicum
              </CardTitle>
              <CardDescription>
                Students starting practicum within the next week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overview?.ready_to_begin?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No students starting practicum soon</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {overview?.ready_to_begin?.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {assignment.leads?.first_name} {assignment.leads?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {assignment.practicum_programs?.program_name} • {assignment.practicum_sites?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Starts: {new Date(assignment.start_date!).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{assignment.status}</Badge>
                        <Button size="sm">
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missing-docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Students with Missing Documents
              </CardTitle>
              <CardDescription>
                Students who haven't submitted required documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Document tracking coming soon</p>
                <p className="text-xs">This feature will be available in the next update</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Records Pending Approval
              </CardTitle>
              <CardDescription>
                Student submissions awaiting instructor or admin review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overview?.pending_approvals?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending approvals</p>
                  <p className="text-xs">All records are up to date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {overview?.pending_approvals?.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {record.practicum_assignments?.leads?.first_name} {record.practicum_assignments?.leads?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.competency_name} • {record.practicum_assignments?.practicum_sites?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(record.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={record.final_status === 'pending' ? 'destructive' : 'secondary'}>
                          {record.final_status}
                        </Badge>
                        <Button size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}