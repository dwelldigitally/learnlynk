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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Modern Hero Header with Glass Morphism */}
      <div className="relative overflow-hidden aurora-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative backdrop-blur-xl bg-white/10 border-b border-white/20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <div className="relative glass-card p-4 rounded-2xl">
                      <Target className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                      Intake Pipeline Management
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2 font-medium">
                      Manage your intake pipelines with AI-powered insights and bulk operations
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button variant="outline" className="glass-button border-white/30 hover:bg-white/20 px-4 py-2">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Insights
                </Button>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="glass-button bg-primary/20 hover:bg-primary/30 border-primary/30 px-4 py-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Intake
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md glass-card backdrop-blur-xl border-white/20">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Create New Intake</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Add a new intake to manage your enrollment pipeline
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-semibold">Intake Name</Label>
                        <Input
                          id="name"
                          value={newIntake.name}
                          onChange={(e) => setNewIntake(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Business Administration - Fall 2024"
                          className="glass-card border-white/20 bg-white/5 mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="program" className="text-sm font-semibold">Program</Label>
                        <Select value={newIntake.program} onValueChange={(value) => setNewIntake(prev => ({ ...prev, program: value }))}>
                          <SelectTrigger className="glass-card border-white/20 bg-white/5 mt-1">
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                          <SelectContent className="glass-card backdrop-blur-xl border-white/20">
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
                        <Label htmlFor="campus" className="text-sm font-semibold">Campus</Label>
                        <Select value={newIntake.campus} onValueChange={(value) => setNewIntake(prev => ({ ...prev, campus: value }))}>
                          <SelectTrigger className="glass-card border-white/20 bg-white/5 mt-1">
                            <SelectValue placeholder="Select campus" />
                          </SelectTrigger>
                          <SelectContent className="glass-card backdrop-blur-xl border-white/20">
                            <SelectItem value="Surrey">Surrey</SelectItem>
                            <SelectItem value="Vancouver">Vancouver</SelectItem>
                            <SelectItem value="Richmond">Richmond</SelectItem>
                            <SelectItem value="Burnaby">Burnaby</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="capacity" className="text-sm font-semibold">Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newIntake.capacity}
                          onChange={(e) => setNewIntake(prev => ({ ...prev, capacity: parseInt(e.target.value) || 25 }))}
                          min="1"
                          max="100"
                          className="glass-card border-white/20 bg-white/5 mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate" className="text-sm font-semibold">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={newIntake.startDate}
                            onChange={(e) => setNewIntake(prev => ({ ...prev, startDate: e.target.value }))}
                            className="glass-card border-white/20 bg-white/5 mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-sm font-semibold">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={newIntake.endDate}
                            onChange={(e) => setNewIntake(prev => ({ ...prev, endDate: e.target.value }))}
                            className="glass-card border-white/20 bg-white/5 mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="glass-button border-white/30">
                          Cancel
                        </Button>
                        <Button onClick={handleCreateIntake} className="glass-button bg-primary/20 hover:bg-primary/30 border-primary/30">
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
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {!selectedIntake ? (
          <div className="space-y-6">
            {/* Modern Overview Cards with Glass Effect */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Intakes</p>
                    <p className="text-3xl font-bold text-foreground">{intakes.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {intakes.filter(i => i.status === 'active').length} active
                    </p>
                  </div>
                  <div className="glass-card p-3 rounded-xl">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Enrollment</p>
                    <p className="text-3xl font-bold text-foreground">
                      {intakes.reduce((sum, i) => sum + i.enrolled, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      of {intakes.reduce((sum, i) => sum + i.capacity, 0)} capacity
                    </p>
                  </div>
                  <div className="glass-card p-3 rounded-xl">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Pipeline Strength</p>
                    <p className="text-3xl font-bold text-foreground">
                      {Math.round(intakes.reduce((sum, i) => sum + i.pipelineStrength, 0) / intakes.length)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across all active intakes
                    </p>
                  </div>
                  <div className="glass-card p-3 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Conversion</p>
                    <p className="text-3xl font-bold text-foreground">
                      {Math.round(intakes.reduce((sum, i) => sum + i.conversionRate, 0) / intakes.length)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lead to enrollment rate
                    </p>
                  </div>
                  <div className="glass-card p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Intakes Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {intakes.map((intake) => (
                <div 
                  key={intake.id} 
                  className="group glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
                  onClick={() => handleIntakeClick(intake)}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {intake.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {intake.program} • Starts {safeFormatDate(intake.startDate, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(intake.status)} className="px-3 py-1">
                        {intake.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Enrollment</span>
                        <span className="font-semibold text-foreground">
                          {intake.enrolled}/{intake.capacity}
                        </span>
                      </div>
                      <Progress 
                        value={(intake.enrolled / intake.capacity) * 100} 
                        className="h-2 bg-white/20"
                      />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="glass-card p-3 rounded-xl">
                          <span className="text-xs text-muted-foreground block">Pipeline Strength</span>
                          <span className={`font-bold ${getPipelineStrengthColor(intake.pipelineStrength)}`}>
                            {intake.pipelineStrength}%
                          </span>
                        </div>
                        <div className="glass-card p-3 rounded-xl">
                          <span className="text-xs text-muted-foreground block">Conversion Rate</span>
                          <span className="font-bold text-accent">
                            {intake.conversionRate}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {intake.leads.length} leads
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {intake.applicants.length} apps
                          </Badge>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back Button and Intake Header */}
            <div className="glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedIntake(null)}
                  className="glass-button border-white/30"
                >
                  ← Back to Overview
                </Button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">{selectedIntake.name}</h2>
                  <p className="text-muted-foreground">{selectedIntake.program} • {selectedIntake.campus}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="glass-button border-white/30">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="glass-button border-white/30">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Recommendations Panel */}
            <div className="glass-card p-6 rounded-2xl border border-primary/30 backdrop-blur-xl bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="glass-card p-3 rounded-xl">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">AI Recommendations</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getAIRecommendations(selectedIntake).map((rec, index) => (
                  <div key={index} className="glass-card p-4 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {rec.priority}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                    <Button size="sm" variant="outline" className="glass-button border-primary/30">
                      {rec.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Intake Management Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="glass-card p-2 rounded-2xl border border-white/20 backdrop-blur-xl">
                <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2">
                  <TabsTrigger 
                    value="leads" 
                    className="glass-card rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Leads ({selectedIntake.leads.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="applicants"
                    className="glass-card rounded-xl data-[state=active]:bg-success/20 data-[state=active]:text-success"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Applicants ({selectedIntake.applicants.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="students"
                    className="glass-card rounded-xl data-[state=active]:bg-accent/20 data-[state=active]:text-accent"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Students ({selectedIntake.students.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Search and Filters */}
              <div className="glass-card p-4 rounded-2xl border border-white/20 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 max-w-sm">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 glass-card border-white/20 bg-white/5"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="glass-button border-white/30">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="glass-button border-white/30">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {selectedRows.length > 0 && (
                  <div className="mt-4 p-3 glass-card rounded-xl border border-primary/30 bg-primary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {selectedRows.length} items selected
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="glass-button border-white/30">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline" className="glass-button border-white/30">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          SMS
                        </Button>
                        <Button size="sm" variant="outline" className="glass-button border-destructive/30">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tab Content */}
              <TabsContent value="leads" className="space-y-4">
                <div className="glass-card rounded-2xl border border-white/20 backdrop-blur-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/10 border-b border-white/20">
                        <tr>
                          <th className="p-4 text-left">
                            <Checkbox
                              checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                              onCheckedChange={(checked) => handleSelectAll(!!checked, filteredData)}
                            />
                          </th>
                          <th className="p-4 text-left font-semibold">Name</th>
                          <th className="p-4 text-left font-semibold">Email</th>
                          <th className="p-4 text-left font-semibold">Source</th>
                          <th className="p-4 text-left font-semibold">Stage</th>
                          <th className="p-4 text-left font-semibold">Score</th>
                          <th className="p-4 text-left font-semibold">Assigned To</th>
                          <th className="p-4 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredData as LeadData[]).map((lead) => (
                          <tr key={lead.id} className="border-b border-white/10 hover:bg-white/5">
                            <td className="p-4">
                              <Checkbox
                                checked={selectedRows.includes(lead.id)}
                                onCheckedChange={(checked) => handleRowSelection(lead.id, !!checked)}
                              />
                            </td>
                            <td className="p-4 font-medium text-foreground">{lead.name}</td>
                            <td className="p-4 text-muted-foreground">{lead.email}</td>
                            <td className="p-4">
                              <Badge variant="outline">{lead.source}</Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant="secondary">{lead.stage}</Badge>
                            </td>
                            <td className="p-4">
                              <span className={`font-semibold ${lead.score >= 80 ? 'text-success' : lead.score >= 60 ? 'text-warning' : 'text-destructive'}`}>
                                {lead.score}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground">{lead.assignedTo}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="glass-button border-white/30">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="glass-button border-white/30">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="applicants" className="space-y-4">
                <div className="glass-card rounded-2xl border border-white/20 backdrop-blur-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/10 border-b border-white/20">
                        <tr>
                          <th className="p-4 text-left">
                            <Checkbox
                              checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                              onCheckedChange={(checked) => handleSelectAll(!!checked, filteredData)}
                            />
                          </th>
                          <th className="p-4 text-left font-semibold">Name</th>
                          <th className="p-4 text-left font-semibold">Email</th>
                          <th className="p-4 text-left font-semibold">Application Date</th>
                          <th className="p-4 text-left font-semibold">Status</th>
                          <th className="p-4 text-left font-semibold">Documents</th>
                          <th className="p-4 text-left font-semibold">Interview</th>
                          <th className="p-4 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredData as ApplicantData[]).map((applicant) => (
                          <tr key={applicant.id} className="border-b border-white/10 hover:bg-white/5">
                            <td className="p-4">
                              <Checkbox
                                checked={selectedRows.includes(applicant.id)}
                                onCheckedChange={(checked) => handleRowSelection(applicant.id, !!checked)}
                              />
                            </td>
                            <td className="p-4 font-medium text-foreground">{applicant.name}</td>
                            <td className="p-4 text-muted-foreground">{applicant.email}</td>
                            <td className="p-4 text-muted-foreground">
                              {safeFormatDate(applicant.applicationDate, 'MMM d, yyyy')}
                            </td>
                            <td className="p-4">
                              <Badge variant={getStatusBadgeVariant(applicant.status)}>
                                {applicant.status.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="p-4">
                              {applicant.documentsComplete ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive" />
                              )}
                            </td>
                            <td className="p-4">
                              {applicant.interviewScheduled ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="glass-button border-white/30">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="glass-button border-white/30">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <div className="glass-card rounded-2xl border border-white/20 backdrop-blur-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/10 border-b border-white/20">
                        <tr>
                          <th className="p-4 text-left">
                            <Checkbox
                              checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                              onCheckedChange={(checked) => handleSelectAll(!!checked, filteredData)}
                            />
                          </th>
                          <th className="p-4 text-left font-semibold">Name</th>
                          <th className="p-4 text-left font-semibold">Email</th>
                          <th className="p-4 text-left font-semibold">Enrollment Date</th>
                          <th className="p-4 text-left font-semibold">Status</th>
                          <th className="p-4 text-left font-semibold">Payment</th>
                          <th className="p-4 text-left font-semibold">GPA</th>
                          <th className="p-4 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(filteredData as StudentData[]).map((student) => (
                          <tr key={student.id} className="border-b border-white/10 hover:bg-white/5">
                            <td className="p-4">
                              <Checkbox
                                checked={selectedRows.includes(student.id)}
                                onCheckedChange={(checked) => handleRowSelection(student.id, !!checked)}
                              />
                            </td>
                            <td className="p-4 font-medium text-foreground">{student.name}</td>
                            <td className="p-4 text-muted-foreground">{student.email}</td>
                            <td className="p-4 text-muted-foreground">
                              {safeFormatDate(student.enrollmentDate, 'MMM d, yyyy')}
                            </td>
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
                            <td className="p-4">
                              <span className={`font-semibold ${student.gpa >= 3.5 ? 'text-success' : student.gpa >= 2.5 ? 'text-warning' : 'text-destructive'}`}>
                                {student.gpa.toFixed(2)}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="glass-button border-white/30">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="glass-button border-white/30">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}