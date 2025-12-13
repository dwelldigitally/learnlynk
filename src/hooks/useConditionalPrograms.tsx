import { useConditionalData } from './useConditionalData';
import { ProgramService } from '@/services/programService';

/**
 * Hook to load programs from database
 */
export function useConditionalPrograms() {
  return useConditionalData(
    ['programs'],
    () => [],
    () => ProgramService.getPrograms()
  );
}
