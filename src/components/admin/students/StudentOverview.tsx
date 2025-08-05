import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface StudentOverviewProps {
  student: any;
  onUpdate: () => void;
}

export function StudentOverview({ student, onUpdate }: StudentOverviewProps) {
  const getStageProgress = (stage: string) => {
    const stageMap = {
      'LEAD_FORM': 20,
      'SEND_DOCUMENTS': 40,
      'DOCUMENT_APPROVAL': 60,
      'FEE_PAYMENT': 80,
      'ACCEPTED': 100
    };
    return stageMap[stage as keyof typeof stageMap] || 0;
  };

  const admissionSteps = [
    { id: 1, name: 'Application Submitted', status: 'completed', date: '2024-01-15' },
    { id: 2, name: 'Documents Required', status: 'completed', date: '2024-01-20' },
    { id: 3, name: 'Document Review', status: 'current', date: '2024-01-25' },
    { id: 4, name: 'Payment Processing', status: 'upcoming', date: null },
    { id: 5, name: 'Acceptance Decision', status: 'upcoming', date: null }
  ];

  const documents = [
    { name: 'Transcripts', status: 'approved', uploadDate: '2024-01-22' },
    { name: 'Personal Statement', status: 'approved', uploadDate: '2024-01-23' },
    { name: 'Letters of Recommendation', status: 'pending', uploadDate: '2024-01-24' },
    { name: 'Test Scores', status: 'approved', uploadDate: '2024-01-21' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'current':
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Application Progress</p>
                <p className="text-2xl font-bold">{student.progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acceptance Likelihood</p>
                <p className="text-2xl font-bold">{student.acceptanceLikelihood}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GPA</p>
                <p className="text-2xl font-bold">{student.gpa}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <p className="text-2xl font-bold capitalize">{student.risk_level}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Application Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {admissionSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  {getStatusIcon(step.status)}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      step.status === 'completed' ? 'text-foreground' : 
                      step.status === 'current' ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </p>
                    {step.date && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(step.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge variant={
                    step.status === 'completed' ? 'default' :
                    step.status === 'current' ? 'default' : 'secondary'
                  }>
                    {step.status}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{getStageProgress(student.stage)}%</span>
              </div>
              <Progress value={getStageProgress(student.stage)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Document Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={doc.status === 'approved' ? 'default' : 'secondary'}>
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Documents Complete</span>
              <span className="text-sm text-muted-foreground">3 of 4</span>
            </div>
            <Progress value={75} className="h-2" />
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Full Name</p>
                <p className="font-medium">{student.firstName} {student.lastName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Student ID</p>
                <p className="font-medium">{student.studentId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{student.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium">{student.city}, {student.country}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Program</p>
                <p className="font-medium">{student.program}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">GPA</p>
                <p className="text-2xl font-bold">{student.gpa}</p>
              </div>
              <div>
                <p className="text-muted-foreground">SAT Score</p>
                <p className="text-2xl font-bold">{student.testScores?.SAT}</p>
              </div>
              <div>
                <p className="text-muted-foreground">TOEFL Score</p>
                <p className="text-2xl font-bold">{student.testScores?.TOEFL}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Application Date</p>
                <p className="font-medium">{new Date(student.applicationDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-muted-foreground mb-2">Expected Start Date</p>
              <p className="font-medium">{new Date(student.expectedStartDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Schedule Call
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Request Documents
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Update Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}