import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Eye, 
  Plus, 
  Star, 
  TrendingUp,
  Users,
  Target,
  FileText,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
  level: 'beginner' | 'developing' | 'proficient' | 'advanced';
  targetLevel: 'proficient' | 'advanced';
  progress: number;
  lastAssessed: string;
  evaluatorName: string;
  evaluatorType: 'preceptor' | 'instructor' | 'peer';
  status: 'not_started' | 'in_progress' | 'completed' | 'needs_improvement';
}

const dummyCompetencies: Competency[] = [
  {
    id: '1',
    name: 'Patient Assessment',
    description: 'Ability to conduct comprehensive patient assessments',
    category: 'Clinical Skills',
    level: 'proficient',
    targetLevel: 'proficient',
    progress: 85,
    lastAssessed: '2024-09-20',
    evaluatorName: 'Dr. Sarah Johnson',
    evaluatorType: 'preceptor',
    status: 'completed'
  },
  {
    id: '2',
    name: 'Medication Administration',
    description: 'Safe and accurate medication administration practices',
    category: 'Clinical Skills',
    level: 'developing',
    targetLevel: 'proficient',
    progress: 65,
    lastAssessed: '2024-09-18',
    evaluatorName: 'Nurse Mary Chen',
    evaluatorType: 'preceptor',
    status: 'in_progress'
  },
  {
    id: '3',
    name: 'Clinical Documentation',
    description: 'Accurate and timely clinical documentation',
    category: 'Documentation',
    level: 'proficient',
    targetLevel: 'advanced',
    progress: 90,
    lastAssessed: '2024-09-22',
    evaluatorName: 'Dr. Michael Kim',
    evaluatorType: 'instructor',
    status: 'completed'
  },
  {
    id: '4',
    name: 'Emergency Procedures',
    description: 'Response to emergency situations and protocols',
    category: 'Emergency Care',
    level: 'developing',
    targetLevel: 'proficient',
    progress: 45,
    lastAssessed: '2024-09-15',
    evaluatorName: 'Dr. Sarah Johnson',
    evaluatorType: 'preceptor',
    status: 'needs_improvement'
  },
  {
    id: '5',
    name: 'Patient Communication',
    description: 'Effective communication with patients and families',
    category: 'Communication',
    level: 'proficient',
    targetLevel: 'proficient',
    progress: 88,
    lastAssessed: '2024-09-21',
    evaluatorName: 'Social Worker Lisa Rodriguez',
    evaluatorType: 'instructor',
    status: 'completed'
  },
  {
    id: '6',
    name: 'Team Collaboration',
    description: 'Working effectively within healthcare teams',
    category: 'Professional Skills',
    level: 'developing',
    targetLevel: 'proficient',
    progress: 70,
    lastAssessed: '2024-09-19',
    evaluatorName: 'Charge Nurse Robert Kim',
    evaluatorType: 'preceptor',
    status: 'in_progress'
  }
];

export function CompetencyTracker() {
  const { session } = useAuth();
  const [competencies] = useState<Competency[]>(dummyCompetencies);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCompetency, setSelectedCompetency] = useState<Competency | null>(null);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

  const categories = ['all', ...Array.from(new Set(competencies.map(c => c.category)))];

  const filteredCompetencies = selectedCategory === 'all' 
    ? competencies 
    : competencies.filter(c => c.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs_improvement': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'proficient': return 'bg-green-100 text-green-800 border-green-200';
      case 'developing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const overallProgress = Math.round(
    competencies.reduce((sum, comp) => sum + comp.progress, 0) / competencies.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competency Tracker</h1>
          <p className="text-muted-foreground">
            Monitor and evaluate student competency development
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Evaluation
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Across all competencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competencies.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {competencies.length} competencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competencies.filter(c => c.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently being developed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competencies.filter(c => c.status === 'needs_improvement').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require additional focus
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Competency List</TabsTrigger>
          <TabsTrigger value="matrix">Competency Matrix</TabsTrigger>
          <TabsTrigger value="progress">Progress Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Filter */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Competencies</CardTitle>
                  <CardDescription>Track student competency development progress</CardDescription>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCompetencies.map((competency) => (
                  <div
                    key={competency.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{competency.name}</h3>
                        <Badge className={getStatusColor(competency.status)}>
                          {competency.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getLevelColor(competency.level)}>
                          {competency.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{competency.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Category: {competency.category}</span>
                        <span>Last assessed: {competency.lastAssessed}</span>
                        <span>Evaluator: {competency.evaluatorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={competency.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-12">{competency.progress}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCompetency(competency)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCompetency(competency);
                          setIsEvaluationOpen(true);
                        }}
                      >
                        <Award className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competency Matrix</CardTitle>
              <CardDescription>Visual overview of competency levels across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Competency</th>
                      <th className="text-center p-3">Current Level</th>
                      <th className="text-center p-3">Target Level</th>
                      <th className="text-center p-3">Progress</th>
                      <th className="text-center p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competencies.map((competency) => (
                      <tr key={competency.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{competency.name}</div>
                            <div className="text-sm text-muted-foreground">{competency.category}</div>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant="outline" className={getLevelColor(competency.level)}>
                            {competency.level}
                          </Badge>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant="outline" className={getLevelColor(competency.targetLevel)}>
                            {competency.targetLevel}
                          </Badge>
                        </td>
                        <td className="text-center p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={competency.progress} className="w-20 h-2" />
                            <span className="text-sm">{competency.progress}%</span>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          <Badge className={getStatusColor(competency.status)}>
                            {competency.status.replace('_', ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress by Category</CardTitle>
                <CardDescription>Average competency levels across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.slice(1).map((category) => {
                    const categoryCompetencies = competencies.filter(c => c.category === category);
                    const avgProgress = Math.round(
                      categoryCompetencies.reduce((sum, comp) => sum + comp.progress, 0) / categoryCompetencies.length
                    );
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{category}</span>
                          <span className="text-sm text-muted-foreground">{avgProgress}%</span>
                        </div>
                        <Progress value={avgProgress} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Evaluations</CardTitle>
                <CardDescription>Latest competency assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competencies
                    .sort((a, b) => new Date(b.lastAssessed).getTime() - new Date(a.lastAssessed).getTime())
                    .slice(0, 5)
                    .map((competency) => (
                      <div key={competency.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{competency.name}</div>
                          <div className="text-sm text-muted-foreground">
                            by {competency.evaluatorName} • {competency.lastAssessed}
                          </div>
                        </div>
                        <Badge variant="outline" className={getLevelColor(competency.level)}>
                          {competency.level}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Evaluation Dialog */}
      <Dialog open={isEvaluationOpen} onOpenChange={setIsEvaluationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Evaluate Competency</DialogTitle>
            <DialogDescription>
              Assess student performance for: {selectedCompetency?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Level</Label>
                <Select defaultValue={selectedCompetency?.level}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="developing">Developing</SelectItem>
                    <SelectItem value="proficient">Proficient</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select defaultValue={selectedCompetency?.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="needs_improvement">Needs Improvement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Evaluation Notes</Label>
              <Textarea 
                placeholder="Provide detailed feedback on student performance..."
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEvaluationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Competency evaluation saved');
              setIsEvaluationOpen(false);
            }}>
              Save Evaluation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}