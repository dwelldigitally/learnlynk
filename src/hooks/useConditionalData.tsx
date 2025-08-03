import { useQuery } from '@tanstack/react-query';
import { useDemoDataAccess } from '@/services/demoDataService';

/**
 * Hook to conditionally load demo data or show empty state
 * Only shows demo data if user has access AND no real data exists
 */
export function useConditionalData<T>(
  queryKey: string[],
  demoDataFn: () => T[],
  realDataQuery?: () => Promise<T[]>,
  enabled: boolean = true
) {
  const { data: hasDemoAccess, isLoading: isCheckingAccess } = useDemoDataAccess();

  // Query real data if available
  const { data: realData, isLoading: isLoadingReal, refetch } = useQuery({
    queryKey: [...queryKey, 'real'],
    queryFn: realDataQuery || (() => Promise.resolve([])),
    enabled: enabled && !!realDataQuery,
    staleTime: 5 * 60 * 1000,
  });

  // Query demo data conditionally
  const { data: demoData, isLoading: isLoadingDemo } = useQuery({
    queryKey: [...queryKey, 'demo'],
    queryFn: demoDataFn,
    enabled: hasDemoAccess === true && (!realData || realData.length === 0),
    staleTime: 10 * 60 * 1000,
  });

  const isLoading = isCheckingAccess || isLoadingReal || isLoadingDemo;
  
  // Determine what data to return
  let data: T[] = [];
  let showEmptyState = false;

  if (realData && realData.length > 0) {
    // User has real data - show it
    data = realData;
  } else if (hasDemoAccess && demoData && demoData.length > 0) {
    // User has demo access and no real data - show demo data
    data = demoData;
  } else if (!isLoading && !hasDemoAccess) {
    // User has no demo access and no real data - show empty state
    showEmptyState = true;
  }

  return {
    data,
    isLoading,
    showEmptyState,
    hasDemoAccess: hasDemoAccess || false,
    hasRealData: (realData && realData.length > 0) || false,
    refetch
  };
}