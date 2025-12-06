import { supabase } from '@/integrations/supabase/client';

export type TriggerType = 
  | 'all_documents_approved'
  | 'specific_document_approved'
  | 'payment_received'
  | 'form_submitted'
  | 'manual_approval'
  | 'time_elapsed'
  | 'all_requirements_completed';

export interface StageTransitionTrigger {
  id: string;
  stage_id: string;
  trigger_type: TriggerType;
  condition_config: {
    document_types?: string[];
    document_ids?: string[];
    payment_amount?: number;
    form_id?: string;
    time_days?: number;
    requirement_ids?: string[];
  };
  target_stage_id: string | null;
  is_active: boolean;
  notify_student: boolean;
  notify_admin: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface StageTransitionLog {
  id: string;
  lead_id: string;
  journey_id: string;
  from_stage_id: string | null;
  to_stage_id: string | null;
  trigger_type: string;
  trigger_id: string | null;
  triggered_by: string;
  transition_data: Record<string, any>;
  created_at: string;
  user_id: string;
}

export interface TransitionCheckResult {
  shouldTransition: boolean;
  nextStageId: string | null;
  triggerId: string | null;
  triggerType: string | null;
  reason: string;
}

class StageTransitionService {
  /**
   * Get all triggers for a specific stage
   */
  async getTriggersForStage(stageId: string): Promise<StageTransitionTrigger[]> {
    const { data, error } = await supabase
      .from('stage_transition_triggers')
      .select('*')
      .eq('stage_id', stageId)
      .eq('is_active', true);

    if (error) throw error;
    return (data || []) as unknown as StageTransitionTrigger[];
  }

  /**
   * Create a new transition trigger
   */
  async createTrigger(trigger: Omit<StageTransitionTrigger, 'id' | 'created_at' | 'updated_at'>): Promise<StageTransitionTrigger> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('stage_transition_triggers')
      .insert({
        ...trigger,
        user_id: user.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data as unknown as StageTransitionTrigger;
  }

  /**
   * Update an existing trigger
   */
  async updateTrigger(triggerId: string, updates: Partial<StageTransitionTrigger>): Promise<void> {
    const { error } = await supabase
      .from('stage_transition_triggers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', triggerId);

    if (error) throw error;
  }

  /**
   * Delete a trigger
   */
  async deleteTrigger(triggerId: string): Promise<void> {
    const { error } = await supabase
      .from('stage_transition_triggers')
      .delete()
      .eq('id', triggerId);

    if (error) throw error;
  }

  /**
   * Evaluate if a lead should transition to the next stage
   */
  async evaluateStageCompletion(leadId: string, currentStageId: string): Promise<TransitionCheckResult> {
    // Get triggers for current stage
    const triggers = await this.getTriggersForStage(currentStageId);
    
    if (triggers.length === 0) {
      return {
        shouldTransition: false,
        nextStageId: null,
        triggerId: null,
        triggerType: null,
        reason: 'No transition triggers configured for this stage'
      };
    }

    // Check each trigger
    for (const trigger of triggers) {
      const isSatisfied = await this.checkTriggerCondition(leadId, trigger);
      
      if (isSatisfied) {
        // Get next stage if not explicitly set
        let nextStageId = trigger.target_stage_id;
        if (!nextStageId) {
          nextStageId = await this.getNextStageId(currentStageId);
        }

        return {
          shouldTransition: true,
          nextStageId,
          triggerId: trigger.id,
          triggerType: trigger.trigger_type,
          reason: `Trigger satisfied: ${trigger.trigger_type}`
        };
      }
    }

    return {
      shouldTransition: false,
      nextStageId: null,
      triggerId: null,
      triggerType: null,
      reason: 'No trigger conditions satisfied'
    };
  }

  /**
   * Check if a specific trigger condition is satisfied
   */
  private async checkTriggerCondition(leadId: string, trigger: StageTransitionTrigger): Promise<boolean> {
    switch (trigger.trigger_type) {
      case 'all_documents_approved':
        return this.checkAllDocumentsApproved(leadId);
      
      case 'specific_document_approved':
        return this.checkSpecificDocumentsApproved(leadId, trigger.condition_config.document_types || []);
      
      case 'payment_received':
        return this.checkPaymentReceived(leadId, trigger.condition_config.payment_amount);
      
      case 'all_requirements_completed':
        return this.checkAllRequirementsCompleted(leadId, trigger.stage_id);
      
      case 'manual_approval':
        // Manual approval triggers don't auto-transition
        return false;
      
      default:
        return false;
    }
  }

  /**
   * Check if all documents for a lead are approved
   */
  private async checkAllDocumentsApproved(leadId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('lead_documents')
      .select('admin_status')
      .eq('lead_id', leadId);

    if (error || !data || data.length === 0) return false;

    // All documents must be approved
    return data.every(doc => doc.admin_status === 'approved');
  }

  /**
   * Check if specific document types are approved
   */
  private async checkSpecificDocumentsApproved(leadId: string, documentTypes: string[]): Promise<boolean> {
    if (documentTypes.length === 0) return true;

    const { data, error } = await supabase
      .from('lead_documents')
      .select('document_type, admin_status')
      .eq('lead_id', leadId)
      .in('document_type', documentTypes);

    if (error) return false;
    if (!data || data.length < documentTypes.length) return false;

    // All specified documents must be approved
    return data.every(doc => doc.admin_status === 'approved');
  }

  /**
   * Check if payment has been received (placeholder - implement based on your payment table)
   */
  private async checkPaymentReceived(_leadId: string, _minAmount?: number): Promise<boolean> {
    // TODO: Implement payment check based on actual payment/invoice table structure
    // For now, return false to require manual progression for payment triggers
    return false;
  }

  /**
   * Check if all requirements for a stage are completed
   */
  private async checkAllRequirementsCompleted(leadId: string, stageId: string): Promise<boolean> {
    // Get stage requirements
    const { data: requirements, error: reqError } = await supabase
      .from('journey_requirements')
      .select('id, requirement_type, is_mandatory')
      .eq('stage_id', stageId)
      .eq('is_mandatory', true);

    if (reqError || !requirements || requirements.length === 0) return true;

    // Check each requirement
    for (const req of requirements) {
      if (req.requirement_type === 'document') {
        const docsApproved = await this.checkAllDocumentsApproved(leadId);
        if (!docsApproved) return false;
      }
      // Add more requirement type checks as needed
    }

    return true;
  }

  /**
   * Get the next stage in the journey
   */
  private async getNextStageId(currentStageId: string): Promise<string | null> {
    // Get current stage's journey and order
    const { data: currentStage, error: currentError } = await supabase
      .from('journey_stages')
      .select('journey_id, order_index')
      .eq('id', currentStageId)
      .single();

    if (currentError || !currentStage) return null;

    // Get next stage
    const { data: nextStage, error: nextError } = await supabase
      .from('journey_stages')
      .select('id')
      .eq('journey_id', currentStage.journey_id)
      .eq('order_index', currentStage.order_index + 1)
      .single();

    if (nextError || !nextStage) return null;
    return nextStage.id;
  }

  /**
   * Execute a stage transition
   */
  async executeTransition(
    leadId: string,
    fromStageId: string,
    toStageId: string,
    triggerId: string | null,
    triggerType: string
  ): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    // Get journey ID from stage
    const { data: stage } = await supabase
      .from('journey_stages')
      .select('journey_id')
      .eq('id', fromStageId)
      .single();

    // Log the transition
    await supabase
      .from('stage_transition_logs')
      .insert({
        lead_id: leadId,
        journey_id: stage?.journey_id,
        from_stage_id: fromStageId,
        to_stage_id: toStageId,
        trigger_id: triggerId,
        trigger_type: triggerType,
        triggered_by: 'system',
        transition_data: {
          timestamp: new Date().toISOString(),
          auto_triggered: true
        },
        user_id: user.user.id
      });

    // Update lead's journey progress
    await supabase
      .from('lead_academic_journeys')
      .update({
        current_stage_id: toStageId,
        updated_at: new Date().toISOString()
      })
      .eq('lead_id', leadId);

    // Get trigger to check notification settings
    if (triggerId) {
      const { data: trigger } = await supabase
        .from('stage_transition_triggers')
        .select('notify_student, notify_admin')
        .eq('id', triggerId)
        .single();

      if (trigger?.notify_admin) {
        await this.sendAdminNotification(leadId, fromStageId, toStageId);
      }
    }
  }

  /**
   * Send notification to admin about transition
   */
  private async sendAdminNotification(leadId: string, fromStageId: string, toStageId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    // Get lead and stage names
    const leadResult = await supabase.from('leads').select('first_name, last_name').eq('id', leadId).single();
    const fromStageResult = await supabase.from('journey_stages').select('name').eq('id', fromStageId).single();
    const toStageResult = await supabase.from('journey_stages').select('name').eq('id', toStageId).single();

    const leadName = `${leadResult.data?.first_name || ''} ${leadResult.data?.last_name || ''}`.trim() || 'Unknown Lead';
    const fromStageName = fromStageResult.data?.name || 'Previous Stage';
    const toStageName = toStageResult.data?.name || 'Next Stage';

    await supabase
      .from('notifications')
      .insert({
        user_id: user.user.id,
        type: 'stage_transition',
        title: 'Stage Transition',
        message: `${leadName} has moved from "${fromStageName}" to "${toStageName}"`,
        data: {
          lead_id: leadId,
          from_stage_id: fromStageId,
          to_stage_id: toStageId
        },
        is_read: false
      });
  }

  /**
   * Get transition logs for a lead
   */
  async getTransitionLogs(leadId: string): Promise<StageTransitionLog[]> {
    const { data, error } = await supabase
      .from('stage_transition_logs')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as StageTransitionLog[];
  }

  /**
   * Check and execute transition after document approval
   */
  async checkTransitionOnDocumentApproval(leadId: string, documentId: string): Promise<boolean> {
    // Get lead's current journey stage
    const { data: journeyProgress } = await supabase
      .from('lead_academic_journeys')
      .select('current_stage_id')
      .eq('lead_id', leadId)
      .single();

    if (!journeyProgress?.current_stage_id) return false;

    // Evaluate if transition should happen
    const result = await this.evaluateStageCompletion(leadId, journeyProgress.current_stage_id);

    if (result.shouldTransition && result.nextStageId) {
      await this.executeTransition(
        leadId,
        journeyProgress.current_stage_id,
        result.nextStageId,
        result.triggerId,
        result.triggerType || 'document_approved'
      );
      return true;
    }

    return false;
  }
}

export const stageTransitionService = new StageTransitionService();
