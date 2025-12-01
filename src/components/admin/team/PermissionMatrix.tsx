import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Shield, Search, AlertTriangle } from 'lucide-react';
import type { AppRole, Permission } from '@/types/team-management';
import { toast } from 'sonner';
import { usePermissions, useUpdateRolePermissions } from '@/hooks/usePermissions';
import { useAllRolePermissions } from '@/hooks/useAllRolePermissions';

const ALL_ROLES: AppRole[] = ['admin', 'team_lead', 'advisor', 'finance_officer', 'registrar', 'viewer'];

const getRiskLevelColor = (riskLevel: string | null) => {
  switch (riskLevel) {
    case 'critical': return 'bg-destructive text-destructive-foreground';
    case 'high': return 'bg-warning text-foreground';
    case 'medium': return 'bg-info text-info-foreground';
    case 'low': return 'bg-success text-success-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function PermissionMatrix() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: permissions = [], isLoading } = usePermissions();
  const { data: rolePermissionsMap } = useAllRolePermissions();
  const updateRolePermissions = useUpdateRolePermissions();

  // Group permissions by category
  const categorizedPermissions = permissions.reduce((acc, permission) => {
    const category = permission.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Filter permissions
  const filteredPermissions = permissions.filter(p => 
    p.permission_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.permission_description?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(p => !selectedCategory || p.category === selectedCategory);

  const togglePermission = async (role: AppRole, permissionId: string, currentState: boolean) => {
    if (!rolePermissionsMap) return;
    
    const rolePerms = rolePermissionsMap.get(role) || new Set<string>();
    const newPermissions = new Set(rolePerms);
    
    if (currentState) {
      newPermissions.delete(permissionId);
    } else {
      newPermissions.add(permissionId);
    }
    
    try {
      await updateRolePermissions.mutateAsync({
        role,
        permissionIds: Array.from(newPermissions)
      });
      toast.success(`Permission ${currentState ? 'revoked from' : 'granted to'} ${role}`);
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-12">Loading permissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 relative min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(categorizedPermissions).map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium min-w-[250px]">Permission</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Risk</th>
                  {ALL_ROLES.map(role => (
                    <th key={role} className="text-center p-3 font-medium capitalize">
                      {role.replace('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPermissions.map(permission => (
                  <tr key={permission.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{permission.permission_name}</div>
                        <div className="text-sm text-muted-foreground">{permission.permission_description}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="capitalize">
                        {permission.category}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getRiskLevelColor(permission.risk_level)}>
                        {permission.risk_level === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {permission.risk_level}
                      </Badge>
                    </td>
                    {ALL_ROLES.map(role => {
                      const rolePerms = rolePermissionsMap?.get(role);
                      const hasPermission = rolePerms?.has(permission.id) || false;
                      
                      return (
                        <td key={role} className="p-3 text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={hasPermission}
                              onCheckedChange={() => togglePermission(role, permission.id, hasPermission)}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
