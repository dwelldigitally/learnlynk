import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Plus, 
  Calendar, 
  Users, 
  Target, 
  GitBranch, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  Bell
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useConditionalPrograms } from '@/hooks/useConditionalPrograms';
import { useConditionalIntakes } from '@/hooks/useConditionalIntakes';
import { enhancedIntakeService, EnhancedIntake } from '@/services/enhancedIntakeService';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function IntakeManagementStandalone() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramType, setSelectedProgramType] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState('start_date');

  // Fetch programs and intakes data
  const { data: programs, isLoading: programsLoading } = useConditionalPrograms();
  
  const { data: intakes, isLoading: intakesLoading, refetch: refetchIntakes } = useQuery({
    queryKey: ['enhanced-intakes'],
    queryFn: () => enhancedIntakeService.getIntakesWithProgramData(),
  });

  const { data: filterOptions } = useQuery({
    queryKey: ['intake-filter-options'],
    queryFn: () => enhancedIntakeService.getFilterOptions(),
  });

  // Filter and sort intakes
  const filteredIntakes = useMemo(() => {
    if (!intakes) return [];
    
    let filtered = intakes.filter(intake => {
      const matchesSearch = !searchQuery || 
        intake.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intake.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesProgramType = selectedProgramType === 'all' || intake.program_type === selectedProgramType;
      const matchesCampus = selectedCampus === 'all' || intake.campus === selectedCampus;
      const matchesStatus = selectedStatus === 'all' || intake.status === selectedStatus;
      
      return matchesSearch && matchesProgramType && matchesCampus && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'enrollment_percentage':
          return b.enrollment_percentage - a.enrollment_percentage;
        case 'program_name':
          return a.program_name.localeCompare(b.program_name);
        case 'start_date':
        default:
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      }
    });

    return filtered;
  }, [intakes, searchQuery, selectedProgramType, selectedCampus, selectedStatus, sortBy]);

  // Calculate overview metrics
  const overviewMetrics = useMemo(() => {
    if (!intakes) return { active: 0, applications: 0, targetEnrollment: 0, closingSoon: 0 };
    
    const active = intakes.filter(i => i.status === 'open').length;
    const applications = intakes.reduce((sum, i) => sum + i.enrolled_count, 0);
    const targetEnrollment = intakes.reduce((sum, i) => sum + i.capacity, 0);
    const closingSoon = intakes.filter(i => {
      if (!i.application_deadline) return false;
      const deadline = new Date(i.application_deadline);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return deadline <= thirtyDaysFromNow && deadline >= new Date();
    }).length;

    return { active, applications, targetEnrollment, closingSoon };
  }, [intakes]);

  // Program overview data
  const programOverview = useMemo(() => {
    if (!programs || !intakes) return [];
    
    return programs.map(program => {
      const programIntakes = intakes.filter(i => i.program_id === program.id);
      const totalCapacity = programIntakes.reduce((sum, i) => sum + i.capacity, 0);
      const totalEnrolled = programIntakes.reduce((sum, i) => sum + i.enrolled_count, 0);
      const enrollmentRate = totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0;
      
      return {
        id: program.id,
        name: program.name,
        type: program.type,
        intakeCount: programIntakes.length,
        totalCapacity,
        totalEnrolled,
        enrollmentRate,
        activeIntakes: programIntakes.filter(i => i.status === 'open').length
      };
    });
  }, [programs, intakes]);

  const handleSalesApproachChange = async (intakeId: string, approach: 'aggressive' | 'balanced' | 'neutral') => {
    try {
      await enhancedIntakeService.updateSalesApproach(intakeId, approach);
      await refetchIntakes();
      toast.success('Sales approach updated successfully');
    } catch (error) {
      toast.error('Failed to update sales approach');
    }
  };

  const getHealthStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'critical': return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getHealthStatusColor = (status: 'healthy' | 'warning' | 'critical'): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'healthy': return 'default';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getSalesApproachStrategy = (approach: 'aggressive' | 'balanced' | 'neutral') => {
    return enhancedIntakeService.getSalesApproachStrategy(approach);
  };

  if (programsLoading || intakesLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-8 bg-muted rounded animate-pulse" />
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline Planner</h1>
          <p className="text-muted-foreground">
            Manage intake pipeline, sales approaches, and enrollment strategies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            AI Notifications
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Intake Period
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Intakes</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.active}</div>
            <p className="text-xs text-muted-foreground">Currently open</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Received</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.applications.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Capacity</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.targetEnrollment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {overviewMetrics.targetEnrollment > 0 
                ? `${((overviewMetrics.applications / overviewMetrics.targetEnrollment) * 100).toFixed(1)}% filled`
                : '0% filled'
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closing Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.closingSoon}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Program Overview</TabsTrigger>
          <TabsTrigger value="intakes">Intake Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Overview</CardTitle>
              <CardDescription>
                All active programs with their intake statistics and enrollment progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {programOverview.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No programs found</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {programOverview.map((program) => (
                    <Card key={program.id} className="border-l-4 border-l-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{program.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">{program.type}</Badge>
                          </div>
                          <Badge variant={program.activeIntakes > 0 ? 'default' : 'secondary'}>
                            {program.activeIntakes} active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Enrollment Progress</span>
                          <span className="text-sm font-medium">{program.enrollmentRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={program.enrollmentRate} className="h-2" />
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <div className="font-medium">{program.intakeCount}</div>
                            <div className="text-muted-foreground text-xs">Intakes</div>
                          </div>
                          <div>
                            <div className="font-medium">{program.totalEnrolled}</div>
                            <div className="text-muted-foreground text-xs">Enrolled</div>
                          </div>
                          <div>
                            <div className="font-medium">{program.totalCapacity}</div>
                            <div className="text-muted-foreground text-xs">Capacity</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intakes" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search intakes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start_date">Start Date</SelectItem>
                    <SelectItem value="enrollment_percentage">Enrollment %</SelectItem>
                    <SelectItem value="program_name">Program Name</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedProgramType} onValueChange={setSelectedProgramType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Program Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {filterOptions?.programTypes?.map((type: string) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Campus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campuses</SelectItem>
                    {filterOptions?.campuses?.map((campus: string) => (
                      <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Intake Cards */}
          {filteredIntakes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No intakes found matching your criteria</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedProgramType('all');
                  setSelectedCampus('all');
                  setSelectedStatus('all');
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIntakes.map((intake) => {
                const strategy = getSalesApproachStrategy(intake.sales_approach);
                return (
                  <Card key={intake.id} className="relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                      intake.health_status === 'healthy' ? 'from-success to-success/60' :
                      intake.health_status === 'warning' ? 'from-warning to-warning/60' :
                      'from-destructive to-destructive/60'
                    }`} />
                    
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{intake.program_name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{intake.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getHealthStatusIcon(intake.health_status)}
                          <Badge variant={getHealthStatusColor(intake.health_status)}>
                            {intake.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Start Date</p>
                          <p className="font-medium">{format(new Date(intake.start_date), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Campus</p>
                          <p className="font-medium">{intake.campus || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Delivery</p>
                          <p className="font-medium">{intake.delivery_method}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Study Mode</p>
                          <p className="font-medium">{intake.study_mode}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Enrollment Progress</span>
                          <span className="font-medium">{intake.enrollment_percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={intake.enrollment_percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{intake.enrolled_count} enrolled</span>
                          <span>{intake.capacity} capacity</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Sales Approach</span>
                          <Badge variant="outline" style={{ backgroundColor: strategy.color + '20', color: strategy.color }}>
                            {intake.sales_approach}
                          </Badge>
                        </div>
                        
                        <ToggleGroup
                          type="single"
                          value={intake.sales_approach}
                          onValueChange={(value) => {
                            if (value) handleSalesApproachChange(intake.id, value as any);
                          }}
                          className="grid grid-cols-3 gap-1"
                        >
                          <ToggleGroupItem value="aggressive" size="sm" className="text-xs">
                            Aggressive
                          </ToggleGroupItem>
                          <ToggleGroupItem value="balanced" size="sm" className="text-xs">
                            Balanced
                          </ToggleGroupItem>
                          <ToggleGroupItem value="neutral" size="sm" className="text-xs">
                            Neutral
                          </ToggleGroupItem>
                        </ToggleGroup>

                        <div className="p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Recommended Actions:</p>
                          <ul className="text-xs space-y-1">
                            {strategy.actions.slice(0, 2).map((action, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}