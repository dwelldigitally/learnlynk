import { supabase } from '@/integrations/supabase/client';
import { 
  Email, 
  EmailAccount, 
  TeamInbox, 
  EmailDraft, 
  EmailFilter, 
  EmailStats,
  AIEmailAnalysis 
} from '@/types/email';
import { Lead } from '@/types/lead';

export class EmailService {
  /**
   * Get user's email accounts
   */
  static async getEmailAccounts(): Promise<EmailAccount[]> {
    const { data, error } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching email accounts:', error);
      throw new Error('Failed to fetch email accounts');
    }

    return (data || []) as EmailAccount[];
  }

  /**
   * Get team inboxes accessible to current user
   */
  static async getTeamInboxes(): Promise<TeamInbox[]> {
    const { data, error } = await supabase
      .from('team_inboxes')
      .select(`
        *,
        team_inbox_members!inner(role)
      `)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching team inboxes:', error);
      throw new Error('Failed to fetch team inboxes');
    }

    return data || [];
  }

  /**
   * Get emails with filtering and AI prioritization
   */
  static async getEmails(
    filters: EmailFilter = {},
    page: number = 1,
    limit: number = 50
  ): Promise<{ emails: Email[]; total: number }> {
    let query = supabase
      .from('emails')
      .select(`
        *,
        email_account:email_accounts(email_address, display_name),
        team_inbox:team_inboxes(name),
        lead:leads(first_name, last_name, lead_score, program_interest)
      `, { count: 'exact' });

    // Apply filters
    if (filters.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters.importance?.length) {
      query = query.in('importance', filters.importance);
    }

    if (filters.is_read !== undefined) {
      query = query.eq('is_read', filters.is_read);
    }

    if (filters.team_inbox_id) {
      query = query.eq('team_inbox_id', filters.team_inbox_id);
    }

    if (filters.assigned_to?.length) {
      query = query.in('assigned_to', filters.assigned_to);
    }

    if (filters.ai_priority_range) {
      query = query
        .gte('ai_priority_score', filters.ai_priority_range.min)
        .lte('ai_priority_score', filters.ai_priority_range.max);
    }

    if (filters.date_range) {
      query = query
        .gte('received_datetime', filters.date_range.start.toISOString())
        .lte('received_datetime', filters.date_range.end.toISOString());
    }

    if (filters.search_query) {
      query = query.or(`
        subject.ilike.%${filters.search_query}%,
        body_preview.ilike.%${filters.search_query}%,
        from_email.ilike.%${filters.search_query}%,
        from_name.ilike.%${filters.search_query}%
      `);
    }

    // Order by AI priority score and received time
    query = query
      .order('ai_priority_score', { ascending: false })
      .order('received_datetime', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching emails:', error);
      throw new Error('Failed to fetch emails');
    }

    return {
      emails: (data || []).map(email => ({
        ...email,
        to_emails: Array.isArray(email.to_emails) ? email.to_emails : [],
        cc_emails: Array.isArray(email.cc_emails) ? email.cc_emails : [],
        bcc_emails: Array.isArray(email.bcc_emails) ? email.bcc_emails : [],
        ai_suggested_actions: Array.isArray(email.ai_suggested_actions) ? email.ai_suggested_actions : []
      })) as Email[],
      total: count || 0
    };
  }

  /**
   * Get single email with full details
   */
  static async getEmail(id: string): Promise<Email | null> {
    const { data, error } = await supabase
      .from('emails')
      .select(`
        *,
        email_account:email_accounts(email_address, display_name),
        team_inbox:team_inboxes(name),
        lead:leads(*),
        attachments:email_attachments(*),
        drafts:email_drafts(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching email:', error);
      return null;
    }

    return {
      ...data,
      to_emails: Array.isArray(data.to_emails) ? data.to_emails : [],
      cc_emails: Array.isArray(data.cc_emails) ? data.cc_emails : [],
      bcc_emails: Array.isArray(data.bcc_emails) ? data.bcc_emails : [],
      ai_suggested_actions: Array.isArray(data.ai_suggested_actions) ? data.ai_suggested_actions : []
    } as Email;
  }

  /**
   * Mark email as read/unread
   */
  static async updateEmailReadStatus(id: string, isRead: boolean): Promise<void> {
    const { error } = await supabase
      .from('emails')
      .update({ is_read: isRead })
      .eq('id', id);

    if (error) {
      console.error('Error updating email read status:', error);
      throw new Error('Failed to update email status');
    }
  }

  /**
   * Assign email to user
   */
  static async assignEmail(emailId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('emails')
      .update({ 
        assigned_to: userId,
        assigned_at: new Date().toISOString(),
        status: 'assigned'
      })
      .eq('id', emailId);

    if (error) {
      console.error('Error assigning email:', error);
      throw new Error('Failed to assign email');
    }
  }

  /**
   * Update email status
   */
  static async updateEmailStatus(
    id: string, 
    status: Email['status']
  ): Promise<void> {
    const { error } = await supabase
      .from('emails')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating email status:', error);
      throw new Error('Failed to update email status');
    }
  }

  /**
   * Get email statistics
   */
  static async getEmailStats(filters: EmailFilter = {}): Promise<EmailStats> {
    let baseQuery = supabase.from('emails').select('*');

    // Apply same filters as getEmails
    if (filters.team_inbox_id) {
      baseQuery = baseQuery.eq('team_inbox_id', filters.team_inbox_id);
    }

    if (filters.date_range) {
      baseQuery = baseQuery
        .gte('received_datetime', filters.date_range.start.toISOString())
        .lte('received_datetime', filters.date_range.end.toISOString());
    }

    const { data: emails, error } = await baseQuery;

    if (error) {
      console.error('Error fetching email stats:', error);
      return {
        total_emails: 0,
        unread_count: 0,
        high_priority_count: 0,
        assigned_count: 0,
        response_rate: 0,
        avg_response_time_hours: 0,
        lead_conversion_count: 0,
        by_status: { new: 0, assigned: 0, in_progress: 0, replied: 0, resolved: 0 },
        by_importance: { low: 0, normal: 0, high: 0 }
      };
    }

    const totalEmails = emails?.length || 0;
    const unreadCount = emails?.filter(e => !e.is_read).length || 0;
    const highPriorityCount = emails?.filter(e => e.importance === 'high').length || 0;
    const assignedCount = emails?.filter(e => e.assigned_to).length || 0;
    const leadConversionCount = emails?.filter(e => e.lead_id).length || 0;

    // Calculate status distribution
    const byStatus = emails?.reduce((acc, email) => {
      acc[email.status] = (acc[email.status] || 0) + 1;
      return acc;
    }, {
      new: 0,
      assigned: 0,
      in_progress: 0,
      replied: 0,
      resolved: 0
    }) || { new: 0, assigned: 0, in_progress: 0, replied: 0, resolved: 0 };

    // Calculate importance distribution
    const byImportance = emails?.reduce((acc, email) => {
      acc[email.importance] = (acc[email.importance] || 0) + 1;
      return acc;
    }, {
      low: 0,
      normal: 0,
      high: 0
    }) || { low: 0, normal: 0, high: 0 };

    return {
      total_emails: totalEmails,
      unread_count: unreadCount,
      high_priority_count: highPriorityCount,
      assigned_count: assignedCount,
      response_rate: totalEmails > 0 ? byStatus.replied / totalEmails : 0,
      avg_response_time_hours: 0, // TODO: Calculate from analytics
      lead_conversion_count: leadConversionCount,
      by_status: byStatus,
      by_importance: byImportance
    };
  }

  /**
   * Create AI-powered email draft
   */
  static async createAIDraft(
    originalEmailId: string,
    context: {
      lead?: Lead;
      programInterest?: string[];
      responseType: 'reply' | 'forward' | 'new';
    }
  ): Promise<EmailDraft> {
    // This would integrate with the AI edge function
    // For now, create a basic draft
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('email_drafts')
      .insert({
        original_email_id: originalEmailId,
        created_by: user.id,
        is_ai_generated: true,
        ai_confidence_score: 0.8,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating AI draft:', error);
      throw new Error('Failed to create AI draft');
    }

    return {
      ...data,
      to_emails: Array.isArray(data.to_emails) ? data.to_emails : [],
      cc_emails: Array.isArray(data.cc_emails) ? data.cc_emails : [],
      bcc_emails: Array.isArray(data.bcc_emails) ? data.bcc_emails : [],
      suggested_attachments: Array.isArray(data.suggested_attachments) ? data.suggested_attachments : []
    } as EmailDraft;
  }

  /**
   * Bulk operations on emails
   */
  static async bulkUpdateEmails(
    emailIds: string[],
    updates: Partial<Pick<Email, 'status' | 'is_read' | 'assigned_to'>>
  ): Promise<void> {
    const { error } = await supabase
      .from('emails')
      .update(updates)
      .in('id', emailIds);

    if (error) {
      console.error('Error bulk updating emails:', error);
      throw new Error('Failed to update emails');
    }
  }

  /**
   * Analyze email for AI prioritization and lead matching
   */
  static async analyzeEmailWithAI(emailId: string): Promise<AIEmailAnalysis> {
    // This would call the AI edge function
    // For now, return mock analysis
    const { data: email } = await supabase
      .from('emails')
      .select('*, lead:leads(*)')
      .eq('id', emailId)
      .single();

    if (!email) {
      throw new Error('Email not found');
    }

    // Mock AI analysis - in production this would be from AI service
    const analysis: AIEmailAnalysis = {
      priority_score: Math.random() * 100,
      confidence: 0.85,
      suggested_actions: [
        {
          action: 'send_program_brochure',
          priority: 1,
          reason: 'User expressed interest in healthcare programs'
        },
        {
          action: 'schedule_consultation',
          priority: 2,
          reason: 'High-value prospect based on email content'
        }
      ],
      suggested_response: {
        tone: 'professional_warm',
        key_points: [
          'Thank the prospect for their interest',
          'Provide relevant program information',
          'Offer consultation call'
        ],
        templates: ['program_inquiry_response', 'consultation_offer']
      },
      document_suggestions: []
    };

    // Update email with AI analysis
    await supabase
      .from('emails')
      .update({
        ai_priority_score: analysis.priority_score,
        ai_lead_match_confidence: analysis.confidence,
        ai_suggested_actions: analysis.suggested_actions
      })
      .eq('id', emailId);

    return analysis;
  }
}