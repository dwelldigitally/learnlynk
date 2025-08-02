import { useConditionalData } from './useConditionalData';
import { CommunicationService } from '@/services/communicationService';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load communication demo data or show empty state
 */
export function useConditionalCommunications() {
  return useConditionalData(
    ['communications'],
    () => DemoDataService.getDemoCommunications(),
    () => CommunicationService.getCommunications()
  );
}