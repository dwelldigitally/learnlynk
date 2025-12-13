import { useConditionalData } from './useConditionalData';
import { enhancedIntakeService, EnhancedIntake } from '@/services/enhancedIntakeService';

/**
 * Hook to load intakes from database
 */
export function useConditionalIntakes() {
  return useConditionalData(
    ['intakes'],
    () => [] as EnhancedIntake[],
    () => enhancedIntakeService.getIntakesWithProgramData()
  );
}
