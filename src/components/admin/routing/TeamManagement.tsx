import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AdvisorTeam, TeamMember } from '@/types/routing';
import { Plus, Edit, Trash2, Users, MapPin, Search, Calendar, Settings, TrendingUp } from 'lucide-react';

interface TeamManagementProps {
  onTeamCreated?: () => void;
}

export function TeamManagement({ onTeamCreated }: TeamManagementProps) {
  const [teams, setTeams] = useState<AdvisorTeam[]>([]);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<AdvisorTeam | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Mock advisor data
  useEffect(() => {
    setAdvisors([
      {
        id: 'advisor-1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        max_assignments: 10,
        current_assignments: 23,
        status: 'active',
        schedule: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_time: '09:00',
          end_time: '17:00'
        },
        performance_tier: 'Top',
        team_id: 'team-1',
        response_time_avg: 45,
        conversion_rate: 25.5
      },
      {
        id: 'advisor-2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        max_assignments: 8,
        current_assignments: 17,
        status: 'active',
        schedule: {
          days: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          start_time: '10:00',
          end_time: '18:00'
        },
        performance_tier: 'Advanced',
        team_id: 'team-1',
        response_time_avg: 32,
        conversion_rate: 31.2
      },
      {
        id: 'advisor-3',
        name: 'Michael Lee',
        email: 'michael.l@example.com',
        max_assignments: 6,
        current_assignments: 12,
        status: 'inactive',
        schedule: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_time: '08:00',
          end_time: '16:00'
        },
        performance_tier: 'Standard',
        team_id: 'team-2',
        response_time_avg: 58,
        conversion_rate: 18.7
      },
      {
        id: 'advisor-4',
        name: 'Emily Chen',
        email: 'emily.c@example.com',
        max_assignments: 12,
        current_assignments: 26,
        status: 'active',
        schedule: {
          days: ['wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          start_time: '12:00',
          end_time: '20:00'
        },
        performance_tier: 'Top',
        team_id: 'team-2',
        response_time_avg: 28,
        conversion_rate: 35.8
      },
      {
        id: 'advisor-5',
        name: 'Robert Williams',
        email: 'robert.w@example.com',
        max_assignments: 8,
        current_assignments: 14,
        status: 'active',
        schedule: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_time: '09:00',
          end_time: '17:00'
        },
        performance_tier: 'Advanced',
        team_id: 'team-1',
        response_time_avg: 41,
        conversion_rate: 28.9
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

  const updateAdvisorSettings = (advisorId: string, updates: any) => {
    setAdvisors(prev => prev.map(advisor => 
      advisor.id === advisorId ? { ...advisor, ...updates } : advisor
    ));
    toast({
      title: 'Success',
      description: 'Advisor settings updated successfully'
    });
  };

  const filteredAdvisors = advisors.filter(advisor =>
    advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCapacityPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatSchedule = (schedule: any) => {
    const dayMap: { [key: string]: string } = {
      monday: 'Mon',
      tuesday: 'Tue', 
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    };
    
    const days = schedule.days.map((day: string) => dayMap[day]).join(', ');
    return `${days} (${schedule.start_time} - ${schedule.end_time})`;
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
          <h2 className="text-2xl font-bold">Team & Advisor Management</h2>
          <p className="text-muted-foreground">Organize advisors into teams and manage individual settings</p>
        </div>
      </div>

      <Tabs defaultValue="advisors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="advisors">Advisor Management</TabsTrigger>
          <TabsTrigger value="teams">Team Management</TabsTrigger>
        </TabsList>

        <TabsContent value="advisors" className="space-y-6">
          {/* Search and Stats */}
          <div className="flex items-center justify-between">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search advisors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>Total: {advisors.length}</span>
              <span>Active: {advisors.filter(a => a.status === 'active').length}</span>
              <span>Capacity: {Math.round((advisors.reduce((sum, a) => sum + a.current_assignments, 0) / advisors.reduce((sum, a) => sum + a.max_assignments, 0)) * 100)}%</span>
            </div>
          </div>

          {/* Advisor List */}
          <Card>
            <CardHeader>
              <CardTitle>Advisor Management</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your advisors' workload, status, and performance settings</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-muted-foreground border-b">
                  <div className="col-span-3">Advisor</div>
                  <div className="col-span-2">Max Assignments</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2">Schedule</div>
                  <div className="col-span-2">Performance Tier</div>
                  <div className="col-span-2">Capacity</div>
                </div>

                {/* Advisor Rows */}
                {filteredAdvisors.map(advisor => {
                  const capacityPercentage = getCapacityPercentage(advisor.current_assignments, advisor.max_assignments);
                  
                  return (
                    <div key={advisor.id} className="grid grid-cols-12 gap-4 py-3 items-center border-b last:border-b-0">
                      {/* Advisor Info */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                            {advisor.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{advisor.name}</p>
                            <p className="text-sm text-muted-foreground">{advisor.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Max Assignments */}
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={advisor.max_assignments}
                          onChange={(e) => updateAdvisorSettings(advisor.id, { max_assignments: parseInt(e.target.value) })}
                          className="w-20"
                          min="1"
                        />
                        <span className="text-sm text-muted-foreground ml-2">per week</span>
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        <Switch
                          checked={advisor.status === 'active'}
                          onCheckedChange={(checked) => 
                            updateAdvisorSettings(advisor.id, { status: checked ? 'active' : 'inactive' })
                          }
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          {advisor.status === 'active' ? 'Active' : 'Inactive'}
                        </p>
                      </div>

                      {/* Schedule */}
                      <div className="col-span-2">
                        <p className="text-sm">{formatSchedule(advisor.schedule)}</p>
                        <Button variant="outline" size="sm" className="mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Adjust
                        </Button>
                      </div>

                      {/* Performance Tier */}
                      <div className="col-span-2">
                        <Select 
                          value={advisor.performance_tier}
                          onValueChange={(value) => updateAdvisorSettings(advisor.id, { performance_tier: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Top">Top Performer</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Capacity */}
                      <div className="col-span-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{advisor.current_assignments} of {advisor.max_assignments}</span>
                            <span>{Math.round(capacityPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${getCapacityColor(capacityPercentage)}`}
                              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                    <p className="text-2xl font-bold">
                      {Math.round(advisors.reduce((sum, a) => sum + a.response_time_avg, 0) / advisors.length)}m
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Conversion Rate</p>
                    <p className="text-2xl font-bold">
                      {Math.round((advisors.reduce((sum, a) => sum + a.conversion_rate, 0) / advisors.length) * 10) / 10}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                    <p className="text-2xl font-bold">
                      {advisors.reduce((sum, a) => sum + a.current_assignments, 0)}/{advisors.reduce((sum, a) => sum + a.max_assignments, 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
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
                          <span>{advisors.filter(a => a.team_id === team.id).length} advisors</span>
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
                  
                  <div className="space-y-4">
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
                    
                    {/* Team Members */}
                    <div>
                      <Label className="text-sm font-medium">Team Members:</Label>
                      <div className="mt-2 space-y-2">
                        {advisors
                          .filter(advisor => advisor.team_id === team.id)
                          .map(advisor => (
                            <div key={advisor.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                                  {advisor.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <span className="text-sm">{advisor.name}</span>
                                <Badge variant="outline">
                                  {advisor.performance_tier}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {advisor.current_assignments}/{advisor.max_assignments} assignments
                              </span>
                            </div>
                          ))}
                        {advisors.filter(advisor => advisor.team_id === team.id).length === 0 && (
                          <p className="text-sm text-muted-foreground">No advisors assigned to this team</p>
                        )}
                      </div>
                    </div>
                  </div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}