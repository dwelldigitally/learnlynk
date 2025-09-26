import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileText, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Edit, 
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  User,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Evaluation {
  id: string;
  studentName: string;
  studentEmail: string;
  programName: string;
  siteName: string;
  evaluationType: 'midterm' | 'final' | 'competency' | 'incident';
  evaluatorName: string;
  evaluatorRole: 'preceptor' | 'instructor' | 'coordinator';
  overallRating: number;
  submittedDate: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  categories: Array<{
    name: string;
    score: number;
    maxScore: number;
    comments?: string;
  }>;
  recommendations: string;
  actionItems: string[];
  requiresFollowup: boolean;
}

const dummyEvaluations: Evaluation[] = [
  {
    id: '1',
    studentName: 'Sarah Johnson',
    studentEmail: 'sarah.johnson@email.com',
    programName: 'Nursing Practicum',
    siteName: 'General Hospital',
    evaluationType: 'midterm',
    evaluatorName: 'Dr. Michael Chen',
    evaluatorRole: 'preceptor',
    overallRating: 4.2,
    submittedDate: '2024-09-20',
    dueDate: '2024-09-25',
    status: 'completed',
    categories: [
      { name: 'Clinical Skills', score: 85, maxScore: 100, comments: 'Shows excellent technical proficiency' },
      { name: 'Patient Communication', score: 90, maxScore: 100, comments: 'Outstanding bedside manner' },
      { name: 'Documentation', score: 80, maxScore: 100, comments: 'Good attention to detail, room for improvement in timeliness' },
      { name: 'Professional Behavior', score: 95, maxScore: 100, comments: 'Exemplary professionalism' },
      { name: 'Critical Thinking', score: 82, maxScore: 100, comments: 'Demonstrates good problem-solving skills' }
    ],
    recommendations: 'Continue to develop time management skills for documentation. Consider leadership opportunities.',
    actionItems: [
      'Practice electronic health record navigation',
      'Shadow charge nurse for one shift',
      'Complete advanced cardiac life support training'
    ],
    requiresFollowup: false
  },
  {
    id: '2',
    studentName: 'Michael Rodriguez',
    studentEmail: 'michael.rodriguez@email.com',
    programName: 'Physical Therapy',
    siteName: 'Rehabilitation Center',
    evaluationType: 'competency',
    evaluatorName: 'Dr. Emma Williams',
    evaluatorRole: 'preceptor',
    overallRating: 3.1,
    submittedDate: '',
    dueDate: '2024-09-30',
    status: 'overdue',
    categories: [
      { name: 'Manual Therapy', score: 65, maxScore: 100 },
      { name: 'Exercise Prescription', score: 70, maxScore: 100 },
      { name: 'Patient Assessment', score: 75, maxScore: 100 },
      { name: 'Treatment Planning', score: 68, maxScore: 100 }
    ],
    recommendations: 'Requires additional practice with manual therapy techniques and patient interaction.',
    actionItems: [
      'Schedule additional hands-on practice sessions',
      'Review manual therapy protocols',
      'Improve patient communication skills'
    ],
    requiresFollowup: true
  },
  {
    id: '3',
    studentName: 'Emily Chen',
    studentEmail: 'emily.chen@email.com',
    programName: 'Clinical Psychology',
    siteName: 'Mental Health Center',
    evaluationType: 'final',
    evaluatorName: 'Dr. Lisa Rodriguez',
    evaluatorRole: 'instructor',
    overallRating: 4.8,
    submittedDate: '2024-09-22',
    dueDate: '2024-09-25',
    status: 'completed',
    categories: [
      { name: 'Assessment Skills', score: 95, maxScore: 100, comments: 'Exceptional diagnostic abilities' },
      { name: 'Therapeutic Techniques', score: 92, maxScore: 100, comments: 'Strong rapport with clients' },
      { name: 'Ethics & Professional Standards', score: 98, maxScore: 100, comments: 'Exemplary ethical decision-making' },
      { name: 'Case Documentation', score: 90, maxScore: 100, comments: 'Thorough and accurate records' }
    ],
    recommendations: 'Ready for independent practice. Consider specialized training in trauma therapy.',
    actionItems: [
      'Complete trauma-informed care certification',
      'Attend continuing education workshops',
      'Pursue specialty certification'
    ],
    requiresFollowup: false
  }
];

export function EvaluationCenter() {
  const { session } = useAuth();
  const [evaluations] = useState<Evaluation[]>(dummyEvaluations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.siteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || evaluation.status === statusFilter;
    const matchesType = typeFilter === 'all' || evaluation.evaluationType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'final': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'midterm': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'competency': return 'bg-green-100 text-green-800 border-green-200';
      case 'incident': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const statusCounts = {
    pending: evaluations.filter(e => e.status === 'pending').length,
    in_progress: evaluations.filter(e => e.status === 'in_progress').length,
    completed: evaluations.filter(e => e.status === 'completed').length,
    overdue: evaluations.filter(e => e.status === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluation Center</h1>
          <p className="text-muted-foreground">
            Manage student evaluations and performance assessments
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Evaluations
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Evaluation
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting submission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Edit className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.in_progress}</div>
            <p className="text-xs text-muted-foreground">Being completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.overdue}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="evaluations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="evaluations">All Evaluations</TabsTrigger>
          <TabsTrigger value="templates">Evaluation Templates</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluations" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <CardTitle>Student Evaluations</CardTitle>
                  <CardDescription>Review and manage all student performance evaluations</CardDescription>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search evaluations..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="midterm">Midterm</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="competency">Competency</SelectItem>
                      <SelectItem value="incident">Incident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvaluations.map((evaluation) => (
                  <div
                    key={evaluation.id}
                    className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {evaluation.studentName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{evaluation.studentName}</h3>
                          <Badge className={getStatusColor(evaluation.status)}>
                            {evaluation.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getTypeColor(evaluation.evaluationType)}>
                            {evaluation.evaluationType}
                          </Badge>
                          {evaluation.requiresFollowup && (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                              Follow-up Required
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{evaluation.programName}</span>
                          <span>{evaluation.siteName}</span>
                          <span>Evaluator: {evaluation.evaluatorName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {evaluation.dueDate}
                          </span>
                          {evaluation.submittedDate && (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Submitted: {evaluation.submittedDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {evaluation.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <div className="flex">{getRatingStars(evaluation.overallRating)}</div>
                          <span className="text-sm font-medium">{evaluation.overallRating.toFixed(1)}</span>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEvaluation(evaluation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Templates</CardTitle>
              <CardDescription>Manage standardized evaluation forms and rubrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Templates Created</h3>
                <p className="text-muted-foreground mb-4">Create evaluation templates to standardize assessments</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Ratings by Program</CardTitle>
                <CardDescription>Overall performance across different programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(evaluations.map(e => e.programName))).map((program) => {
                    const programEvals = evaluations.filter(e => e.programName === program && e.status === 'completed');
                    const avgRating = programEvals.length > 0 
                      ? programEvals.reduce((sum, evaluation) => sum + evaluation.overallRating, 0) / programEvals.length 
                      : 0;
                    return (
                      <div key={program} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{program}</span>
                          <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)}/5.0</span>
                        </div>
                        <Progress value={(avgRating / 5) * 100} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evaluation Status Distribution</CardTitle>
                <CardDescription>Current status of all evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(statusCounts).map(([status, count]) => {
                    const percentage = (count / evaluations.length) * 100;
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">{status.replace('_', ' ')}</span>
                          <span className="text-sm text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Evaluation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Evaluation</DialogTitle>
            <DialogDescription>
              Create a new evaluation for a student's practicum performance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Student</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="michael">Michael Rodriguez</SelectItem>
                    <SelectItem value="emily">Emily Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Evaluation Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="midterm">Midterm</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                    <SelectItem value="competency">Competency</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Evaluator</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select evaluator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chen">Dr. Michael Chen</SelectItem>
                    <SelectItem value="williams">Dr. Emma Williams</SelectItem>
                    <SelectItem value="rodriguez">Dr. Lisa Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <Label>Instructions</Label>
              <Textarea 
                placeholder="Provide specific instructions for this evaluation..."
                className="h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Evaluation created and assigned');
              setIsCreateDialogOpen(false);
            }}>
              Create Evaluation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evaluation Detail Dialog */}
      {selectedEvaluation && (
        <Dialog open={!!selectedEvaluation} onOpenChange={() => setSelectedEvaluation(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Evaluation Details</DialogTitle>
              <DialogDescription>
                {selectedEvaluation.evaluationType} evaluation for {selectedEvaluation.studentName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Student</div>
                  <div className="font-medium">{selectedEvaluation.studentName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Program</div>
                  <div className="font-medium">{selectedEvaluation.programName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Site</div>
                  <div className="font-medium">{selectedEvaluation.siteName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Evaluator</div>
                  <div className="font-medium">{selectedEvaluation.evaluatorName}</div>
                </div>
              </div>

              {/* Rating Categories */}
              {selectedEvaluation.status === 'completed' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Performance Categories</h3>
                  <div className="space-y-4">
                    {selectedEvaluation.categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.score}/{category.maxScore}
                          </span>
                        </div>
                        <Progress value={(category.score / category.maxScore) * 100} />
                        {category.comments && (
                          <p className="text-sm text-muted-foreground">{category.comments}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedEvaluation.recommendations && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                  <p className="text-muted-foreground">{selectedEvaluation.recommendations}</p>
                </div>
              )}

              {/* Action Items */}
              {selectedEvaluation.actionItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Action Items</h3>
                  <ul className="space-y-2">
                    {selectedEvaluation.actionItems.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedEvaluation(null)}>
                Close
              </Button>
              {selectedEvaluation.status !== 'completed' && (
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Evaluation
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}