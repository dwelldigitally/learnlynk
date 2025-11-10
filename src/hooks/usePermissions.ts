import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Permission } from '@/types/team-management';

// Temporarily stubbed until Supabase types regenerate
export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => [] as Permission[],
  });
};

export const useRolePermissions = (role?: string) => {
  return useQuery({
    queryKey: ['role-permissions', role],
    queryFn: async () => [],
    enabled: !!role,
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ role, permissionIds }: { role: string; permissionIds: string[] }) => {
      console.log('Waiting for Supabase types to regenerate...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
    },
  });
};

export const useUserPermissions = (userId?: string) => {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: async () => [],
    enabled: !!userId,
  });
};

export const useGrantUserPermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, permissionId }: { userId: string; permissionId: string }) => {
      console.log('Waiting for Supabase types to regenerate...');
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
      console.log('Waiting for Supabase types to regenerate...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    },
  });
};
