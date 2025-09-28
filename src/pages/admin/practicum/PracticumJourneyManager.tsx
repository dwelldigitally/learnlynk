import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy, 
  FileText, 
  Clock, 
  CheckSquare, 
  BookOpen, 
  Award,
  Play,
  Pause,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePracticumJourneys, usePracticumJourneyMutations } from '@/hooks/usePracticum';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

const stepTypeIcons = {
  'agreement-signing': FileText,
  'attendance-logging': Clock,
  'competency-assessment': CheckSquare,
  'journal-entry': BookOpen,
  'evaluation-form': Award,
  'document-upload': FileText
};

export function PracticumJourneyManager() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const { data: journeys, isLoading } = usePracticumJourneys(session?.user?.id || '');
  const { createJourney } = usePracticumJourneyMutations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [journeyToDelete, setJourneyToDelete] = useState<string | null>(null);

  const filteredJourneys = journeys?.filter(journey =>
    journey.journey_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateNew = () => {
    navigate('/admin/practicum/journeys/builder');
  };

  const handleEdit = (journey: any) => {
    // Convert journey to builder config format
    const builderConfig = {
      id: journey.id,
      name: journey.journey_name,
      description: '',
      type: 'practicum',
      elements: journey.steps || [],
      settings: {},
      metadata: {
        created_at: journey.created_at,
        updated_at: journey.updated_at
      }
    };
    
    navigate(`/admin/practicum/journeys/builder/${journey.id}`, {
      state: { journey: builderConfig }
    });
  };

  const handleDuplicate = async (journey: any) => {
    try {
      const duplicatedJourney = {
        user_id: session?.user?.id,
        journey_name: `${journey.journey_name} (Copy)`,
        steps: journey.steps,
        is_active: true,
        is_default: false
      };

      const { error } = await supabase
        .from('practicum_journeys')
        .insert(duplicatedJourney);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journey duplicated successfully",
      });
    } catch (error) {
      console.error('Error duplicating journey:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate journey",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (journey: any) => {
    try {
      const { error } = await supabase
        .from('practicum_journeys')
        .update({ is_active: !journey.is_active })
        .eq('id', journey.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Journey ${journey.is_active ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling journey status:', error);
      toast({
        title: "Error",
        description: "Failed to update journey status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!journeyToDelete) return;
    
    try {
      const { error } = await supabase
        .from('practicum_journeys')
        .delete()
        .eq('id', journeyToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Journey deleted successfully",
      });
      setDeleteDialogOpen(false);
      setJourneyToDelete(null);
    } catch (error) {
      console.error('Error deleting journey:', error);
      toast({
        title: "Error",
        description: "Failed to delete journey",
        variant: "destructive",
      });
    }
  };

  const getStepTypeCounts = (steps: any[]) => {
    const counts: Record<string, number> = {};
    if (Array.isArray(steps)) {
      steps.forEach(step => {
        if (step && step.type) {
          counts[step.type] = (counts[step.type] || 0) + 1;
        }
      });
    }
    return counts;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Practicum Journey Manager</h1>
          <p className="text-muted-foreground">Create and manage practicum workflow journeys</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Journey
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search journeys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredJourneys.length} journey{filteredJourneys.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Journeys Grid */}
      {filteredJourneys.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Practicum Journeys Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first practicum journey to define the workflow steps students need to complete.
          </p>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Journey
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJourneys.map((journey) => {
            const steps = Array.isArray(journey.steps) ? journey.steps : [];
            const stepCounts = getStepTypeCounts(steps);
            
            return (
              <Card key={journey.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{journey.journey_name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={journey.is_active ? "default" : "secondary"}>
                          {journey.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {journey.is_default && (
                          <Badge variant="outline">Default</Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(journey)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(journey)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(journey)}>
                          {journey.is_active ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setJourneyToDelete(journey.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Steps</span>
                      <Badge variant="outline">{steps.length}</Badge>
                    </div>
                    
                    {/* Step Type Breakdown */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Step Types:</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(stepCounts).map(([type, count]) => {
                          const IconComponent = stepTypeIcons[type as keyof typeof stepTypeIcons] || FileText;
                          return (
                            <div key={type} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                              <IconComponent className="h-3 w-3" />
                              <span>{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleEdit(journey)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Journey</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this practicum journey? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}