import { useQuery } from '@tanstack/react-query';

/**
 * Hook to load data from database with proper empty state handling
 * Demo data access has been removed - app now relies entirely on real data
 */
export function useConditionalData<T>(
  queryKey: string[],
  _demoDataFn: () => T[], // Kept for API compatibility but not used
  realDataQuery?: () => Promise<T[]>,
  enabled: boolean = true
) {
  const { data: realData, isLoading, refetch, error } = useQuery({
    queryKey: [...queryKey, 'real'],
    queryFn: realDataQuery || (() => Promise.resolve([])),
    enabled: enabled && !!realDataQuery,
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
