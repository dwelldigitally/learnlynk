import { useConditionalData } from './useConditionalData';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load team member demo data or show empty state
 */
export function useConditionalTeamMembers() {
  return useConditionalData(
    ['team-members'],
    () => [], // No demo team members yet
    undefined // No real team service yet
  );
}