import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Mail, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface InviteTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamId?: string;
  onInviteSent?: () => void;
}

const InviteTeamMemberDialog: React.FC<InviteTeamMemberDialogProps> = ({
  isOpen,
  onClose,
  teamId,
  onInviteSent
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvite = async () => {
    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    if (!teamId) {
      toast({
        title: "Error",
        description: "Team not selected",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', formData.email.trim())
        .single();

      // For now, we'll just show a success message and let the user manually add members
      // since the database schema is still being set up
      
      toast({
        title: "Feature Coming Soon",
        description: "Team invitation functionality is being set up. For now, please manually coordinate with team members.",
      });

      // Reset form
      setFormData({
        email: '',
        role: 'member',
        message: ''
      });

      onInviteSent?.();
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      role: 'member',
      message: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Team Member
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="colleague@university.edu"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData({...formData, role: value})}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Input
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Join our team to help with admissions..."
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSendInvite} disabled={isLoading}>
            <Mail className="w-4 h-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send Invitation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeamMemberDialog;