import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Profile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url: string | null;
  title: string | null;
  department: string | null;
}

interface AddTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  onMemberAdded: () => void;
}

const AddTeamMemberDialog: React.FC<AddTeamMemberDialogProps> = ({
  isOpen,
  onClose,
  teamId,
  onMemberAdded
}) => {
  const { toast } = useToast();
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [role, setRole] = useState('member');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
    }
  }, [isOpen, teamId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(availableUsers);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        availableUsers.filter(user => {
          const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
          const email = user.email.toLowerCase();
          return fullName.includes(query) || email.includes(query);
        })
      );
    }
  }, [searchQuery, availableUsers]);

  const fetchAvailableUsers = async () => {
    setIsFetching(true);
    try {
      // Get users not already in this team
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select('advisor_id')
        .eq('team_id', teamId);

      if (membersError) throw membersError;

      const existingMemberIds = teamMembers?.map(m => m.advisor_id) || [];

      // Get all profiles except those already in the team
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email, avatar_url, title, department')
        .order('first_name', { ascending: true });

      if (profilesError) throw profilesError;

      const available = profiles?.filter(p => !existingMemberIds.includes(p.user_id)) || [];
      setAvailableUsers(available);
      setFilteredUsers(available);
    } catch (error) {
      console.error('Error fetching available users:', error);
      toast({
        title: "Error",
        description: "Failed to load available users",
        variant: "destructive"
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          advisor_id: selectedUser.user_id,
          role,
          is_active: true,
          assigned_leads_today: 0
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${selectedUser.first_name || selectedUser.email} added to team`
      });

      handleClose();
      onMemberAdded();
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedUser(null);
    setRole('member');
    onClose();
  };

  const getUserInitials = (user: Profile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const getUserDisplayName = (user: Profile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.email;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add Team Member
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9"
            />
          </div>

          <div className="flex-1 overflow-y-auto border rounded-lg">
            {isFetching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No users found matching your search' : 'No available users to add'}
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                      selectedUser?.user_id === user.user_id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{getUserDisplayName(user)}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        {user.title && (
                          <p className="text-xs text-muted-foreground truncate">{user.title}</p>
                        )}
                      </div>
                      {selectedUser?.user_id === user.user_id && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedUser && (
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAddMember} disabled={!selectedUser || isLoading}>
            {isLoading ? 'Adding...' : 'Add to Team'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
