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
import { Plus, Edit, Trash2, Users, MapPin, Search, Calendar, Settings, TrendingUp, UserCog, Shield, Network, Workflow } from 'lucide-react';
import TeamMembersList from '@/components/team/TeamMembersList';
import { EnhancedTeamHierarchy } from '@/components/admin/team/EnhancedTeamHierarchy';
import { SystemRoleManagement } from '@/components/admin/team/SystemRoleManagement';
import { PermissionMatrix } from '@/components/admin/team/PermissionMatrix';
import { UserDirectory } from '@/components/admin/team/UserDirectory';

interface TeamManagementProps {
  onTeamCreated?: () => void;
}

export function TeamManagement({ onTeamCreated }: TeamManagementProps) {
  const [teams, setTeams] = useState<AdvisorTeam[]>([]);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<AdvisorTeam | null>(null);
  const [managingTeam, setManagingTeam] = useState<AdvisorTeam | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Team Management
          </h2>
          <p className="text-muted-foreground mt-1">Comprehensive team organization, roles, and permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Teams</p>
                <p className="text-2xl font-bold mt-1">{teams.filter(t => t.is_active).length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold mt-1">{advisors.filter(a => a.status === 'active').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                <UserCog className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Roles</p>
                <p className="text-2xl font-bold mt-1">6</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Permissions</p>
                <p className="text-2xl font-bold mt-1">12</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Workflow className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          <TabsTrigger value="directory" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-4 w-4" />
            User Directory
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Network className="h-4 w-4" />
            Team Hierarchy
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-4 w-4" />
            Routing Teams
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="h-4 w-4" />
            Role Management
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Workflow className="h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          <UserDirectory />
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-6">
          <EnhancedTeamHierarchy />
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
                    onClick={() => setManagingTeam(team)}
                    variant="default"
                    size="sm"
                  >
                    <UserCog className="h-4 w-4 mr-1" />
                    Manage Members
                  </Button>
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

        {/* Team Member Management Dialog */}
        <Dialog open={!!managingTeam} onOpenChange={() => setManagingTeam(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Team Members</DialogTitle>
            </DialogHeader>
            {managingTeam && (
              <TeamMembersList
                teamId={managingTeam.id}
                teamName={managingTeam.name}
              />
            )}
          </DialogContent>
        </Dialog>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <SystemRoleManagement />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <PermissionMatrix />
        </TabsContent>

        <TabsContent value="advisors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Team Advisors
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                View and manage advisors across all teams
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search advisors by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredAdvisors.map(advisor => {
                  const capacityPercentage = getCapacityPercentage(advisor.current_assignments, advisor.max_assignments);
                  const team = teams.find(t => t.id === advisor.team_id);
                  
                  return (
                    <div key={advisor.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">{advisor.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <div className="font-medium">{advisor.name}</div>
                            <div className="text-sm text-muted-foreground">{advisor.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {team && (
                            <Badge variant="outline">
                              <Users className="h-3 w-3 mr-1" />
                              {team.name}
                            </Badge>
                          )}
                          <Badge className={advisor.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                            {advisor.status}
                          </Badge>
                          <Badge variant="secondary">{advisor.performance_tier}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Capacity</span>
                            <span className="font-medium">{advisor.current_assignments}/{advisor.max_assignments}</span>
                          </div>
                          <Progress 
                            value={capacityPercentage} 
                            className={`h-2 ${getCapacityColor(capacityPercentage)}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Performance</div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-success" />
                              <span className="font-medium">{advisor.conversion_rate}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-info" />
                              <span className="font-medium">{advisor.response_time_avg}min</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Schedule</div>
                          <div className="text-xs">{formatSchedule(advisor.schedule)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
