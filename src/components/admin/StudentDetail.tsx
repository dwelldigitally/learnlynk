import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  FileText, 
  DollarSign, 
  MessageCircle,
  Calendar,
  User,
  GraduationCap,
  Bell,
  Download,
  Upload,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Brain,
  Users,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useConditionalStudents } from '@/hooks/useConditionalStudents';
import { useStudentsPaginated } from '@/services/studentService';
import { useConditionalPrograms } from '@/hooks/useConditionalPrograms';
import { useConditionalFinancials } from '@/hooks/useConditionalFinancials';
import { useConditionalDocuments } from '@/hooks/useConditionalDocuments';
import { useStudentDocuments } from '@/services/documentService';
import { useStudentCommunications } from '@/services/communicationService';

export function StudentDetail() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data using existing hooks - try both conditional and direct
  const { data: students, isLoading: studentsLoading } = useConditionalStudents();
  const { data: paginatedStudents } = useStudentsPaginated({ page: 1, pageSize: 1000 }, {});
  const { data: programs } = useConditionalPrograms();
  const { data: financials } = useConditionalFinancials();
  const { data: allDocuments } = useConditionalDocuments();
  const { data: documents } = useStudentDocuments(studentId || '');
  const { data: communications } = useStudentCommunications(studentId || '');

  // Debug logging
  console.log('StudentDetail Debug:', {
    studentId,
    students,
    paginatedStudents,
    studentsLoading,
    studentsCount: students?.length,
    paginatedCount: paginatedStudents?.data?.length
  });

  // Try to find student in either dataset
  const allStudents = paginatedStudents?.data || students;
  const student = allStudents?.find((s: any) => s.id === studentId);
  const studentFinancials = financials?.filter((f: any) => 
    f.student_name === `${student?.first_name} ${student?.last_name}`
  );
  const studentDocuments = documents || allDocuments?.filter((d: any) => d.student_id === studentId);

  console.log('Student lookup:', {
    studentId,
    foundStudent: student,
    allStudentIds: students?.map((s: any) => s.id)
  });

  if (studentsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium">Loading...</h3>
          <p className="text-muted-foreground">Fetching student information...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium">Student not found</h3>
          <p className="text-muted-foreground">The student you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/students')} className="mt-4">
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'ACCEPTED': return 'default';
      case 'FEE_PAYMENT': return 'secondary';
      case 'DOCUMENT_APPROVAL': return 'outline';
      case 'SEND_DOCUMENTS': return 'destructive';
      default: return 'outline';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const totalFees = studentFinancials?.reduce((sum: number, f: any) => sum + parseFloat(f.amount || 0), 0) || 0;
  const paidAmount = studentFinancials?.filter((f: any) => f.status === 'paid')
    .reduce((sum: number, f: any) => sum + parseFloat(f.amount || 0), 0) || 0;
  const paymentProgress = totalFees > 0 ? (paidAmount / totalFees) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/students')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Students
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.first_name} ${student.last_name}`} />
                  <AvatarFallback>
                    {student.first_name?.[0]}{student.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-semibold">
                    {student.first_name} {student.last_name}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{student.student_id}</span>
                    <span>•</span>
                    <span>{student.program}</span>
                    <Badge variant={getStageColor(student.stage)}>
                      {student.stage.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Contract
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Task
              </Button>
              <Button variant="default" size="sm" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Collect Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{student.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">
                  {[student.city, student.state, student.country].filter(Boolean).join(', ') || 'Not provided'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <p className={`font-medium ${getRiskColor(student.risk_level)}`}>
                  {student.risk_level || 'Low'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lead Score</p>
                <div className="flex items-center gap-2">
                  <Progress value={student.lead_score || 0} className="flex-1" />
                  <span className="text-sm font-medium">{student.lead_score || 0}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acceptance Likelihood</p>
                <div className="flex items-center gap-2">
                  <Progress value={student.acceptance_likelihood || 0} className="flex-1" />
                  <span className="text-sm font-medium">{student.acceptance_likelihood || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Upload className="h-4 w-4" />
                Request Documents
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Bell className="h-4 w-4" />
                Send Reminder
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Meeting
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <MessageCircle className="h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Application Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Application ID</p>
                      <p className="font-medium">APP-2025-0001</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Program</p>
                      <p className="font-medium">{student.program}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stage</p>
                      <Badge variant={getStageColor(student.stage)}>
                        {student.stage.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <div className="flex items-center gap-2">
                        <Progress value={student.progress || 0} className="flex-1" />
                        <span className="text-sm">{student.progress || 0}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      High chance of conversion
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Documents submitted</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Email sent</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Application reviewed</p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Application Tab */}
          <TabsContent value="application" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>Complete application information and requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Application Number</p>
                    <p className="font-medium">APP-2025-0001</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submission Date</p>
                    <p className="font-medium">Jan 15, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Application Deadline</p>
                    <p className="font-medium">Feb 15, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Decision</p>
                    <p className="font-medium">Jan 30, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Intake Start</p>
                    <p className="font-medium">Mar 1, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lead Source</p>
                    <p className="font-medium">Website Form</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Documents</span>
                  <Button size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Request Document
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentDocuments?.map((doc: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{doc.name}</h4>
                        <Badge variant={
                          doc.status === 'approved' ? 'default' : 
                          doc.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {doc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No documents uploaded yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Program Fee</p>
                    <p className="text-2xl font-bold">${totalFees.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="text-2xl font-bold text-green-600">${paidAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-2xl font-bold text-orange-600">${(totalFees - paidAmount).toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Progress</p>
                  <Progress value={paymentProgress} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">{paymentProgress.toFixed(1)}% completed</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Payment History</h4>
                  {studentFinancials?.map((payment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.payment_type}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(payment.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${parseFloat(payment.amount).toLocaleString()}</p>
                        <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center py-4 text-muted-foreground">No payment records found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Communication Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communications?.map((comm: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {comm.type === 'email' && <Mail className="h-4 w-4" />}
                        {comm.type === 'phone' && <Phone className="h-4 w-4" />}
                        {comm.type === 'sms' && <MessageCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{comm.subject}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comm.sent_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{comm.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{comm.type}</Badge>
                          <Badge variant="outline">{comm.direction}</Badge>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center py-8 text-muted-foreground">No communications found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">85</div>
                    <p className="text-sm text-muted-foreground">Application Health Score</p>
                  </div>
                  <Progress value={85} className="h-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Documents complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Payment on track</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span>Awaiting final review</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Advisor Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium">Follow up before intake deadline</p>
                    <p className="text-xs text-muted-foreground">Recommended action in 3 days</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium">High conversion probability</p>
                    <p className="text-xs text-muted-foreground">Student shows strong engagement</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium">Schedule orientation call</p>
                    <p className="text-xs text-muted-foreground">Prepare for program start</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default StudentDetail;