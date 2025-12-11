import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to check if the current user has a specific permission.
 * Checks both role-based permissions and direct user permissions.
 */
export const useHasPermission = (permissionName: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['has-permission', user?.id, permissionName],
    queryFn: async () => {
      if (!user?.id) return false;

      // First, get the user's roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return false;
      }

      const roles = userRoles?.map(r => r.role) || [];

      // Check if any of the user's roles have this permission
      if (roles.length > 0) {
        const { data: rolePerms, error: rolePermsError } = await supabase
          .from('role_permissions' as any)
          .select('permission_id, permissions!inner(permission_name)')
          .in('role', roles);

        if (!rolePermsError && rolePerms) {
          const hasRolePermission = rolePerms.some(
            (rp: any) => rp.permissions?.permission_name === permissionName
          );
          if (hasRolePermission) return true;
        }
      }

      // Check for direct user permissions
      const { data: userPerms, error: userPermsError } = await supabase
        .from('user_permissions' as any)
        .select('permission_id, permissions!inner(permission_name)')
        .eq('user_id', user.id);

      if (!userPermsError && userPerms) {
        const hasDirectPermission = userPerms.some(
          (up: any) => up.permissions?.permission_name === permissionName
        );
        if (hasDirectPermission) return true;
      }

      return false;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Hook to check multiple permissions at once.
 * Returns an object with permission names as keys and boolean values.
 */
export const useHasPermissions = (permissionNames: string[]) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['has-permissions', user?.id, permissionNames.sort().join(',')],
    queryFn: async () => {
      if (!user?.id) {
        return Object.fromEntries(permissionNames.map(p => [p, false]));
      }

      // Get the user's roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const roles = userRoles?.map(r => r.role) || [];

      // Get all role-based permissions
      let rolePermissionNames: string[] = [];
      if (roles.length > 0) {
        const { data: rolePerms } = await supabase
          .from('role_permissions' as any)
          .select('permissions!inner(permission_name)')
          .in('role', roles);

        rolePermissionNames = (rolePerms || []).map((rp: any) => rp.permissions?.permission_name).filter(Boolean);
      }

      // Get direct user permissions
      const { data: userPerms } = await supabase
        .from('user_permissions' as any)
        .select('permissions!inner(permission_name)')
        .eq('user_id', user.id);

      const directPermissionNames = (userPerms || []).map((up: any) => up.permissions?.permission_name).filter(Boolean);

      // Combine all permissions
      const allPermissions = new Set([...rolePermissionNames, ...directPermissionNames]);

      // Return object with all requested permissions
      return Object.fromEntries(
        permissionNames.map(p => [p, allPermissions.has(p)])
      );
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
};
