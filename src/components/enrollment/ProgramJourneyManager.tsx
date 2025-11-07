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
import { PageHeader } from '@/components/modern/PageHeader';
import { ModernCard } from '@/components/modern/ModernCard';
import { InfoBadge } from '@/components/modern/InfoBadge';

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
        console.log('Checking master templates...');
        const hasMasterTemplates = await MasterJourneyService.checkMasterTemplatesExist();
        
        if (!hasMasterTemplates) {
          console.log('No master templates found, showing setup');
          setShowMasterSetup(true);
          return;
        }

        console.log('Master templates exist, checking journey data...', { 
          academicJourneys: academicJourneys?.length,
          journeysLoading 
        });
        
        // Check if no academic journeys exist - just show success message
        if (academicJourneys && academicJourneys.length === 0 && !journeysLoading) {
          console.log('No academic journeys found, showing success message');
          toast.success('Master templates are ready!');
        }
      } catch (error) {
        console.error('Error checking master templates:', error);
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
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Modern Header */}
        <PageHeader
          title="Journey Manager"
          subtitle="Design and manage academic and practicum journeys with advanced analytics and intelligent workflows"
          action={
            <div className="flex gap-3">
              {(selectedJourneyType === 'all' || selectedJourneyType === 'academic') && (
                <Button variant="outline" onClick={() => setShowMasterSetup(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Master Templates
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2">
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
          }
        />

        {/* Search and Filters */}
        <ModernCard>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search journeys by name, description, or program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <Select value={selectedJourneyType} onValueChange={(value) => setSelectedJourneyType(value as JourneyType)}>
                <SelectTrigger className="w-full sm:w-[200px]">
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
                <SelectTrigger className="w-full sm:w-[240px]">
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
        </ModernCard>

        {/* Journeys Grid */}
        {(journeysLoading || practicumLoading) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ModernCard key={i} className="animate-pulse">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </div>
                    <div className="h-6 bg-muted rounded-full w-16"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-10 bg-muted rounded flex-1"></div>
                      <div className="h-10 bg-muted rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        ) : filteredJourneys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJourneys.map((journey, index) => {
              const StatusIcon = getJourneyStatusIcon(journey.is_active);
              const completionPercentage = journey.type === 'academic' ? getStagesCompletionPercentage(journey.raw.stages) : 0;
              
              return (
                <ModernCard 
                  key={journey.id}
                  className="group hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {journey.name}
                          </h3>
                          <InfoBadge variant={journey.type === 'academic' ? 'default' : 'secondary'}>
                            {journey.type === 'academic' ? 'Academic' : 'Practicum'}
                          </InfoBadge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {journey.description || 'No description provided'}
                        </p>
                      </div>
                      <InfoBadge 
                        variant={journey.is_active ? 'success' : 'secondary'}
                        className="flex-shrink-0 ml-3"
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {journey.is_active ? 'Active' : 'Inactive'}
                      </InfoBadge>
                    </div>

                    {/* Progress Indicator - Academic journeys only */}
                    {journey.type === 'academic' && journey.raw.stages && journey.raw.stages.length > 0 && (
                      <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span className="font-medium">Stage Progress</span>
                          <span className="font-semibold">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Journey Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/20">
                        <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="truncate text-foreground font-medium">
                          {journey.type === 'academic' ? getProgramName(journey.program_id) : 'Practicum'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/20">
                        <Activity className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium">
                          {journey.stagesCount} {journey.type === 'academic' ? 'stages' : 'steps'}
                        </span>
                      </div>
                      {journey.version && (
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/20">
                          <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-foreground font-medium">v{journey.version}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/20">
                        <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium">
                          {new Date(journey.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3 border-t border-border/50">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditJourney(journey)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => toast('Journey preview coming soon!')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </ModernCard>
              );
            })}
          </div>
        ) : (
          <ModernCard>
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <BookOpen className="h-10 w-10 text-primary" />
                  </div>
                  {!searchTerm && selectedProgram === 'all' && selectedJourneyType === 'all' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  No Journeys Found
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {searchTerm || selectedProgram !== 'all' || selectedJourneyType !== 'all'
                    ? 'No journeys match your current filters. Try adjusting your search criteria or clear filters to see all journeys.'
                    : 'Transform your enrollment process by creating structured academic and practicum journeys. Guide students through each step with intelligent workflows.'
                  }
                </p>
                {!searchTerm && selectedProgram === 'all' && selectedJourneyType === 'all' && (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleCreateAcademicJourney} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Academic Journey
                    </Button>
                    <Button variant="outline" onClick={handleCreatePracticumJourney} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Practicum Journey
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ModernCard>
        )}

        {/* Stats Overview - Only when showing journeys */}
        {filteredJourneys.length > 0 && (
          <ModernCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Journey Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-3 rounded-lg bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {filteredJourneys.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Journeys</div>
                </div>
                
                <div className="text-center">
                  <div className="p-3 rounded-lg bg-success/10 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <div className="text-3xl font-bold text-success mb-1">
                    {filteredJourneys.filter(j => j.is_active).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
                
                <div className="text-center">
                  <div className="p-3 rounded-lg bg-blue-500/10 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {new Set(filteredJourneys.map(j => j.program_id)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Programs</div>
                </div>
              </div>
            </div>
          </ModernCard>
        )}
      </div>
    </div>
  );
}