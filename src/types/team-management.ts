export type AppRole = 'admin' | 'team_lead' | 'advisor' | 'finance_officer' | 'registrar' | 'viewer';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type PermissionCategory = 'leads' | 'students' | 'financial' | 'system' | 'team';

export interface Permission {
  id: string;
  permission_name: string;
  permission_description: string | null;
  category: PermissionCategory | null;
  risk_level: RiskLevel | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_by: string | null;
  assigned_at: string;
}

export interface RolePermission {
  role: AppRole;
  permission_id: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  granted_by: string | null;
  granted_at: string;
}

export interface TeamHierarchyNode {
  id: string;
  name: string;
  type: 'team' | 'department' | 'individual';
  parent_id: string | null;
  manager_id: string | null;
  description: string | null;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  children?: TeamHierarchyNode[];
  memberCount?: number;
}

export interface UserWithRoles {
  id: string;
  email: string;
  roles: AppRole[];
  permissions: Permission[];
}

export interface RoleWithPermissions {
  role: AppRole;
  permissions: Permission[];
  userCount: number;
}
