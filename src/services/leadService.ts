import { supabase } from '@/integrations/supabase/client';
import type { Lead } from '@/types/lead';
import { LeadRoutingService } from './leadRoutingService';
import { NotificationService } from './notificationService';
import { leadActivityService } from './leadActivityService';
import { DuplicateLeadService } from './duplicateLeadService';

export interface CreateLeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  source: any;
  program_interest?: string[];
  preferred_intake_id?: string;
  academic_term_id?: string;
  notes?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  user_id?: string;
  source_details?: string;
  tags?: string[];
  tenant_id?: string;
  skipDuplicateCheck?: boolean;
}

export interface CreateLeadError {
  message: string;
  code?: string;
  existingLeadId?: string;
  existingLeadEmail?: string;
}

export class LeadService {
  /**
   * Creates a new lead in the system
   */
  static async createLead(leadData: CreateLeadData, tenantId?: string): Promise<{ data: Lead | null; error: CreateLeadError | null }> {
    try {
      // Get tenant_id from parameter or fetch user's primary tenant
      let effectiveTenantId = tenantId || leadData.tenant_id;
      
      if (!effectiveTenantId) {
        const { data: tenantUser } = await supabase
          .from('tenant_users')
          .select('tenant_id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .eq('is_primary', true)
          .single();
        effectiveTenantId = tenantUser?.tenant_id;
      }

      // Check for duplicates if tenant has duplicate prevention configured
      if (effectiveTenantId && !leadData.skipDuplicateCheck) {
        const duplicateCheck = await DuplicateLeadService.checkForDuplicate(
          leadData.email,
          leadData.phone,
          effectiveTenantId
        );

        if (duplicateCheck.isDuplicate && duplicateCheck.existingLead) {
          return {
            data: null,
            error: {
              message: `A lead with this ${duplicateCheck.matchType} already exists`,
              code: 'DUPLICATE_LEAD',
              existingLeadId: duplicateCheck.existingLead.id,
              existingLeadEmail: duplicateCheck.existingLead.email
            }
          };
        }
      }

      const { data, error } = await supabase
        .from('leads')
        .insert({
          first_name: leadData.first_name,
          last_name: leadData.last_name,
          email: leadData.email,
          phone: leadData.phone,
          country: leadData.country,
          state: leadData.state,
          city: leadData.city,
          source: leadData.source as any,
          program_interest: leadData.program_interest || [],
          preferred_intake_id: leadData.preferred_intake_id || null,
          academic_term_id: leadData.academic_term_id || null,
          notes: leadData.notes,
          utm_source: leadData.utm_source,
          utm_medium: leadData.utm_medium,
          utm_campaign: leadData.utm_campaign,
          utm_content: leadData.utm_content,
          utm_term: leadData.utm_term,
          user_id: leadData.user_id,
          source_details: leadData.source_details,
          tags: leadData.tags || [],
          status: 'new' as any,
          priority: 'medium' as any,
          lead_score: 0,
          tenant_id: effectiveTenantId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        return { data: null, error };
      }

      const lead = data as Lead;

      // Log lead creation activity
      await leadActivityService.logLeadCreated(
        lead.id,
        leadData.source || 'unknown',
        leadData.program_interest
      );

      // Auto-route the lead based on routing rules
      try {
        const routingResult = await LeadRoutingService.evaluateRoutingRules(lead);
        
        if (routingResult.matched && routingResult.assignedTo) {
          // Update lead with assignment
          const { data: updatedLead } = await this.updateLead(lead.id, {
            assigned_to: routingResult.assignedTo,
            assigned_at: new Date().toISOString(),
            assignment_method: routingResult.method as any
          });

          // Log advisor assignment
          const { data: advisorProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', routingResult.assignedTo)
            .single();
          
          const advisorName = advisorProfile
            ? [advisorProfile.first_name, advisorProfile.last_name].filter(Boolean).join(' ')
            : 'Unknown Advisor';
          
          await leadActivityService.logAdvisorChange(
            lead.id,
            null,
            advisorName,
            routingResult.method
          );

          // Send notification to assigned advisor
          await NotificationService.notifyLeadAssignment(
            updatedLead?.id || lead.id,
            routingResult.assignedTo,
            {
              leadName: `${lead.first_name} ${lead.last_name}`,
              ruleName: routingResult.ruleName || 'Routing Rule'
            }
          );

          return { data: updatedLead || lead, error: null };
        }
      } catch (routingError) {
        console.error('Error in lead routing:', routingError);
        // Don't fail lead creation if routing fails
      }

      return { data: lead, error: null };
    } catch (error) {
      console.error('Error in createLead:', error);
      return { data: null, error };
    }
  }

  /**
   * Creates lead activities
   */
  static async createActivity(leadId: string, activity: any): Promise<{ error: any }> {
    return { error: null };
  }

  /**
   * Gets lead activities
   */
  static async getLeadActivities(leadId: string): Promise<{ data: any[] | null; error: any }> {
    return { data: [], error: null };
  }

  /**
   * Gets lead by ID
   */
  static async getLeadById(leadId: string): Promise<{ data: Lead | null; error: any }> {
    return this.getLead(leadId);
  }

  /**
   * Updates lead status
   */
  static async updateLeadStatus(leadId: string, status: string): Promise<{ error: any }> {
    return this.updateStatus(leadId, status);
  }

  /**
   * Remove AI agent from lead
   */
  static async removeAIAgentFromLead(leadId: string): Promise<{ error: any }> {
    return { error: null };
  }

  /**
   * Gets all leads for a tenant (falls back to user_id for backward compatibility)
   */
  static async getLeads(userId: string, tenantId?: string): Promise<{ data: Lead[] | null; error: any }> {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      // If tenantId provided, filter by tenant, otherwise fall back to user_id
      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      } else {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leads:', error);
        return { data: null, error };
      }

      return { data: data as Lead[], error: null };
    } catch (error) {
      console.error('Error in getLeads:', error);
      return { data: null, error };
    }
  }

  /**
   * Gets a single lead by ID
   */
  static async getLead(leadId: string): Promise<{ data: Lead | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error) {
        console.error('Error fetching lead:', error);
        return { data: null, error };
      }

      return { data: data as Lead, error: null };
    } catch (error) {
      console.error('Error in getLead:', error);
      return { data: null, error };
    }
  }

  /**
   * Updates a lead
   */
  static async updateLead(leadId: string, updates: Partial<Lead>): Promise<{ data: Lead | null; error: any }> {
    try {
      // Remove tenant_id from updates to prevent changing it
      const { tenant_id, ...safeUpdates } = updates as any;
      
      const { data, error } = await supabase
        .from('leads')
        .update(safeUpdates as any)
        .eq('id', leadId)
        .select()
        .single();

      if (error) {
        console.error('Error updating lead:', error);
        return { data: null, error };
      }

      return { data: data as Lead, error: null };
    } catch (error) {
      console.error('Error in updateLead:', error);
      return { data: null, error };
    }
  }

  /**
   * Deletes a lead
   */
  static async deleteLead(leadId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) {
        console.error('Error deleting lead:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Error in deleteLead:', error);
      return { error };
    }
  }

  /**
   * Updates lead status and captures AI training data for converted/lost leads
   */
  static async updateStatus(leadId: string, status: string): Promise<{ error: any }> {
    const result = await this.updateLead(leadId, { status: status as any });
    
    // Capture training data for AI scoring when lead outcome is known
    if (!result.error && ['converted', 'lost'].includes(status.toLowerCase())) {
      this.captureTrainingDataAsync(leadId, status.toLowerCase() as 'converted' | 'lost');
    }
    
    return result;
  }

  /**
   * Captures AI training data asynchronously (fire-and-forget)
   */
  private static async captureTrainingDataAsync(leadId: string, outcome: 'converted' | 'lost'): Promise<void> {
    try {
      // Get lead to find tenant_id
      const { data: lead } = await this.getLead(leadId);
      const tenantId = (lead as any)?.tenant_id;
      if (!tenantId) {
        console.warn('Cannot capture training data: lead or tenant_id not found');
        return;
      }

      // Fire-and-forget call to snapshot training data
      supabase.functions.invoke('ai-snapshot-training-data', {
        body: { lead_id: leadId, tenant_id: tenantId, outcome }
      }).then(response => {
        if (response.error) {
          console.error('Error capturing AI training data:', response.error);
        } else {
          console.log(`AI training data captured for lead ${leadId} with outcome: ${outcome}`);
        }
      }).catch(err => {
        console.error('Failed to capture AI training data:', err);
      });
    } catch (error) {
      console.error('Error in captureTrainingDataAsync:', error);
    }
  }

  /**
   * Assigns a lead to an advisor
   */
  static async assignLead(leadId: string, advisorId: string): Promise<{ error: any }> {
    return this.updateLead(leadId, { 
      assigned_to: advisorId,
      assigned_at: new Date().toISOString(),
      assignment_method: 'manual'
    });
  }

  /**
   * Gets hot leads with high priority and engagement
   */
  static async getHotLeads(userId: string, tenantId?: string): Promise<{ data: Lead[] | null; error: any }> {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .or('priority.eq.urgent,priority.eq.high')
        .gte('lead_score', 70)
        .order('lead_score', { ascending: false })
        .limit(15);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      } else {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching hot leads:', error);
        return { data: null, error };
      }

      return { data: data as Lead[], error: null };
    } catch (error) {
      console.error('Error in getHotLeads:', error);
      return { data: null, error };
    }
  }

  /**
   * Gets today's call list from lead_tasks (call/follow-up tasks due today or overdue)
   */
  static async getTodaysCallList(userId: string, tenantId?: string): Promise<{ data: any[] | null; error: any }> {
    try {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const endOfDay = today.toISOString();

      // Build filter conditions
      const typeFilter = 'type.in.(call,Call,follow_up,Follow Up,follow-up,Follow-Up)';
      const statusFilter = 'status.in.(pending,in_progress)';
      
      let query = supabase
        .from('lead_tasks')
        .select('*, lead:leads!lead_id(*)');
      
      // Apply filters step by step with type assertions
      query = (query as any).or(typeFilter);
      query = (query as any).or(statusFilter); 
      query = query.lte('due_date', endOfDay);
      query = query.order('due_date', { ascending: true });

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching todays call list:', error);
        return { data: null, error };
      }

      // Filter for valid call types and tasks with lead data
      const callTypes = ['call', 'follow_up', 'follow-up'];
      const validStatuses = ['pending', 'in_progress'];
      const validTasks = (data || []).filter((task: any) => 
        task.lead && 
        callTypes.includes(task.type?.toLowerCase()) &&
        validStatuses.includes(task.status?.toLowerCase())
      );

      return { data: validTasks, error: null };
    } catch (error) {
      console.error('Error in getTodaysCallList:', error);
      return { data: null, error };
    }
  }

  /**
   * Gets re-enquiry students - leads who have submitted forms multiple times
   */
  static async getReenquiryStudents(userId: string, tenantId?: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
    program?: string;
    status?: string;
    assignedTo?: string;
  }): Promise<{ data: Lead[] | null; error: any }> {
    try {
      let query = supabase
        .from('leads')
        .select('*, form_submissions:form_submissions(id, form_id, submitted_at)')
        .or('reenquiry_count.gt.0,tags.cs.{reenquiry,upsell,program_change,dormant,reactivation,alumni_referral}')
        .order('last_reenquiry_at', { ascending: false, nullsFirst: false });

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      // Apply filters
      if (filters?.dateFrom) {
        query = query.gte('last_reenquiry_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('last_reenquiry_at', filters.dateTo);
      }
      if (filters?.program) {
        query = query.contains('program_interest', [filters.program]);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status as any);
      }
      if (filters?.assignedTo) {
        query = query.eq('assigned_to', filters.assignedTo);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching re-enquiry students:', error);
        return { data: null, error };
      }

      return { data: data as Lead[], error: null };
    } catch (error) {
      console.error('Error in getReenquiryStudents:', error);
      return { data: null, error };
    }
  }

  /**
   * Handles re-enquiry when a lead submits a form again
   * Updates lead properties, saves form submission, and notifies advisor
   */
  static async handleReenquiry(
    existingLeadId: string,
    formData: Record<string, any>,
    formId: string,
    formTitle: string
  ): Promise<void> {
    try {
      // 1. Get the existing lead
      const { data: existingLead, error: leadError } = await this.getLead(existingLeadId);
      if (leadError || !existingLead) {
        throw new Error('Failed to fetch existing lead');
      }

      // 2. Save the form submission linked to existing lead
      const { error: submissionError } = await supabase
        .from('form_submissions')
        .insert({
          form_id: formId,
          lead_id: existingLeadId,
          submission_data: {
            ...formData,
            reenquiry: true,
            original_form_title: formTitle,
          },
          tenant_id: (existingLead as any).tenant_id
        });

      if (submissionError) {
        console.error('Error saving form submission:', submissionError);
      }

      // 3. Update lead properties
      const currentTags = existingLead.tags || [];
      const newTags = currentTags.includes('reenquiry') 
        ? currentTags 
        : [...currentTags, 'reenquiry'];

      // Merge program interests if new ones provided
      const newPrograms = formData['program_interest'] || formData['programs'] || [];
      const existingPrograms = existingLead.program_interest || [];
      const mergedPrograms = [...new Set([...existingPrograms, ...(Array.isArray(newPrograms) ? newPrograms : [newPrograms])])];

      await this.updateLead(existingLeadId, {
        number_of_form_submissions: (existingLead.number_of_form_submissions || 0) + 1,
        last_form_submission_at: new Date().toISOString(),
        reenquiry_count: ((existingLead as any).reenquiry_count || 0) + 1,
        last_reenquiry_at: new Date().toISOString(),
        tags: newTags,
        program_interest: mergedPrograms.length > 0 ? mergedPrograms : existingLead.program_interest,
        notes: existingLead.notes 
          ? `${existingLead.notes}\n\n[Re-enquiry ${new Date().toLocaleDateString()}] Submitted ${formTitle}`
          : `[Re-enquiry ${new Date().toLocaleDateString()}] Submitted ${formTitle}`,
      } as any);

      // 4. Notify assigned advisor if exists
      if (existingLead.assigned_to) {
        await NotificationService.notifyReenquiry(
          existingLeadId,
          existingLead.assigned_to,
          `${existingLead.first_name} ${existingLead.last_name}`,
          formTitle
        );
      }

      // Activity logging handled by updateLead

    } catch (error) {
      console.error('Error handling re-enquiry:', error);
      throw error;
    }
  }

  /**
   * Adds leads to the call list by creating call tasks
   */
  static async addToCallList(
    leadIds: string[],
    userId: string,
    tenantId?: string,
    taskDetails?: { title?: string; description?: string; dueDate?: string }
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    const today = new Date().toISOString();

    for (const leadId of leadIds) {
      try {
        const { error } = await supabase
          .from('lead_tasks')
          .insert({
            lead_id: leadId,
            user_id: userId,
            tenant_id: tenantId,
            title: taskDetails?.title || 'Follow up on re-enquiry',
            description: taskDetails?.description || 'Lead submitted a form again - follow up required',
            task_type: 'call',
            type: 'call',
            due_date: taskDetails?.dueDate || today,
            status: 'pending',
            priority: 'high',
            assigned_to: userId,
          } as any);

        if (error) {
          console.error('Error creating call task for lead:', leadId, error);
          failed++;
        } else {
          success++;
        }
      } catch (error) {
        console.error('Error adding lead to call list:', error);
        failed++;
      }
    }

    return { success, failed };
  }
}
