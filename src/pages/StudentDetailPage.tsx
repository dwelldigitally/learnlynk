import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, FileText, MessageSquare, Clock, BarChart3, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TopNavigationBar } from '@/components/admin/TopNavigationBar';
import { StudentSidebar } from '@/components/admin/students/StudentSidebar';
import { StudentRightSidebar } from '@/components/admin/students/StudentRightSidebar';
import { StudentOverview } from '@/components/admin/students/StudentOverview';
import { StudentApplication } from '@/components/admin/students/StudentApplication';
import { StudentDocuments } from '@/components/admin/students/StudentDocuments';
import { StudentCommunications } from '@/components/admin/students/StudentCommunications';
import { StudentTimeline } from '@/components/admin/students/StudentTimeline';
import { useConditionalStudents } from '@/hooks/useConditionalStudents';

export default function StudentDetailPage() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { toast } = useToast();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use conditional students hook for demo data access
  const { data: demoStudents } = useConditionalStudents();

  // UUID validation function
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    if (studentId) {
      loadStudent();
    }
  }, [studentId, demoStudents, navigate]);

  const loadStudent = async () => {
    if (!studentId) {
      console.log('❌ No studentId found');
      return;
    }
    
    console.log('🔍 Loading student with ID:', studentId);
    
    try {
      setLoading(true);
      
      // First check if it's demo data (simple IDs like "s1", "s2")
      if (demoStudents && !isValidUUID(studentId)) {
        const foundDemoStudent = demoStudents.find((s: any) => s.id === studentId);
        if (foundDemoStudent) {
          // Convert demo student format to expected format
          const convertedStudent = {
            id: foundDemoStudent.id,
            firstName: foundDemoStudent.first_name,
            lastName: foundDemoStudent.last_name,
            email: foundDemoStudent.email,
            studentId: foundDemoStudent.student_id,
            program: foundDemoStudent.program,
            stage: foundDemoStudent.stage,
            progress: foundDemoStudent.progress,
            phone: foundDemoStudent.phone,
            country: foundDemoStudent.country,
            city: foundDemoStudent.city,
            state: foundDemoStudent.state,
            risk_level: foundDemoStudent.risk_level,
            acceptanceLikelihood: foundDemoStudent.acceptance_likelihood,
            leadScore: foundDemoStudent.lead_score,
            gpa: 3.8,
            testScores: { SAT: 1450, TOEFL: 105 },
            applicationDate: '2024-01-15',
            expectedStartDate: '2024-09-01',
            advisor: {
              name: 'Dr. Sarah Wilson',
              email: 'sarah.wilson@university.edu',
              phone: '+1 (555) 987-6543'
            }
          };
          setStudent(convertedStudent);
          console.log('✅ Demo student loaded successfully');
          return;
        }
      }
      
      // If it's a UUID format, try to load real student data
      if (isValidUUID(studentId)) {
        // TODO: Replace with actual API call for real students
        // For now, create mock student data for UUID-based IDs
        const mockStudent = {
          id: studentId,
          firstName: 'Emma',
          lastName: 'Johnson',
          email: 'emma.johnson@email.com',
          studentId: 'STU-2024-001',
          program: 'Computer Science',
          stage: 'DOCUMENT_APPROVAL',
          progress: 75,
          phone: '+1 (555) 123-4567',
          country: 'Canada',
          city: 'Toronto',
          risk_level: 'low',
          acceptanceLikelihood: 85,
          gpa: 3.8,
          testScores: { SAT: 1450, TOEFL: 105 },
          applicationDate: '2024-01-15',
          expectedStartDate: '2024-09-01',
          advisor: {
            name: 'Dr. Sarah Wilson',
            email: 'sarah.wilson@university.edu',
            phone: '+1 (555) 987-6543'
          }
        };
        
        setStudent(mockStudent);
        console.log('✅ Real student mock data loaded successfully');
        return;
      }
      
      // If we get here, student was not found
      throw new Error('Student not found');
      
    } catch (error) {
      console.log('❌ Error loading student:', error);
      toast({
        title: 'Error',
        description: 'Failed to load student',
        variant: 'destructive'
      });
      navigate('/admin/students');
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'LEAD_FORM': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SEND_DOCUMENTS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'DOCUMENT_APPROVAL': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'FEE_PAYMENT': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'ACCEPTED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Student not found</h2>
          <Button onClick={() => navigate('/admin/students')}>
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNavigationBar 
        activeSection="students" 
        onSectionChange={() => {}} 
        onToggleMobileMenu={() => {}} 
      />
      
      {/* Header with back button */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/students')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
            <div>
              <h1 className="text-xl font-bold">{student.firstName} {student.lastName}</h1>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStageColor(student.stage)}>
              {student.stage.replace('_', ' ')}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Progress: <span className="font-semibold text-foreground">{student.progress}%</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Risk: <span className={`font-semibold ${student.risk_level === 'low' ? 'text-green-600' : student.risk_level === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                {student.risk_level.charAt(0).toUpperCase() + student.risk_level.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Sidebar - Student Details */}
        <StudentSidebar student={student} onUpdate={loadStudent} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="application" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Application
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="communications" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Communications
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0">
                <TabsContent value="overview" className="h-full m-0">
                  <StudentOverview student={student} onUpdate={loadStudent} />
                </TabsContent>

                <TabsContent value="application" className="h-full m-0">
                  <StudentApplication student={student} onUpdate={loadStudent} />
                </TabsContent>

                <TabsContent value="documents" className="h-full m-0">
                  <StudentDocuments student={student} onUpdate={loadStudent} />
                </TabsContent>

                <TabsContent value="communications" className="h-full m-0">
                  <StudentCommunications student={student} onUpdate={loadStudent} />
                </TabsContent>

                <TabsContent value="timeline" className="h-full m-0">
                  <StudentTimeline student={student} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
        
        {/* Right Sidebar - AI Insights */}
        <StudentRightSidebar student={student} />
      </div>
    </div>
  );
}