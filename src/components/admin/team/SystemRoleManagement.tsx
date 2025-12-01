import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, Shield, X } from 'lucide-react';
import type { AppRole } from '@/types/team-management';
import { toast } from 'sonner';
import { useUsers } from '@/hooks/useUsers';
import { useAssignRole, useRevokeRole } from '@/hooks/useSystemRoles';

const ALL_ROLES: { value: AppRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full system access' },
  { value: 'team_lead', label: 'Team Lead', description: 'Manage teams and view roles' },
  { value: 'advisor', label: 'Advisor', description: 'Advise students and manage leads' },
  { value: 'finance_officer', label: 'Finance Officer', description: 'Manage financial records' },
  { value: 'registrar', label: 'Registrar', description: 'Student registration and records' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
];

export function SystemRoleManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('viewer');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  
  const { data: users = [], isLoading } = useUsers();
  const assignRoleMutation = useAssignRole();
  const revokeRoleMutation = useRevokeRole();

  const handleAssignRole = async () => {
    if (!selectedUserEmail) {
      toast.error('Please enter a user email');
      return;
    }
    
    const user = users.find(u => u.email === selectedUserEmail);
    if (!user) {
      toast.error('User not found');
      return;
    }
    
    try {
      await assignRoleMutation.mutateAsync({ userId: user.id, role: selectedRole });
      toast.success(`Role ${selectedRole} assigned successfully`);
      setShowAssignDialog(false);
      setSelectedUserEmail('');
    } catch (error) {
      toast.error('Failed to assign role');
    }
  };

  const handleRevokeRole = async (userId: string, role: AppRole) => {
    if (!confirm(`Are you sure you want to revoke the ${role} role?`)) return;
    
    try {
      await revokeRoleMutation.mutateAsync({ userId, role });
      toast.success(`Role ${role} revoked successfully`);
    } catch (error) {
      toast.error('Failed to revoke role');
    }
  };

  // Create a user role map from real data
  const userRoleMap = new Map<string, { roles: AppRole[], name: string, userId: string }>(
    users.map(user => [
      user.email,
      {
        roles: user.roles as AppRole[],
        name: user.full_name || user.email,
        userId: user.id
      }
    ])
  );

  const getRoleColor = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'team_lead': return 'bg-primary text-primary-foreground';
      case 'advisor': return 'bg-info text-info-foreground';
      case 'finance_officer': return 'bg-success text-success-foreground';
      case 'registrar': return 'bg-warning text-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Role to User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">User Email</label>
                <Input
                  placeholder="Enter user email"
                  value={selectedUserEmail}
                  onChange={(e) => setSelectedUserEmail(e.target.value)}
                  list="user-emails"
                />
                <datalist id="user-emails">
                  {users.map(user => (
                    <option key={user.id} value={user.email} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-muted-foreground">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAssignRole} className="w-full">
                Assign Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {ALL_ROLES.map(roleInfo => {
          const usersWithRole = Array.from(userRoleMap.entries()).filter(
            ([, data]) => data.roles.includes(roleInfo.value)
          );
          
          return (
            <Card key={roleInfo.value}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span>{roleInfo.label}</span>
                    <Badge variant="outline">{usersWithRole.length} users</Badge>
                  </div>
                  <Badge className={getRoleColor(roleInfo.value)}>
                    {roleInfo.value}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{roleInfo.description}</p>
              </CardHeader>
              <CardContent>
                {usersWithRole.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No users assigned to this role</div>
                ) : (
                  <div className="space-y-2">
                    {usersWithRole.map(([email, data]) => (
                      <div key={email} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="font-medium">{data.name}</div>
                          <div className="text-xs text-muted-foreground">{email}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeRole(data.userId, roleInfo.value)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
