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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PROGRAM_INTAKE_DATES } from '@/constants/intakeDates';

interface StudentBatch {
  intakeId: string;
  intakeDate: string;
  intakeLabel: string;
  programName: string;
  capacity: number;
  enrolled: number;
  students: StudentProgress[];
}

interface StudentProgress {
  id: string;
  studentName: string;
  email: string;
  phone?: string;
  avatar?: string;
  programName: string;
  intakeId: string;
  intakeDate: string;
  siteName: string;
  siteLocation: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  completedHours: number;
  attendanceRate: number;
  competenciesCompleted: number;
  totalCompetencies: number;
  currentStatus: 'active' | 'at_risk' | 'completed' | 'on_hold';
  lastActivity: string;
  preceptorName: string;
  preceptorEmail: string;
  overallProgress: number;
  gpa: number;
  midtermGrade?: number;
  upcomingDeadlines: Array<{
    type: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
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
    feedback: string;
  }>;
  competencyDetails: Array<{
    category: string;
    name: string;
    status: 'completed' | 'in_progress' | 'not_started';
    score?: number;
    completedDate?: string;
  }>;
}

// Generate student batches from intake dates
const generateStudentBatches = (): StudentBatch[] => {
  const batches: StudentBatch[] = [];
  
  Object.entries(PROGRAM_INTAKE_DATES).forEach(([programName, intakes]) => {
    intakes.forEach((intake) => {
      const enrolledCount = Math.min(intake.enrolled + Math.floor(Math.random() * 5), intake.capacity);
      const students = generateStudentsForIntake(intake.id, programName, intake.date, enrolledCount);
      
      batches.push({
        intakeId: intake.id,
        intakeDate: intake.date,
        intakeLabel: intake.label,
        programName,
        capacity: intake.capacity,
        enrolled: students.length,
        students
      });
    });
  });
  
  return batches.sort((a, b) => new Date(a.intakeDate).getTime() - new Date(b.intakeDate).getTime());
};

const generateStudentsForIntake = (intakeId: string, programName: string, intakeDate: string, count: number): StudentProgress[] => {
  const firstNames = ['Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Ashley', 'Christopher', 'Amanda', 'Matthew'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez'];
  const sites = [
    { name: 'General Hospital', location: 'Metro City, CA' },
    { name: 'Community Health Center', location: 'Downtown, CA' },
    { name: 'Children\'s Medical Center', location: 'Westside, CA' },
    { name: 'Regional Medical Center', location: 'Northfield, CA' },
    { name: 'Valley Health Clinic', location: 'Valley View, CA' }
  ];

  const students: StudentProgress[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const site = sites[Math.floor(Math.random() * sites.length)];
    const completedHours = Math.floor(Math.random() * 400) + 50;
    const totalHours = 480;
    
    students.push({
      id: `${intakeId}-${i + 1}`,
      studentName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      programName,
      intakeId,
      intakeDate,
      siteName: site.name,
      siteLocation: site.location,
      startDate: intakeDate,
      endDate: new Date(new Date(intakeDate).getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalHours,
      completedHours,
      attendanceRate: Math.floor(Math.random() * 15) + 85,
      competenciesCompleted: Math.floor(Math.random() * 8) + 4,
      totalCompetencies: 15,
      currentStatus: Math.random() > 0.8 ? 'at_risk' : Math.random() > 0.1 ? 'active' : 'completed',
      lastActivity: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      preceptorName: `Dr. ${['Michael Chen', 'Sarah Wilson', 'David Thompson', 'Emily Rodriguez', 'Robert Johnson'][Math.floor(Math.random() * 5)]}`,
      preceptorEmail: 'preceptor@site.com',
      overallProgress: Math.floor((completedHours / totalHours) * 100),
      gpa: Math.round((Math.random() * 1.5 + 2.5) * 10) / 10,
      midtermGrade: Math.floor(Math.random() * 30) + 70,
      upcomingDeadlines: [],
      recentActivities: [],
      evaluations: [],
      competencyDetails: []
    });
  }
  
  return students;
};

export function StudentProgress() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());

  const studentBatches = generateStudentBatches();

  const toggleBatch = (batchId: string) => {
    const newExpanded = new Set(expandedBatches);
    if (newExpanded.has(batchId)) {
      newExpanded.delete(batchId);
    } else {
      newExpanded.add(batchId);
    }
    setExpandedBatches(newExpanded);
  };

  const filteredBatches = studentBatches.filter(batch => {
    if (programFilter !== 'all' && batch.programName !== programFilter) return false;
    
    return batch.students.some(student => {
      const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || student.currentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'at_risk': return 'bg-destructive text-destructive-foreground';
      case 'completed': return 'bg-primary text-primary-foreground';
      case 'on_hold': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getBatchStatusSummary = (batch: StudentBatch) => {
    const statusCounts = batch.students.reduce((acc, student) => {
      acc[student.currentStatus] = (acc[student.currentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return statusCounts;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Progress Management</h1>
          <p className="text-muted-foreground">Manage student progress organized by intake batches</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
          <Button className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Send Notifications
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {Object.keys(PROGRAM_INTAKE_DATES).map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student Batches */}
      <div className="space-y-4">
        {filteredBatches.map((batch) => {
          const statusSummary = getBatchStatusSummary(batch);
          const isExpanded = expandedBatches.has(batch.intakeId);
          
          return (
            <Card key={batch.intakeId} className="overflow-hidden">
              <Collapsible 
                open={isExpanded} 
                onOpenChange={() => toggleBatch(batch.intakeId)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-accent transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            {batch.programName} - {batch.intakeLabel}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Intake: {new Date(batch.intakeDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {batch.enrolled}/{batch.capacity} enrolled
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {Object.entries(statusSummary).map(([status, count]) => (
                          <Badge key={status} variant="outline" className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(status).split(' ')[0]}`} />
                            {count} {status.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid gap-4">
                      {batch.students
                        .filter(student => {
                          const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                               student.email.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesStatus = statusFilter === 'all' || student.currentStatus === statusFilter;
                          return matchesSearch && matchesStatus;
                        })
                        .map((student) => (
                          <Card key={student.id} className="border-l-4 border-l-primary/20">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={student.avatar} />
                                    <AvatarFallback>
                                      {student.studentName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold text-lg">{student.studentName}</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                      <MapPin className="h-3 w-3" />
                                      {student.siteName} - {student.siteLocation}
                                    </p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                      <User className="h-3 w-3" />
                                      Preceptor: {student.preceptorName}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Progress value={student.overallProgress} className="w-24" />
                                      <span className="text-sm font-medium">{student.overallProgress}%</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {student.completedHours}/{student.totalHours} hours
                                    </div>
                                  </div>
                                  
                                  <Badge className={getStatusColor(student.currentStatus)}>
                                    {student.currentStatus.replace('_', ' ')}
                                  </Badge>
                                  
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setSelectedStudent(student)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center gap-3">
                                          <Avatar className="h-10 w-10">
                                            <AvatarFallback>
                                              {student.studentName.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                          </Avatar>
                                          {student.studentName} - Progress Details
                                        </DialogTitle>
                                      </DialogHeader>
                                      
                                      <Tabs defaultValue="overview" className="w-full">
                                        <TabsList className="grid w-full grid-cols-5">
                                          <TabsTrigger value="overview">Overview</TabsTrigger>
                                          <TabsTrigger value="competencies">Competencies</TabsTrigger>
                                          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
                                          <TabsTrigger value="activities">Activities</TabsTrigger>
                                          <TabsTrigger value="contact">Contact</TabsTrigger>
                                        </TabsList>
                                        
                                        <TabsContent value="overview" className="space-y-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <Card>
                                              <CardHeader className="pb-3">
                                                <CardTitle className="text-base">Basic Information</CardTitle>
                                              </CardHeader>
                                              <CardContent className="space-y-2">
                                                <div><strong>Program:</strong> {student.programName}</div>
                                                <div><strong>Site:</strong> {student.siteName}</div>
                                                <div><strong>Start Date:</strong> {new Date(student.startDate).toLocaleDateString()}</div>
                                                <div><strong>End Date:</strong> {new Date(student.endDate).toLocaleDateString()}</div>
                                                <div><strong>Status:</strong> 
                                                  <Badge className={`ml-2 ${getStatusColor(student.currentStatus)}`}>
                                                    {student.currentStatus.replace('_', ' ')}
                                                  </Badge>
                                                </div>
                                              </CardContent>
                                            </Card>
                                            
                                            <Card>
                                              <CardHeader className="pb-3">
                                                <CardTitle className="text-base">Progress Metrics</CardTitle>
                                              </CardHeader>
                                              <CardContent className="space-y-3">
                                                <div className="space-y-1">
                                                  <div className="flex justify-between text-sm">
                                                    <span>Overall Progress</span>
                                                    <span>{student.overallProgress}%</span>
                                                  </div>
                                                  <Progress value={student.overallProgress} />
                                                </div>
                                                <div><strong>Hours:</strong> {student.completedHours}/{student.totalHours}</div>
                                                <div><strong>Attendance:</strong> {student.attendanceRate}%</div>
                                                <div><strong>GPA:</strong> {student.gpa}</div>
                                                <div><strong>Competencies:</strong> {student.competenciesCompleted}/{student.totalCompetencies}</div>
                                              </CardContent>
                                            </Card>
                                          </div>
                                        </TabsContent>
                                        
                                        <TabsContent value="competencies">
                                          <Card>
                                            <CardHeader>
                                              <CardTitle>Competency Progress</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                              <div className="text-center py-8 text-muted-foreground">
                                                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>Competency details would be displayed here</p>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </TabsContent>
                                        
                                        <TabsContent value="evaluations">
                                          <Card>
                                            <CardHeader>
                                              <CardTitle>Evaluations & Feedback</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                              <div className="text-center py-8 text-muted-foreground">
                                                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>Evaluation details would be displayed here</p>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </TabsContent>
                                        
                                        <TabsContent value="activities">
                                          <Card>
                                            <CardHeader>
                                              <CardTitle>Recent Activities</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                              <div className="text-center py-8 text-muted-foreground">
                                                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>Activity timeline would be displayed here</p>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </TabsContent>
                                        
                                        <TabsContent value="contact">
                                          <Card>
                                            <CardHeader>
                                              <CardTitle>Contact Information</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <h4 className="font-medium mb-2">Student</h4>
                                                  <div className="space-y-1 text-sm">
                                                    <div className="flex items-center gap-2">
                                                      <Mail className="h-4 w-4" />
                                                      {student.email}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                      <Phone className="h-4 w-4" />
                                                      {student.phone}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div>
                                                  <h4 className="font-medium mb-2">Preceptor</h4>
                                                  <div className="space-y-1 text-sm">
                                                    <div>{student.preceptorName}</div>
                                                    <div className="flex items-center gap-2">
                                                      <Mail className="h-4 w-4" />
                                                      {student.preceptorEmail}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex gap-2 pt-4">
                                                <Button className="flex items-center gap-2">
                                                  <MessageSquare className="h-4 w-4" />
                                                  Send Message
                                                </Button>
                                                <Button variant="outline" className="flex items-center gap-2">
                                                  <Phone className="h-4 w-4" />
                                                  Schedule Call
                                                </Button>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </TabsContent>
                                      </Tabs>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {filteredBatches.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground">No student batches found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or search criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}