import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

/**
 * Hook to load programs from database (tenant-scoped)
 */
export function useConditionalPrograms() {
  const { tenantId } = useTenant();

  const { data: realData, isLoading, refetch, error } = useQuery({
    queryKey: ['programs', tenantId],
    queryFn: async () => {
      if (!tenantId) return [];

      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching programs:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  });

  const data = realData || [];
  const showEmptyState = !isLoading && data.length === 0;

  return {
    data,
    isLoading,
    error,
    showEmptyState,
    hasDemoAccess: false,
    hasRealData: data.length > 0,
    refetch
  };
}
