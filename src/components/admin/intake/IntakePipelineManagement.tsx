import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Plus, 
  Calendar, 
  Users, 
  Target, 
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { toast } from 'sonner';

// Helper function to safely format dates
const safeFormatDate = (dateString: string, formatString: string = 'MMM d'): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid Date';
    return format(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error, 'Date string:', dateString);
    return 'Invalid Date';
  }
};

// Dummy data types
interface IntakeData {
  id: string;
  name: string;
  program: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolled: number;
  status: 'active' | 'planning' | 'closed';
  pipelineStrength: number;
  conversionRate: number;
  salesApproach: 'aggressive' | 'balanced' | 'conservative';
  campus: string;
  leads: LeadData[];
  applicants: ApplicantData[];
  students: StudentData[];
}

interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  score: number;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  intakeId: string;
}

interface ApplicantData {
  id: string;
  name: string;
  email: string;
  phone: string;
  applicationDate: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  documentsComplete: boolean;
  interviewScheduled: boolean;
  intakeId: string;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  status: 'enrolled' | 'deferred' | 'withdrawn';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  gpa: number;
  intakeId: string;
}

// Generate dummy data
const generateDummyIntakes = (): IntakeData[] => {
  const programs = ['Health Care Assistant', 'Education Assistant', 'Aviation', 'Hospitality', 'ECE', 'MLA'];
  const campuses = ['Surrey', 'Vancouver', 'Richmond', 'Burnaby'];
  const statuses = ['active', 'planning', 'closed'] as const;
  const salesApproaches = ['aggressive', 'balanced', 'conservative'] as const;

  return Array.from({ length: 8 }, (_, i) => {
    const id = `intake-${i + 1}`;
    const program = programs[i % programs.length];
    const capacity = 25 + Math.floor(Math.random() * 50);
    const enrolled = Math.floor(capacity * (0.3 + Math.random() * 0.6));
    
    return {
      id,
      name: `${program} - ${['Spring', 'Summer', 'Fall', 'Winter'][i % 4]} 2024`,
      program,
      startDate: new Date(2024, (i % 4) * 3, 1).toISOString().split('T')[0],
      endDate: new Date(2024, (i % 4) * 3 + 3, 0).toISOString().split('T')[0],
      capacity,
      enrolled,
      status: statuses[i % 3],
      pipelineStrength: 60 + Math.floor(Math.random() * 40),
      conversionRate: 15 + Math.floor(Math.random() * 25),
      salesApproach: salesApproaches[i % 3],
      campus: campuses[i % campuses.length],
      leads: generateLeads(id, 15 + Math.floor(Math.random() * 20)),
      applicants: generateApplicants(id, 8 + Math.floor(Math.random() * 15)),
      students: generateStudents(id, enrolled)
    };
  });
};

const generateLeads = (intakeId: string, count: number): LeadData[] => {
  const sources = ['Website', 'Social Media', 'Referral', 'Events', 'Partner'];
  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Follow-up'];
  const advisors = ['Sarah Wilson', 'Mike Johnson', 'Emma Davis', 'James Chen'];

  return Array.from({ length: count }, (_, i) => {
    const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const lastContactDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    return {
      id: `lead-${intakeId}-${i + 1}`,
      name: `Lead ${i + 1} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5]}`,
      email: `lead${i + 1}@example.com`,
      phone: `+1-555-${String(i + 1000).slice(-4)}`,
      source: sources[i % sources.length],
      stage: stages[i % stages.length],
      score: 40 + Math.floor(Math.random() * 60),
      assignedTo: advisors[i % advisors.length],
      createdAt: createdDate.toISOString(),
      lastContact: lastContactDate.toISOString(),
      intakeId
    };
  });
};

const generateApplicants = (intakeId: string, count: number): ApplicantData[] => {
  const statuses = ['submitted', 'under_review', 'approved', 'rejected'] as const;

  return Array.from({ length: count }, (_, i) => ({
    id: `applicant-${intakeId}-${i + 1}`,
    name: `Applicant ${i + 1} ${['Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'][i % 5]}`,
    email: `applicant${i + 1}@example.com`,
    phone: `+1-555-${String(i + 2000).slice(-4)}`,
    applicationDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[i % statuses.length],
    documentsComplete: Math.random() > 0.3,
    interviewScheduled: Math.random() > 0.5,
    intakeId
  }));
};

const generateStudents = (intakeId: string, count: number): StudentData[] => {
  const statuses = ['enrolled', 'deferred', 'withdrawn'] as const;
  const paymentStatuses = ['paid', 'pending', 'overdue'] as const;

  return Array.from({ length: count }, (_, i) => ({
    id: `student-${intakeId}-${i + 1}`,
    name: `Student ${i + 1} ${['Anderson', 'Thomas', 'Jackson', 'White', 'Harris'][i % 5]}`,
    email: `student${i + 1}@example.com`,
    phone: `+1-555-${String(i + 3000).slice(-4)}`,
    enrollmentDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[i % statuses.length],
    paymentStatus: paymentStatuses[i % paymentStatuses.length],
    gpa: 2.0 + Math.random() * 2.0,
    intakeId
  }));
};

export function IntakePipelineManagement() {
  const [intakes, setIntakes] = useState<IntakeData[]>(generateDummyIntakes());
  const [selectedIntake, setSelectedIntake] = useState<IntakeData | null>(null);
  const [activeTab, setActiveTab] = useState('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSalesApproachDialog, setShowSalesApproachDialog] = useState(false);
  const [newIntake, setNewIntake] = useState({
    name: '',
    program: '',
    campus: '',
    capacity: 25,
    startDate: '',
    endDate: ''
  });

  // AI Recommendations data
  const getAIRecommendations = (intake: IntakeData) => {
    const recommendations = [
      {
        type: 'conversion',
        title: 'Optimize Conversion Rate',
        description: `Your current conversion rate is ${intake.conversionRate}%. Consider implementing targeted follow-up campaigns for leads in the "Qualified" stage.`,
        priority: 'high',
        action: 'Create nurture sequence'
      },
      {
        type: 'pipeline',
        title: 'Pipeline Strength Alert',
        description: `Pipeline strength is at ${intake.pipelineStrength}%. Increase lead generation activities to meet enrollment targets.`,
        priority: intake.pipelineStrength < 70 ? 'high' : 'medium',
        action: 'Launch marketing campaign'
      },
      {
        type: 'engagement',
        title: 'Engagement Optimization',
        description: 'Leads from "Social Media" source show 23% higher engagement. Consider increasing social media budget.',
        priority: 'medium',
        action: 'Adjust marketing mix'
      }
    ];

    return recommendations;
  };

  const handleIntakeClick = (intake: IntakeData) => {
    setSelectedIntake(intake);
    setSelectedRows([]);
  };

  const handleRowSelection = (id: string, checked: boolean) => {
    setSelectedRows(prev => 
      checked 
        ? [...prev, id]
        : prev.filter(rowId => rowId !== id)
    );
  };

  const handleSelectAll = (checked: boolean, data: any[]) => {
    setSelectedRows(checked ? data.map(item => item.id) : []);
  };

  const handleBulkAction = (action: string) => {
    toast.success(`${action} applied to ${selectedRows.length} selected items`);
    setSelectedRows([]);
    setShowBulkActions(false);
  };

  const handleCreateIntake = () => {
    if (!newIntake.name || !newIntake.program || !newIntake.campus || !newIntake.startDate || !newIntake.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const id = `intake-${Date.now()}`;
    const intake: IntakeData = {
      id,
      name: newIntake.name,
      program: newIntake.program,
      campus: newIntake.campus,
      startDate: newIntake.startDate,
      endDate: newIntake.endDate,
      capacity: newIntake.capacity,
      enrolled: 0,
      status: 'planning',
      pipelineStrength: 50,
      conversionRate: 20,
      salesApproach: 'balanced',
      leads: [],
      applicants: [],
      students: []
    };

    setIntakes(prev => [...prev, intake]);
    setNewIntake({
      name: '',
      program: '',
      campus: '',
      capacity: 25,
      startDate: '',
      endDate: ''
    });
    setShowCreateDialog(false);
    toast.success('Intake created successfully');
  };

  const handleUpdateSalesApproach = (approach: 'aggressive' | 'balanced' | 'conservative') => {
    if (selectedIntake) {
      const updatedIntake = { ...selectedIntake, salesApproach: approach };
      setIntakes(prev => prev.map(intake => 
        intake.id === selectedIntake.id ? updatedIntake : intake
      ));
      setSelectedIntake(updatedIntake);
      setShowSalesApproachDialog(false);
      toast.success(`Sales approach updated to ${approach}`);
    }
  };

  const getPipelineStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active': 
      case 'enrolled': 
      case 'approved': 
      case 'paid': 
        return 'default';
      case 'planning': 
      case 'under_review': 
      case 'pending': 
        return 'secondary';
      case 'closed': 
      case 'rejected': 
      case 'withdrawn': 
      case 'overdue': 
        return 'destructive';
      default: 
        return 'outline';
    }
  };

  const filteredData = useMemo(() => {
    if (!selectedIntake) return [];
    
    const data = selectedIntake[activeTab as keyof IntakeData] as any[];
    if (!Array.isArray(data)) return [];
    
    return data.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedIntake, activeTab, searchQuery]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intake Pipeline Management</h1>
          <p className="text-muted-foreground">
            Manage your intake pipelines with AI-powered insights and bulk operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Intake
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Intake</DialogTitle>
                <DialogDescription>
                  Add a new intake to manage your enrollment pipeline
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Intake Name</Label>
                  <Input
                    id="name"
                    value={newIntake.name}
                    onChange={(e) => setNewIntake(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Business Administration - Fall 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="program">Program</Label>
                  <Select value={newIntake.program} onValueChange={(value) => setNewIntake(prev => ({ ...prev, program: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Health Care Assistant">Health Care Assistant</SelectItem>
                      <SelectItem value="Education Assistant">Education Assistant</SelectItem>
                      <SelectItem value="Aviation">Aviation</SelectItem>
                      <SelectItem value="Hospitality">Hospitality</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="MLA">MLA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="campus">Campus</Label>
                  <Select value={newIntake.campus} onValueChange={(value) => setNewIntake(prev => ({ ...prev, campus: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Surrey">Surrey</SelectItem>
                      <SelectItem value="Vancouver">Vancouver</SelectItem>
                      <SelectItem value="Richmond">Richmond</SelectItem>
                      <SelectItem value="Burnaby">Burnaby</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newIntake.capacity}
                    onChange={(e) => setNewIntake(prev => ({ ...prev, capacity: parseInt(e.target.value) || 25 }))}
                    min="1"
                    max="100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newIntake.startDate}
                      onChange={(e) => setNewIntake(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newIntake.endDate}
                      onChange={(e) => setNewIntake(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateIntake}>
                    Create Intake
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!selectedIntake ? (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Intakes</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{intakes.length}</div>
                <p className="text-xs text-muted-foreground">
                  {intakes.filter(i => i.status === 'active').length} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enrollment</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {intakes.reduce((sum, i) => sum + i.enrolled, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {intakes.reduce((sum, i) => sum + i.capacity, 0)} capacity
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Pipeline Strength</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(intakes.reduce((sum, i) => sum + i.pipelineStrength, 0) / intakes.length)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all active intakes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(intakes.reduce((sum, i) => sum + i.conversionRate, 0) / intakes.length)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Lead to enrollment rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Intakes Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {intakes.map((intake) => (
              <Card 
                key={intake.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleIntakeClick(intake)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{intake.name}</CardTitle>
                      <CardDescription>
                        {intake.program} • Starts {safeFormatDate(intake.startDate, 'MMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(intake.status)}>
                      {intake.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Enrollment</span>
                    <span className="font-medium">
                      {intake.enrolled}/{intake.capacity}
                    </span>
                  </div>
                  <Progress 
                    variant="enrollment"
                    value={(intake.enrolled / intake.capacity) * 100} 
                    enrollmentPercentage={(intake.enrolled / intake.capacity) * 100}
                    className="h-2"
                  />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Pipeline Strength</span>
                      <div className={`font-medium ${getPipelineStrengthColor(intake.pipelineStrength)}`}>
                        {intake.pipelineStrength}%
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <div className="font-medium">{intake.conversionRate}%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted-foreground">
                      {intake.campus} Campus
                    </span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back button and header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedIntake(null)}
            >
              ← Back to Intakes
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedIntake.name}</h2>
              <p className="text-muted-foreground">{selectedIntake.program} • {selectedIntake.campus} Campus</p>
            </div>
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {getAIRecommendations(selectedIntake).map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-medium">{rec.title}</span>
                      <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      {rec.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Approach & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sales Approach & Pipeline Settings
              </CardTitle>
              <CardDescription>
                Configure your sales strategy and monitor pipeline performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Sales Approach Section */}
                <div className="lg:col-span-1">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Sales Approach</Label>
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="capitalize px-3 py-1">
                          {selectedIntake.salesApproach}
                        </Badge>
                        <Dialog open={showSalesApproachDialog} onOpenChange={setShowSalesApproachDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-2" />
                              Modify
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Update Sales Approach</DialogTitle>
                              <DialogDescription>
                                Choose the sales approach that best fits your intake strategy and target audience
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                              <div 
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                                  selectedIntake.salesApproach === 'aggressive' 
                                    ? 'border-primary bg-primary/10 shadow-md' 
                                    : 'border-border hover:border-primary/50'
                                }`}
                                onClick={() => handleUpdateSalesApproach('aggressive')}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <Zap className="h-5 w-5 text-orange-500" />
                                  <div className="font-semibold">Aggressive</div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  High-frequency follow-ups, urgent messaging, immediate action focus
                                </div>
                                <div className="mt-2 text-xs text-primary font-medium">
                                  ⚡ Fast results • High pressure • Quick decisions
                                </div>
                              </div>
                              
                              <div 
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                                  selectedIntake.salesApproach === 'balanced' 
                                    ? 'border-primary bg-primary/10 shadow-md' 
                                    : 'border-border hover:border-primary/50'
                                }`}
                                onClick={() => handleUpdateSalesApproach('balanced')}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <Target className="h-5 w-5 text-blue-500" />
                                  <div className="font-semibold">Balanced</div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Regular follow-ups, educational content, relationship building
                                </div>
                                <div className="mt-2 text-xs text-primary font-medium">
                                  🎯 Steady growth • Professional • Relationship-focused
                                </div>
                              </div>
                              
                              <div 
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                                  selectedIntake.salesApproach === 'conservative' 
                                    ? 'border-primary bg-primary/10 shadow-md' 
                                    : 'border-border hover:border-primary/50'
                                }`}
                                onClick={() => handleUpdateSalesApproach('conservative')}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                  <div className="font-semibold">Conservative</div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Gentle nurturing, educational approach, long-term relationship focus
                                </div>
                                <div className="mt-2 text-xs text-primary font-medium">
                                  🌱 Long-term • Gentle • Trust-building
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedIntake.salesApproach === 'aggressive' && 'Fast-paced, high-pressure sales tactics'}
                        {selectedIntake.salesApproach === 'balanced' && 'Professional, relationship-focused approach'}
                        {selectedIntake.salesApproach === 'conservative' && 'Gentle, educational sales methodology'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Pipeline Metrics */}
                <div className="lg:col-span-2">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Pipeline Strength */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Pipeline Strength</Label>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-2xl font-bold ${getPipelineStrengthColor(selectedIntake.pipelineStrength)}`}>
                            {selectedIntake.pipelineStrength}%
                          </span>
                          <div className="flex items-center gap-2">
                            {selectedIntake.pipelineStrength >= 80 ? (
                              <TrendingUp className="h-5 w-5 text-green-500" />
                            ) : selectedIntake.pipelineStrength >= 60 ? (
                              <Target className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                        <Progress value={selectedIntake.pipelineStrength} className="h-2 mb-2" />
                        <p className="text-xs text-muted-foreground">
                          {selectedIntake.pipelineStrength >= 80 && 'Excellent pipeline health'}
                          {selectedIntake.pipelineStrength >= 60 && selectedIntake.pipelineStrength < 80 && 'Good pipeline performance'}
                          {selectedIntake.pipelineStrength < 60 && 'Pipeline needs attention'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Conversion Rate */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Conversion Rate</Label>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-bold text-primary">
                            {selectedIntake.conversionRate}%
                          </span>
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Leads to Students</span>
                            <span className="font-medium">{selectedIntake.conversionRate}%</span>
                          </div>
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${selectedIntake.conversionRate}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Industry average: 18-25%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="leads">
                  Leads ({selectedIntake.leads.length})
                </TabsTrigger>
                <TabsTrigger value="applicants">
                  Applicants ({selectedIntake.applicants.length})
                </TabsTrigger>
                <TabsTrigger value="students">
                  Students ({selectedIntake.students.length})
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedRows.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedRows.length} item(s) selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Email')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Call')}>
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Update Status')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Assign')}>
                    <Users className="h-4 w-4 mr-2" />
                    Assign To
                  </Button>
                </div>
              </div>
            )}

            <TabsContent value="leads" className="space-y-4">
              <LeadsTable 
                data={filteredData as LeadData[]}
                selectedRows={selectedRows}
                onRowSelection={handleRowSelection}
                onSelectAll={handleSelectAll}
              />
            </TabsContent>

            <TabsContent value="applicants" className="space-y-4">
              <ApplicantsTable 
                data={filteredData as ApplicantData[]}
                selectedRows={selectedRows}
                onRowSelection={handleRowSelection}
                onSelectAll={handleSelectAll}
              />
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <StudentsTable 
                data={filteredData as StudentData[]}
                selectedRows={selectedRows}
                onRowSelection={handleRowSelection}
                onSelectAll={handleSelectAll}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

// Table components
function LeadsTable({ 
  data, 
  selectedRows, 
  onRowSelection, 
  onSelectAll 
}: {
  data: LeadData[];
  selectedRows: string[];
  onRowSelection: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean, data: any[]) => void;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={(checked) => onSelectAll(!!checked, data)}
                  />
                </th>
                <th className="p-4 text-left font-medium">Name</th>
                <th className="p-4 text-left font-medium">Email</th>
                <th className="p-4 text-left font-medium">Source</th>
                <th className="p-4 text-left font-medium">Stage</th>
                <th className="p-4 text-left font-medium">Score</th>
                <th className="p-4 text-left font-medium">Assigned To</th>
                <th className="p-4 text-left font-medium">Last Contact</th>
                <th className="p-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedRows.includes(lead.id)}
                      onCheckedChange={(checked) => onRowSelection(lead.id, !!checked)}
                    />
                  </td>
                  <td className="p-4 font-medium">{lead.name}</td>
                  <td className="p-4">{lead.email}</td>
                  <td className="p-4">
                    <Badge variant="outline">{lead.source}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{lead.stage}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-sm">{lead.score}</span>
                    </div>
                  </td>
                  <td className="p-4">{lead.assignedTo}</td>
                  <td className="p-4">{safeFormatDate(lead.lastContact)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicantsTable({ 
  data, 
  selectedRows, 
  onRowSelection, 
  onSelectAll 
}: {
  data: ApplicantData[];
  selectedRows: string[];
  onRowSelection: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean, data: any[]) => void;
}) {
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved': return 'default';
      case 'under_review': case 'submitted': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={(checked) => onSelectAll(!!checked, data)}
                  />
                </th>
                <th className="p-4 text-left font-medium">Name</th>
                <th className="p-4 text-left font-medium">Email</th>
                <th className="p-4 text-left font-medium">Application Date</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium">Documents</th>
                <th className="p-4 text-left font-medium">Interview</th>
                <th className="p-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((applicant) => (
                <tr key={applicant.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedRows.includes(applicant.id)}
                      onCheckedChange={(checked) => onRowSelection(applicant.id, !!checked)}
                    />
                  </td>
                  <td className="p-4 font-medium">{applicant.name}</td>
                  <td className="p-4">{applicant.email}</td>
                  <td className="p-4">{safeFormatDate(applicant.applicationDate, 'MMM d, yyyy')}</td>
                  <td className="p-4">
                    <Badge variant={getStatusBadgeVariant(applicant.status)}>
                      {applicant.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {applicant.documentsComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </td>
                  <td className="p-4">
                    {applicant.interviewScheduled ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentsTable({ 
  data, 
  selectedRows, 
  onRowSelection, 
  onSelectAll 
}: {
  data: StudentData[];
  selectedRows: string[];
  onRowSelection: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean, data: any[]) => void;
}) {
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'enrolled': case 'paid': return 'default';
      case 'deferred': case 'pending': return 'secondary';
      case 'withdrawn': case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={(checked) => onSelectAll(!!checked, data)}
                  />
                </th>
                <th className="p-4 text-left font-medium">Name</th>
                <th className="p-4 text-left font-medium">Email</th>
                <th className="p-4 text-left font-medium">Enrollment Date</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium">Payment</th>
                <th className="p-4 text-left font-medium">GPA</th>
                <th className="p-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((student) => (
                <tr key={student.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedRows.includes(student.id)}
                      onCheckedChange={(checked) => onRowSelection(student.id, !!checked)}
                    />
                  </td>
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4">{student.email}</td>
                  <td className="p-4">{safeFormatDate(student.enrollmentDate, 'MMM d, yyyy')}</td>
                  <td className="p-4">
                    <Badge variant={getStatusBadgeVariant(student.status)}>
                      {student.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={getStatusBadgeVariant(student.paymentStatus)}>
                      {student.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-4">{student.gpa ? student.gpa.toFixed(2) : 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}