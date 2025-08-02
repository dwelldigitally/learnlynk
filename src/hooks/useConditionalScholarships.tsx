import { useConditionalData } from './useConditionalData';
import { ScholarshipService } from '@/services/scholarshipService';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load scholarship demo data or show empty state
 */
export function useConditionalScholarships() {
  return useConditionalData(
    ['scholarships'],
    () => DemoDataService.getDemoScholarshipApplications(),
    () => ScholarshipService.getScholarshipApplications()
  );
}