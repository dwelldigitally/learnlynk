import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserRole, AppRole } from '@/types/team-management';

// Temporarily stubbed until Supabase types regenerate
export const useUserRoles = (userId?: string) => {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => [] as UserRole[],
    enabled: !!userId,
  });
};

export const useAllUserRoles = () => {
  return useQuery({
    queryKey: ['all-user-roles'],
    queryFn: async () => [] as UserRole[],
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      console.log('Waiting for Supabase types to regenerate...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
    },
  });
};

export const useRevokeRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      console.log('Waiting for Supabase types to regenerate...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
    },
  });
};

export const useCheckUserRole = (userId: string | undefined, role: AppRole) => {
  return useQuery({
    queryKey: ['check-role', userId, role],
    queryFn: async () => false,
    enabled: !!userId,
  });
};
