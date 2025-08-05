import { useConditionalData } from './useConditionalData';
import { enhancedIntakeService } from '@/services/enhancedIntakeService';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load intake demo data or show empty state
 */
export function useConditionalIntakes() {
  return useConditionalData(
    ['intakes'],
    () => [], // No demo intakes for now
    () => enhancedIntakeService.getIntakesWithProgramData()
  );
}