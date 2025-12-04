import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Users, Filter, Mail, Calendar, UserPlus, X, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import type { AppRole } from '@/types/team-management';
import { useUsers } from '@/hooks/useUsers';
import { InviteUserDialog } from './InviteUserDialog';
import { ChangeRoleDialog } from './ChangeRoleDialog';
import { useTeamInvitations, useCancelInvitation } from '@/hooks/useTeamInvitations';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-500 border-red-500/20',
  team_lead: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  advisor: 'bg-green-500/10 text-green-500 border-green-500/20',
  finance_officer: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  registrar: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  viewer: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  team_lead: 'Team Lead',
  advisor: 'Advisor',
  finance_officer: 'Finance Officer',
  registrar: 'Registrar',
  viewer: 'Viewer',
};

export const UserDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [cancelInviteId, setCancelInviteId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null);
  
  const { data: users = [], isLoading } = useUsers();
  const { data: invitations = [], isLoading: invitationsLoading } = useTeamInvitations();
  const cancelInvitation = useCancelInvitation();

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.team_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter as any);

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const filteredInvitations = useMemo(() => {
    return pendingInvitations.filter(inv => {
      const fullName = `${inv.first_name} ${inv.last_name || ''}`.toLowerCase();
      const matchesSearch = 
        fullName.includes(searchTerm.toLowerCase()) ||
        inv.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || inv.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [pendingInvitations, searchTerm, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      withRoles: users.filter(u => u.roles.length > 0).length,
      pendingInvites: pendingInvitations.length,
    };
  }, [users, pendingInvitations]);

  const handleCancelInvite = async () => {
    if (!cancelInviteId) return;

    try {
      await cancelInvitation.mutateAsync(cancelInviteId);
      toast.success('Invitation cancelled');
      setCancelInviteId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel invitation');
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  if (isLoading || invitationsLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Directory
              </CardTitle>
              <CardDescription>
                Search and manage all users, their roles, and team assignments
              </CardDescription>
            </div>
            <Button onClick={() => setShowInviteDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.withRoles}</div>
            <p className="text-sm text-muted-foreground">Users with Roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.pendingInvites}</div>
            <p className="text-sm text-muted-foreground">Pending Invitations</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="team_lead">Team Lead</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                  <SelectItem value="finance_officer">Finance Officer</SelectItem>
                  <SelectItem value="registrar">Registrar</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardContent className="pt-6">
          {users.length === 0 && pendingInvitations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">No users yet</p>
              <p className="text-sm">Users and invitations will appear here</p>
            </div>
          ) : filteredUsers.length === 0 && filteredInvitations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pending Invitations */}
              {filteredInvitations.map(invitation => (
                <div
                  key={`invite-${invitation.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* Avatar */}
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {getInitials(`${invitation.first_name} ${invitation.last_name || ''}`, invitation.email)}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {invitation.first_name} {invitation.last_name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{invitation.email}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Invited {format(new Date(invitation.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>

                  {/* Status & Role */}
                  <div className="flex flex-wrap gap-2 max-w-xs">
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                      Pending Invite
                    </Badge>
                    <Badge
                      variant="outline"
                      className={ROLE_COLORS[invitation.role] || 'bg-gray-500/10 text-gray-500'}
                    >
                      {ROLE_LABELS[invitation.role] || invitation.role}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCancelInviteId(invitation.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Active Users */}
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* Avatar */}
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar_url || ''} alt={user.full_name || user.email} />
                    <AvatarFallback>{getInitials(user.full_name, user.email)}</AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {user.full_name || 'No name set'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.team_name && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Team: {user.team_name}
                      </div>
                    )}
                  </div>

                  {/* Roles */}
                  <div className="flex flex-wrap gap-2 max-w-xs">
                    {user.roles.length > 0 ? (
                      user.roles.map(role => (
                        <Badge
                          key={role}
                          variant="outline"
                          className={ROLE_COLORS[role] || 'bg-gray-500/10 text-gray-500'}
                        >
                          {ROLE_LABELS[role] || role}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                        No Role
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Joined Date */}
                  <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground min-w-[140px]">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(user.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <InviteUserDialog 
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
      />

      <ChangeRoleDialog
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />

      <AlertDialog open={!!cancelInviteId} onOpenChange={(open) => !open && setCancelInviteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this invitation? The invited user will not be able to accept it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelInvite} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
