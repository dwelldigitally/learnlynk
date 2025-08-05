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
    async () => {
      // Get students with snake_case format to match demo data
      const paginatedResponse = await StudentService.getStudentsPaginated(
        { page: 1, pageSize: 1000 },
        {}
      );
      return paginatedResponse.data.map(student => ({
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        phone: student.phone,
        program: student.program,
        stage: student.stage,
        acceptance_likelihood: student.acceptance_likelihood,
        risk_level: student.risk_level,
        progress: student.progress,
        lead_score: student.lead_score,
        country: student.country,
        city: student.city,
        state: student.state
      }));
    }
  );
}