import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
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
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterCampus, setFilterCampus] = useState<string>('all');
  const [newIntake, setNewIntake] = useState({
    name: '',
    program: '',
    campus: '',
    capacity: 25,
    startDate: '',
    endDate: '',
    waitlistEnabled: false
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
      endDate: '',
      waitlistEnabled: false
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

  const filteredIntakes = useMemo(() => {
    return intakes.filter(intake => {
      const matchesStatus = filterStatus === 'all' || intake.status === filterStatus;
      const matchesProgram = filterProgram === 'all' || intake.program === filterProgram;
      const matchesCampus = filterCampus === 'all' || intake.campus === filterCampus;
      
      return matchesStatus && matchesProgram && matchesCampus;
    });
  }, [intakes, filterStatus, filterProgram, filterCampus]);

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
    <div className="min-h-screen bg-background">
      {/* Clean Professional Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Intake Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage enrollment pipelines and track conversion metrics
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                AI Insights
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
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
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="program">Program</Label>
                      <Select value={newIntake.program} onValueChange={(value) => setNewIntake(prev => ({ ...prev, program: value }))}>
                        <SelectTrigger className="mt-1.5">
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
                        <SelectTrigger className="mt-1.5">
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
                        className="mt-1.5"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="waitlist"
                        checked={newIntake.waitlistEnabled}
                        onCheckedChange={(checked) => setNewIntake(prev => ({ ...prev, waitlistEnabled: checked as boolean }))}
                      />
                      <Label htmlFor="waitlist" className="text-sm font-normal cursor-pointer">
                        Enable waitlist for this intake
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newIntake.startDate}
                          onChange={(e) => setNewIntake(prev => ({ ...prev, startDate: e.target.value }))}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newIntake.endDate}
                          onChange={(e) => setNewIntake(prev => ({ ...prev, endDate: e.target.value }))}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
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
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-6 py-6 border-b bg-muted/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filter by:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterProgram} onValueChange={setFilterProgram}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="Health Care Assistant">Health Care Assistant</SelectItem>
                <SelectItem value="Education Assistant">Education Assistant</SelectItem>
                <SelectItem value="Aviation">Aviation</SelectItem>
                <SelectItem value="Hospitality">Hospitality</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="MLA">MLA</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCampus} onValueChange={setFilterCampus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campuses</SelectItem>
                <SelectItem value="Surrey">Surrey</SelectItem>
                <SelectItem value="Vancouver">Vancouver</SelectItem>
                <SelectItem value="Richmond">Richmond</SelectItem>
                <SelectItem value="Burnaby">Burnaby</SelectItem>
              </SelectContent>
            </Select>

            {(filterStatus !== 'all' || filterProgram !== 'all' || filterCampus !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterProgram('all');
                  setFilterCampus('all');
                }}
                className="text-muted-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredIntakes.length} of {intakes.length} intakes
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {!selectedIntake ? (
          <div className="space-y-6">
            {/* Overview Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Intakes</p>
                      <p className="text-2xl font-semibold mt-2">{intakes.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {intakes.filter(i => i.status === 'active').length} active
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Enrollment</p>
                      <p className="text-2xl font-semibold mt-2">
                        {intakes.reduce((sum, i) => sum + i.enrolled, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        of {intakes.reduce((sum, i) => sum + i.capacity, 0)} capacity
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Pipeline Strength</p>
                      <p className="text-2xl font-semibold mt-2">
                        {Math.round(intakes.reduce((sum, i) => sum + i.pipelineStrength, 0) / intakes.length)}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Across all active intakes
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Conversion</p>
                      <p className="text-2xl font-semibold mt-2">
                        {Math.round(intakes.reduce((sum, i) => sum + i.conversionRate, 0) / intakes.length)}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Lead to enrollment rate
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Intakes List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIntakes.map((intake) => (
                <Card 
                  key={intake.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleIntakeClick(intake)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{intake.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {intake.program} • {safeFormatDate(intake.startDate, 'MMM d, yyyy')}
                        </CardDescription>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">📍 {intake.campus}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(intake.status)}>
                        {intake.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Enrollment</span>
                      <span className="font-medium">
                        {intake.enrolled}/{intake.capacity}
                      </span>
                    </div>
                    <Progress 
                      value={(intake.enrolled / intake.capacity) * 100} 
                      className="h-2"
                    />
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-muted/50 p-2.5 rounded-md">
                        <p className="text-xs text-muted-foreground">Pipeline</p>
                        <p className={`text-sm font-semibold ${getPipelineStrengthColor(intake.pipelineStrength)}`}>
                          {intake.pipelineStrength}%
                        </p>
                      </div>
                      <div className="bg-muted/50 p-2.5 rounded-md">
                        <p className="text-xs text-muted-foreground">Conversion</p>
                        <p className="text-sm font-semibold">
                          {intake.conversionRate}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {intake.leads.length} leads
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {intake.applicants.length} apps
                        </Badge>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center justify-between pt-3 border-t mt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {intake.status === 'active' ? 'Accepting Applications' : 'Closed Intake'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {intake.status === 'active' ? 'Open for new applicants' : 'Not accepting applications'}
                        </span>
                      </div>
                      <Switch
                        checked={intake.status === 'active'}
                        onCheckedChange={(checked) => {
                          const newStatus = checked ? 'active' : 'closed';
                          setIntakes(prev => prev.map(i => 
                            i.id === intake.id ? { ...i, status: newStatus as 'active' | 'closed' | 'planning' } : i
                          ));
                          toast.success(`Intake ${checked ? 'opened' : 'closed'}`);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with Back Button */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedIntake(null)}
                  >
                    ← Back to Overview
                  </Button>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">{selectedIntake.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedIntake.program} • {selectedIntake.campus}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>AI Recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {getAIRecommendations(selectedIntake).map((rec, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                            {rec.priority}
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-2">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                        <Button size="sm" variant="outline">
                          {rec.action}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <Card>
                <CardHeader className="pb-3">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="leads">
                      <Users className="h-4 w-4 mr-2" />
                      Leads ({selectedIntake.leads.length})
                    </TabsTrigger>
                    <TabsTrigger value="applicants">
                      <Calendar className="h-4 w-4 mr-2" />
                      Applicants ({selectedIntake.applicants.length})
                    </TabsTrigger>
                    <TabsTrigger value="students">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Students ({selectedIntake.students.length})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
              </Card>

              {/* Search and Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex-1 max-w-sm">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name or email..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {selectedRows.length > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-muted border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {selectedRows.length} items selected
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            SMS
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tab Content */}
              <TabsContent value="leads" className="space-y-4">
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="p-3 text-left">
                            <Checkbox
                              checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                              onCheckedChange={(checked) => handleSelectAll(!!checked, filteredData)}
                            />
                          </th>
                          <th className="p-3 text-left text-sm font-medium">Name</th>
                          <th className="p-3 text-left text-sm font-medium">Email</th>
                          <th className="p-3 text-left text-sm font-medium">Source</th>
                          <th className="p-3 text-left text-sm font-medium">Stage</th>
                          <th className="p-3 text-left text-sm font-medium">Score</th>
                          <th className="p-3 text-left text-sm font-medium">Assigned To</th>
                          <th className="p-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredData as LeadData[]).map((lead) => (
                          <tr key={lead.id} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <Checkbox
                                checked={selectedRows.includes(lead.id)}
                                onCheckedChange={(checked) => handleRowSelection(lead.id, !!checked)}
                              />
                            </td>
                            <td className="p-3 font-medium">{lead.name}</td>
                            <td className="p-3 text-sm text-muted-foreground">{lead.email}</td>
                            <td className="p-3">
                              <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                            </td>
                            <td className="p-3">
                              <Badge variant="secondary" className="text-xs">{lead.stage}</Badge>
                            </td>
                            <td className="p-3">
                              <span className={`font-medium text-sm ${lead.score >= 80 ? 'text-green-600' : lead.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {lead.score}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">{lead.assignedTo}</td>
                            <td className="p-3">
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="applicants" className="space-y-4">
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="p-3 text-left">
                            <Checkbox
                              checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                              onCheckedChange={(checked) => handleSelectAll(!!checked, filteredData)}
                            />
                          </th>
                          <th className="p-3 text-left text-sm font-medium">Name</th>
                          <th className="p-3 text-left text-sm font-medium">Email</th>
                          <th className="p-3 text-left text-sm font-medium">Application Date</th>
                          <th className="p-3 text-left text-sm font-medium">Status</th>
                          <th className="p-3 text-left text-sm font-medium">Documents</th>
                          <th className="p-3 text-left text-sm font-medium">Interview</th>
                          <th className="p-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredData as ApplicantData[]).map((applicant) => (
                          <tr key={applicant.id} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <Checkbox
                                checked={selectedRows.includes(applicant.id)}
                                onCheckedChange={(checked) => handleRowSelection(applicant.id, !!checked)}
                              />
                            </td>
                            <td className="p-3 font-medium">{applicant.name}</td>
                            <td className="p-3 text-sm text-muted-foreground">{applicant.email}</td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {safeFormatDate(applicant.applicationDate, 'MMM d, yyyy')}
                            </td>
                            <td className="p-3">
                              <Badge variant={getStatusBadgeVariant(applicant.status)} className="text-xs">
                                {applicant.status?.replace('_', ' ') || 'Unknown'}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {applicant.documentsComplete ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </td>
                            <td className="p-3">
                              {applicant.interviewScheduled ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="p-3 text-left">
                            <Checkbox
                              checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                              onCheckedChange={(checked) => handleSelectAll(!!checked, filteredData)}
                            />
                          </th>
                          <th className="p-3 text-left text-sm font-medium">Name</th>
                          <th className="p-3 text-left text-sm font-medium">Email</th>
                          <th className="p-3 text-left text-sm font-medium">Enrollment Date</th>
                          <th className="p-3 text-left text-sm font-medium">Status</th>
                          <th className="p-3 text-left text-sm font-medium">Payment</th>
                          <th className="p-3 text-left text-sm font-medium">GPA</th>
                          <th className="p-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredData as StudentData[]).map((student) => (
                          <tr key={student.id} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <Checkbox
                                checked={selectedRows.includes(student.id)}
                                onCheckedChange={(checked) => handleRowSelection(student.id, !!checked)}
                              />
                            </td>
                            <td className="p-3 font-medium">{student.name}</td>
                            <td className="p-3 text-sm text-muted-foreground">{student.email}</td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {safeFormatDate(student.enrollmentDate, 'MMM d, yyyy')}
                            </td>
                            <td className="p-3">
                              <Badge variant={getStatusBadgeVariant(student.status)} className="text-xs">
                                {student.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge variant={getStatusBadgeVariant(student.paymentStatus)} className="text-xs">
                                {student.paymentStatus}
                              </Badge>
                            </td>
                            <td className="p-3">
                               <span className={`font-medium text-sm ${(student.gpa || 0) >= 3.5 ? 'text-green-600' : (student.gpa || 0) >= 2.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                                 {(student.gpa || 0).toFixed(2)}
                               </span>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}