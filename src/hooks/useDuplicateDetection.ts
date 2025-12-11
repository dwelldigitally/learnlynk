import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DuplicateLeadService, DuplicateGroup, DuplicatePreventionField, DuplicateCheckResult } from '@/services/duplicateLeadService';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';

export function useDuplicatePreventionSetting() {
  const { tenantId, loading } = useTenant();

  return useQuery({
    queryKey: ['duplicate-prevention-setting', tenantId],
    queryFn: async () => {
      if (!tenantId) throw new Error('No tenant ID');
      return DuplicateLeadService.getDuplicatePreventionSetting(tenantId);
    },
    enabled: !!tenantId && !loading,
    retry: false
  });
}

export function useCheckDuplicate() {
  const { tenantId } = useTenant();

  return async (email: string, phone?: string): Promise<DuplicateCheckResult> => {
    if (!tenantId) return { isDuplicate: false };
    return DuplicateLeadService.checkForDuplicate(email, phone, tenantId);
  };
}

export function useSetDuplicatePreventionSetting() {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (field: DuplicatePreventionField) => {
      if (!tenantId) throw new Error('No tenant');
      return DuplicateLeadService.setDuplicatePreventionSetting(tenantId, field);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['duplicate-prevention-setting'] });
        toast({
          title: 'Success',
          description: 'Duplicate prevention configured successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to configure duplicate prevention',
          variant: 'destructive'
        });
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to configure duplicate prevention',
        variant: 'destructive'
      });
    }
  });
}

export function usePotentialDuplicates() {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ['potential-duplicates', tenantId],
    queryFn: async () => {
      if (!tenantId) return [];
      return DuplicateLeadService.findPotentialDuplicates(tenantId);
    },
    enabled: !!tenantId
  });
}

export function useExactDuplicates() {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: ['exact-duplicates', tenantId],
    queryFn: async () => {
      if (!tenantId) return [];
      return DuplicateLeadService.findExactDuplicates(tenantId);
    },
    enabled: !!tenantId
  });
}

export function useMergeLeads() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ primaryLeadId, secondaryLeadId }: { primaryLeadId: string; secondaryLeadId: string }) => {
      return DuplicateLeadService.mergeLeads(primaryLeadId, secondaryLeadId);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['potential-duplicates'] });
        queryClient.invalidateQueries({ queryKey: ['exact-duplicates'] });
        queryClient.invalidateQueries({ queryKey: ['leads'] });
        toast({
          title: 'Success',
          description: 'Leads merged successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to merge leads',
          variant: 'destructive'
        });
      }
    }
  });
}

export function useDeleteDuplicates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (leadIds: string[]) => {
      return DuplicateLeadService.deleteDuplicates(leadIds);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['potential-duplicates'] });
      queryClient.invalidateQueries({ queryKey: ['exact-duplicates'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: 'Duplicates Deleted',
        description: `Successfully deleted ${result.success} duplicate${result.success !== 1 ? 's' : ''}${result.failed > 0 ? `, ${result.failed} failed` : ''}`
      });
    }
  });
}

export function useDuplicateStats() {
  const { data: potentialDuplicates = [], isLoading: loadingPotential } = usePotentialDuplicates();
  const { data: exactDuplicates = [], isLoading: loadingExact } = useExactDuplicates();

  const totalDuplicateLeads = potentialDuplicates.reduce((sum, group) => sum + group.leads.length - 1, 0);
  const exactMatchCount = exactDuplicates.reduce((sum, group) => sum + group.leads.length - 1, 0);
  const nearMatchCount = potentialDuplicates
    .filter(g => g.matchType === 'similar_name' || g.matchType === 'name_program')
    .reduce((sum, group) => sum + group.leads.length - 1, 0);

  return {
    totalDuplicates: totalDuplicateLeads,
    exactMatches: exactMatchCount,
    nearMatches: nearMatchCount,
    totalGroups: potentialDuplicates.length,
    isLoading: loadingPotential || loadingExact
  };
}
