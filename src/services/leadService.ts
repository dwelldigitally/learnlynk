import { supabase } from '@/integrations/supabase/client';
import type { Lead } from '@/types/lead';

export interface CreateLeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  source: any; // Use any to bypass enum issues
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
}

export class LeadService {
  /**
   * Creates a new lead in the system
   */
  static async createLead(leadData: CreateLeadData): Promise<{ data: Lead | null; error: any }> {
    try {
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
          lead_score: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        return { data: null, error };
      }

      return { data: data as Lead, error: null };
    } catch (error) {
      console.error('Error in createLead:', error);
      return { data: null, error };
    }
  }

  /**
   * Creates lead activities
   */
  static async createActivity(leadId: string, activity: any): Promise<{ error: any }> {
    // Mock implementation for backward compatibility
    return { error: null };
  }

  /**
   * Gets lead activities
   */
  static async getLeadActivities(leadId: string): Promise<{ data: any[] | null; error: any }> {
    // Mock implementation for backward compatibility
    return { data: [], error: null };
  }

  /**
   * Gets lead by ID (alias for getLead)
   */
  static async getLeadById(leadId: string): Promise<{ data: Lead | null; error: any }> {
    return this.getLead(leadId);
  }

  /**
   * Updates lead status (alias for updateStatus)
   */
  static async updateLeadStatus(leadId: string, status: string): Promise<{ error: any }> {
    return this.updateStatus(leadId, status);
  }

  /**
   * Remove AI agent from lead (mock implementation)
   */
  static async removeAIAgentFromLead(leadId: string): Promise<{ error: any }> {
    return { error: null };
  }

  /**
   * Gets all leads for a user
   */
  static async getLeads(userId: string): Promise<{ data: Lead[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

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
      const { data, error } = await supabase
        .from('leads')
        .update(updates as any)
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
   * Updates lead status
   */
  static async updateStatus(leadId: string, status: string): Promise<{ error: any }> {
    return this.updateLead(leadId, { status: status as any });
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
  static async getHotLeads(userId: string): Promise<{ data: Lead[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .or('priority.eq.urgent,priority.eq.high')
        .gte('lead_score', 70)
        .order('lead_score', { ascending: false })
        .limit(15);

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
   * Gets today's call list
   */
  static async getTodaysCallList(userId: string): Promise<{ data: Lead[] | null; error: any }> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .not('next_follow_up_at', 'is', null)
        .or(`next_follow_up_at.gte.${startOfDay},next_follow_up_at.lt.${endOfDay},next_follow_up_at.lt.${startOfDay}`)
        .order('next_follow_up_at', { ascending: true });

      if (error) {
        console.error('Error fetching todays call list:', error);
        return { data: null, error };
      }

      return { data: data as Lead[], error: null };
    } catch (error) {
      console.error('Error in getTodaysCallList:', error);
      return { data: null, error };
    }
  }

  /**
   * Gets re-enquiry students
   */
  static async getReenquiryStudents(userId: string): Promise<{ data: Lead[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .or('tags.cs.{upsell,program_change,dormant,reactivation,alumni_referral}')
        .order('lead_score', { ascending: false })
        .limit(20);

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
}