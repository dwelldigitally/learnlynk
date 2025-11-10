import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Shield, Search, AlertTriangle } from 'lucide-react';
import type { AppRole, Permission } from '@/types/team-management';
import { toast } from 'sonner';

const ALL_ROLES: AppRole[] = ['admin', 'team_lead', 'advisor', 'finance_officer', 'registrar', 'viewer'];

// Mock permissions data
const mockPermissions: Permission[] = [
  // Leads
  { id: 'p1', permission_name: 'view_leads', permission_description: 'View lead information', category: 'leads', risk_level: 'low', created_at: '', updated_at: '' },
  { id: 'p2', permission_name: 'create_leads', permission_description: 'Create new leads', category: 'leads', risk_level: 'medium', created_at: '', updated_at: '' },
  { id: 'p3', permission_name: 'edit_leads', permission_description: 'Edit lead information', category: 'leads', risk_level: 'medium', created_at: '', updated_at: '' },
  { id: 'p4', permission_name: 'delete_leads', permission_description: 'Delete leads', category: 'leads', risk_level: 'high', created_at: '', updated_at: '' },
  { id: 'p5', permission_name: 'export_leads', permission_description: 'Export lead data', category: 'leads', risk_level: 'high', created_at: '', updated_at: '' },
  // Students
  { id: 'p6', permission_name: 'view_students', permission_description: 'View student information', category: 'students', risk_level: 'medium', created_at: '', updated_at: '' },
  { id: 'p7', permission_name: 'create_students', permission_description: 'Create student records', category: 'students', risk_level: 'high', created_at: '', updated_at: '' },
  { id: 'p8', permission_name: 'edit_students', permission_description: 'Edit student information', category: 'students', risk_level: 'high', created_at: '', updated_at: '' },
  { id: 'p9', permission_name: 'view_academic_records', permission_description: 'View academic records', category: 'students', risk_level: 'high', created_at: '', updated_at: '' },
  { id: 'p10', permission_name: 'export_student_data', permission_description: 'Export student data', category: 'students', risk_level: 'critical', created_at: '', updated_at: '' },
  // Financial
  { id: 'p11', permission_name: 'view_payments', permission_description: 'View payment records', category: 'financial', risk_level: 'high', created_at: '', updated_at: '' },
  { id: 'p12', permission_name: 'process_payments', permission_description: 'Process payments', category: 'financial', risk_level: 'high', created_at: '', updated_at: '' },
  { id: 'p13', permission_name: 'issue_refunds', permission_description: 'Issue refunds', category: 'financial', risk_level: 'critical', created_at: '', updated_at: '' },
  { id: 'p14', permission_name: 'export_financial_data', permission_description: 'Export financial data', category: 'financial', risk_level: 'critical', created_at: '', updated_at: '' },
  // System
  { id: 'p15', permission_name: 'manage_users', permission_description: 'Manage user accounts', category: 'system', risk_level: 'critical', created_at: '', updated_at: '' },
  { id: 'p16', permission_name: 'manage_roles', permission_description: 'Manage user roles', category: 'system', risk_level: 'critical', created_at: '', updated_at: '' },
  { id: 'p17', permission_name: 'system_settings', permission_description: 'Configure system settings', category: 'system', risk_level: 'critical', created_at: '', updated_at: '' },
  { id: 'p18', permission_name: 'view_audit_logs', permission_description: 'View audit logs', category: 'system', risk_level: 'medium', created_at: '', updated_at: '' },
  // Team
  { id: 'p19', permission_name: 'manage_teams', permission_description: 'Manage team structure', category: 'team', risk_level: 'medium', created_at: '', updated_at: '' },
  { id: 'p20', permission_name: 'assign_team_members', permission_description: 'Assign users to teams', category: 'team', risk_level: 'medium', created_at: '', updated_at: '' },
  { id: 'p21', permission_name: 'view_team_reports', permission_description: 'View team reports', category: 'team', risk_level: 'low', created_at: '', updated_at: '' },
];

// Mock role permissions (which roles have which permissions)
const mockRolePermissions = new Map<string, Set<string>>([
  ['admin', new Set(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20', 'p21'])],
  ['team_lead', new Set(['p1', 'p2', 'p3', 'p5', 'p6', 'p11', 'p19', 'p20', 'p21'])],
  ['advisor', new Set(['p1', 'p2', 'p3', 'p6', 'p21'])],
  ['finance_officer', new Set(['p1', 'p6', 'p11', 'p12', 'p13', 'p14'])],
  ['registrar', new Set(['p1', 'p6', 'p7', 'p8', 'p9'])],
  ['viewer', new Set(['p1', 'p6', 'p21'])],
]);

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
  
  const permissions = mockPermissions;
  const isLoading = false;

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

  const togglePermission = (role: AppRole, permissionId: string, currentState: boolean) => {
    const rolePerms = mockRolePermissions.get(role);
    if (rolePerms) {
      if (currentState) {
        rolePerms.delete(permissionId);
      } else {
        rolePerms.add(permissionId);
      }
    }
    toast.success(`Permission ${currentState ? 'revoked from' : 'granted to'} ${role} (demo)`);
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
                      const rolePerms = mockRolePermissions.get(role);
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
