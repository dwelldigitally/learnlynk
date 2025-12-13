import { useConditionalData } from './useConditionalData';
import { EventService } from '@/services/eventService';

/**
 * Hook to load events from database
 */
export function useConditionalEvents() {
  return useConditionalData(
    ['events'],
    () => [],
    () => EventService.getEvents()
  );
}
