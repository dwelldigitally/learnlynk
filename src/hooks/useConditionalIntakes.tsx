import { useConditionalData } from './useConditionalData';
import { enhancedIntakeService, EnhancedIntake } from '@/services/enhancedIntakeService';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load intake demo data or show empty state
 */
export function useConditionalIntakes() {
  return useConditionalData(
    ['intakes'],
    () => DemoDataService.getDemoIntakes() as EnhancedIntake[],
    () => enhancedIntakeService.getIntakesWithProgramData()
  );
}