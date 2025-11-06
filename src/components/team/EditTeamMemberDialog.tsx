import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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

interface EditTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onMemberUpdated: () => void;
}

const EditTeamMemberDialog: React.FC<EditTeamMemberDialogProps> = ({
  isOpen,
  onClose,
  member,
  onMemberUpdated
}) => {
  const { toast } = useToast();
  const [role, setRole] = useState(member?.role || 'member');
  const [isActive, setIsActive] = useState(member?.is_active ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  React.useEffect(() => {
    if (member) {
      setRole(member.role);
      setIsActive(member.is_active);
    }
  }, [member]);

  const handleSave = async () => {
    if (!member) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          role,
          is_active: isActive
        })
        .eq('id', member.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member updated successfully"
      });

      onMemberUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!member) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', member.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member removed successfully"
      });

      onMemberUpdated();
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!member) return null;

  const getUserInitials = () => {
    if (member.profiles?.first_name && member.profiles?.last_name) {
      return `${member.profiles.first_name[0]}${member.profiles.last_name[0]}`.toUpperCase();
    }
    return member.profiles?.email[0].toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (member.profiles?.first_name && member.profiles?.last_name) {
      return `${member.profiles.first_name} ${member.profiles.last_name}`;
    }
    return member.profiles?.email || 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Team Member
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="w-16 h-16">
                <AvatarImage src={member.profiles?.avatar_url || undefined} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-lg">{getUserDisplayName()}</p>
                <p className="text-sm text-muted-foreground truncate">{member.profiles?.email}</p>
                {member.profiles?.title && (
                  <p className="text-xs text-muted-foreground truncate mt-1">{member.profiles.title}</p>
                )}
              </div>
            </div>

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

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Status</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <span className="text-sm text-muted-foreground">
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joined:</span>
                <span className="font-medium">{formatDate(member.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Leads Today:</span>
                <span className="font-medium">{member.assigned_leads_today}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove from Team
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {getUserDisplayName()} from this team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} disabled={isLoading}>
              {isLoading ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditTeamMemberDialog;
