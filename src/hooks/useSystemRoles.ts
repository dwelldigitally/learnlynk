import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UserRole, AppRole } from '@/types/team-management';

export const useUserRoles = (userId?: string) => {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_roles' as any)
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return (data || []) as unknown as UserRole[];
    },
    enabled: !!userId,
  });
};

export const useAllUserRoles = () => {
  return useQuery({
    queryKey: ['all-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles' as any)
        .select('*');
      
      if (error) throw error;
      return (data || []) as unknown as UserRole[];
    },
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_roles' as any)
        .insert({
          user_id: userId,
          role,
          assigned_by: user?.id,
        });
      
      if (error) throw error;
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
      const { error } = await supabase
        .from('user_roles' as any)
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
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
    queryFn: async () => {
      if (!userId) return false;
      
      const { data, error } = await supabase
        .from('user_roles' as any)
        .select('id')
        .eq('user_id', userId)
        .eq('role', role)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!userId,
  });
};
