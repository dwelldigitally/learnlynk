import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
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
  Award,
  TrendingUp,
  Star,
  Target,
  Activity,
  ArrowRight,
  Eye,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  BarChart3,
  Download,
  Send,
  Settings,
  Filter,
  Search
} from 'lucide-react';
import { usePracticumOverview } from '@/hooks/usePracticum';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/modern/GlassCard';
import { NeoCard } from '@/components/modern/NeoCard';
import { supabase } from '@/integrations/supabase/client';
import { PROGRAM_INTAKE_DATES, getUpcomingIntakeDatesForProgram } from '@/constants/intakeDates';

// Types for batch management
interface BatchData {
  id: string;
  program: string;
  intakeDate: string;
  studentCount: number;
  capacity: number;
  status: 'about-to-start' | 'active' | 'about-to-end' | 'unscheduled' | 'missing-docs' | 'missing-attendance' | 'completed';
  completionRate?: number;
  attendanceRate?: number;
  documentComplianceRate?: number;
  site?: string;
  startDate?: string;
  endDate?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  students: Array<{
    id: string;
    name: string;
    progress: number;
    missingItems?: string[];
    lastActivity?: string;
  }>;
}

// Generate realistic batch data based on intake dates
const generateBatchData = (): BatchData[] => {
  const programs = Object.keys(PROGRAM_INTAKE_DATES);
  const batches: BatchData[] = [];
  const now = new Date();
  
  programs.forEach(program => {
    const intakeDates = PROGRAM_INTAKE_DATES[program as keyof typeof PROGRAM_INTAKE_DATES];
    
    intakeDates.forEach(intake => {
      const intakeDate = new Date(intake.date);
      const daysDiff = Math.floor((intakeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine batch status based on timeline
      let status: BatchData['status'] = 'unscheduled';
      let urgencyLevel: BatchData['urgencyLevel'] = 'low';
      
      if (daysDiff < -120) { // Completed
        status = 'completed';
      } else if (daysDiff < -14) { // Active practicum
        status = Math.random() > 0.7 ? 'missing-attendance' : 'active';
        urgencyLevel = status === 'missing-attendance' ? 'high' : 'medium';
      } else if (daysDiff < 14) { // About to end
        status = 'about-to-end';
        urgencyLevel = 'high';
      } else if (daysDiff < 60) { // About to start
        status = Math.random() > 0.8 ? 'missing-docs' : 'about-to-start';
        urgencyLevel = status === 'missing-docs' ? 'critical' : 'medium';
      }
      
      // Generate students for this batch
      const studentCount = Math.min(intake.enrolled, intake.capacity);
      const students = Array.from({ length: studentCount }, (_, i) => ({
        id: `${intake.id}-student-${i}`,
        name: `Student ${i + 1}`,
        progress: Math.floor(Math.random() * 100),
        missingItems: status === 'missing-docs' ? ['Health Certificate', 'Background Check'] : undefined,
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      if (studentCount > 0) {
        batches.push({
          id: intake.id,
          program,
          intakeDate: intake.date,
          studentCount,
          capacity: intake.capacity,
          status,
          urgencyLevel,
          completionRate: Math.floor(Math.random() * 100),
          attendanceRate: Math.floor(80 + Math.random() * 20),
          documentComplianceRate: Math.floor(70 + Math.random() * 30),
          site: `Site ${Math.floor(Math.random() * 5) + 1}`,
          startDate: new Date(intakeDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(intakeDate.getTime() + 150 * 24 * 60 * 60 * 1000).toISOString(),
          students
        });
      }
    });
  });
  
  return batches.sort((a, b) => new Date(a.intakeDate).getTime() - new Date(b.intakeDate).getTime());
};

export function PracticumDashboard() {
  const { session } = useAuth();
  const { data: overview, isLoading, refetch } = usePracticumOverview(session?.user?.id || '');
  const [isSeeding, setIsSeeding] = useState(false);
  const [batchData] = useState(() => generateBatchData());
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());
  
  const toggleBatch = (batchId: string) => {
    const newExpanded = new Set(expandedBatches);
    if (newExpanded.has(batchId)) {
      newExpanded.delete(batchId);
    } else {
      newExpanded.add(batchId);
    }
    setExpandedBatches(newExpanded);
  };
  
  const handleAddDummyData = async () => {
    console.log('🚀 Add Sample Data clicked');
    console.log('User session:', session?.user?.id);
    
    if (!session?.user?.id) {
      console.error('❌ No user session found');
      toast.error('You must be logged in to add sample data');
      return;
    }

    setIsSeeding(true);
    console.log('💾 Starting database operations...');
    try {
      // Create practicum sites
      const sites = [
        {
          user_id: session.user.id,
          name: 'General Hospital',
          organization: 'City Medical Center',
          contact_person: 'Dr. Sarah Johnson',
          contact_email: 'sarah.johnson@generalhospital.com',
          contact_phone: '(555) 123-4567',
          address: '123 Medical Drive',
          city: 'Metro City',
          state: 'CA',
          country: 'USA',
          postal_code: '12345',
          max_capacity_per_semester: 8,
          specializations: ['Emergency Medicine', 'Internal Medicine', 'Surgery'],
          requirements: { documents: ['Medical clearance', 'Background check', 'Immunizations'] },
          is_active: true
        }
      ];

      console.log('📍 Inserting practicum sites...');
      const { data: siteData, error: siteError } = await supabase
        .from('practicum_sites')
        .insert(sites)
        .select();

      if (siteError) {
        console.error('❌ Site insertion error:', siteError);
        throw siteError;
      }
      console.log('✅ Sites inserted successfully:', siteData);

      await refetch();
      toast.success('Sample practicum data added successfully!');
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast.error('Failed to add sample data. Please try again.');
    } finally {
      setIsSeeding(false);
    }
  };
  
  // Categorize batches
  const categorizedBatches = {
    aboutToStart: batchData.filter(b => b.status === 'about-to-start'),
    unscheduled: batchData.filter(b => b.status === 'unscheduled'),
    missingDocs: batchData.filter(b => b.status === 'missing-docs'),
    active: batchData.filter(b => b.status === 'active'),
    missingAttendance: batchData.filter(b => b.status === 'missing-attendance'),
    aboutToEnd: batchData.filter(b => b.status === 'about-to-end'),
    completed: batchData.filter(b => b.status === 'completed')
  };

  // Calculate KPIs
  const totalStudents = batchData.reduce((sum, batch) => sum + batch.studentCount, 0);
  const activePracticums = categorizedBatches.active.length + categorizedBatches.missingAttendance.length;
  const averageCompletion = Math.round(
    batchData.reduce((sum, batch) => sum + (batch.completionRate || 0), 0) / batchData.length
  );
  const criticalIssues = batchData.filter(b => b.urgencyLevel === 'critical').length;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in p-6">
        <div className="h-8 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gradient-to-br from-muted to-muted/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const kpiStats = [
    {
      title: "Total Students",
      count: totalStudents,
      icon: <Users className="h-5 w-5" />,
      gradient: "from-blue-500 to-indigo-600",
      description: "Students across all batches",
      trend: "+12%"
    },
    {
      title: "Active Practicums", 
      count: activePracticums,
      icon: <Activity className="h-5 w-5" />,
      gradient: "from-green-500 to-emerald-600",
      description: "Currently in practicum",
      trend: "+8%"
    },
    {
      title: "Avg Completion",
      count: `${averageCompletion}%`,
      icon: <Target className="h-5 w-5" />,
      gradient: "from-purple-500 to-violet-600",
      description: "Average completion rate",
      trend: "+5%"
    },
    {
      title: "Critical Issues",
      count: criticalIssues,
      icon: <AlertTriangle className="h-5 w-5" />,
      gradient: "from-red-500 to-rose-600",
      description: "Requiring immediate attention",
      trend: "-15%"
    }
  ];

  const BatchCard = ({ batch }: { batch: BatchData }) => {
    const isExpanded = expandedBatches.has(batch.id);
    const statusConfig = {
      'about-to-start': { color: 'bg-blue-500', icon: PlayCircle, label: 'Starting Soon' },
      'active': { color: 'bg-green-500', icon: Activity, label: 'Active' },
      'about-to-end': { color: 'bg-orange-500', icon: StopCircle, label: 'Ending Soon' },
      'unscheduled': { color: 'bg-gray-500', icon: Calendar, label: 'Unscheduled' },
      'missing-docs': { color: 'bg-red-500', icon: FileText, label: 'Missing Docs' },
      'missing-attendance': { color: 'bg-amber-500', icon: AlertCircle, label: 'Missing Attendance' },
      'completed': { color: 'bg-emerald-500', icon: CheckCircle, label: 'Completed' }
    };
    
    const config = statusConfig[batch.status];
    const Icon = config.icon;
    
    return (
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <Collapsible open={isExpanded} onOpenChange={() => toggleBatch(batch.id)}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{batch.program}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(batch.intakeDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={batch.urgencyLevel === 'critical' ? 'destructive' : 'secondary'}>
                    {config.label}
                  </Badge>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{batch.studentCount}</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{Math.round((batch.studentCount / batch.capacity) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Capacity</div>
                  </div>
                  {batch.completionRate && (
                    <div className="text-center">
                      <div className="text-lg font-semibold">{batch.completionRate}%</div>
                      <div className="text-xs text-muted-foreground">Progress</div>
                    </div>
                  )}
                </div>
                <Progress value={(batch.studentCount / batch.capacity) * 100} className="w-24" />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  {batch.attendanceRate && (
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold">{batch.attendanceRate}%</div>
                      <div className="text-xs text-muted-foreground">Attendance</div>
                    </div>
                  )}
                  {batch.documentComplianceRate && (
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold">{batch.documentComplianceRate}%</div>
                      <div className="text-xs text-muted-foreground">Compliance</div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Students ({batch.students.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {batch.students.map(student => (
                      <div key={student.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <span className="text-sm font-medium">{student.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={student.progress} className="w-16 h-2" />
                          <span className="text-xs text-muted-foreground">{student.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Practicum Batch Management
            </h1>
            <p className="text-lg text-muted-foreground">Monitor and manage student batches across all practicum stages</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="neo-button group">
              <Filter className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
              Filter Batches
            </Button>
            <Button variant="outline" className="neo-button group">
              <Download className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              <Users className="h-4 w-4 mr-2" />
              Bulk Actions
            </Button>
          </div>
        </div>

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiStats.map((stat, index) => (
            <GlassCard key={index} className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600">{stat.trend}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.count}
                  </h3>
                  <p className="text-lg font-semibold text-foreground/90">{stat.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stat.description}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Batch Categories */}
        <div className="space-y-8">
          {/* Pre-Practicum Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <Calendar className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Pre-Practicum Preparation</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {categorizedBatches.aboutToStart.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600">About to Start Practicum</h3>
                  {categorizedBatches.aboutToStart.map(batch => (
                    <BatchCard key={batch.id} batch={batch} />
                  ))}
                </div>
              )}
              
              {categorizedBatches.unscheduled.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-600">Unscheduled Batches</h3>
                  {categorizedBatches.unscheduled.map(batch => (
                    <BatchCard key={batch.id} batch={batch} />
                  ))}
                </div>
              )}
              
              {categorizedBatches.missingDocs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600">Missing Documents</h3>
                  {categorizedBatches.missingDocs.map(batch => (
                    <BatchCard key={batch.id} batch={batch} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Practicum Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Active Practicum</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {categorizedBatches.active.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600">Currently Active</h3>
                  {categorizedBatches.active.map(batch => (
                    <BatchCard key={batch.id} batch={batch} />
                  ))}
                </div>
              )}
              
              {categorizedBatches.missingAttendance.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-600">Missing Attendance/Grades</h3>
                  {categorizedBatches.missingAttendance.map(batch => (
                    <BatchCard key={batch.id} batch={batch} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Post-Practicum Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500 text-white">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Post-Practicum</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {categorizedBatches.aboutToEnd.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-600">About to Complete</h3>
                  {categorizedBatches.aboutToEnd.map(batch => (
                    <BatchCard key={batch.id} batch={batch} />
                  ))}
                </div>
              )}
              
              {categorizedBatches.completed.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-600">Recently Completed</h3>
                  {categorizedBatches.completed.slice(0, 3).map(batch => (
                    <BatchCard key={batch.id} batch={batch} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}