import { useConditionalData } from './useConditionalData';
import { EventService } from '@/services/eventService';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load event demo data or show empty state
 */
export function useConditionalEvents() {
  return useConditionalData(
    ['events'],
    () => DemoDataService.getDemoEvents(),
    () => EventService.getEvents()
  );
}