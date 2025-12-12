import { supabase } from '@/integrations/supabase/client';
import { LEAD_PROPERTIES } from '@/config/leadProperties';

export type ActionCategory = 'lead' | 'document' | 'communication' | 'stage' | 'task' | 'note' | 'system' | 'payment';

export type ActionType = 
  // Lead actions
  | 'lead_created' | 'lead_updated' | 'lead_deleted'
  // Document actions
  | 'document_uploaded' | 'document_approved' | 'document_rejected' | 'document_deleted'
  // Stage actions
  | 'stage_advanced' | 'stage_regressed'
  // Assignment actions
  | 'intake_assigned' | 'intake_changed'
  | 'advisor_assigned' | 'advisor_changed'
  | 'status_changed' | 'priority_changed'
  // Task actions
  | 'task_created' | 'task_completed' | 'task_updated' | 'task_deleted'
  // Note actions
  | 'note_added' | 'note_updated' | 'note_deleted'
  // Communication actions
  | 'communication_logged'
  // Entry requirement actions
  | 'entry_requirement_met' | 'entry_requirement_updated'
  // Payment actions
  | 'payment_created' | 'payment_status_changed' | 'invoice_sent' | 'receipt_sent' | 'payment_received';

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
   * Build field labels from centralized lead properties config
   */
  private getFieldLabels(): Record<string, string> {
    return LEAD_PROPERTIES.reduce((acc, prop) => {
      acc[prop.key] = prop.label;
      return acc;
    }, {} as Record<string, string>);
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

    const fieldLabels = this.getFieldLabels();

    const changes = changedFields.map(field => {
      const label = fieldLabels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const oldVal = oldValues[field];
      const newVal = newValues[field];
      
      // Format array values
      const formatValue = (val: any) => {
        if (val === null || val === undefined) return 'empty';
        if (Array.isArray(val)) return val.join(', ') || 'empty';
        return String(val);
      };
      
      return `${label}: "${formatValue(oldVal)}" → "${formatValue(newVal)}"`;
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
   * Log entry requirement status change
   */
  async logEntryRequirementChange(
    leadId: string,
    requirementName: string,
    oldStatus: string | null,
    newStatus: string,
    threshold?: string,
    comments?: string
  ): Promise<void> {
    const actionType = newStatus === 'met' ? 'entry_requirement_met' : 'entry_requirement_updated';
    const title = newStatus === 'met' ? 'Entry Requirement Met' : 'Entry Requirement Updated';
    
    let description = `"${requirementName}" marked as ${newStatus}`;
    if (threshold) {
      description += ` (Threshold: ${threshold})`;
    }
    if (comments) {
      description += ` - ${comments}`;
    }

    await this.logActivity(
      leadId,
      actionType,
      'document',
      title,
      description,
      { status: oldStatus, requirement: requirementName },
      { status: newStatus, requirement: requirementName, threshold },
      { requirementName, threshold, comments }
    );
  }

  // =====================================
  // PAYMENT LOGGING METHODS
  // =====================================

  /**
   * Log payment creation
   */
  async logPaymentCreated(
    leadId: string,
    paymentType: string,
    amount: number,
    currency: string = 'USD'
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'payment_created',
      'payment',
      'Payment Created',
      `${paymentType} payment of ${currency} ${amount.toFixed(2)} created`,
      null,
      { type: paymentType, amount, currency },
      { paymentType, amount, currency }
    );
  }

  /**
   * Log payment status change
   */
  async logPaymentStatusChange(
    leadId: string,
    paymentType: string,
    oldStatus: string,
    newStatus: string,
    amount: number
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'payment_status_changed',
      'payment',
      'Payment Status Changed',
      `${paymentType} payment status changed from "${oldStatus}" to "${newStatus}" ($${amount.toFixed(2)})`,
      { status: oldStatus },
      { status: newStatus, amount },
      { paymentType, amount }
    );
  }

  /**
   * Log payment received
   */
  async logPaymentReceived(
    leadId: string,
    paymentType: string,
    amount: number,
    currency: string = 'USD'
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'payment_received',
      'payment',
      'Payment Received',
      `Received ${currency} ${amount.toFixed(2)} for ${paymentType}`,
      null,
      { type: paymentType, amount, currency, status: 'paid' },
      { paymentType, amount, currency }
    );
  }

  /**
   * Log invoice sent
   */
  async logInvoiceSent(
    leadId: string,
    paymentType: string,
    amount: number,
    invoiceNumber?: string
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'invoice_sent',
      'payment',
      'Invoice Sent',
      `Invoice ${invoiceNumber ? `#${invoiceNumber}` : ''} sent for ${paymentType} ($${amount.toFixed(2)})`,
      null,
      { invoiceNumber, amount, paymentType },
      { paymentType, amount, invoiceNumber }
    );
  }

  /**
   * Log receipt sent
   */
  async logReceiptSent(
    leadId: string,
    paymentType: string,
    amount: number,
    receiptNumber?: string
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'receipt_sent',
      'payment',
      'Receipt Sent',
      `Receipt ${receiptNumber ? `#${receiptNumber}` : ''} sent for ${paymentType} ($${amount.toFixed(2)})`,
      null,
      { receiptNumber, amount, paymentType },
      { paymentType, amount, receiptNumber }
    );
  }

  // =====================================
  // TASK LOGGING METHODS
  // =====================================

  /**
   * Log task creation
   */
  async logTaskCreated(
    leadId: string,
    taskTitle: string,
    taskId: string,
    priority?: string,
    dueDate?: string
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'task_created',
      'task',
      'Task Created',
      `Task "${taskTitle}" created${priority ? ` with ${priority} priority` : ''}`,
      null,
      { title: taskTitle, priority, dueDate },
      { task_id: taskId, title: taskTitle, priority, dueDate }
    );
  }

  /**
   * Log task update
   */
  async logTaskUpdated(
    leadId: string,
    taskTitle: string,
    changedFields: string[],
    oldValues: Record<string, any>,
    newValues: Record<string, any>
  ): Promise<void> {
    const changes = changedFields.map(field => {
      const label = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return `${label}: "${oldValues[field] || 'empty'}" → "${newValues[field] || 'empty'}"`;
    }).join(', ');

    await this.logActivity(
      leadId,
      'task_updated',
      'task',
      'Task Updated',
      `Task "${taskTitle}" updated: ${changes}`,
      oldValues,
      newValues,
      { title: taskTitle, changedFields }
    );
  }

  /**
   * Log task completion
   */
  async logTaskCompleted(
    leadId: string,
    taskTitle: string
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'task_completed',
      'task',
      'Task Completed',
      `Task "${taskTitle}" marked as completed`,
      { status: 'pending' },
      { status: 'completed' },
      { title: taskTitle }
    );
  }

  /**
   * Log task deletion
   */
  async logTaskDeleted(
    leadId: string,
    taskTitle: string
  ): Promise<void> {
    await this.logActivity(
      leadId,
      'task_deleted',
      'task',
      'Task Deleted',
      `Task "${taskTitle}" was deleted`,
      { title: taskTitle },
      null,
      { title: taskTitle }
    );
  }

  // =====================================
  // NOTE LOGGING METHODS
  // =====================================

  /**
   * Log note added
   */
  async logNoteAdded(
    leadId: string,
    noteContent: string,
    noteType?: string
  ): Promise<void> {
    const truncatedContent = noteContent.length > 50 
      ? noteContent.substring(0, 50) + '...' 
      : noteContent;

    await this.logActivity(
      leadId,
      'note_added',
      'note',
      'Note Added',
      `Added ${noteType || 'general'} note: "${truncatedContent}"`,
      null,
      { content: noteContent, type: noteType },
      { noteType }
    );
  }

  /**
   * Log note updated
   */
  async logNoteUpdated(
    leadId: string,
    oldContent: string,
    newContent: string
  ): Promise<void> {
    const truncatedNew = newContent.length > 50 
      ? newContent.substring(0, 50) + '...' 
      : newContent;

    await this.logActivity(
      leadId,
      'note_updated',
      'note',
      'Note Updated',
      `Note updated: "${truncatedNew}"`,
      { content: oldContent },
      { content: newContent },
      {}
    );
  }

  /**
   * Log note deletion
   */
  async logNoteDeleted(
    leadId: string,
    noteContent: string
  ): Promise<void> {
    const truncatedContent = noteContent.length > 50 
      ? noteContent.substring(0, 50) + '...' 
      : noteContent;

    await this.logActivity(
      leadId,
      'note_deleted',
      'note',
      'Note Deleted',
      `Note deleted: "${truncatedContent}"`,
      { content: noteContent },
      null,
      {}
    );
  }

  // =====================================
  // COMMUNICATION LOGGING METHODS
  // =====================================

  /**
   * Log communication (email, SMS, call, etc.)
   */
  async logCommunicationLogged(
    leadId: string,
    type: string,
    direction: 'inbound' | 'outbound',
    subject?: string
  ): Promise<void> {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    const directionLabel = direction === 'outbound' ? 'Sent' : 'Received';
    
    await this.logActivity(
      leadId,
      'communication_logged',
      'communication',
      `${typeLabel} ${directionLabel}`,
      subject || `${typeLabel} ${direction} communication logged`,
      null,
      { type, direction, subject },
      { type, direction }
    );
  }

  // =====================================
  // FETCH METHODS
  // =====================================

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
