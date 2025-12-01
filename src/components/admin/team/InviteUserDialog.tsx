import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserPlus, Mail, Shield, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateInvitation } from '@/hooks/useTeamInvitations';
import type { AppRole } from '@/types/team-management';

interface InviteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent?: () => void;
}

const roleOptions: Array<{ value: AppRole; label: string; description: string }> = [
  {
    value: 'admin',
    label: 'Administrator',
    description: 'Full system access with ability to manage all settings, users, and data'
  },
  {
    value: 'team_lead',
    label: 'Team Lead',
    description: 'Manage team members, leads, and view team reports'
  },
  {
    value: 'advisor',
    label: 'Advisor',
    description: 'Manage leads and students, view team reports'
  },
  {
    value: 'finance_officer',
    label: 'Finance Officer',
    description: 'Manage payments, process refunds, and view financial data'
  },
  {
    value: 'registrar',
    label: 'Registrar',
    description: 'Manage student records and academic information'
  },
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'View-only access to leads, students, and team reports'
  }
];

export function InviteUserDialog({ isOpen, onClose, onInviteSent }: InviteUserDialogProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AppRole>('viewer');
  const [personalMessage, setPersonalMessage] = useState('');
  
  const createInvitation = useCreateInvitation();

  const selectedRoleInfo = roleOptions.find(r => r.value === role);

  const handleSendInvite = async () => {
    if (!firstName.trim()) {
      toast.error('Please enter a first name');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await createInvitation.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        email: email.trim(),
        role,
        personal_message: personalMessage.trim() || undefined
      });

      toast.success(`Invitation sent to ${firstName} ${lastName}`.trim());
      
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setRole('viewer');
      setPersonalMessage('');
      
      onInviteSent?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invitation');
    }
  };

  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setRole('viewer');
    setPersonalMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite User to Team
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* First Name Input */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={createInvitation.isPending}
            />
          </div>

          {/* Last Name Input */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center gap-2">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={createInvitation.isPending}
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={createInvitation.isPending}
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Role
            </Label>
            <Select value={role} onValueChange={(v) => setRole(v as AppRole)} disabled={createInvitation.isPending}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRoleInfo && (
              <p className="text-sm text-muted-foreground">
                {selectedRoleInfo.description}
              </p>
            )}
          </div>

          {/* Personal Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Personal Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Add a personal note to your invitation..."
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              rows={3}
              disabled={createInvitation.isPending}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={createInvitation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendInvite}
            disabled={createInvitation.isPending}
          >
            {createInvitation.isPending ? (
              <>Sending...</>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
