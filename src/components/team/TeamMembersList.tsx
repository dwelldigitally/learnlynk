import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Mail, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import InviteTeamMemberDialog from './InviteTeamMemberDialog';

interface TeamMember {
  id: string;
  advisor_id: string;
  role: string;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeamData = async () => {
    setIsLoading(true);
    try {
      // For now, we'll show a placeholder as the team member functionality is being set up
      setMembers([]);
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

  const handleCancelInvitation = async (invitationId: string) => {
    // Placeholder for future implementation
    toast({
      title: "Feature Coming Soon",
      description: "Team management functionality is being set up",
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    // Placeholder for future implementation
    toast({
      title: "Feature Coming Soon", 
      description: "Team management functionality is being set up",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
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
          <Button 
            onClick={() => setIsInviteDialogOpen(true)}
            size="sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Active Members */}
            {members.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Active Members</h4>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {member.profiles?.first_name?.[0] || member.profiles?.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {member.profiles?.first_name && member.profiles?.last_name
                              ? `${member.profiles.first_name} ${member.profiles.last_name}`
                              : member.profiles?.email || 'Team Member'
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">{member.profiles?.email || 'No email'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Invitations */}
            {invitations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Pending Invitations</h4>
                <div className="space-y-2">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-orange-600 dark:text-orange-300" />
                        </div>
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited {new Date(invitation.invited_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(invitation.role)}>
                          {invitation.role}
                        </Badge>
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          Pending
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id)}
                        >
                          <X className="w-4 h-4 text-destructive" />
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

      <InviteTeamMemberDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        teamId={teamId}
        onInviteSent={fetchTeamData}
      />
    </>
  );
};

export default TeamMembersList;