import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Calendar, 
  Users, 
  Target, 
  TrendingUp,
  Search,
  Download,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Loader2,
  CalendarDays,
  GraduationCap,
  BarChart3
} from 'lucide-react';
import { format, isValid, parseISO, isFuture, isPast } from 'date-fns';
import { toast } from 'sonner';
import { useActiveCampuses } from '@/hooks/useCampuses';
import { usePrograms } from '@/hooks/usePrograms';
import { useRealIntakes, useCreateIntake, useUpdateIntakeStatus, useUpdateSalesApproach, RealIntake } from '@/hooks/useRealIntakes';
import { useLeadsByIntake } from '@/hooks/useIntakeLeads';
import { ConditionalDataWrapper } from '@/components/admin/ConditionalDataWrapper';

// Helper function to safely format dates
const safeFormatDate = (dateString: string | null, formatString: string = 'MMM d'): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid Date';
    return format(date, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

export function IntakePipelineManagement() {
  const { data: dbCampuses = [], isLoading: campusesLoading } = useActiveCampuses();
  const { data: dbPrograms = [], isLoading: programsLoading } = usePrograms();
  const { data: intakes = [], isLoading: intakesLoading, isError } = useRealIntakes();
  
  const createIntakeMutation = useCreateIntake();
  const updateStatusMutation = useUpdateIntakeStatus();
  const updateSalesApproachMutation = useUpdateSalesApproach();

  const [selectedIntake, setSelectedIntake] = useState<RealIntake | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterCampus, setFilterCampus] = useState<string>('all');
  const [newIntake, setNewIntake] = useState({
    name: '',
    program_id: '',
    campus: '',
    capacity: 25,
    start_date: '',
    application_deadline: '',
    study_mode: 'full-time',
    delivery_method: 'in-class'
  });

  // Fetch leads for selected intake
  const { data: intakeLeads = [], isLoading: leadsLoading } = useLeadsByIntake(selectedIntake?.id || null);

  const handleIntakeClick = (intake: RealIntake) => {
    setSelectedIntake(intake);
    setActiveTab('overview');
  };

  const handleCreateIntake = async () => {
    if (!newIntake.name || !newIntake.program_id || !newIntake.start_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    await createIntakeMutation.mutateAsync({
      name: newIntake.name,
      program_id: newIntake.program_id,
      start_date: newIntake.start_date,
      application_deadline: newIntake.application_deadline || undefined,
      capacity: newIntake.capacity,
      campus: newIntake.campus || undefined,
      study_mode: newIntake.study_mode,
      delivery_method: newIntake.delivery_method,
      status: 'planning'
    });

    setNewIntake({
      name: '',
      program_id: '',
      campus: '',
      capacity: 25,
      start_date: '',
      application_deadline: '',
      study_mode: 'full-time',
      delivery_method: 'in-class'
    });
    setShowCreateDialog(false);
  };

  const handleStatusToggle = async (intake: RealIntake, newStatus: 'open' | 'closed') => {
    await updateStatusMutation.mutateAsync({
      intakeId: intake.id,
      status: newStatus,
      enrolled: intake.enrolled,
      capacity: intake.capacity,
      startDate: intake.start_date
    });
  };

  const handleUpdateSalesApproach = async (approach: 'aggressive' | 'balanced' | 'neutral') => {
    if (selectedIntake) {
      await updateSalesApproachMutation.mutateAsync({
        intakeId: selectedIntake.id,
        salesApproach: approach
      });
      // Update local state
      setSelectedIntake(prev => prev ? { ...prev, sales_approach: approach } : null);
    }
  };

  const getPipelineStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'open': return 'default';
      case 'planning': return 'secondary';
      case 'closed': case 'full': return 'destructive';
      default: return 'outline';
    }
  };

  const getHealthStatus = (intake: RealIntake) => {
    const enrollmentRate = intake.capacity > 0 ? (intake.enrolled / intake.capacity) * 100 : 0;
    const startDate = new Date(intake.start_date);
    const daysUntilStart = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (enrollmentRate >= 90) return { status: 'healthy', label: 'On Track', color: 'text-green-600', icon: CheckCircle };
    if (enrollmentRate >= 70 || (daysUntilStart > 30 && enrollmentRate >= 50)) return { status: 'warning', label: 'Monitor', color: 'text-amber-600', icon: AlertTriangle };
    return { status: 'critical', label: 'At Risk', color: 'text-red-600', icon: XCircle };
  };

  const canOpenIntake = (intake: RealIntake) => {
    const startDate = new Date(intake.start_date);
    return intake.enrolled < intake.capacity && isFuture(startDate);
  };

  const filteredIntakes = useMemo(() => {
    return intakes.filter(intake => {
      const matchesStatus = filterStatus === 'all' || intake.status === filterStatus;
      const matchesProgram = filterProgram === 'all' || intake.program_id === filterProgram;
      const matchesCampus = filterCampus === 'all' || intake.campus === filterCampus;
      
      return matchesStatus && matchesProgram && matchesCampus;
    });
  }, [intakes, filterStatus, filterProgram, filterCampus]);

  const isLoading = campusesLoading || programsLoading || intakesLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-6 py-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="container mx-auto px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-2 w-full mb-4" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {selectedIntake && (
                <Button variant="ghost" size="icon" onClick={() => setSelectedIntake(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-semibold text-foreground">
                  {selectedIntake ? selectedIntake.name : 'Intake Management'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {selectedIntake 
                    ? `${selectedIntake.program_name} • ${safeFormatDate(selectedIntake.start_date, 'MMM d, yyyy')}`
                    : 'Manage enrollment pipelines and track conversion metrics'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
                      <Label htmlFor="name">Intake Name *</Label>
                      <Input
                        id="name"
                        value={newIntake.name}
                        onChange={(e) => setNewIntake(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Business Administration - Fall 2024"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="program">Program *</Label>
                      <Select 
                        value={newIntake.program_id} 
                        onValueChange={(value) => setNewIntake(prev => ({ ...prev, program_id: value }))}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          {dbPrograms.length === 0 ? (
                            <SelectItem value="no-programs" disabled>No programs configured</SelectItem>
                          ) : (
                            dbPrograms.map((program) => (
                              <SelectItem key={program.id} value={program.id}>
                                {program.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="campus">Campus</Label>
                      <Select 
                        value={newIntake.campus} 
                        onValueChange={(value) => setNewIntake(prev => ({ ...prev, campus: value }))}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select campus" />
                        </SelectTrigger>
                        <SelectContent>
                          {dbCampuses.map((campus) => (
                            <SelectItem key={campus.id} value={campus.name}>
                              {campus.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="capacity">Capacity *</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newIntake.capacity}
                          onChange={(e) => setNewIntake(prev => ({ ...prev, capacity: parseInt(e.target.value) || 25 }))}
                          min="1"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="study_mode">Study Mode</Label>
                        <Select 
                          value={newIntake.study_mode} 
                          onValueChange={(value) => setNewIntake(prev => ({ ...prev, study_mode: value }))}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_date">Start Date *</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={newIntake.start_date}
                          onChange={(e) => setNewIntake(prev => ({ ...prev, start_date: e.target.value }))}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="application_deadline">Application Deadline</Label>
                        <Input
                          id="application_deadline"
                          type="date"
                          value={newIntake.application_deadline}
                          onChange={(e) => setNewIntake(prev => ({ ...prev, application_deadline: e.target.value }))}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateIntake}
                        disabled={createIntakeMutation.isPending}
                      >
                        {createIntakeMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
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

      {/* Main Content */}
      {!selectedIntake ? (
        <>
          {/* Filters */}
          <div className="container mx-auto px-6 py-6 border-b bg-muted/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                  <TabsTrigger value="planning">Planning</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex flex-wrap items-center gap-3">
                <Select value={filterProgram} onValueChange={setFilterProgram}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {dbPrograms.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterCampus} onValueChange={setFilterCampus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Campus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campuses</SelectItem>
                    {dbCampuses.map((campus) => (
                      <SelectItem key={campus.id} value={campus.name}>
                        {campus.name}
                      </SelectItem>
                    ))}
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
                
                <div className="text-sm text-muted-foreground">
                  {filteredIntakes.length} of {intakes.length}
                </div>
              </div>
            </div>
          </div>

          {/* Intakes Grid */}
          <div className="container mx-auto px-6 py-6">
            <ConditionalDataWrapper
              isLoading={false}
              showEmptyState={filteredIntakes.length === 0}
              hasDemoAccess={false}
              hasRealData={intakes.length > 0}
              emptyTitle={intakes.length === 0 ? 'No intakes found' : 'No matching intakes'}
              emptyDescription={intakes.length === 0 
                ? 'Create your first intake to start managing enrollment pipelines'
                : 'No intakes match your current filters'}
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredIntakes.map((intake) => {
                  const health = getHealthStatus(intake);
                  const HealthIcon = health.icon;
                  const enrollmentPercent = intake.capacity > 0 ? (intake.enrolled / intake.capacity) * 100 : 0;

                  return (
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
                              {intake.program_name} • {safeFormatDate(intake.start_date, 'MMM d, yyyy')}
                            </CardDescription>
                            {intake.campus && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-muted-foreground">📍 {intake.campus}</span>
                              </div>
                            )}
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
                          value={enrollmentPercent} 
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
                              {intake.totalLeads} leads
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {intake.enrolled} enrolled
                            </Badge>
                          </div>
                          <div className={`flex items-center gap-1 ${health.color}`}>
                            <HealthIcon className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">{health.label}</span>
                          </div>
                        </div>
                        
                        <div 
                          className="flex items-center justify-between pt-3 border-t mt-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {intake.status === 'open' ? 'Accepting Applications' : 'Closed Intake'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {!canOpenIntake(intake) && intake.status !== 'open'
                                ? (intake.enrolled >= intake.capacity ? 'At full capacity' : 'Start date passed')
                                : (intake.status === 'open' ? 'Open for applicants' : 'Not accepting applications')
                              }
                            </span>
                          </div>
                          <Switch
                            checked={intake.status === 'open'}
                            disabled={!canOpenIntake(intake) && intake.status !== 'open'}
                            onCheckedChange={(checked) => {
                              handleStatusToggle(intake, checked ? 'open' : 'closed');
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ConditionalDataWrapper>
          </div>
        </>
      ) : (
        /* Intake Detail View */
        <div className="container mx-auto px-6 py-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Enrolled</p>
                    <p className="text-2xl font-bold">{selectedIntake.enrolled}/{selectedIntake.capacity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Leads</p>
                    <p className="text-2xl font-bold">{selectedIntake.totalLeads}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold">{selectedIntake.conversionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pipeline Strength</p>
                    <p className={`text-2xl font-bold ${getPipelineStrengthColor(selectedIntake.pipelineStrength)}`}>
                      {selectedIntake.pipelineStrength}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Detail Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leads">Leads ({selectedIntake.totalLeads})</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Intake Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Intake Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-medium flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {safeFormatDate(selectedIntake.start_date, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Application Deadline</p>
                        <p className="font-medium">
                          {safeFormatDate(selectedIntake.application_deadline, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Campus</p>
                        <p className="font-medium">{selectedIntake.campus || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Study Mode</p>
                        <p className="font-medium capitalize">{selectedIntake.study_mode || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Delivery Method</p>
                        <p className="font-medium capitalize">{selectedIntake.delivery_method || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge variant={getStatusBadgeVariant(selectedIntake.status)}>
                          {selectedIntake.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lead Funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lead Funnel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(selectedIntake.leadsByStatus).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(selectedIntake.leadsByStatus).map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{status}</span>
                            <div className="flex items-center gap-3">
                              <Progress 
                                value={selectedIntake.totalLeads > 0 ? (count / selectedIntake.totalLeads) * 100 : 0} 
                                className="w-24 h-2" 
                              />
                              <span className="text-sm font-medium w-8 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No leads assigned to this intake yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sales Approach */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sales Approach</CardTitle>
                  <CardDescription>Configure the sales strategy for this intake</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {(['aggressive', 'balanced', 'neutral'] as const).map((approach) => (
                      <Button
                        key={approach}
                        variant={selectedIntake.sales_approach === approach ? 'default' : 'outline'}
                        onClick={() => handleUpdateSalesApproach(approach)}
                        disabled={updateSalesApproachMutation.isPending}
                        className="capitalize"
                      >
                        {approach === 'aggressive' && <Zap className="h-4 w-4 mr-2" />}
                        {approach === 'balanced' && <Target className="h-4 w-4 mr-2" />}
                        {approach === 'neutral' && <Brain className="h-4 w-4 mr-2" />}
                        {approach}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Leads for this Intake</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : intakeLeads.length > 0 ? (
                    <div className="space-y-3">
                      {intakeLeads
                        .filter(lead => 
                          !searchQuery || 
                          `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((lead) => (
                          <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                              <p className="text-sm text-muted-foreground">{lead.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="capitalize">{lead.status}</Badge>
                              <span className="text-sm text-muted-foreground">
                                Score: {lead.lead_score || 0}
                              </span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No leads assigned to this intake yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Leads can select this intake when expressing interest in the program
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Intake Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Accept Applications</p>
                      <p className="text-sm text-muted-foreground">
                        {canOpenIntake(selectedIntake) 
                          ? 'Enable to start accepting applications'
                          : selectedIntake.enrolled >= selectedIntake.capacity 
                            ? 'Cannot open - intake is at full capacity'
                            : 'Cannot open - start date has passed'
                        }
                      </p>
                    </div>
                    <Switch
                      checked={selectedIntake.status === 'open'}
                      disabled={!canOpenIntake(selectedIntake) && selectedIntake.status !== 'open'}
                      onCheckedChange={(checked) => {
                        handleStatusToggle(selectedIntake, checked ? 'open' : 'closed');
                        setSelectedIntake(prev => prev ? { ...prev, status: checked ? 'open' : 'closed' } : null);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
