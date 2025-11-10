import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Permission } from '@/types/team-management';

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions' as any)
        .select('*')
        .order('category', { ascending: true })
        .order('permission_name', { ascending: true });
      
      if (error) throw error;
      return (data || []) as unknown as Permission[];
    },
  });
};

export const useRolePermissions = (role?: string) => {
  return useQuery({
    queryKey: ['role-permissions', role],
    queryFn: async () => {
      if (!role) return [];
      
      const { data, error } = await supabase
        .from('role_permissions' as any)
        .select('*, permissions(*)')
        .eq('role', role);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!role,
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ role, permissionIds }: { role: string; permissionIds: string[] }) => {
      // Delete existing permissions for role
      await supabase
        .from('role_permissions' as any)
        .delete()
        .eq('role', role);

      // Insert new permissions
      if (permissionIds.length > 0) {
        const { error } = await supabase
          .from('role_permissions' as any)
          .insert(permissionIds.map(permission_id => ({ role, permission_id })));
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
    },
  });
};

export const useUserPermissions = (userId?: string) => {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_permissions' as any)
        .select('*, permissions(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useGrantUserPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, permissionId }: { userId: string; permissionId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_permissions' as any)
        .insert({
          user_id: userId,
          permission_id: permissionId,
          granted_by: user?.id,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    },
  });
};

export const useRevokeUserPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, permissionId }: { userId: string; permissionId: string }) => {
      const { error } = await supabase
        .from('user_permissions' as any)
        .delete()
        .eq('user_id', userId)
        .eq('permission_id', permissionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    },
  });
};
