import { useConditionalData } from './useConditionalData';
import { supabase } from '@/integrations/supabase/client';
import { StudentApplication } from '@/types/application';

/**
 * Hook to load applications from database
 */
export function useConditionalApplications() {
  return useConditionalData(
    ['applications'],
    () => [],
    async (): Promise<StudentApplication[]> => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching applications:', error);
        return [];
      }
      
      return data?.map(app => ({
        id: app.id,
        studentId: app.user_id,
        studentName: app.student_name,
        email: app.email,
        phone: app.phone || '',
        program: app.program,
        applicationDate: new Date(app.application_date),
        status: app.status as StudentApplication['status'],
        stage: 'DOCUMENT_APPROVAL' as const,
        priority: app.priority as StudentApplication['priority'],
        progress: app.progress,
        acceptanceLikelihood: 75,
        advisorAssigned: app.advisor_assigned || 'Unassigned',
        documentsSubmitted: Array.isArray(app.documents_submitted) ? app.documents_submitted.length : 0,
        documentsRequired: 2,
        estimatedDecision: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(app.updated_at),
        city: 'Not specified',
        country: 'Not specified'
      } satisfies StudentApplication)) || [];
    }
  );
}
