import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Calendar, 
  User, 
  MapPin, 
  FileText, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Search,
  Filter,
  Eye,
  Download,
  Bell,
  MessageSquare,
  BarChart3,
  Target,
  Zap,
  Mail,
  Phone,
  BookOpen,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StudentProgress {
  id: string;
  studentName: string;
  email: string;
  phone?: string;
  avatar?: string;
  programName: string;
  siteName: string;
  siteLocation: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  completedHours: number;
  attendanceRate: number;
  competenciesCompleted: number;
  totalCompetencies: number;
  currentStatus: 'active' | 'completed' | 'at_risk' | 'pending';
  lastActivity: string;
  preceptorName: string;
  preceptorEmail: string;
  overallProgress: number;
  gpa?: number;
  midtermGrade?: number;
  finalGrade?: number;
  upcomingDeadlines: Array<{
    type: string;
    description: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  recentActivities: Array<{
    type: string;
    description: string;
    date: string;
    status?: string;
  }>;
  evaluations: Array<{
    type: string;
    evaluator: string;
    score: number;
    date: string;
    feedback?: string;
  }>;
  competencyDetails: Array<{
    category: string;
    name: string;
    status: 'completed' | 'in_progress' | 'not_started';
    score?: number;
    completedDate?: string;
  }>;
}

const dummyStudentProgress: StudentProgress[] = [
  {
    id: '1',
    studentName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    programName: 'Nursing Practicum',
    siteName: 'General Hospital',
    siteLocation: 'Metro City, CA',
    startDate: '2024-08-15',
    endDate: '2024-12-15',
    totalHours: 480,
    completedHours: 360,
    attendanceRate: 95,
    competenciesCompleted: 12,
    totalCompetencies: 15,
    currentStatus: 'active',
    lastActivity: '2024-09-25',
    preceptorName: 'Dr. Michael Chen',
    preceptorEmail: 'michael.chen@hospital.com',
    overallProgress: 75,
    gpa: 3.8,
    midtermGrade: 88,
    upcomingDeadlines: [
      {
        type: 'competency',
        description: 'Emergency Response Assessment',
        dueDate: '2024-10-05',
        priority: 'high'
      },
      {
        type: 'evaluation',
        description: 'Mid-term Evaluation',
        dueDate: '2024-10-15',
        priority: 'medium'
      }
    ],
    recentActivities: [
      {
        type: 'attendance',
        description: 'Submitted weekly hours log - 40 hours',
        date: '2024-09-25',
        status: 'approved'
      },
      {
        type: 'competency',
        description: 'Completed Patient Care Competency',
        date: '2024-09-22',
        status: 'passed'
      },
      {
        type: 'evaluation',
        description: 'Weekly check-in with preceptor',
        date: '2024-09-20'
      }
    ],
    evaluations: [
      {
        type: 'Weekly Evaluation',
        evaluator: 'Dr. Michael Chen',
        score: 92,
        date: '2024-09-20',
        feedback: 'Excellent patient interaction skills. Shows great improvement in clinical procedures.'
      },
      {
        type: 'Peer Review',
        evaluator: 'Nursing Staff',
        score: 87,
        date: '2024-09-15',
        feedback: 'Works well with team, demonstrates professionalism.'
      }
    ],
    competencyDetails: [
      { category: 'Patient Care', name: 'Basic Patient Assessment', status: 'completed', score: 95, completedDate: '2024-09-01' },
      { category: 'Patient Care', name: 'Medication Administration', status: 'completed', score: 88, completedDate: '2024-09-08' },
      { category: 'Emergency', name: 'Emergency Response', status: 'in_progress' },
      { category: 'Documentation', name: 'Patient Records', status: 'completed', score: 92, completedDate: '2024-09-15' },
      { category: 'Communication', name: 'Patient Communication', status: 'completed', score: 94, completedDate: '2024-09-22' }
    ]
  },
  {
    id: '2',
    studentName: 'Michael Rodriguez',
    email: 'michael.rodriguez@email.com',
    phone: '(555) 234-5678',
    programName: 'Physical Therapy',
    siteName: 'Rehabilitation Center',
    siteLocation: 'Metro City, CA',
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    totalHours: 400,
    completedHours: 120,
    attendanceRate: 88,
    competenciesCompleted: 4,
    totalCompetencies: 12,
    currentStatus: 'at_risk',
    lastActivity: '2024-09-20',
    preceptorName: 'Dr. Emma Williams',
    preceptorEmail: 'emma.williams@rehab.com',
    overallProgress: 30,
    gpa: 3.2,
    upcomingDeadlines: [
      {
        type: 'attendance',
        description: 'Weekly Hours Log',
        dueDate: '2024-09-30',
        priority: 'high'
      },
      {
        type: 'competency',
        description: 'Manual Therapy Assessment',
        dueDate: '2024-10-10',
        priority: 'high'
      }
    ],
    recentActivities: [
      {
        type: 'attendance',
        description: 'Missed 2 days this week',
        date: '2024-09-20',
        status: 'flagged'
      },
      {
        type: 'evaluation',
        description: 'Concerns raised about punctuality',
        date: '2024-09-18'
      }
    ],
    evaluations: [
      {
        type: 'Weekly Evaluation',
        evaluator: 'Dr. Emma Williams',
        score: 72,
        date: '2024-09-18',
        feedback: 'Needs improvement in time management and attendance. Clinical skills are developing well.'
      }
    ],
    competencyDetails: [
      { category: 'Assessment', name: 'Patient Evaluation', status: 'completed', score: 78, completedDate: '2024-09-10' },
      { category: 'Treatment', name: 'Exercise Prescription', status: 'in_progress' },
      { category: 'Documentation', name: 'Treatment Notes', status: 'not_started' }
    ]
  },
  {
    id: '3',
    studentName: 'Emily Chen',
    email: 'emily.chen@email.com',
    phone: '(555) 345-6789',
    programName: 'Clinical Psychology',
    siteName: 'Mental Health Center',
    siteLocation: 'Metro City, CA',
    startDate: '2024-07-01',
    endDate: '2024-12-31',
    totalHours: 600,
    completedHours: 580,
    attendanceRate: 98,
    competenciesCompleted: 18,
    totalCompetencies: 18,
    currentStatus: 'completed',
    lastActivity: '2024-09-24',
    preceptorName: 'Dr. Lisa Rodriguez',
    preceptorEmail: 'lisa.rodriguez@mhc.com',
    overallProgress: 97,
    gpa: 3.9,
    midtermGrade: 94,
    finalGrade: 96,
    upcomingDeadlines: [],
    recentActivities: [
      {
        type: 'completion',
        description: 'Successfully completed all practicum requirements',
        date: '2024-09-24',
        status: 'completed'
      },
      {
        type: 'evaluation',
        description: 'Final evaluation completed',
        date: '2024-09-20',
        status: 'excellent'
      }
    ],
    evaluations: [
      {
        type: 'Final Evaluation',
        evaluator: 'Dr. Lisa Rodriguez',
        score: 96,
        date: '2024-09-20',
        feedback: 'Outstanding performance throughout the practicum. Demonstrates excellent clinical judgment and interpersonal skills.'
      }
    ],
    competencyDetails: [
      { category: 'Assessment', name: 'Clinical Interview', status: 'completed', score: 96, completedDate: '2024-08-15' },
      { category: 'Assessment', name: 'Psychological Testing', status: 'completed', score: 94, completedDate: '2024-08-30' },
      { category: 'Treatment', name: 'Individual Therapy', status: 'completed', score: 98, completedDate: '2024-09-10' },
      { category: 'Treatment', name: 'Group Therapy', status: 'completed', score: 92, completedDate: '2024-09-15' }
    ]
  }
];

export function StudentProgress() {
  const { session } = useAuth();
  const [students] = useState<StudentProgress[]>(dummyStudentProgress);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.siteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.currentStatus === statusFilter;
    const matchesProgram = programFilter === 'all' || student.programName === programFilter;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'at_risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompetencyStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'not_started': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusCounts = {
    active: students.filter(s => s.currentStatus === 'active').length,
    completed: students.filter(s => s.currentStatus === 'completed').length,
    at_risk: students.filter(s => s.currentStatus === 'at_risk').length,
    pending: students.filter(s => s.currentStatus === 'pending').length,
  };

  const programs = [...new Set(students.map(s => s.programName))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Progress</h1>
          <p className="text-muted-foreground">
            Monitor individual student progress across all practicum placements
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Progress Report
          </Button>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.active}</div>
            <p className="text-xs text-muted-foreground">Currently in practicum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.at_risk}</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Starting soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Student Progress Overview</CardTitle>
              <CardDescription>Track individual student progress and performance</CardDescription>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map(program => (
                    <SelectItem key={program} value={program}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>
                      {student.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{student.studentName}</h3>
                      <Badge className={getStatusColor(student.currentStatus)}>
                        {student.currentStatus.replace('_', ' ')}
                      </Badge>
                      {student.gpa && (
                        <Badge variant="outline">
                          GPA: {student.gpa}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {student.siteName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {student.startDate} - {student.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {student.preceptorName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:w-96">
                  <div className="text-center">
                    <div className="text-sm font-medium">Hours</div>
                    <div className="text-xs text-muted-foreground">
                      {student.completedHours}/{student.totalHours}
                    </div>
                    <Progress 
                      value={(student.completedHours / student.totalHours) * 100} 
                      className="h-2 mt-1"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Attendance</div>
                    <div className="text-xs text-muted-foreground">{student.attendanceRate}%</div>
                    <Progress value={student.attendanceRate} className="h-2 mt-1" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Competencies</div>
                    <div className="text-xs text-muted-foreground">
                      {student.competenciesCompleted}/{student.totalCompetencies}
                    </div>
                    <Progress 
                      value={(student.competenciesCompleted / student.totalCompetencies) * 100} 
                      className="h-2 mt-1"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Overall</div>
                    <div className="text-xs text-muted-foreground">{student.overallProgress}%</div>
                    <Progress value={student.overallProgress} className="h-2 mt-1" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>
                              {student.studentName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              {student.studentName}
                              <Badge className={getStatusColor(student.currentStatus)}>
                                {student.currentStatus.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-normal">
                              {student.programName} at {student.siteName}
                            </p>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                        <TabsList className="grid w-full grid-cols-5">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="competencies">Competencies</TabsTrigger>
                          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
                          <TabsTrigger value="activities">Activities</TabsTrigger>
                          <TabsTrigger value="contact">Contact</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="overview" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Hours Progress</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {student.completedHours}/{student.totalHours}
                                </div>
                                <Progress 
                                  value={(student.completedHours / student.totalHours) * 100} 
                                  className="mt-2"
                                />
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Attendance Rate</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{student.attendanceRate}%</div>
                                <Progress value={student.attendanceRate} className="mt-2" />
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Academic Performance</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-1">
                                  {student.gpa && <div className="text-sm">GPA: <span className="font-semibold">{student.gpa}</span></div>}
                                  {student.midtermGrade && <div className="text-sm">Midterm: <span className="font-semibold">{student.midtermGrade}%</span></div>}
                                  {student.finalGrade && <div className="text-sm">Final: <span className="font-semibold">{student.finalGrade}%</span></div>}
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Overall Progress</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{student.overallProgress}%</div>
                                <Progress value={student.overallProgress} className="mt-2" />
                              </CardContent>
                            </Card>
                          </div>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle>Practicum Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Placement Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Site:</span> {student.siteName}</div>
                                    <div><span className="font-medium">Location:</span> {student.siteLocation}</div>
                                    <div><span className="font-medium">Duration:</span> {student.startDate} - {student.endDate}</div>
                                    <div><span className="font-medium">Total Hours:</span> {student.totalHours}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Supervision</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Preceptor:</span> {student.preceptorName}</div>
                                    <div><span className="font-medium">Email:</span> {student.preceptorEmail}</div>
                                    <div><span className="font-medium">Last Activity:</span> {student.lastActivity}</div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="competencies" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle>Competency Progress</CardTitle>
                              <CardDescription>
                                Track completion of required competencies
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {student.competencyDetails.map((competency, index) => (
                                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                      <div className="font-medium">{competency.name}</div>
                                      <div className="text-sm text-muted-foreground">{competency.category}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {competency.score && (
                                        <span className="text-sm font-medium">{competency.score}%</span>
                                      )}
                                      <Badge className={getCompetencyStatusColor(competency.status)}>
                                        {competency.status.replace('_', ' ')}
                                      </Badge>
                                      {competency.completedDate && (
                                        <span className="text-xs text-muted-foreground">
                                          {competency.completedDate}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="evaluations" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle>Evaluations & Feedback</CardTitle>
                              <CardDescription>
                                Review evaluation scores and feedback
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {student.evaluations.map((evaluation, index) => (
                                  <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <div>
                                        <h4 className="font-medium">{evaluation.type}</h4>
                                        <p className="text-sm text-muted-foreground">by {evaluation.evaluator}</p>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-lg font-bold">{evaluation.score}%</div>
                                        <div className="text-xs text-muted-foreground">{evaluation.date}</div>
                                      </div>
                                    </div>
                                    {evaluation.feedback && (
                                      <>
                                        <Separator className="my-3" />
                                        <p className="text-sm">{evaluation.feedback}</p>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="activities" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle>Recent Activities</CardTitle>
                              <CardDescription>
                                Timeline of student activities and submissions
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {student.recentActivities.map((activity, index) => (
                                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                    <div className="flex-1">
                                      <div className="font-medium">{activity.description}</div>
                                      <div className="text-sm text-muted-foreground">{activity.date}</div>
                                    </div>
                                    {activity.status && (
                                      <Badge variant="outline">{activity.status}</Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="contact" className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle>Contact Information</CardTitle>
                              <CardDescription>
                                Communication details and quick actions
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3">Student</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      <span className="text-sm">{student.email}</span>
                                    </div>
                                    {student.phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm">{student.phone}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2 mt-4">
                                    <Button size="sm" variant="outline">
                                      <Mail className="h-4 w-4 mr-2" />
                                      Email
                                    </Button>
                                    {student.phone && (
                                      <Button size="sm" variant="outline">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-3">Preceptor</h4>
                                  <div className="space-y-2">
                                    <div><span className="font-medium">Name:</span> {student.preceptorName}</div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      <span className="text-sm">{student.preceptorEmail}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-4">
                                    <Button size="sm" variant="outline">
                                      <Mail className="h-4 w-4 mr-2" />
                                      Email Preceptor
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>Important deadlines requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students
              .flatMap(student => 
                student.upcomingDeadlines.map(deadline => ({
                  ...deadline,
                  studentName: student.studentName,
                  studentId: student.id
                }))
              )
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 10)
              .map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{deadline.description}</span>
                      <span className="text-sm text-muted-foreground">
                        {deadline.studentName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(deadline.priority)}>
                      {deadline.priority}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Due: {deadline.dueDate}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}