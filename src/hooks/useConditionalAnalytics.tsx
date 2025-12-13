import { useConditionalData } from './useConditionalData';

/**
 * Hook to conditionally load analytics data
 */
export function useConditionalAnalytics() {
  return useConditionalData(
    ['analytics'],
    () => [],
    undefined // No real analytics service yet
  );
}