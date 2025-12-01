import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/types/team-management';

export const useAllRolePermissions = () => {
  return useQuery({
    queryKey: ['all-role-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions' as any)
        .select('role, permission_id');
      
      if (error) throw error;
      
      // Convert to Map<role, Set<permission_id>>
      const rolePermMap = new Map<AppRole, Set<string>>();
      
      const typedData = data as unknown as Array<{ role: AppRole; permission_id: string }>;
      
      typedData.forEach((rp) => {
        if (!rolePermMap.has(rp.role)) {
          rolePermMap.set(rp.role, new Set());
        }
        rolePermMap.get(rp.role)!.add(rp.permission_id);
      });
      
      return rolePermMap;
    }
  });
};
