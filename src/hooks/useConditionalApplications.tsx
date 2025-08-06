import { useConditionalData } from './useConditionalData';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load application demo data or show empty state
 */
export function useConditionalApplications() {
  return useConditionalData(
    ['applications'],
    () => DemoDataService.getDemoApplications(),
    async () => {
      // TODO: Replace with real application service when available
      return [];
    }
  );
}