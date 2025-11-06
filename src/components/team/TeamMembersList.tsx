import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Mail, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InviteTeamMemberDialog from './InviteTeamMemberDialog';
import AddTeamMemberDialog from './AddTeamMemberDialog';
import EditTeamMemberDialog from './EditTeamMemberDialog';

interface TeamMember {
  id: string;
  advisor_id: string;
  role: string;
  is_active: boolean;
  assigned_leads_today: number;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    avatar_url: string | null;
    title: string | null;
  } | null;
}

interface TeamMembersListProps {
  teamId: string;
  teamName: string;
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ teamId, teamName }) => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeamData = async () => {
    setIsLoading(true);
    try {
      // Fetch team members
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (membersError) throw membersError;

      // Fetch profiles for these members
      if (membersData && membersData.length > 0) {
        const advisorIds = membersData.map(m => m.advisor_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name, email, avatar_url, title')
          .in('user_id', advisorIds);

        if (profilesError) throw profilesError;

        // Merge the data
        const membersWithProfiles = membersData.map(member => ({
          ...member,
          profiles: profilesData?.find(p => p.user_id === member.advisor_id) || null
        }));

        setMembers(membersWithProfiles);
      } else {
        setMembers([]);
      }
      
      // Note: Invitations functionality can be added later
      setInvitations([]);
    } catch (error) {
      console.error('Error fetching team data:', error);
      toast({
        title: "Error",
        description: "Failed to load team data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [teamId]);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'advisor':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'member':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  const getUserInitials = (member: TeamMember) => {
    if (member.profiles?.first_name && member.profiles?.last_name) {
      return `${member.profiles.first_name[0]}${member.profiles.last_name[0]}`.toUpperCase();
    }
    return member.profiles?.email[0].toUpperCase() || 'U';
  };

  const getUserDisplayName = (member: TeamMember) => {
    if (member.profiles?.first_name && member.profiles?.last_name) {
      return `${member.profiles.first_name} ${member.profiles.last_name}`;
    }
    return member.profiles?.email || 'Unknown User';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {teamName} Members
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              size="sm"
              variant="default"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
            <Button 
              onClick={() => setIsInviteDialogOpen(true)}
              size="sm"
              variant="outline"
            >
              <Mail className="w-4 h-4 mr-2" />
              Invite New User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Team Statistics */}
            {members.length > 0 && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{members.length}</p>
                  <p className="text-xs text-muted-foreground">Total Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{members.filter(m => m.is_active).length}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {members.reduce((sum, m) => sum + (m.assigned_leads_today || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Leads Today</p>
                </div>
              </div>
            )}

            {/* Active Members */}
            {members.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Team Members</h4>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div 
                      key={member.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setEditingMember(member)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar>
                          <AvatarImage src={member.profiles?.avatar_url || undefined} />
                          <AvatarFallback>{getUserInitials(member)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{getUserDisplayName(member)}</p>
                            {member.is_active && (
                              <div className="w-2 h-2 rounded-full bg-green-500" title="Active" />
                            )}
                            {!member.is_active && (
                              <div className="w-2 h-2 rounded-full bg-gray-400" title="Inactive" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{member.profiles?.email}</p>
                          {member.profiles?.title && (
                            <p className="text-xs text-muted-foreground truncate">{member.profiles.title}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right mr-2">
                          <p className="text-xs text-muted-foreground">Assigned Today</p>
                          <p className="text-sm font-medium">{member.assigned_leads_today || 0}</p>
                        </div>
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingMember(member);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {members.length === 0 && invitations.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No team members yet.</p>
                <p className="text-sm text-muted-foreground">Invite your first team member to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddTeamMemberDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        teamId={teamId}
        onMemberAdded={fetchTeamData}
      />

      <InviteTeamMemberDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        teamId={teamId}
        onInviteSent={fetchTeamData}
      />

      <EditTeamMemberDialog
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        member={editingMember}
        onMemberUpdated={fetchTeamData}
      />
    </>
  );
};

export default TeamMembersList;
