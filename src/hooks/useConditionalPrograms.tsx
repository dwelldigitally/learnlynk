import { useConditionalData } from './useConditionalData';
import { ProgramService } from '@/services/programService';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load program demo data or show empty state
 */
export function useConditionalPrograms() {
  return useConditionalData(
    ['programs'],
    () => DemoDataService.getDemoPrograms(),
    () => ProgramService.getPrograms()
  );
}