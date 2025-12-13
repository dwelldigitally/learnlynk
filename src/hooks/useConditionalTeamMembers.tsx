import { useConditionalData } from './useConditionalData';

/**
 * Hook to load team members from database
 */
export function useConditionalTeamMembers() {
  return useConditionalData(
    ['team-members'],
    () => [],
    undefined // Uses profiles table via useTeamMembers hook instead
  );
}
