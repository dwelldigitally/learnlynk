import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  GraduationCap,
  Target,
  User,
  MapPin,
  DollarSign
} from 'lucide-react';

interface StudentApplicationProps {
  student: any;
  onUpdate: () => void;
}

export function StudentApplication({ student, onUpdate }: StudentApplicationProps) {
  const requirements = [
    { name: 'Academic Transcripts', completed: true, required: true, dueDate: '2024-02-01' },
    { name: 'Personal Statement', completed: true, required: true, dueDate: '2024-02-01' },
    { name: 'Letters of Recommendation (2)', completed: false, required: true, dueDate: '2024-02-15' },
    { name: 'English Proficiency Test', completed: true, required: true, dueDate: '2024-02-01' },
    { name: 'Portfolio (if applicable)', completed: false, required: false, dueDate: '2024-02-20' },
    { name: 'Financial Documents', completed: false, required: true, dueDate: '2024-02-10' }
  ];

  const programDetails = {
    name: student.program,
    duration: '4 years',
    credits: 120,
    format: 'Full-time',
    startDate: student.expectedStartDate,
    tuition: '$45,000/year',
    applicationFee: '$100',
    deadline: '2024-03-01'
  };

  const academicHistory = [
    { institution: 'Toronto High School', degree: 'High School Diploma', year: '2020-2024', gpa: '3.8/4.0' },
    { institution: 'SAT', degree: 'Standardized Test', year: '2023', gpa: '1450/1600' },
    { institution: 'TOEFL', degree: 'English Proficiency', year: '2023', gpa: '105/120' }
  ];

  const getRequirementIcon = (completed: boolean, required: boolean) => {
    if (completed) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (required) return <AlertTriangle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="program">Program Details</TabsTrigger>
          <TabsTrigger value="academic">Academic History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Application Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Application Date</p>
                  <p className="font-semibold">{new Date(student.applicationDate).toLocaleDateString()}</p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground">Current Stage</p>
                  <Badge variant="outline" className="mt-1">
                    {student.stage.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="font-semibold">{student.progress}%</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Student ID</p>
                  <p className="font-medium">{student.studentId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Program</p>
                  <p className="font-medium">{student.program}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expected Start</p>
                  <p className="font-medium">{new Date(student.expectedStartDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Risk Assessment</p>
                  <Badge variant={
                    student.risk_level === 'low' ? 'default' :
                    student.risk_level === 'medium' ? 'secondary' : 'destructive'
                  }>
                    {student.risk_level?.charAt(0).toUpperCase() + student.risk_level?.slice(1)}
                  </Badge>
                </div>
              </div>
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
                  <p className="text-muted-foreground">Email Address</p>
                  <p className="font-medium">{student.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{student.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {student.city}, {student.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Application Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getRequirementIcon(req.completed, req.required)}
                      <div>
                        <p className="font-medium">{req.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(req.dueDate).toLocaleDateString()}
                          {req.required && <span className="text-red-600 ml-2">*Required</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={req.completed ? 'default' : req.required ? 'destructive' : 'secondary'}>
                        {req.completed ? 'Complete' : req.required ? 'Required' : 'Optional'}
                      </Badge>
                      {!req.completed && (
                        <Button size="sm" variant="outline">
                          {req.completed ? 'View' : 'Upload'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Requirements Complete</span>
                <span className="text-sm text-muted-foreground">
                  {requirements.filter(r => r.completed).length} of {requirements.filter(r => r.required).length} required
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Program Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Program Name</p>
                  <p className="font-medium">{programDetails.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{programDetails.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Credits</p>
                  <p className="font-medium">{programDetails.credits}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Study Format</p>
                  <p className="font-medium">{programDetails.format}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{new Date(programDetails.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Application Deadline</p>
                  <p className="font-medium">{new Date(programDetails.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Annual Tuition</p>
                    <p className="font-medium text-lg">{programDetails.tuition}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Application Fee</p>
                    <p className="font-medium">{programDetails.applicationFee}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {academicHistory.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{item.institution}</h4>
                        <p className="text-sm text-muted-foreground">{item.degree}</p>
                      </div>
                      <Badge variant="outline">{item.year}</Badge>
                    </div>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Score/GPA: </span>
                      <span className="font-medium">{item.gpa}</span>
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{student.gpa}</p>
                  <p className="text-sm text-muted-foreground">Overall GPA</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{student.testScores?.SAT}</p>
                  <p className="text-sm text-muted-foreground">SAT Score</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{student.testScores?.TOEFL}</p>
                  <p className="text-sm text-muted-foreground">TOEFL Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}