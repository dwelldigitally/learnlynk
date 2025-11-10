import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Filter, Mail, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import type { AppRole } from '@/types/team-management';

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

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'tash@frasermarketing.ca',
    full_name: 'Tash Fraser',
    avatar_url: null,
    roles: ['admin'],
    team_name: 'Financial Services',
    team_type: 'department',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'tushar@wcc.ca',
    full_name: 'Tushar Malhotra',
    avatar_url: null,
    roles: ['team_lead'],
    team_name: 'Domestic Admissions Team',
    team_type: 'team',
    created_at: '2024-02-20T10:00:00Z'
  },
  {
    id: '3',
    email: 'rockingtushar123@gmail.com',
    full_name: 'Tushar Advisor',
    avatar_url: null,
    roles: ['advisor'],
    team_name: 'Program Advisors',
    team_type: 'team',
    created_at: '2024-03-10T10:00:00Z'
  },
  {
    id: '4',
    email: 'malhotratushar37@gmail.com',
    full_name: 'Tushar Finance',
    avatar_url: null,
    roles: ['finance_officer'],
    team_name: 'Financial Services',
    team_type: 'department',
    created_at: '2024-03-15T10:00:00Z'
  },
  {
    id: '5',
    email: 'sarah.johnson@wcc.ca',
    full_name: 'Sarah Johnson',
    avatar_url: null,
    roles: ['registrar', 'advisor'],
    team_name: 'Registrar Office',
    team_type: 'team',
    created_at: '2024-04-01T10:00:00Z'
  },
  {
    id: '6',
    email: 'mike.chen@wcc.ca',
    full_name: 'Mike Chen',
    avatar_url: null,
    roles: ['team_lead'],
    team_name: 'International Admissions Team',
    team_type: 'team',
    created_at: '2024-04-10T10:00:00Z'
  },
  {
    id: '7',
    email: 'emma.davis@wcc.ca',
    full_name: 'Emma Davis',
    avatar_url: null,
    roles: ['advisor'],
    team_name: 'Program Advisors',
    team_type: 'team',
    created_at: '2024-05-01T10:00:00Z'
  },
  {
    id: '8',
    email: 'james.wilson@wcc.ca',
    full_name: 'James Wilson',
    avatar_url: null,
    roles: ['viewer'],
    team_name: null,
    team_type: null,
    created_at: '2024-05-15T10:00:00Z'
  }
];

export const UserDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const isLoading = false;
  const users = mockUsers;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.team_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter as any);

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      withRoles: users.filter(u => u.roles.length > 0).length,
      withTeams: users.filter(u => u.team_name).length,
    };
  }, []);

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
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
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Directory
          </CardTitle>
          <CardDescription>
            Search and manage all users, their roles, and team assignments
          </CardDescription>
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
            <div className="text-2xl font-bold">{stats.withTeams}</div>
            <p className="text-sm text-muted-foreground">Users in Teams</p>
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
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
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
    </div>
  );
};
