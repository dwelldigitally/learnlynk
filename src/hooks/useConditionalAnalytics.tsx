import { useConditionalData } from './useConditionalData';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load analytics demo data or show empty state
 */
export function useConditionalAnalytics() {
  return useConditionalData(
    ['analytics'],
    () => DemoDataService.getDemoAnalyticsData(),
    undefined // No real analytics service yet
  );
}