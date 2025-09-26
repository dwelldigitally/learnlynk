import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StudentProgress {
  id: string;
  studentName: string;
  email: string;
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
  overallProgress: number;
  upcomingDeadlines: Array<{
    type: string;
    description: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const dummyStudentProgress: StudentProgress[] = [
  {
    id: '1',
    studentName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
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
    overallProgress: 75,
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
    ]
  },
  {
    id: '2',
    studentName: 'Michael Rodriguez',
    email: 'michael.rodriguez@email.com',
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
    overallProgress: 30,
    upcomingDeadlines: [
      {
        type: 'attendance',
        description: 'Weekly Hours Log',
        dueDate: '2024-09-30',
        priority: 'high'
      }
    ]
  },
  {
    id: '3',
    studentName: 'Emily Chen',
    email: 'emily.chen@email.com',
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
    overallProgress: 97,
    upcomingDeadlines: []
  },
  {
    id: '4',
    studentName: 'David Kim',
    email: 'david.kim@email.com',
    programName: 'Occupational Therapy',
    siteName: 'Children\'s Hospital',
    siteLocation: 'Metro City, CA',
    startDate: '2024-10-01',
    endDate: '2025-01-31',
    totalHours: 350,
    completedHours: 0,
    attendanceRate: 0,
    competenciesCompleted: 0,
    totalCompetencies: 10,
    currentStatus: 'pending',
    lastActivity: '2024-09-25',
    preceptorName: 'Dr. Robert Kim',
    overallProgress: 0,
    upcomingDeadlines: [
      {
        type: 'orientation',
        description: 'Practicum Orientation',
        dueDate: '2024-09-30',
        priority: 'high'
      }
    ]
  }
];

export function StudentProgress() {
  const { session } = useAuth();
  const [students] = useState<StudentProgress[]>(dummyStudentProgress);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.siteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
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

  const statusCounts = {
    active: students.filter(s => s.currentStatus === 'active').length,
    completed: students.filter(s => s.currentStatus === 'completed').length,
    at_risk: students.filter(s => s.currentStatus === 'at_risk').length,
    pending: students.filter(s => s.currentStatus === 'pending').length,
  };

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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
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