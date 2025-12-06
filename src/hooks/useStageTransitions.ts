import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stageTransitionService, StageTransitionTrigger, TriggerType } from '@/services/stageTransitionService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useStageTransitionTriggers(stageId: string | null) {
  return useQuery({
    queryKey: ['stage-transition-triggers', stageId],
    queryFn: async () => {
      if (!stageId) return [];
      return stageTransitionService.getTriggersForStage(stageId);
    },
    enabled: !!stageId
  });
}

export function useCreateTransitionTrigger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trigger: {
      stage_id: string;
      trigger_type: TriggerType;
      condition_config?: Record<string, any>;
      target_stage_id?: string | null;
      notify_student?: boolean;
      notify_admin?: boolean;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      return stageTransitionService.createTrigger({
        stage_id: trigger.stage_id,
        trigger_type: trigger.trigger_type,
        condition_config: trigger.condition_config || {},
        target_stage_id: trigger.target_stage_id || null,
        is_active: true,
        notify_student: trigger.notify_student ?? true,
        notify_admin: trigger.notify_admin ?? true,
        user_id: user.user.id
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stage-transition-triggers', variables.stage_id] });
      toast.success('Transition trigger created');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create trigger');
    }
  });
}

export function useUpdateTransitionTrigger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ triggerId, updates }: { triggerId: string; updates: Partial<StageTransitionTrigger> }) => {
      return stageTransitionService.updateTrigger(triggerId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stage-transition-triggers'] });
      toast.success('Trigger updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update trigger');
    }
  });
}

export function useDeleteTransitionTrigger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (triggerId: string) => {
      return stageTransitionService.deleteTrigger(triggerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stage-transition-triggers'] });
      toast.success('Trigger deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete trigger');
    }
  });
}

export function useTransitionLogs(leadId: string | null) {
  return useQuery({
    queryKey: ['stage-transition-logs', leadId],
    queryFn: async () => {
      if (!leadId) return [];
      return stageTransitionService.getTransitionLogs(leadId);
    },
    enabled: !!leadId
  });
}

export function useEvaluateStageCompletion() {
  return useMutation({
    mutationFn: async ({ leadId, stageId }: { leadId: string; stageId: string }) => {
      const result = await stageTransitionService.evaluateStageCompletion(leadId, stageId);
      
      if (result.shouldTransition && result.nextStageId) {
        await stageTransitionService.executeTransition(
          leadId,
          stageId,
          result.nextStageId,
          result.triggerId,
          result.triggerType || 'manual'
        );
      }
      
      return result;
    },
    onSuccess: (result) => {
      if (result.shouldTransition) {
        toast.success('Lead advanced to next stage');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to evaluate stage completion');
    }
  });
}

// Trigger type labels for UI
export const TRIGGER_TYPE_OPTIONS: { value: TriggerType; label: string; description: string }[] = [
  {
    value: 'all_documents_approved',
    label: 'All Documents Approved',
    description: 'Advance when all required documents are approved'
  },
  {
    value: 'specific_document_approved',
    label: 'Specific Document Approved',
    description: 'Advance when specific document types are approved'
  },
  {
    value: 'payment_received',
    label: 'Payment Received',
    description: 'Advance when payment is received'
  },
  {
    value: 'form_submitted',
    label: 'Form Submitted',
    description: 'Advance when a specific form is submitted'
  },
  {
    value: 'all_requirements_completed',
    label: 'All Requirements Completed',
    description: 'Advance when all stage requirements are met'
  },
  {
    value: 'manual_approval',
    label: 'Manual Approval Required',
    description: 'Requires manual admin approval to advance'
  }
];
