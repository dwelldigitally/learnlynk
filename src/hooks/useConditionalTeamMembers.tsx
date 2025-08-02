import { useConditionalData } from './useConditionalData';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load team member demo data or show empty state
 */
export function useConditionalTeamMembers() {
  return useConditionalData(
    ['team-members'],
    () => DemoDataService.getDemoTeamMembers(),
    undefined // No real team service yet
  );
}