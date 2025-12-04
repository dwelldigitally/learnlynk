import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssignRole, useRevokeRole } from '@/hooks/useSystemRoles';
import { toast } from 'sonner';
import type { AppRole } from '@/types/team-management';

interface ChangeRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string; // This is the user_id from profiles table
    full_name: string | null;
    email: string;
    roles: string[];
  } | null;
}

const ROLE_OPTIONS: { value: AppRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full system access' },
  { value: 'team_lead', label: 'Team Lead', description: 'Manage team members and leads' },
  { value: 'advisor', label: 'Advisor', description: 'Handle leads and students' },
  { value: 'finance_officer', label: 'Finance Officer', description: 'Manage payments and finances' },
  { value: 'registrar', label: 'Registrar', description: 'Manage student records' },
  { value: 'viewer', label: 'Viewer', description: 'View-only access' },
];

export const ChangeRoleDialog: React.FC<ChangeRoleDialogProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [selectedRole, setSelectedRole] = useState<AppRole | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const assignRole = useAssignRole();
  const revokeRole = useRevokeRole();

  const currentRole = (user?.roles[0] as AppRole) || null;

  const handleSubmit = async () => {
    if (!user || !selectedRole) return;

    setIsSubmitting(true);
    try {
      // Revoke current role if exists
      if (currentRole) {
        await revokeRole.mutateAsync({ userId: user.id, role: currentRole as AppRole });
      }
      
      // Assign new role
      await assignRole.mutateAsync({ userId: user.id, role: selectedRole });
      
      toast.success(`Role updated to ${ROLE_OPTIONS.find(r => r.value === selectedRole)?.label}`);
      onClose();
      setSelectedRole('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedRole('');
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for {user.full_name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Current Role</Label>
            <p className="text-sm text-muted-foreground">
              {currentRole 
                ? ROLE_OPTIONS.find(r => r.value === currentRole)?.label || currentRole
                : 'No role assigned'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">New Role</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((role) => (
                  <SelectItem 
                    key={role.value} 
                    value={role.value}
                    disabled={role.value === currentRole}
                  >
                    <div className="flex flex-col">
                      <span>{role.label}</span>
                      <span className="text-xs text-muted-foreground">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedRole || selectedRole === currentRole || isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
