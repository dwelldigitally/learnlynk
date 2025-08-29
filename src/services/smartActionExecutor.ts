import { supabase } from "@/integrations/supabase/client";

export interface SmartActionExecution {
  id: string;
  actionType: 'email' | 'call' | 'follow_up' | 'document' | 'assignment';
  leadId: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  executionData?: any;
  result?: any;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ExecutionOptions {
  immediate?: boolean;
  scheduledFor?: string;
  context?: any;
}

class SmartActionExecutorService {
  async executeAction(
    actionType: string,
    actionData: any,
    options: ExecutionOptions = {}
  ): Promise<SmartActionExecution> {
    const execution: SmartActionExecution = {
      id: crypto.randomUUID(),
      actionType: actionType as any,
      leadId: actionData.leadId,
      status: 'pending',
      executionData: actionData,
      createdAt: new Date().toISOString(),
    };

    try {
      execution.status = 'executing';
      
      switch (actionType) {
        case 'email':
          execution.result = await this.executeEmailAction(actionData, options);
          break;
        case 'call':
          execution.result = await this.executeCallAction(actionData, options);
          break;
        case 'follow_up':
          execution.result = await this.executeFollowUpAction(actionData, options);
          break;
        case 'document':
          execution.result = await this.executeDocumentAction(actionData, options);
          break;
        case 'assignment':
          execution.result = await this.executeAssignmentAction(actionData, options);
          break;
        default:
          throw new Error(`Unknown action type: ${actionType}`);
      }

      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();

      // Log execution to database
      await this.logExecution(execution);

      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.completedAt = new Date().toISOString();
      
      await this.logExecution(execution);
      throw error;
    }
  }

  private async executeEmailAction(actionData: any, options: ExecutionOptions) {
    const { leadId, emailTemplate, subject, content, personalization } = actionData;

    // Get lead data for personalization
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Personalize content
    const personalizedContent = this.personalizeContent(content, lead, personalization);
    const personalizedSubject = this.personalizeContent(subject, lead, personalization);

    // Create communication record
    const { data: communication, error } = await supabase
      .from('lead_communications')
      .insert({
        lead_id: leadId,
        user_id: lead.user_id,
        type: 'email',
        direction: 'outbound',
        subject: personalizedSubject,
        content: personalizedContent,
        status: options.immediate ? 'completed' : 'scheduled',
        scheduled_for: options.scheduledFor,
        is_ai_generated: true,
      })
      .select()
      .single();

    if (error) throw error;

    // For immediate execution, call email sending service
    if (options.immediate) {
      // In a real implementation, this would call your email service
      console.log('Sending email:', {
        to: lead.email,
        subject: personalizedSubject,
        content: personalizedContent,
      });
    }

    return {
      communicationId: communication.id,
      personalizedContent,
      personalizedSubject,
      scheduled: !options.immediate,
    };
  }

  private async executeCallAction(actionData: any, options: ExecutionOptions) {
    const { leadId, callScript, purpose, duration } = actionData;

    // Get lead data
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Create communication record
    const { data: communication, error } = await supabase
      .from('lead_communications')
      .insert({
        lead_id: leadId,
        user_id: lead.user_id,
        type: 'call',
        direction: 'outbound',
        content: callScript,
        status: 'scheduled',
        scheduled_for: options.scheduledFor || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        metadata: { purpose, duration },
        is_ai_generated: true,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      communicationId: communication.id,
      scheduledFor: communication.scheduled_for,
      callScript,
    };
  }

  private async executeFollowUpAction(actionData: any, options: ExecutionOptions) {
    const { leadId, followUpType, delay, content } = actionData;

    // Get lead data
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Create universal task
    const { data: task, error } = await supabase
      .from('universal_tasks')
      .insert({
        user_id: lead.user_id,
        title: `Follow up with ${lead.first_name} ${lead.last_name}`,
        description: content,
        category: 'follow_up',
        priority: this.calculatePriority(lead),
        entity_type: 'lead',
        entity_id: leadId,
        due_date: new Date(Date.now() + (delay * 24 * 60 * 60 * 1000)).toISOString(),
        status: 'pending',
        metadata: { 
          followUpType,
          aiGenerated: true,
          originalActionData: actionData 
        },
      })
      .select()
      .single();

    if (error) throw error;

    return {
      taskId: task.id,
      dueDate: task.due_date,
      followUpType,
    };
  }

  private async executeDocumentAction(actionData: any, options: ExecutionOptions) {
    const { leadId, documentType, templateId, data } = actionData;

    // Generate document content based on type
    let documentContent = '';
    let fileName = '';

    switch (documentType) {
      case 'application_summary':
        documentContent = this.generateApplicationSummary(data);
        fileName = `application_summary_${leadId}.html`;
        break;
      case 'enrollment_checklist':
        documentContent = this.generateEnrollmentChecklist(data);
        fileName = `enrollment_checklist_${leadId}.html`;
        break;
      default:
        throw new Error(`Unknown document type: ${documentType}`);
    }

    return {
      documentType,
      fileName,
      content: documentContent,
      generated: true,
    };
  }

  private async executeAssignmentAction(actionData: any, options: ExecutionOptions) {
    const { leadId, advisorId, reason, priority } = actionData;

    // Update lead assignment
    const { data: updatedLead, error } = await supabase
      .from('leads')
      .update({
        assigned_to: advisorId,
        assigned_at: new Date().toISOString(),
        assignment_method: 'ai_based',
        priority: priority || 'medium',
      })
      .eq('id', leadId)
      .select()
      .single();

    if (error) throw error;

    // Create notification task for the advisor
    await supabase
      .from('universal_tasks')
      .insert({
        user_id: updatedLead.user_id,
        title: `New lead assigned: ${updatedLead.first_name} ${updatedLead.last_name}`,
        description: `AI assigned this lead due to: ${reason}`,
        category: 'communication',
        priority: priority || 'medium',
        entity_type: 'lead',
        entity_id: leadId,
        assigned_to: advisorId,
        status: 'pending',
        metadata: { aiAssignment: true, reason },
      });

    return {
      leadId,
      advisorId,
      assignedAt: updatedLead.assigned_at,
      reason,
    };
  }

  private personalizeContent(content: string, lead: any, personalization: any = {}): string {
    let personalized = content;
    
    // Replace standard placeholders
    personalized = personalized.replace(/\{firstName\}/g, lead.first_name || '');
    personalized = personalized.replace(/\{lastName\}/g, lead.last_name || '');
    personalized = personalized.replace(/\{email\}/g, lead.email || '');
    personalized = personalized.replace(/\{program\}/g, lead.program_interest?.[0] || 'your program of interest');
    
    // Replace custom personalization
    Object.entries(personalization).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      personalized = personalized.replace(regex, String(value));
    });

    return personalized;
  }

  private calculatePriority(lead: any): 'low' | 'medium' | 'high' | 'urgent' {
    const score = lead.lead_score || 0;
    const aiScore = lead.ai_score || 0;
    
    if (score > 80 || aiScore > 0.8) return 'urgent';
    if (score > 60 || aiScore > 0.6) return 'high';
    if (score > 40 || aiScore > 0.4) return 'medium';
    return 'low';
  }

  private generateApplicationSummary(data: any): string {
    return `
      <h1>Application Summary</h1>
      <p><strong>Student:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Program:</strong> ${data.program}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    `;
  }

  private generateEnrollmentChecklist(data: any): string {
    return `
      <h1>Enrollment Checklist</h1>
      <p><strong>Student:</strong> ${data.firstName} ${data.lastName}</p>
      <ul>
        <li>☐ Application submitted</li>
        <li>☐ Documents verified</li>
        <li>☐ Interview completed</li>
        <li>☐ Deposit paid</li>
        <li>☐ Enrollment confirmed</li>
      </ul>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    `;
  }

  private async logExecution(execution: SmartActionExecution) {
    try {
      await supabase
        .from('action_execution_logs')
        .insert({
          action_id: execution.id,
          execution_result: execution.status,
          execution_data: execution.executionData,
          response_time_minutes: execution.completedAt 
            ? Math.round((new Date(execution.completedAt).getTime() - new Date(execution.createdAt).getTime()) / 60000)
            : null,
          outcome_achieved: execution.status === 'completed',
        });
    } catch (error) {
      console.error('Failed to log execution:', error);
    }
  }
}

export const smartActionExecutor = new SmartActionExecutorService();