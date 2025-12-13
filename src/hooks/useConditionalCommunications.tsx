import { useConditionalData } from './useConditionalData';
import { CommunicationService } from '@/services/communicationService';

/**
 * Hook to load communications from database
 */
export function useConditionalCommunications() {
  return useConditionalData(
    ['communications'],
    () => [],
    () => CommunicationService.getCommunications()
  );
}
