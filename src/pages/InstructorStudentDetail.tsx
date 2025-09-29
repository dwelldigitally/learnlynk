import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock,
  Award,
  BookOpen,
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  MessageSquare,
  Download
} from 'lucide-react';

const InstructorStudentDetail = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { studentId } = useParams();

  // Mock student data
  const studentData = {
    id: studentId,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    program: 'Nursing Practicum',
    batch: 'Spring 2024 - Cohort A',
    site: 'City General Hospital',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    preceptor: 'Dr. Jennifer Martinez',
    progress: {
      overall: 82,
      attendance: 145,
      requiredHours: 180,
      competenciesCompleted: 8,
      totalCompetencies: 12,
      journalsSubmitted: 6,
      requiredJournals: 8,
      evaluationsCompleted: 1,
      totalEvaluations: 2
    },
    recentActivity: [
      { type: 'attendance', description: 'Submitted 8 hours at Emergency Department', date: '2 hours ago', status: 'pending' },
      { type: 'competency', description: 'IV Insertion competency submitted', date: '1 day ago', status: 'approved' },
      { type: 'journal', description: 'Week 6 reflection journal', date: '3 days ago', status: 'approved' },
      { type: 'evaluation', description: 'Midterm self-evaluation completed', date: '1 week ago', status: 'reviewed' }
    ]
  };

  const attendanceRecords = [
    { id: 1, date: '2024-03-20', hours: 8, location: 'Emergency Department', status: 'pending', preceptor: 'Dr. Smith' },
    { id: 2, date: '2024-03-19', hours: 8, location: 'Medical-Surgical Unit', status: 'approved', preceptor: 'Nurse Johnson' },
    { id: 3, date: '2024-03-18', hours: 7, location: 'ICU', status: 'approved', preceptor: 'Dr. Brown' },
    { id: 4, date: '2024-03-17', hours: 8, location: 'Emergency Department', status: 'approved', preceptor: 'Dr. Smith' }
  ];

  const competencies = [
    { id: 1, name: 'IV Insertion', status: 'completed', dateCompleted: '2024-03-19', attempts: 1, score: 'Satisfactory' },
    { id: 2, name: 'Medication Administration', status: 'completed', dateCompleted: '2024-03-15', attempts: 1, score: 'Excellent' },
    { id: 3, name: 'Wound Care', status: 'in-progress', dateStarted: '2024-03-18', attempts: 1, score: null },
    { id: 4, name: 'Patient Assessment', status: 'pending', dateStarted: null, attempts: 0, score: null }
  ];

  const journals = [
    { id: 1, week: 6, title: 'Critical Care Experience', submitted: '2024-03-18', status: 'approved', grade: 'A' },
    { id: 2, week: 5, title: 'Medication Safety', submitted: '2024-03-11', status: 'approved', grade: 'B+' },
    { id: 3, week: 4, title: 'Patient Communication', submitted: '2024-03-04', status: 'approved', grade: 'A-' },
    { id: 4, week: 3, title: 'Emergency Response', submitted: '2024-02-26', status: 'approved', grade: 'A' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance': return Clock;
      case 'competency': return Award;
      case 'journal': return BookOpen;
      case 'evaluation': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/instructor/batches')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Batch
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{studentData.name}</h1>
              <p className="text-muted-foreground">{studentData.program} • {studentData.batch}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Student Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{studentData.name}</h2>
                  <p className="text-muted-foreground">{studentData.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{studentData.site}</span>
                    <span>•</span>
                    <span>Preceptor: {studentData.preceptor}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Student
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Records
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm font-medium mb-2">Overall Progress</div>
                <div className="text-2xl font-bold text-primary mb-1">{studentData.progress.overall}%</div>
                <Progress value={studentData.progress.overall} className="h-2" />
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Clinical Hours</div>
                <div className="text-lg font-semibold">
                  {studentData.progress.attendance}/{studentData.progress.requiredHours}
                </div>
                <Progress 
                  value={(studentData.progress.attendance / studentData.progress.requiredHours) * 100} 
                  className="h-2" 
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Competencies</div>
                <div className="text-lg font-semibold">
                  {studentData.progress.competenciesCompleted}/{studentData.progress.totalCompetencies}
                </div>
                <Progress 
                  value={(studentData.progress.competenciesCompleted / studentData.progress.totalCompetencies) * 100} 
                  className="h-2" 
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Journals</div>
                <div className="text-lg font-semibold">
                  {studentData.progress.journalsSubmitted}/{studentData.progress.requiredJournals}
                </div>
                <Progress 
                  value={(studentData.progress.journalsSubmitted / studentData.progress.requiredJournals) * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Recent Activity</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="competencies">Competencies</TabsTrigger>
            <TabsTrigger value="journals">Journals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.recentActivity.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{activity.description}</div>
                            <div className="text-sm text-muted-foreground">{activity.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                          {activity.status === 'pending' && (
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{record.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {record.hours} hours • {record.location} • {record.preceptor}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        {record.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competencies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Competency Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competencies.map((competency) => (
                    <div key={competency.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Award className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{competency.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {competency.status === 'completed' && `Completed: ${competency.dateCompleted}`}
                            {competency.status === 'in-progress' && `Started: ${competency.dateStarted}`}
                            {competency.status === 'pending' && 'Not started'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(competency.status)}>
                          {competency.status}
                        </Badge>
                        {competency.score && (
                          <span className="text-sm font-medium">{competency.score}</span>
                        )}
                        {competency.status === 'in-progress' && (
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Journal Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journals.map((journal) => (
                    <div key={journal.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Week {journal.week}: {journal.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Submitted: {journal.submitted}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(journal.status)}>
                          {journal.status}
                        </Badge>
                        {journal.grade && (
                          <span className="text-sm font-medium">Grade: {journal.grade}</span>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InstructorStudentDetail;