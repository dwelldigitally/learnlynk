import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadActivity, LeadFormData, LeadAssignmentRequest, LeadSearchFilters, LeadStatus } from '@/types/lead';
import { DemoDataService } from './demoDataService';

export class LeadService {
  // Create a new lead
  static async createLead(leadData: LeadFormData): Promise<Lead> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...leadData,
        user_id: user?.id,
        tags: [],
        lead_score: 0
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create lead: ${error.message}`);
    }

    return data as Lead;
  }

  // Get all leads with optional filters and demo data support
  static async getLeads(filters?: LeadSearchFilters, page = 1, limit = 50): Promise<{ leads: Lead[]; total: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No authenticated user found');
      return { leads: [], total: 0 };
    }

    // Check if user has demo data access
    const hasDemoData = await DemoDataService.hasUserDemoData();
    console.log('User has demo data access:', hasDemoData);
    
    // Check if user has any real leads of their own
    const { data: userLeads, count: userLeadsCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    console.log('User leads count:', userLeadsCount);
    
    // If user has demo data and no real leads of their own, return demo data
    if (hasDemoData && (userLeadsCount === 0 || userLeadsCount === null)) {
      console.log('Returning demo leads for user');
      const demoLeads = DemoDataService.getDemoLeads();
      return {
        leads: demoLeads as Lead[],
        total: demoLeads.length
      };
    }

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters.source && filters.source.length > 0) {
        query = query.in('source', filters.source);
      }
      if (filters.priority && filters.priority.length > 0) {
        query = query.in('priority', filters.priority);
      }
      if (filters.assigned_to && filters.assigned_to.length > 0) {
        query = query.in('assigned_to', filters.assigned_to);
      }
      if (filters.program_interest && filters.program_interest.length > 0) {
        query = query.overlaps('program_interest', filters.program_interest);
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      if (filters.date_range) {
        query = query
          .gte('created_at', filters.date_range.start.toISOString())
          .lte('created_at', filters.date_range.end.toISOString());
      }
      if (filters.lead_score_range) {
        query = query
          .gte('lead_score', filters.lead_score_range.min)
          .lte('lead_score', filters.lead_score_range.max);
      }
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch leads: ${error.message}`);
    }

    return {
      leads: (data as Lead[]) || [],
      total: count || 0
    };
  }

  // Get a single lead by ID
  static async getLeadById(id: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch lead: ${error.message}`);
    }

    return data as Lead;
  }

  // Update a lead
  static async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update lead: ${error.message}`);
    }

    return data as Lead;
  }

  // Assign a lead to an advisor
  static async assignLead(request: LeadAssignmentRequest): Promise<Lead> {
    const updates = {
      assigned_to: request.assigned_to,
      assigned_at: new Date().toISOString(),
      assignment_method: request.assignment_method
    };

    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', request.lead_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to assign lead: ${error.message}`);
    }

    // Log the assignment activity
    await this.createActivity(request.lead_id, {
      activity_type: 'assignment',
      activity_description: `Lead assigned to advisor using ${request.assignment_method} method`,
      activity_data: {
        assigned_to: request.assigned_to,
        assignment_method: request.assignment_method,
        notes: request.notes
      }
    });

    return data as Lead;
  }

  // Create a lead activity
  static async createActivity(leadId: string, activity: {
    activity_type: string;
    activity_description: string;
    activity_data?: Record<string, any>;
    performed_by?: string;
  }): Promise<LeadActivity> {
    const { data, error } = await supabase
      .from('lead_activities')
      .insert([{
        lead_id: leadId,
        ...activity
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create activity: ${error.message}`);
    }

    return data as LeadActivity;
  }

  // Get activities for a lead
  static async getLeadActivities(leadId: string): Promise<LeadActivity[]> {
    const { data, error } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('performed_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch activities: ${error.message}`);
    }

    return (data as LeadActivity[]) || [];
  }

  // Update lead status
  static async updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<Lead> {
    const currentLead = await this.getLeadById(id);
    if (!currentLead) {
      throw new Error('Lead not found');
    }

    const lead = await this.updateLead(id, { status });

    // Log the status change
    await this.createActivity(id, {
      activity_type: 'status_change',
      activity_description: `Lead status changed to ${status}`,
      activity_data: {
        old_status: currentLead.status,
        new_status: status,
        notes
      }
    });

    return lead;
  }

  // Bulk assign leads using round robin
  static async assignLeadsRoundRobin(leadIds: string[], advisorIds: string[]): Promise<void> {
    if (advisorIds.length === 0) {
      throw new Error('No advisors available for assignment');
    }

    const assignments = leadIds.map((leadId, index) => ({
      lead_id: leadId,
      assigned_to: advisorIds[index % advisorIds.length],
      assignment_method: 'round_robin' as const
    }));

    for (const assignment of assignments) {
      await this.assignLead(assignment);
    }
  }

  // Get lead statistics with demo data support
  static async getLeadStats(): Promise<{
    total: number;
    new_leads: number;
    contacted: number;
    qualified: number;
    converted: number;
    conversion_rate: number;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { total: 0, new_leads: 0, contacted: 0, qualified: 0, converted: 0, conversion_rate: 0 };
    }

    // Check if user has demo data access
    const hasDemoData = await DemoDataService.hasUserDemoData();
    console.log('Getting lead stats - user has demo data:', hasDemoData);
    
    const { data, error } = await supabase
      .from('leads')
      .select('status')
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to fetch lead stats: ${error.message}`);
    }

    console.log('User lead stats count:', data?.length || 0);

    // If user has demo data and no real data exists, return demo analytics
    if (hasDemoData && (!data || data.length === 0)) {
      console.log('Returning demo analytics');
      const demoAnalytics = DemoDataService.getDemoAnalytics();
      return {
        total: demoAnalytics.totalLeads,
        new_leads: demoAnalytics.newLeads,
        contacted: demoAnalytics.contactedLeads,
        qualified: demoAnalytics.qualifiedLeads,
        converted: demoAnalytics.convertedLeads,
        conversion_rate: demoAnalytics.conversionRate
      };
    }

    const stats = data.reduce((acc, lead) => {
      acc.total++;
      if (lead.status === 'new') acc.new_leads++;
      if (lead.status === 'contacted') acc.contacted++;
      if (lead.status === 'qualified') acc.qualified++;
      if (lead.status === 'converted') acc.converted++;
      return acc;
    }, {
      total: 0,
      new_leads: 0,
      contacted: 0,
      qualified: 0,
      converted: 0
    });

    return {
      ...stats,
      conversion_rate: stats.total > 0 ? (stats.converted / stats.total) * 100 : 0
    };
  }

  // Delete a lead (soft delete by updating status)
  static async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete lead: ${error.message}`);
    }
  }
}