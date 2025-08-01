import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AdvisorTeam, TeamMember } from '@/types/routing';
import { Plus, Edit, Trash2, Users, MapPin } from 'lucide-react';

interface TeamManagementProps {
  onTeamCreated?: () => void;
}

export function TeamManagement({ onTeamCreated }: TeamManagementProps) {
  const [teams, setTeams] = useState<AdvisorTeam[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<AdvisorTeam | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock teams for demonstration
  useEffect(() => {
    setTeams([
      {
        id: 'team-1',
        name: 'Healthcare Specialists',
        description: 'Team specialized in healthcare programs',
        is_active: true,
        max_daily_assignments: 30,
        region: 'Canada',
        specializations: ['Health Care Assistant', 'Medical'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'team-2',
        name: 'Aviation Team',
        description: 'Advisors for aviation programs',
        is_active: true,
        max_daily_assignments: 20,
        region: 'North America',
        specializations: ['Aviation', 'Technical'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    max_daily_assignments: 30,
    region: '',
    specializations: [] as string[]
  });

  const availableSpecializations = [
    'Health Care Assistant',
    'Aviation',
    'Education Assistant',
    'Hospitality',
    'ECE',
    'MLA',
    'Medical',
    'Technical',
    'Business',
    'Creative Arts'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Team name is required',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      if (editingTeam) {
        // Update existing team
        const updatedTeam = {
          ...editingTeam,
          ...formData,
          updated_at: new Date().toISOString()
        };
        setTeams(prev => prev.map(team => team.id === editingTeam.id ? updatedTeam : team));
        toast({
          title: 'Success',
          description: 'Team updated successfully'
        });
      } else {
        // Create new team
        const newTeam: AdvisorTeam = {
          id: `team-${Date.now()}`,
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setTeams(prev => [...prev, newTeam]);
        toast({
          title: 'Success',
          description: 'Team created successfully'
        });
      }

      resetForm();
      setShowTeamForm(false);
      setEditingTeam(null);
      
      if (onTeamCreated) {
        onTeamCreated();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save team',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      is_active: true,
      max_daily_assignments: 30,
      region: '',
      specializations: []
    });
  };

  const handleEdit = (team: AdvisorTeam) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description || '',
      is_active: team.is_active,
      max_daily_assignments: team.max_daily_assignments,
      region: team.region || '',
      specializations: team.specializations
    });
    setShowTeamForm(true);
  };

  const handleDelete = async (teamId: string) => {
    try {
      setTeams(prev => prev.filter(team => team.id !== teamId));
      toast({
        title: 'Success',
        description: 'Team deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete team',
        variant: 'destructive'
      });
    }
  };

  const toggleTeamStatus = async (teamId: string) => {
    try {
      setTeams(prev => prev.map(team => 
        team.id === teamId 
          ? { ...team, is_active: !team.is_active, updated_at: new Date().toISOString() }
          : team
      ));
      
      const team = teams.find(t => t.id === teamId);
      toast({
        title: 'Success',
        description: `Team ${team?.is_active ? 'disabled' : 'enabled'} successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update team status',
        variant: 'destructive'
      });
    }
  };

  const addSpecialization = (specialization: string) => {
    if (!formData.specializations.includes(specialization)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, specialization]
      }));
    }
  };

  const removeSpecialization = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== specialization)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">Organize advisors into teams for better lead routing</p>
        </div>
        <Dialog open={showTeamForm} onOpenChange={setShowTeamForm}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingTeam(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTeam ? 'Edit Team' : 'Create New Team'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Team Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    placeholder="e.g., Canada, North America"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_assignments">Max Daily Assignments</Label>
                  <Input
                    id="max_assignments"
                    type="number"
                    min="1"
                    value={formData.max_daily_assignments}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_daily_assignments: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div>
                <Label>Specializations</Label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.specializations.map(spec => (
                      <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                        {spec}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeSpecialization(spec)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSpecializations
                      .filter(spec => !formData.specializations.includes(spec))
                      .map(spec => (
                        <Button
                          key={spec}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSpecialization(spec)}
                        >
                          + {spec}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowTeamForm(false);
                    resetForm();
                    setEditingTeam(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingTeam ? 'Update Team' : 'Create Team'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {teams.map(team => (
          <Card key={team.id} className={!team.is_active ? 'opacity-75' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {team.name}
                      {!team.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      {team.region && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {team.region}
                        </span>
                      )}
                      <span>Max {team.max_daily_assignments} daily assignments</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleTeamStatus(team.id)}
                    variant="outline"
                    size="sm"
                  >
                    {team.is_active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    onClick={() => handleEdit(team)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(team.id)}
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {team.description && (
                <p className="text-sm text-muted-foreground mb-4">{team.description}</p>
              )}
              
              {team.specializations.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Specializations:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {team.specializations.map(spec => (
                      <Badge key={spec} variant="outline">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {teams.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No teams created yet. Click "Add Team" to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}