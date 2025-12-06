import { useState, useEffect, useCallback } from 'react';
import { entryRequirementService, LeadEntryRequirement } from '@/services/entryRequirementService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseLeadEntryRequirementsResult {
  requirements: LeadEntryRequirement[];
  isLoading: boolean;
  error: Error | null;
  progress: { approved: number; total: number; percentage: number };
  refetch: () => Promise<void>;
  approveRequirement: (requirementId: string, notes?: string) => Promise<void>;
  rejectRequirement: (requirementId: string, reason: string) => Promise<void>;
  linkDocument: (requirementId: string, documentId: string) => Promise<void>;
  unlinkDocument: (requirementId: string) => Promise<void>;
}

export function useLeadEntryRequirements(
  leadId: string | undefined,
  programName: string | undefined
): UseLeadEntryRequirementsResult {
  const [requirements, setRequirements] = useState<LeadEntryRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState({ approved: 0, total: 0, percentage: 0 });
  const { toast } = useToast();

  const fetchRequirements = useCallback(async () => {
    if (!leadId) {
      setRequirements([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Initialize requirements if needed (for this lead's program)
      if (programName) {
        await entryRequirementService.initializeRequirements(leadId, programName, user.id);
      }

      // Fetch requirements
      const data = await entryRequirementService.getLeadRequirements(leadId);
      setRequirements(data);

      // Fetch progress
      const progressData = await entryRequirementService.getRequirementProgress(leadId);
      setProgress(progressData);
    } catch (err) {
      console.error('Error fetching entry requirements:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch requirements'));
    } finally {
      setIsLoading(false);
    }
  }, [leadId, programName]);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  const approveRequirement = async (requirementId: string, notes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      await entryRequirementService.approveRequirement(requirementId, user.id, notes);
      toast({
        title: 'Requirement Approved',
        description: 'The entry requirement has been approved.',
      });
      await fetchRequirements();
    } catch (err) {
      console.error('Error approving requirement:', err);
      toast({
        title: 'Error',
        description: 'Failed to approve requirement.',
        variant: 'destructive',
      });
    }
  };

  const rejectRequirement = async (requirementId: string, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      await entryRequirementService.rejectRequirement(requirementId, user.id, reason);
      toast({
        title: 'Requirement Rejected',
        description: 'The entry requirement has been rejected.',
      });
      await fetchRequirements();
    } catch (err) {
      console.error('Error rejecting requirement:', err);
      toast({
        title: 'Error',
        description: 'Failed to reject requirement.',
        variant: 'destructive',
      });
    }
  };

  const linkDocument = async (requirementId: string, documentId: string) => {
    try {
      await entryRequirementService.linkDocumentToRequirement(requirementId, documentId);
      toast({
        title: 'Document Linked',
        description: 'The document has been linked to this requirement.',
      });
      await fetchRequirements();
    } catch (err) {
      console.error('Error linking document:', err);
      toast({
        title: 'Error',
        description: 'Failed to link document.',
        variant: 'destructive',
      });
    }
  };

  const unlinkDocument = async (requirementId: string) => {
    try {
      await entryRequirementService.unlinkDocument(requirementId);
      toast({
        title: 'Document Unlinked',
        description: 'The document has been unlinked from this requirement.',
      });
      await fetchRequirements();
    } catch (err) {
      console.error('Error unlinking document:', err);
      toast({
        title: 'Error',
        description: 'Failed to unlink document.',
        variant: 'destructive',
      });
    }
  };

  return {
    requirements,
    isLoading,
    error,
    progress,
    refetch: fetchRequirements,
    approveRequirement,
    rejectRequirement,
    linkDocument,
    unlinkDocument,
  };
}
