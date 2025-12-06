import { supabase } from '@/integrations/supabase/client';

export type ActionCategory = 'lead' | 'document' | 'communication' | 'stage' | 'task' | 'note' | 'system';

export type ActionType = 
  | 'lead_created' | 'lead_updated' | 'lead_deleted'
  | 'document_uploaded' | 'document_approved' | 'document_rejected' | 'document_deleted'
  | 'stage_advanced' | 'stage_regressed'
  | 'intake_assigned' | 'intake_changed'
  | 'advisor_assigned' | 'advisor_changed'
  | 'status_changed' | 'priority_changed'
  | 'note_added' | 'task_created' | 'task_completed'
  | 'communication_logged';

export interface ActivityLogEntry {
  id: string;
  lead_id: string;
  user_id: string | null;
  action_type: string;
  action_category: string;
  title: string;
  description: string | null;
  old_value: any;
  new_value: any;
  metadata: any;
  created_at: string;
  // Joined from profiles
  user_name?: string;
}

class LeadActivityService {
  /**
   * Core logging function - logs an activity to the lead_activity_logs table
   */
  async logActivity(
    leadId: string,
    actionType: ActionType,
    actionCategory: ActionCategory,
    title: string,
    description?: string,
    oldValue?: any,
    newValue?: any,
    metadata?: any
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('lead_activity_logs')
        .insert({
          lead_id: leadId,
          user_id: user?.id || null,
          action_type: actionType,
          action_category: actionCategory,
          title,
          description,
          old_value: oldValue || null,
          new_value: newValue || null,
          metadata: metadata || {}
        });

      if (error) {
        console.error('[LeadActivityService] Error logging activity:', error);
      }
    } catch (error) {
      console.error('[LeadActivityService] Failed to log activity:', error);
    }
  }

  /**
   * Log lead field updates with change tracking
   */
  async logLeadUpdate(
    leadId: string,
    changedFields: string[],
    oldValues: Record<string, any>,
    newValues: Record<string, any>
  ): Promise<void> {
    if (changedFields.length === 0) return;

    const fieldLabels: Record<string, string> = {
      first_name: 'First Name',
      last_name: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      status: 'Status',
      priority: 'Priority',
      source: 'Source',
      country: 'Country',
      state: 'State',
      city: 'City',
      program_interest: 'Program Interest',
      tags: 'Tags',
      notes: 'Notes'
    };

    const changes = changedFields.map(field => {
      const label = fieldLabels[field] || field;
      return `${label}: "${oldValues[field] || 'empty'}" → "${newValues[field] || 'empty'}"`;
    });

    await this.logActivity(
      leadId,
      'lead_updated',
      'lead',
      'Lead Details Updated',
      changes.join(', '),
      oldValues,
      newValues,
      { changedFields }
    );
  }

  /**
   * Log document upload
   */
  async logDocumentUpload(
    leadId: string,
    documentName: string,
    requirementName?: string
  ): Promise<void> {
    const description = requirementName 
      ? `Uploaded "${documentName}" for ${requirementName}`
      : `Uploaded "${documentName}"`;

    await this.logActivity(
      leadId,
      'document_uploaded',
      'document',
      'Document Uploaded',
      description,
      null,
      { documentName, requirementName },
      { documentName, requirementName }
    );
  }

  /**
   * Log document status change (approve/reject)
   */
  async logDocumentStatusChange(
    leadId: string,
    documentName: string,
    oldStatus: string,
    newStatus: string,
    comments?: string
  ): Promise<void> {
    const actionType = newStatus === 'approved' ? 'document_approved' : 'document_rejected';
    const title = newStatus === 'approved' ? 'Document Approved' : 'Document Rejected';
    
    let description = `"${documentName}" ${newStatus}`;
    if (comments) {
      description += ` with comment: "${comments}"`;
    }

    await this.logActivity(
      leadId,
      actionType,
      'document',
      title,
      description,
      { status: oldStatus },
      { status: newStatus, comments },
      { documentName, comments }
    );
  }

  /**
   * Log document deletion
   */
  async logDocumentDeleted(
    leadId: string,
    documentName: string
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'document_deleted',
      'document',
      'Document Deleted',
      `Deleted "${documentName}"`,
      { documentName },
      null,
      { documentName }
    );
  }

  /**
   * Log stage transition
   */
  async logStageChange(
    leadId: string,
    fromStageName: string,
    toStageName: string,
    triggerType: string = 'manual'
  ): Promise<void> {
    const isAdvance = triggerType !== 'regress';
    const actionType = isAdvance ? 'stage_advanced' : 'stage_regressed';
    const title = isAdvance ? 'Stage Advanced' : 'Stage Regressed';

    await this.logActivity(
      leadId,
      actionType,
      'stage',
      title,
      `Moved from "${fromStageName}" → "${toStageName}" stage`,
      { stage: fromStageName },
      { stage: toStageName },
      { triggerType }
    );
  }

  /**
   * Log intake assignment or change
   */
  async logIntakeChange(
    leadId: string,
    oldIntakeName: string | null,
    newIntakeName: string
  ): Promise<void> {
    const actionType = oldIntakeName ? 'intake_changed' : 'intake_assigned';
    const title = oldIntakeName ? 'Intake Changed' : 'Intake Assigned';
    
    const description = oldIntakeName 
      ? `Changed intake from "${oldIntakeName}" to "${newIntakeName}"`
      : `Set preferred intake to "${newIntakeName}"`;

    await this.logActivity(
      leadId,
      actionType,
      'lead',
      title,
      description,
      { intake: oldIntakeName },
      { intake: newIntakeName }
    );
  }

  /**
   * Log advisor assignment or change
   */
  async logAdvisorChange(
    leadId: string,
    oldAdvisorName: string | null,
    newAdvisorName: string,
    assignmentMethod?: string
  ): Promise<void> {
    const actionType = oldAdvisorName ? 'advisor_changed' : 'advisor_assigned';
    const title = oldAdvisorName ? 'Advisor Changed' : 'Advisor Assigned';
    
    let description = oldAdvisorName
      ? `Changed advisor from "${oldAdvisorName}" to "${newAdvisorName}"`
      : `Assigned to ${newAdvisorName}`;
    
    if (assignmentMethod) {
      description += ` via ${assignmentMethod.replace('_', ' ')} routing rule`;
    }

    await this.logActivity(
      leadId,
      actionType,
      'lead',
      title,
      description,
      { advisor: oldAdvisorName },
      { advisor: newAdvisorName },
      { assignmentMethod }
    );
  }

  /**
   * Log status change
   */
  async logStatusChange(
    leadId: string,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'status_changed',
      'lead',
      'Status Changed',
      `Status changed from "${oldStatus}" to "${newStatus}"`,
      { status: oldStatus },
      { status: newStatus }
    );
  }

  /**
   * Log priority change
   */
  async logPriorityChange(
    leadId: string,
    oldPriority: string,
    newPriority: string
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'priority_changed',
      'lead',
      'Priority Changed',
      `Priority changed from "${oldPriority}" to "${newPriority}"`,
      { priority: oldPriority },
      { priority: newPriority }
    );
  }

  /**
   * Log lead creation
   */
  async logLeadCreated(
    leadId: string,
    source: string,
    programInterest?: string[]
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'lead_created',
      'lead',
      'Lead Created',
      `New lead registered via ${source}`,
      null,
      { source, programInterest },
      { source, programInterest }
    );
  }

  /**
   * Get all activity logs for a lead with user names
   */
  async getActivityLogs(leadId: string): Promise<ActivityLogEntry[]> {
    const { data, error } = await supabase
      .from('lead_activity_logs')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[LeadActivityService] Error fetching activity logs:', error);
      return [];
    }

    // Fetch user names for all unique user_ids
    const userIds = [...new Set((data || []).map(log => log.user_id).filter(Boolean))];
    
    let userNames: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds);
      
      if (profiles) {
        userNames = profiles.reduce((acc, profile) => {
          const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Unknown User';
          acc[profile.user_id] = name;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    // Attach user names to logs
    return (data || []).map(log => ({
      ...log,
      user_name: log.user_id ? (userNames[log.user_id] || 'Unknown User') : 'System'
    }));
  }
}

export const leadActivityService = new LeadActivityService();
