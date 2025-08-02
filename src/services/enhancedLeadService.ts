import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadActivity, LeadFormData, LeadAssignmentRequest, LeadSearchFilters, LeadStatus } from '@/types/lead';
import { DemoDataService } from './demoDataService';

export interface EnhancedLeadFilters extends LeadSearchFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeadListResponse {
  leads: Lead[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BulkOperation {
  operation: 'assign' | 'status_change' | 'delete' | 'tag_add' | 'tag_remove';
  leadIds: string[];
  data?: any;
}

export class EnhancedLeadService {
  private static readonly DEFAULT_PAGE_SIZE = 50;
  private static readonly MAX_PAGE_SIZE = 100;

  // Enhanced lead fetching with server-side pagination, search, and filtering
  static async getLeads(
    page = 1,
    pageSize = this.DEFAULT_PAGE_SIZE,
    filters?: EnhancedLeadFilters
  ): Promise<LeadListResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return this.getEmptyResponse(page, pageSize);
    }

    // Check for demo data
    const hasDemoData = await DemoDataService.hasUserDemoData();
    const { data: userLeads, count: userLeadsCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Return demo data if applicable
    if (hasDemoData && (userLeadsCount === 0 || userLeadsCount === null)) {
      return this.getDemoDataResponse(page, pageSize, filters);
    }

    // Ensure page size doesn't exceed maximum
    const limitedPageSize = Math.min(pageSize, this.MAX_PAGE_SIZE);
    const offset = (page - 1) * limitedPageSize;

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // Apply search across multiple fields
    if (filters?.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
    }

    // Apply filters
    if (filters?.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }
    if (filters?.source && filters.source.length > 0) {
      query = query.in('source', filters.source);
    }
    if (filters?.priority && filters.priority.length > 0) {
      query = query.in('priority', filters.priority);
    }
    if (filters?.assigned_to && filters.assigned_to.length > 0) {
      query = query.in('assigned_to', filters.assigned_to);
    }
    if (filters?.program_interest && filters.program_interest.length > 0) {
      query = query.overlaps('program_interest', filters.program_interest);
    }
    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }
    if (filters?.date_range) {
      query = query
        .gte('created_at', filters.date_range.start.toISOString())
        .lte('created_at', filters.date_range.end.toISOString());
    }
    if (filters?.lead_score_range) {
      query = query
        .gte('lead_score', filters.lead_score_range.min)
        .lte('lead_score', filters.lead_score_range.max);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'created_at';
    const sortOrder = filters?.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limitedPageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch leads: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limitedPageSize);

    return {
      leads: (data as Lead[]) || [],
      total,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  // Get lead suggestions for search autocomplete
  static async getLeadSuggestions(query: string, limit = 10): Promise<Array<{
    id: string;
    name: string;
    email: string;
    type: 'name' | 'email';
  }>> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !query.trim()) {
      return [];
    }

    const searchTerm = query.trim();
    const { data, error } = await supabase
      .from('leads')
      .select('id, first_name, last_name, email')
      .eq('user_id', user.id)
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .limit(limit);

    if (error) {
      console.error('Failed to fetch suggestions:', error);
      return [];
    }

    return (data || []).map(lead => ({
      id: lead.id,
      name: `${lead.first_name} ${lead.last_name}`,
      email: lead.email,
      type: lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ? 'email' : 'name'
    }));
  }

  // Bulk operations for selected leads
  static async performBulkOperation(operation: BulkOperation): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };
    
    switch (operation.operation) {
      case 'assign':
        return this.bulkAssign(operation.leadIds, operation.data.advisorId, operation.data.assignmentMethod);
      
      case 'status_change':
        return this.bulkStatusChange(operation.leadIds, operation.data.status, operation.data.notes);
      
      case 'delete':
        return this.bulkDelete(operation.leadIds);
      
      case 'tag_add':
        return this.bulkTagOperation(operation.leadIds, operation.data.tags, 'add');
      
      case 'tag_remove':
        return this.bulkTagOperation(operation.leadIds, operation.data.tags, 'remove');
      
      default:
        throw new Error(`Unsupported bulk operation: ${operation.operation}`);
    }
  }

  // Export leads with current filters
  static async exportLeads(filters?: EnhancedLeadFilters, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    // Get all leads matching the filters (no pagination)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id);

    // Apply same filters as getLeads
    if (filters?.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
    }

    // ... apply other filters ...

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to export leads: ${error.message}`);
    }

    if (format === 'csv') {
      return this.generateCSV(data || []);
    } else {
      throw new Error('Excel export not implemented yet');
    }
  }

  // Get filter options for dropdowns
  static async getFilterOptions(): Promise<{
    sources: string[];
    statuses: string[];
    priorities: string[];
    assignees: Array<{ id: string; name: string }>;
    programs: string[];
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { sources: [], statuses: [], priorities: [], assignees: [], programs: [] };
    }

    // Get unique values from existing leads
    const { data, error } = await supabase
      .from('leads')
      .select('source, status, priority, assigned_to, program_interest')
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to fetch filter options:', error);
      return { sources: [], statuses: [], priorities: [], assignees: [], programs: [] };
    }

    const sources = [...new Set(data?.map(l => l.source).filter(Boolean))];
    const statuses = [...new Set(data?.map(l => l.status).filter(Boolean))];
    const priorities = [...new Set(data?.map(l => l.priority).filter(Boolean))];
    const assignees: Array<{ id: string; name: string }> = []; // TODO: Get from profiles
    const programs = [...new Set(data?.flatMap(l => l.program_interest || []).filter(Boolean))];

    return { sources, statuses, priorities, assignees, programs };
  }

  // Private helper methods
  private static getEmptyResponse(page: number, pageSize: number): LeadListResponse {
    return {
      leads: [],
      total: 0,
      currentPage: page,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false
    };
  }

  private static getDemoDataResponse(page: number, pageSize: number, filters?: EnhancedLeadFilters): LeadListResponse {
    let demoLeads = DemoDataService.getDemoLeads() as Lead[];

    // Apply client-side filtering for demo data
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      demoLeads = demoLeads.filter(lead =>
        `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm) ||
        (lead.phone && lead.phone.toLowerCase().includes(searchTerm))
      );
    }

    // Apply other filters...
    if (filters?.status && filters.status.length > 0) {
      demoLeads = demoLeads.filter(lead => filters.status!.includes(lead.status));
    }

    // Apply pagination
    const total = demoLeads.length;
    const totalPages = Math.ceil(total / pageSize);
    const offset = (page - 1) * pageSize;
    const paginatedLeads = demoLeads.slice(offset, offset + pageSize);

    return {
      leads: paginatedLeads,
      total,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  private static async bulkAssign(leadIds: string[], advisorId: string, assignmentMethod: string): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const leadId of leadIds) {
      try {
        await supabase
          .from('leads')
          .update({
            assigned_to: advisorId,
            assigned_at: new Date().toISOString(),
            assignment_method: assignmentMethod
          })
          .eq('id', leadId);
        
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to assign lead ${leadId}: ${error}`);
      }
    }

    return results;
  }

  private static async bulkStatusChange(leadIds: string[], status: LeadStatus, notes?: string): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const leadId of leadIds) {
      try {
        await supabase
          .from('leads')
          .update({ status })
          .eq('id', leadId);
        
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to update status for lead ${leadId}: ${error}`);
      }
    }

    return results;
  }

  private static async bulkDelete(leadIds: string[]): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const leadId of leadIds) {
      try {
        await supabase
          .from('leads')
          .delete()
          .eq('id', leadId);
        
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to delete lead ${leadId}: ${error}`);
      }
    }

    return results;
  }

  private static async bulkTagOperation(leadIds: string[], tags: string[], operation: 'add' | 'remove'): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const leadId of leadIds) {
      try {
        const { data: lead } = await supabase
          .from('leads')
          .select('tags')
          .eq('id', leadId)
          .single();

        if (lead) {
          const currentTags = lead.tags || [];
          let newTags: string[];

          if (operation === 'add') {
            newTags = [...new Set([...currentTags, ...tags])];
          } else {
            newTags = currentTags.filter(tag => !tags.includes(tag));
          }

          await supabase
            .from('leads')
            .update({ tags: newTags })
            .eq('id', leadId);
        }
        
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to update tags for lead ${leadId}: ${error}`);
      }
    }

    return results;
  }

  private static generateCSV(leads: Lead[]): Blob {
    const headers = [
      'First Name', 'Last Name', 'Email', 'Phone', 'Country', 'State', 'City',
      'Source', 'Status', 'Priority', 'Lead Score', 'Program Interest', 'Tags',
      'Created At', 'Updated At', 'Assigned To'
    ];

    const csvData = [
      headers.join(','),
      ...leads.map(lead => [
        lead.first_name,
        lead.last_name,
        lead.email,
        lead.phone || '',
        lead.country || '',
        lead.state || '',
        lead.city || '',
        lead.source,
        lead.status,
        lead.priority,
        lead.lead_score,
        (lead.program_interest || []).join(';'),
        (lead.tags || []).join(';'),
        new Date(lead.created_at).toISOString(),
        new Date(lead.updated_at).toISOString(),
        lead.assigned_to || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  }
}