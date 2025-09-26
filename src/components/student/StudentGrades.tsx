import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  TrendingUp, 
  Award, 
  Calendar,
  FileText,
  Download,
  BarChart3
} from 'lucide-react';

interface Grade {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  gradePoints: number;
  percentage: number;
  semester: string;
  year: number;
  instructor: string;
  status: 'Complete' | 'In Progress' | 'Incomplete';
}

interface Assignment {
  id: string;
  courseCode: string;
  name: string;
  type: 'Assignment' | 'Quiz' | 'Midterm' | 'Final' | 'Project';
  grade: number;
  maxPoints: number;
  dueDate: string;
  submittedDate: string;
  feedback?: string;
}

const mockGrades: Grade[] = [
  {
    id: '1',
    courseCode: 'NURS 1010',
    courseName: 'Fundamentals of Nursing',
    credits: 4,
    grade: 'A',
    gradePoints: 4.0,
    percentage: 92,
    semester: 'Fall',
    year: 2024,
    instructor: 'Dr. Sarah Johnson',
    status: 'Complete'
  },
  {
    id: '2',
    courseCode: 'COMP 2714',
    courseName: 'Database Systems',
    credits: 3,
    grade: 'B+',
    gradePoints: 3.3,
    percentage: 87,
    semester: 'Fall',
    year: 2024,
    instructor: 'Prof. Michael Chen',
    status: 'Complete'
  },
  {
    id: '3',
    courseCode: 'BUSN 3300',
    courseName: 'International Business',
    credits: 3,
    grade: 'A-',
    gradePoints: 3.7,
    percentage: 89,
    semester: 'Spring',
    year: 2024,
    instructor: 'Dr. Emily Rodriguez',
    status: 'In Progress'
  }
];

const mockAssignments: Assignment[] = [
  {
    id: '1',
    courseCode: 'NURS 1010',
    name: 'Patient Care Plan Assignment',
    type: 'Assignment',
    grade: 45,
    maxPoints: 50,
    dueDate: '2024-12-15',
    submittedDate: '2024-12-14',
    feedback: 'Excellent work on patient assessment. Consider more detailed nursing interventions.'
  },
  {
    id: '2',
    courseCode: 'COMP 2714',
    name: 'Database Design Project',
    type: 'Project',
    grade: 87,
    maxPoints: 100,
    dueDate: '2024-12-20',
    submittedDate: '2024-12-19',
    feedback: 'Good normalization and ER diagram. Missing some constraints.'
  }
];

export default function StudentGrades() {
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const semesters = [...new Set(mockGrades.map(grade => grade.semester))];
  const years = [...new Set(mockGrades.map(grade => grade.year.toString()))];

  const filteredGrades = mockGrades.filter(grade => {
    const matchesSemester = selectedSemester === 'all' || grade.semester === selectedSemester;
    const matchesYear = selectedYear === 'all' || grade.year.toString() === selectedYear;
    return matchesSemester && matchesYear;
  });

  const currentGPA = filteredGrades.length > 0 
    ? (filteredGrades.reduce((sum, grade) => sum + (grade.gradePoints * grade.credits), 0) /
       filteredGrades.reduce((sum, grade) => sum + grade.credits, 0)).toFixed(2)
    : '0.00';

  const totalCredits = filteredGrades.reduce((sum, grade) => sum + grade.credits, 0);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
      case 'A+':
        return 'bg-green-500';
      case 'A-':
      case 'B+':
        return 'bg-blue-500';
      case 'B':
      case 'B-':
        return 'bg-yellow-500';
      case 'C+':
      case 'C':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">My Grades</h1>
          <p className="text-xl text-muted-foreground">
            Track your academic performance and view detailed grade reports
          </p>
        </div>

        {/* GPA Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current GPA</p>
                  <p className="text-2xl font-bold text-foreground">{currentGPA}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credits Earned</p>
                  <p className="text-2xl font-bold text-foreground">{totalCredits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Courses Completed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {filteredGrades.filter(g => g.status === 'Complete').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-foreground">
                    {filteredGrades.filter(g => g.status === 'In Progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="grades" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grades">Course Grades</TabsTrigger>
            <TabsTrigger value="assignments">Assignment Details</TabsTrigger>
          </TabsList>

          <TabsContent value="grades" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Grade Report</CardTitle>
                  <div className="flex gap-4">
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        {semesters.map(semester => (
                          <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Transcript
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Grades Table */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredGrades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg ${getGradeColor(grade.grade)} flex items-center justify-center`}>
                            <span className="text-white font-bold text-lg">{grade.grade}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{grade.courseCode}</h3>
                            <p className="text-sm text-muted-foreground">{grade.courseName}</p>
                            <p className="text-xs text-muted-foreground">{grade.instructor}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Credits</p>
                          <p className="font-semibold">{grade.credits}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Percentage</p>
                          <p className="font-semibold">{grade.percentage}%</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Grade Points</p>
                          <p className="font-semibold">{grade.gradePoints}</p>
                        </div>
                        
                        <div className="text-center min-w-[100px]">
                          <Badge variant={grade.status === 'Complete' ? 'default' : 'secondary'}>
                            {grade.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Assignment Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAssignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{assignment.name}</h3>
                            <p className="text-sm text-muted-foreground">{assignment.courseCode}</p>
                          </div>
                          <Badge variant="outline">{assignment.type}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Score</p>
                            <p className="font-semibold text-lg">
                              {assignment.grade}/{assignment.maxPoints}
                            </p>
                            <Progress 
                              value={(assignment.grade / assignment.maxPoints) * 100} 
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Due Date</p>
                            <p className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Submitted</p>
                            <p className="font-medium">{new Date(assignment.submittedDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        {assignment.feedback && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Instructor Feedback:</p>
                            <p className="text-sm">{assignment.feedback}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}