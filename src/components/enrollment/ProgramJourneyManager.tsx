import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Eye, Settings, Calendar, Users, BookOpen, AlertTriangle, CheckCircle, Clock, FileText, BarChart3, TrendingUp, Activity, ChevronDown } from 'lucide-react';
import { usePrograms } from '@/services/programService';
import { useAcademicJourneys } from '@/services/academicJourneyService';
import { usePracticumJourneys } from '@/hooks/usePracticum';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { JourneyBuilder } from './JourneyBuilder';
import { JourneyEditor } from './JourneyEditor';
import { MasterJourneySetupWizard } from './MasterJourneySetupWizard';
import { AcademicJourney } from '@/types/academicJourney';
import { enrollmentDemoSeedService } from '@/services/enrollmentDemoSeedService';
import { MasterJourneyService } from '@/services/masterJourneyService';
import { toast } from 'sonner';

type JourneyType = 'all' | 'academic' | 'practicum';

interface CombinedJourney {
  id: string;
  type: 'academic' | 'practicum';
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  stagesCount: number;
  program_id?: string;
  version?: number;
  raw: any;
}

export function ProgramJourneyManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedJourneyType, setSelectedJourneyType] = useState<JourneyType>('all');
  const [showJourneyBuilder, setShowJourneyBuilder] = useState(false);
  const [showMasterSetup, setShowMasterSetup] = useState(false);
  const [editingJourneyId, setEditingJourneyId] = useState<string | null>(null);

  const { data: programs, isLoading: programsLoading, error: programsError } = usePrograms();
  const { data: academicJourneys, isLoading: journeysLoading, error: journeysError, refetch: refetchJourneys } = useAcademicJourneys();
  const { data: practicumJourneys, isLoading: practicumLoading } = usePracticumJourneys(session?.user?.id || '');

  // Set initial filter from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    if (typeParam === 'practicum') {
      setSelectedJourneyType('practicum');
    }
  }, [location.search]);

  // Check master templates and seed dummy data if needed
  useEffect(() => {
    const checkAndSeed = async () => {
      try {
        const hasMasterTemplates = await MasterJourneyService.checkMasterTemplatesExist();
        
        if (!hasMasterTemplates) {
          setShowMasterSetup(true);
          return;
        }

        // Seed dummy data if no academic journeys exist
        if (academicJourneys && academicJourneys.length === 0 && !journeysLoading) {
          // await enrollmentDemoSeedService.seedDummyData();
          refetchJourneys();
          toast.success('Master templates are ready!');
        }
      } catch (error) {
        console.error('Error checking master templates or seeding data:', error);
      }
    };

    if (!journeysLoading) {
      checkAndSeed();
    }
  }, [academicJourneys, journeysLoading, refetchJourneys]);

  // Combine and normalize journeys
  const combinedJourneys: CombinedJourney[] = [
    ...(academicJourneys?.map(journey => ({
      id: journey.id,
      type: 'academic' as const,
      name: journey.name,
      description: journey.description,
      is_active: journey.is_active,
      created_at: journey.created_at,
      stagesCount: journey.stages?.length || 0,
      program_id: journey.program_id,
      version: journey.version,
      raw: journey
    })) || []),
    ...(practicumJourneys?.map(journey => ({
      id: journey.id,
      type: 'practicum' as const,
      name: journey.journey_name,
      description: '',
      is_active: journey.is_active,
      created_at: journey.created_at,
      stagesCount: Array.isArray(journey.steps) ? journey.steps.length : 0,
      program_id: journey.program_id,
      version: undefined,
      raw: journey
    })) || [])
  ];

  // Filter journeys based on search, program, and type selection
  const filteredJourneys = combinedJourneys.filter(journey => {
    const matchesSearch = journey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (journey.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesProgram = selectedProgram === 'all' || journey.program_id === selectedProgram;
    const matchesType = selectedJourneyType === 'all' || journey.type === selectedJourneyType;
    return matchesSearch && matchesProgram && matchesType;
  });

  if (programsError || journeysError) {
    console.error('Error loading data:', { programsError, journeysError });
  }

  const handleCreateAcademicJourney = () => {
    setShowJourneyBuilder(true);
  };

  const handleCreatePracticumJourney = () => {
    navigate('/admin/practicum/journeys/builder');
  };

  const handleEditJourney = (journey: CombinedJourney) => {
    if (journey.type === 'academic') {
      setEditingJourneyId(journey.id);
    } else {
      // Convert practicum journey to builder config format
      const builderConfig = {
        id: journey.id,
        name: journey.name,
        description: journey.description || '',
        type: 'practicum',
        elements: journey.raw.steps || [],
        settings: {},
        metadata: {
          created_at: journey.created_at,
          updated_at: journey.raw.updated_at
        }
      };
      
      navigate(`/admin/practicum/journeys/builder/${journey.id}`, {
        state: { journey: builderConfig }
      });
    }
  };

  const handleMasterSetupComplete = () => {
    setShowMasterSetup(false);
    refetchJourneys();
  };

  const handleMasterSetupSkip = () => {
    setShowMasterSetup(false);
    toast('Master templates are recommended for consistent journey management');
  };

  const getProgramName = (programId?: string | null) => {
    if (!programId) return 'No Program';
    const program = programs?.find(p => p.id === programId);
    return program?.name || 'Unknown Program';
  };

  const getJourneyStatusColor = (isActive: boolean) => {
    return isActive ? 'status-active' : 'status-inactive';
  };

  const getJourneyStatusIcon = (isActive: boolean) => {
    return isActive ? CheckCircle : Clock;
  };

  const getJourneyCardClass = (isActive: boolean) => {
    return isActive ? 'journey-card journey-card-active' : 'journey-card journey-card-inactive';
  };

  const getStagesCompletionPercentage = (stages: any[] = []) => {
    if (!stages.length) return 0;
    const activeStages = stages.filter(stage => stage.status === 'active').length;
    return Math.round((activeStages / stages.length) * 100);
  };

  // Show Master Journey Setup Wizard if needed
  if (showMasterSetup) {
    return (
      <MasterJourneySetupWizard 
        onComplete={handleMasterSetupComplete}
        onSkip={handleMasterSetupSkip}
      />
    );
  }

  // Show Journey Editor if editing is active
  if (editingJourneyId) {
    return (
      <JourneyEditor 
        journeyId={editingJourneyId}
        onBack={() => setEditingJourneyId(null)}
      />
    );
  }

  // Show Journey Builder if building is active
  if (showJourneyBuilder) {
    return (
      <JourneyBuilder 
        onBack={() => setShowJourneyBuilder(false)}
      />
    );
  }

  // Main manager interface
  return (
    <div className="space-y-8">
      {/* Enhanced Header with Glass Card */}
      <div className="glass-card p-8 rounded-2xl border border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-primary text-primary-foreground">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                 <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Journey Manager
                </h1>
                <p className="text-muted-foreground mt-1">
                  Design and manage academic and practicum journeys with advanced analytics
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {(selectedJourneyType === 'all' || selectedJourneyType === 'academic') && (
              <Button variant="outline" onClick={() => setShowMasterSetup(true)} className="action-button">
                <Settings className="h-4 w-4 mr-2" />
                Master Templates
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2 action-button bg-gradient-primary hover:shadow-lg">
                  <Plus className="h-4 w-4" />
                  Create Journey
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCreateAcademicJourney}>
                  Create Academic Journey
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreatePracticumJourney}>
                  Create Practicum Journey
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="glass-card p-6 rounded-xl border border-border/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search journeys by name, description, or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl border-border/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Select value={selectedJourneyType} onValueChange={(value) => setSelectedJourneyType(value as JourneyType)}>
            <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-xl border-border/50">
              <SelectValue placeholder="Journey Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="practicum">Practicum</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={selectedProgram} 
            onValueChange={setSelectedProgram}
            disabled={selectedJourneyType === 'practicum'}
          >
            <SelectTrigger className="w-full sm:w-[240px] h-12 rounded-xl border-border/50">
              <SelectValue placeholder="Filter by program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programs?.map(program => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Journeys Grid */}
      {(journeysLoading || practicumLoading) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="journey-card p-6 animate-pulse">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-muted rounded-lg w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                  <div className="h-6 bg-muted rounded-full w-16"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-10 bg-muted rounded-lg flex-1"></div>
                    <div className="h-10 bg-muted rounded-lg flex-1"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredJourneys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJourneys.map((journey, index) => {
            const StatusIcon = getJourneyStatusIcon(journey.is_active);
            const completionPercentage = journey.type === 'academic' ? getStagesCompletionPercentage(journey.raw.stages) : 0;
            
            return (
              <div 
                key={journey.id} 
                className={`${getJourneyCardClass(journey.is_active)} p-6 group animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                        {journey.name}
                      </h3>
                      <Badge variant={journey.type === 'academic' ? 'default' : 'secondary'} className="text-xs">
                        {journey.type === 'academic' ? 'Academic' : 'Practicum'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {journey.description || 'No description provided'}
                    </p>
                  </div>
                  <div className={`status-indicator ${getJourneyStatusColor(journey.is_active)} ml-3 flex-shrink-0`}>
                    <StatusIcon className="h-3 w-3" />
                    {journey.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Progress Indicator - Only for Academic journeys */}
                {journey.type === 'academic' && journey.raw.stages && journey.raw.stages.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Stage Progress</span>
                      <span>{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Journey Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate text-foreground">
                      {journey.type === 'academic' ? getProgramName(journey.program_id) : 'Practicum'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {journey.stagesCount} {journey.type === 'academic' ? 'stages' : 'steps'}
                    </span>
                  </div>
                  {journey.version && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">v{journey.version}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {new Date(journey.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 action-button hover:border-primary/30 hover:bg-primary/5"
                    onClick={() => handleEditJourney(journey)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 action-button hover:border-accent/30 hover:bg-accent/5"
                    onClick={() => toast('Journey preview coming soon!')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card text-center py-20 rounded-2xl border border-border/50">
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="h-12 w-12 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                <AlertTriangle className="h-3 w-3 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No Journeys Found
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {searchTerm || selectedProgram !== 'all' || selectedJourneyType !== 'all'
                ? 'No journeys match your current filters. Try adjusting your search criteria or clear filters to see all journeys.'
                : 'Transform your enrollment process by creating structured academic and practicum journeys. Guide students through each step with intelligent workflows.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(searchTerm || selectedProgram !== 'all' || selectedJourneyType !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedProgram('all');
                    setSelectedJourneyType('all');
                  }}
                  className="action-button"
                >
                  Clear Filters
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2 action-button bg-gradient-primary hover:shadow-lg">
                    <Plus className="h-4 w-4" />
                    Create Your First Journey
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={handleCreateAcademicJourney}>
                    Create Academic Journey
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCreatePracticumJourney}>
                    Create Practicum Journey
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Analytics Dashboard */}
      {filteredJourneys.length > 0 && (
        <div className="glass-card p-6 rounded-xl border border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Analytics Overview</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1 animate-counter">
                {filteredJourneys.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Journeys</div>
            </div>
            
            <div className="text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-success-light rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-success mb-1 animate-counter">
                {filteredJourneys.filter(j => j.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Journeys</div>
            </div>
            
            <div className="text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning-light rounded-2xl flex items-center justify-center mx-auto">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-warning mb-1 animate-counter">
                {filteredJourneys.filter(j => !j.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Inactive</div>
            </div>
            
            <div className="text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-accent mb-1 animate-counter">
                {new Set(filteredJourneys.map(j => j.program_id)).size}
              </div>
              <div className="text-sm text-muted-foreground">Programs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}