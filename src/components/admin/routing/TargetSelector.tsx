import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Users, User, Search, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TargetSelectorProps {
  targetType: 'advisors' | 'teams';
  selectedAdvisors: string[];
  selectedTeams: string[];
  onTargetTypeChange: (type: 'advisors' | 'teams') => void;
  onAdvisorsChange: (advisors: string[]) => void;
  onTeamsChange: (teams: string[]) => void;
}

interface Advisor {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  title?: string;
  avatar_url?: string;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  type?: string;
  region?: string;
  is_active: boolean;
  member_count: number;
}

export function TargetSelector({
  targetType,
  selectedAdvisors,
  selectedTeams,
  onTargetTypeChange,
  onAdvisorsChange,
  onTeamsChange
}: TargetSelectorProps) {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (targetType === 'advisors') {
      fetchAdvisors();
    } else {
      fetchTeams();
    }
  }, [targetType]);

  const fetchAdvisors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email, title, avatar_url')
        .order('first_name');

      if (error) throw error;
      setAdvisors(data || []);
    } catch (error) {
      console.error('Error fetching advisors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load advisors',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('master_teams')
        .select(`
          id,
          name,
          description,
          type,
          region,
          is_active,
          team_members (count)
        `)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      const teamsWithCount = (data || []).map(team => ({
        ...team,
        member_count: Array.isArray(team.team_members) ? team.team_members.length : (team.team_members as any)?.count || 0
      }));

      setTeams(teamsWithCount);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teams',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdvisor = (advisorId: string) => {
    if (selectedAdvisors.includes(advisorId)) {
      onAdvisorsChange(selectedAdvisors.filter(id => id !== advisorId));
    } else {
      onAdvisorsChange([...selectedAdvisors, advisorId]);
    }
  };

  const toggleTeam = (teamId: string) => {
    if (selectedTeams.includes(teamId)) {
      onTeamsChange(selectedTeams.filter(id => id !== teamId));
    } else {
      onTeamsChange([...selectedTeams, teamId]);
    }
  };

  const selectAll = () => {
    if (targetType === 'advisors') {
      const filtered = getFilteredAdvisors();
      onAdvisorsChange(filtered.map(a => a.user_id));
    } else {
      const filtered = getFilteredTeams();
      onTeamsChange(filtered.map(t => t.id));
    }
  };

  const clearAll = () => {
    if (targetType === 'advisors') {
      onAdvisorsChange([]);
    } else {
      onTeamsChange([]);
    }
  };

  const getFilteredAdvisors = () => {
    if (!searchTerm) return advisors;
    const term = searchTerm.toLowerCase();
    return advisors.filter(
      a =>
        a.first_name?.toLowerCase().includes(term) ||
        a.last_name?.toLowerCase().includes(term) ||
        a.email?.toLowerCase().includes(term) ||
        a.title?.toLowerCase().includes(term)
    );
  };

  const getFilteredTeams = () => {
    if (!searchTerm) return teams;
    const term = searchTerm.toLowerCase();
    return teams.filter(
      t =>
        t.name?.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term) ||
        t.type?.toLowerCase().includes(term) ||
        t.region?.toLowerCase().includes(term)
    );
  };

  const removeAdvisor = (advisorId: string) => {
    onAdvisorsChange(selectedAdvisors.filter(id => id !== advisorId));
  };

  const removeTeam = (teamId: string) => {
    onTeamsChange(selectedTeams.filter(id => id !== teamId));
  };

  const getAdvisorName = (advisorId: string) => {
    const advisor = advisors.find(a => a.user_id === advisorId);
    if (!advisor) return advisorId;
    return `${advisor.first_name} ${advisor.last_name}`;
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || teamId;
  };

  const filteredAdvisors = getFilteredAdvisors();
  const filteredTeams = getFilteredTeams();

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Select Assignment Targets</Label>
        <p className="text-sm text-muted-foreground">
          Choose specific advisors or teams to receive leads from this rule
        </p>
      </div>

      {/* Target Type Selection */}
      <RadioGroup value={targetType} onValueChange={(value) => onTargetTypeChange(value as 'advisors' | 'teams')}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="advisors" id="advisors" />
          <Label htmlFor="advisors" className="cursor-pointer flex items-center gap-2">
            <User className="h-4 w-4" />
            Assign to Specific Advisors
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="teams" id="teams" />
          <Label htmlFor="teams" className="cursor-pointer flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assign to Teams
          </Label>
        </div>
      </RadioGroup>

      {/* Search and Actions */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${targetType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={selectAll} variant="outline" size="sm">
          Select All
        </Button>
        <Button onClick={clearAll} variant="outline" size="sm">
          Clear
        </Button>
      </div>

      {/* Selection List */}
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : targetType === 'advisors' ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredAdvisors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No advisors found</div>
              ) : (
                filteredAdvisors.map((advisor) => (
                  <div
                    key={advisor.user_id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => toggleAdvisor(advisor.user_id)}
                  >
                    <Checkbox
                      checked={selectedAdvisors.includes(advisor.user_id)}
                      onCheckedChange={() => toggleAdvisor(advisor.user_id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
                        {advisor.first_name} {advisor.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{advisor.email}</div>
                      {advisor.title && (
                        <div className="text-xs text-muted-foreground">{advisor.title}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTeams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No teams found</div>
              ) : (
                filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => toggleTeam(team.id)}
                  >
                    <Checkbox
                      checked={selectedTeams.includes(team.id)}
                      onCheckedChange={() => toggleTeam(team.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium flex items-center gap-2">
                        {team.name}
                        <Badge variant="secondary" className="text-xs">
                          {team.member_count} {team.member_count === 1 ? 'member' : 'members'}
                        </Badge>
                      </div>
                      {team.description && (
                        <div className="text-sm text-muted-foreground truncate">{team.description}</div>
                      )}
                      {(team.type || team.region) && (
                        <div className="flex gap-2 mt-1">
                          {team.type && (
                            <Badge variant="outline" className="text-xs">
                              {team.type}
                            </Badge>
                          )}
                          {team.region && (
                            <Badge variant="outline" className="text-xs">
                              {team.region}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Items Preview */}
      {(selectedAdvisors.length > 0 || selectedTeams.length > 0) && (
        <div>
          <Label className="text-sm font-medium">Selected Targets:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {targetType === 'advisors'
              ? selectedAdvisors.map((advisorId) => (
                  <Badge key={advisorId} variant="secondary" className="pl-2 pr-1">
                    {getAdvisorName(advisorId)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAdvisor(advisorId);
                      }}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              : selectedTeams.map((teamId) => (
                  <Badge key={teamId} variant="secondary" className="pl-2 pr-1">
                    {getTeamName(teamId)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTeam(teamId);
                      }}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {targetType === 'teams'
              ? 'Leads will be distributed among all active members of the selected teams.'
              : `${selectedAdvisors.length} ${selectedAdvisors.length === 1 ? 'advisor' : 'advisors'} selected.`}
          </p>
        </div>
      )}
    </div>
  );
}
