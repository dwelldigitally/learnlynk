import { useConditionalData } from './useConditionalData';
import { StudentService } from '@/services/studentService';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load student demo data or show empty state
 */
export function useConditionalStudents() {
  return useConditionalData(
    ['students'],
    () => DemoDataService.getDemoStudents(),
    () => StudentService.getStudents()
  );
}