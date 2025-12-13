import { useConditionalData } from './useConditionalData';
import { ScholarshipService } from '@/services/scholarshipService';

/**
 * Hook to load scholarship applications from database
 */
export function useConditionalScholarships() {
  return useConditionalData(
    ['scholarships'],
    () => [],
    () => ScholarshipService.getScholarshipApplications()
  );
}
