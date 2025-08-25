import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, GraduationCap, FileText, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentProgressData {
  id: string;
  student_name: string;
  program: string;
  stage: 'inquiry' | 'application' | 'admitted' | 'enrolled' | 'graduated';
  progress_percentage: number;
  next_milestone: string;
  documents_submitted: number;
  documents_required: number;
  tuition_paid: number;
  tuition_total: number;
  enrollment_date?: string;
  expected_graduation?: string;
}

export function StudentProgressTracker() {
  const [students, setStudents] = useState<StudentProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadStudentProgress();
  }, []);

  const loadStudentProgress = async () => {
    try {
      // Since we don't have a dedicated student progress table, 
      // we'll create mock data based on action_queue and signals
      const mockProgressData: StudentProgressData[] = [
        {
          id: '1',
          student_name: 'Emma Johnson',
          program: 'Computer Science',
          stage: 'application',
          progress_percentage: 65,
          next_milestone: 'Submit transcript',
          documents_submitted: 3,
          documents_required: 5,
          tuition_paid: 0,
          tuition_total: 15000,
          enrollment_date: '2024-01-15',
          expected_graduation: '2026-05-15'
        },
        {
          id: '2',
          student_name: 'Michael Chen',
          program: 'Business Administration',
          stage: 'admitted',
          progress_percentage: 85,
          next_milestone: 'Complete enrollment deposit',
          documents_submitted: 5,
          documents_required: 5,
          tuition_paid: 1000,
          tuition_total: 12000,
          enrollment_date: '2024-02-01',
          expected_graduation: '2025-12-15'
        },
        {
          id: '3',
          student_name: 'Sarah Williams',
          program: 'Nursing',
          stage: 'enrolled',
          progress_percentage: 95,
          next_milestone: 'Begin orientation',
          documents_submitted: 6,
          documents_required: 6,
          tuition_paid: 8000,
          tuition_total: 18000,
          enrollment_date: '2024-01-08',
          expected_graduation: '2026-08-15'
        }
      ];

      setStudents(mockProgressData);
    } catch (error) {
      console.error('Error loading student progress:', error);
      toast({
        title: "Error",
        description: "Failed to load student progress data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'inquiry': return 'bg-blue-100 text-blue-800';
      case 'application': return 'bg-yellow-100 text-yellow-800';
      case 'admitted': return 'bg-green-100 text-green-800';
      case 'enrolled': return 'bg-purple-100 text-purple-800';
      case 'graduated': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'inquiry': return User;
      case 'application': return FileText;
      case 'admitted': return GraduationCap;
      case 'enrolled': return Calendar;
      case 'graduated': return GraduationCap;
      default: return User;
    }
  };

  const filteredStudents = students.filter(student => 
    selectedStage === 'all' || student.stage === selectedStage
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Progress Tracker</h1>
          <p className="text-muted-foreground">
            Monitor student journey from inquiry to graduation
          </p>
        </div>
      </div>

      {/* Stage Filter */}
      <div className="flex items-center space-x-2">
        {['all', 'inquiry', 'application', 'admitted', 'enrolled', 'graduated'].map(stage => (
          <Button
            key={stage}
            variant={selectedStage === stage ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStage(stage)}
            className="capitalize"
          >
            {stage === 'all' ? 'All Stages' : stage}
          </Button>
        ))}
      </div>

      {/* Student Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => {
          const StageIcon = getStageIcon(student.stage);
          
          return (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{student.student_name}</CardTitle>
                  <Badge className={getStageColor(student.stage)}>
                    {student.stage}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{student.program}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Overall Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{student.progress_percentage}%</span>
                  </div>
                  <Progress value={student.progress_percentage} className="h-2" />
                </div>

                {/* Next Milestone */}
                <div className="flex items-center space-x-2">
                  <StageIcon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Next Milestone</p>
                    <p className="text-xs text-muted-foreground">{student.next_milestone}</p>
                  </div>
                </div>

                {/* Documents Progress */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Documents</span>
                  </div>
                  <span className="text-sm font-medium">
                    {student.documents_submitted}/{student.documents_required}
                  </span>
                </div>

                {/* Tuition Progress */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Tuition</span>
                  </div>
                  <span className="text-sm font-medium">
                    ${student.tuition_paid.toLocaleString()}/${student.tuition_total.toLocaleString()}
                  </span>
                </div>

                {/* Key Dates */}
                {student.enrollment_date && (
                  <div className="text-xs text-muted-foreground">
                    <p>Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}</p>
                    {student.expected_graduation && (
                      <p>Expected Graduation: {new Date(student.expected_graduation).toLocaleDateString()}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{students.length}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {students.filter(s => s.stage === 'enrolled').length}
            </p>
            <p className="text-sm text-muted-foreground">Currently Enrolled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {students.filter(s => s.stage === 'application').length}
            </p>
            <p className="text-sm text-muted-foreground">In Application</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(students.reduce((acc, s) => acc + s.progress_percentage, 0) / students.length)}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}