import React, { useState } from "react";
import { ArrowLeft, Filter, Calendar, Clock, Award, FileText, Eye, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStudentAssignments, useStudentRecords, useSendReminder } from "@/hooks/useStudentPracticum";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecordsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { data: assignments } = useStudentAssignments();
  const activeAssignment = assignments?.[0];
  const { data: records, isLoading } = useStudentRecords(activeAssignment?.id);
  const sendReminder = useSendReminder();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const filterRecords = (recordList: any[]) => {
    return recordList.filter(record => {
      const matchesSearch = searchTerm === "" || 
        JSON.stringify(record).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || record.status === statusFilter || 
        record.completion_status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const handleSendReminder = async (recordId: string) => {
    try {
      await sendReminder.mutateAsync(recordId);
    } catch (error) {
      console.error('Failed to send reminder:', error);
    }
  };

  const RecordDetailDialog = ({ record, trigger }: { record: any; trigger: React.ReactNode }) => (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record Details</DialogTitle>
          <DialogDescription>
            Submitted on {new Date(record.created_at).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {record.total_hours && (
            <div>
              <h4 className="font-medium">Time Details</h4>
              <p className="text-sm text-muted-foreground">
                {record.time_in} - {record.time_out} ({record.total_hours} hours)
              </p>
            </div>
          )}
          
          {record.activities && (
            <div>
              <h4 className="font-medium">Activities</h4>
              <p className="text-sm text-muted-foreground">{record.activities}</p>
            </div>
          )}
          
          {record.reflection_content && (
            <div>
              <h4 className="font-medium">Reflection</h4>
              <p className="text-sm text-muted-foreground">{record.reflection_content}</p>
            </div>
          )}
          
          {record.learning_objectives && (
            <div>
              <h4 className="font-medium">Learning Objectives</h4>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {record.learning_objectives.map((objective: string, index: number) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          )}
          
          {record.preceptor_notes && (
            <div>
              <h4 className="font-medium">Preceptor Notes</h4>
              <p className="text-sm text-muted-foreground">{record.preceptor_notes}</p>
            </div>
          )}
          
          {record.instructor_feedback && (
            <div>
              <h4 className="font-medium">Instructor Feedback</h4>
              <p className="text-sm text-muted-foreground">{record.instructor_feedback}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

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
          <h1 className="text-3xl font-bold tracking-tight">My Records</h1>
          <p className="text-muted-foreground">View all your practicum submissions and their status</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Records Tabs */}
      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="journals" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Journals
          </TabsTrigger>
          <TabsTrigger value="competencies" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Competencies
          </TabsTrigger>
          <TabsTrigger value="evaluations" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Evaluations
          </TabsTrigger>
        </TabsList>

        {/* Attendance Records */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Your submitted daily hours and their approval status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filterRecords(records?.attendance || []).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.time_in} - {record.time_out} • {record.total_hours} hours
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {record.activities}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(record.status)}
                      <RecordDetailDialog
                        record={record}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        }
                      />
                      {record.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendReminder(record.id)}
                          disabled={sendReminder.isPending}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Remind
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {filterRecords(records?.attendance || []).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No attendance records found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journal Records */}
        <TabsContent value="journals">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Journals</CardTitle>
              <CardDescription>Your reflection entries and instructor feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filterRecords(records?.journals || []).map((journal) => (
                  <div key={journal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">Week of {new Date(journal.week_of).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {journal.learning_objectives.length} learning objectives
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground truncate max-w-md">
                            {journal.reflection_content}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(journal.status === 'reviewed' ? 'reviewed' : 'pending')}
                      <RecordDetailDialog
                        record={journal}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        }
                      />
                      {journal.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendReminder(journal.id)}
                          disabled={sendReminder.isPending}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Remind
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {filterRecords(records?.journals || []).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No journal entries found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competency Records */}
        <TabsContent value="competencies">
          <Card>
            <CardHeader>
              <CardTitle>Competency Records</CardTitle>
              <CardDescription>Skills and competencies you've practiced and their approval status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filterRecords(records?.competencies || []).map((competency) => (
                  <div key={competency.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">
                            {competency.practicum_competencies?.name || 'Competency'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(competency.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {competency.practicum_competencies?.description || 'No description available'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(competency.completion_status)}
                      <RecordDetailDialog
                        record={competency}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        }
                      />
                      {competency.completion_status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendReminder(competency.id)}
                          disabled={sendReminder.isPending}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Remind
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {filterRecords(records?.competencies || []).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No competency records found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evaluation Records */}
        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle>Self-Evaluations</CardTitle>
              <CardDescription>Your completed midterm and final evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filterRecords(records?.evaluations || []).map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium capitalize">{evaluation.evaluation_type} Evaluation</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted {new Date(evaluation.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground truncate max-w-md">
                            {evaluation.overall_reflection}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(evaluation.status === 'reviewed' ? 'reviewed' : 'pending')}
                      <RecordDetailDialog
                        record={evaluation}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        }
                      />
                      {evaluation.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendReminder(evaluation.id)}
                          disabled={sendReminder.isPending}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Remind
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {filterRecords(records?.evaluations || []).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No evaluation records found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}