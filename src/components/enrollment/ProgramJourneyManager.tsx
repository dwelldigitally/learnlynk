import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Eye, Settings, Calendar, Users, BookOpen, AlertTriangle } from 'lucide-react';
import { usePrograms } from '@/services/programService';
import { useAcademicJourneys } from '@/services/academicJourneyService';
import { JourneyBuilder } from './JourneyBuilder';
import { MasterJourneySetupWizard } from './MasterJourneySetupWizard';
import { AcademicJourney } from '@/types/academicJourney';
import { enrollmentDemoSeedService } from '@/services/enrollmentDemoSeedService';
import { MasterJourneyService } from '@/services/masterJourneyService';
import { toast } from 'sonner';

export function ProgramJourneyManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [showJourneyBuilder, setShowJourneyBuilder] = useState(false);
  const [showMasterSetup, setShowMasterSetup] = useState(false);

  const { data: programs, isLoading: programsLoading, error: programsError } = usePrograms();
  const { data: journeys, isLoading: journeysLoading, error: journeysError, refetch: refetchJourneys } = useAcademicJourneys();

  // Check master templates and seed dummy data if needed
  useEffect(() => {
    const checkAndSeed = async () => {
      try {
        const hasMasterTemplates = await MasterJourneyService.checkMasterTemplatesExist();
        
        if (!hasMasterTemplates) {
          setShowMasterSetup(true);
          return;
        }

        // Seed dummy data if no journeys exist
        if (journeys && journeys.length === 0 && !journeysLoading) {
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
  }, [journeys, journeysLoading, refetchJourneys]);

  // Filter journeys based on search and program selection
  const filteredJourneys = journeys?.filter(journey => {
    const matchesSearch = journey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (journey.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesProgram = selectedProgram === 'all' || journey.program_id === selectedProgram;
    return matchesSearch && matchesProgram;
  }) || [];

  if (programsError || journeysError) {
    console.error('Error loading data:', { programsError, journeysError });
  }

  const handleCreateJourney = () => {
    setShowJourneyBuilder(true);
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
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Journey Manager</h1>
          <p className="text-muted-foreground">
            Design and manage student enrollment journeys from inquiry to enrollment
          </p>
        </div>
        <Button onClick={handleCreateJourney} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Journey
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search journeys by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedProgram} onValueChange={setSelectedProgram}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select program" />
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

      {/* Journeys Grid */}
      {journeysLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted rounded flex-1"></div>
                    <div className="h-8 bg-muted rounded flex-1"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredJourneys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJourneys.map(journey => (
            <Card key={journey.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {journey.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {journey.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <Badge className={getJourneyStatusColor(journey.is_active)}>
                    {journey.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{getProgramName(journey.program_id)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>{journey.stages?.length || 0} stages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>v{journey.version}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(journey.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toast('Journey editing coming soon!')}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Edit Journey
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toast('Journey preview coming soon!')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Academic Journeys Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || selectedProgram !== 'all' 
                ? 'No journeys match your current filters. Try adjusting your search criteria.'
                : 'Get started by creating your first academic journey to manage student enrollment workflows.'
              }
            </p>
            <div className="flex gap-2 justify-center">
              {(searchTerm || selectedProgram !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedProgram('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Button onClick={handleCreateJourney} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {filteredJourneys.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center p-6">
              <div className="text-2xl font-bold text-primary mb-1">{filteredJourneys.length}</div>
              <div className="text-sm text-muted-foreground">Total Journeys</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {filteredJourneys.filter(j => j.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {filteredJourneys.filter(j => !j.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Inactive</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {new Set(filteredJourneys.map(j => j.program_id)).size}
              </div>
              <div className="text-sm text-muted-foreground">Programs</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}