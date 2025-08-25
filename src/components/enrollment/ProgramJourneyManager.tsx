import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePrograms } from '@/services/programService';
import { useAcademicJourneys, useCreateJourneyFromTemplate } from '@/services/academicJourneyService';
import { JourneyBuilder } from './JourneyBuilder';
import { JourneyPlayMapper } from '@/components/admin/JourneyPlayMapper';
import { BookOpen, Plus, Settings, Eye, ArrowRight, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ProgramJourneyManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [showJourneyBuilder, setShowJourneyBuilder] = useState(false);
  const [showPlayMapper, setShowPlayMapper] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<any>(null);
  
  const { toast } = useToast();
  const { data: programs } = usePrograms();
  const { data: journeys, isLoading } = useAcademicJourneys();
  const createJourneyMutation = useCreateJourneyFromTemplate();

  const filteredJourneys = journeys?.filter(journey => {
    const matchesSearch = journey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journey.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = filterProgram === 'all' || journey.program_id === filterProgram;
    return matchesSearch && matchesProgram;
  }) || [];

  const handleCreateJourney = () => {
    setShowJourneyBuilder(true);
  };

  const getProgramName = (programId: string | null) => {
    if (!programId || !programs) return 'No Program';
    const program = programs.find(p => p.id === programId);
    return program?.name || 'Unknown Program';
  };

  const getJourneyStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  if (showPlayMapper && selectedJourney) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowPlayMapper(false);
              setSelectedJourney(null);
            }}
          >
            ← Back to Journeys
          </Button>
          <div>
            <h2 className="text-xl font-semibold">{selectedJourney.name}</h2>
            <p className="text-muted-foreground">Configure plays for this journey</p>
          </div>
        </div>
        
        <JourneyPlayMapper 
          journey={selectedJourney}
          onMappingsChanged={() => {
            // Optionally refresh data
          }}
        />
      </div>
    );
  }

  if (showJourneyBuilder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Create Academic Journey</h2>
            <p className="text-muted-foreground">Build a new academic journey from templates</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowJourneyBuilder(false)}
          >
            Back to Manager
          </Button>
        </div>
        <JourneyBuilder />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Program Journey Manager</h2>
          <p className="text-muted-foreground">
            Manage academic journeys and workflows for your programs
          </p>
        </div>
        <Button onClick={handleCreateJourney} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Journey
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search journeys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterProgram} onValueChange={setFilterProgram}>
          <SelectTrigger className="w-full sm:w-48">
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

      {/* Journey List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredJourneys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJourneys.map(journey => (
            <Card key={journey.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{journey.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {journey.description || 'No description available'}
                    </p>
                  </div>
                  <Badge className={getJourneyStatusColor(journey.is_active)}>
                    {journey.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{getProgramName(journey.program_id)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Version {journey.version}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Created {new Date(journey.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedJourney(journey);
                        setShowPlayMapper(true);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure Plays
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Academic Journeys Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || filterProgram !== 'all' 
                ? 'No journeys match your current filters. Try adjusting your search criteria.'
                : 'Start creating academic journeys to manage student workflows and requirements.'
              }
            </p>
            <Button onClick={handleCreateJourney} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Journey
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {filteredJourneys.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center p-4">
              <div className="text-2xl font-bold text-primary">{filteredJourneys.length}</div>
              <div className="text-sm text-muted-foreground">Total Journeys</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredJourneys.filter(j => j.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-4">
              <div className="text-2xl font-bold text-orange-600">
                {filteredJourneys.filter(j => !j.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Inactive</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600">
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