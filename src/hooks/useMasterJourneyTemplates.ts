import { useQuery } from '@tanstack/react-query';
import { MasterJourneyService } from '@/services/masterJourneyService';

export function useMasterJourneyTemplates() {
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['master-journey-templates'],
    queryFn: () => MasterJourneyService.getMasterTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const domesticTemplate = templates?.find(t => t.student_type === 'domestic');
  const internationalTemplate = templates?.find(t => t.student_type === 'international');

  return {
    templates,
    domesticTemplate,
    internationalTemplate,
    isLoading,
    error
  };
}
