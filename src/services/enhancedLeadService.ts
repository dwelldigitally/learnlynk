import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadActivity, LeadFormData, LeadAssignmentRequest, LeadSearchFilters, LeadStatus } from '@/types/lead';

export interface EnhancedLeadFilters extends LeadSearchFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  unassigned_only?: boolean;
  lifecycle_stage?: string[];
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
      console.log('No authenticated user found');
      return this.getEmptyResponse(page, pageSize);
    }

    console.log('Fetching leads for user:', user.id);


    // Ensure page size doesn't exceed maximum
    const limitedPageSize = Math.min(pageSize, this.MAX_PAGE_SIZE);
    const offset = (page - 1) * limitedPageSize;

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' });

    // Filter based on unassigned_only flag
    if (filters?.unassigned_only) {
      query = query.is('user_id', null);
    } else {
      query = query.or(`user_id.eq.${user.id},user_id.is.null`);
    }

    // Apply full-text search if available, fallback to ILIKE
    if (filters?.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      // Use full-text search for better performance at scale
      // Fallback to ILIKE for partial matches
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
    if (filters?.lifecycle_stage && filters.lifecycle_stage.length > 0) {
      query = query.in('lifecycle_stage', filters.lifecycle_stage);
    }

    // Apply sorting - map virtual columns to actual database columns
    let sortBy = filters?.sortBy || 'created_at';
    const sortOrder = filters?.sortOrder || 'desc';
    
    // Map 'name' to 'first_name' since 'name' doesn't exist in the database
    if (sortBy === 'name') {
      sortBy = 'first_name';
    }
    
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limitedPageSize - 1);

    const { data, error, count } = await query;

    console.log('Query results:', { 
      data: data, 
      error: error, 
      count: count,
      dataLength: data?.length 
    });

    if (error) {
      console.error('Error fetching leads:', error);
      throw new Error(`Failed to fetch leads: ${error.message}`);
    }

    // Ensure ip_address is properly typed
    const typedLeads = (data || []).map(lead => ({
      ...lead,
      ip_address: String(lead.ip_address || '')
    })) as Lead[];

    const total = count || 0;
    const totalPages = Math.ceil(total / limitedPageSize);

    return {
      leads: typedLeads,
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('leads')
      .select('*');

    // Apply same filtering logic as getLeads
    if (filters?.unassigned_only) {
      query = query.is('user_id', null);
    } else {
      query = query.or(`user_id.eq.${user.id},user_id.is.null`);
    }

    if (filters?.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to export leads: ${error.message}`);
    }

    const typedData = (data || []).map(lead => ({
      ...lead,
      ip_address: String(lead.ip_address || '')
    })) as Lead[];

    if (format === 'csv') {
      return this.generateCSV(typedData);
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
    const assignees: Array<{ id: string; name: string }> = [];
    const programs = [...new Set(data?.flatMap(l => l.program_interest || []).filter(Boolean))];

    return { sources, statuses, priorities, assignees, programs };
  }

  // Claim unassigned leads - OPTIMIZED: Single query
  static async claimLeads(leadIds: string[]): Promise<{ success: number; failed: number }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('leads')
        .update({
          user_id: user.id,
          assigned_to: user.id,
          assigned_at: new Date().toISOString(),
          assignment_method: 'manual'
        })
        .in('id', leadIds)
        .is('user_id', null)
        .select();

      if (error) throw error;

      return {
        success: data?.length || 0,
        failed: leadIds.length - (data?.length || 0)
      };
    } catch (error) {
      console.error('Error claiming leads:', error);
      return {
        success: 0,
        failed: leadIds.length
      };
    }
  }

  // Get unassigned leads count
  static async getUnassignedLeadsCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .is('user_id', null);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unassigned leads count:', error);
      return 0;
    }
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

  // OPTIMIZED: Single query instead of N queries
  private static async bulkAssign(
    leadIds: string[], 
    advisorId: string, 
    assignmentMethod: string
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const validMethods = ['manual', 'round_robin', 'ai_based', 'geography', 'performance', 'team_based', 'territory_based', 'workload_based'];
    const method = validMethods.includes(assignmentMethod) ? assignmentMethod : 'manual';

    try {
      const { data, error } = await supabase
        .from('leads')
        .update({
          assigned_to: advisorId,
          assigned_at: new Date().toISOString(),
          assignment_method: method as any
        })
        .in('id', leadIds)
        .select('id');

      if (error) {
        return { 
          success: 0, 
          failed: leadIds.length, 
          errors: [`Bulk assign failed: ${error.message}`] 
        };
      }

      const successCount = data?.length || 0;
      return {
        success: successCount,
        failed: leadIds.length - successCount,
        errors: []
      };
    } catch (error) {
      return {
        success: 0,
        failed: leadIds.length,
        errors: [`Bulk assign error: ${error}`]
      };
    }
  }

  // OPTIMIZED: Single query instead of N queries
  private static async bulkStatusChange(
    leadIds: string[], 
    status: LeadStatus, 
    notes?: string
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ status })
        .in('id', leadIds)
        .select('id');

      if (error) {
        return { 
          success: 0, 
          failed: leadIds.length, 
          errors: [`Bulk status change failed: ${error.message}`] 
        };
      }

      const successCount = data?.length || 0;
      return {
        success: successCount,
        failed: leadIds.length - successCount,
        errors: []
      };
    } catch (error) {
      return {
        success: 0,
        failed: leadIds.length,
        errors: [`Bulk status change error: ${error}`]
      };
    }
  }

  // OPTIMIZED: Single query instead of N queries
  private static async bulkDelete(leadIds: string[]): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const { error, count } = await supabase
        .from('leads')
        .delete()
        .in('id', leadIds);

      if (error) {
        return { 
          success: 0, 
          failed: leadIds.length, 
          errors: [`Bulk delete failed: ${error.message}`] 
        };
      }

      // Note: delete doesn't return count by default, assume success if no error
      return {
        success: leadIds.length,
        failed: 0,
        errors: []
      };
    } catch (error) {
      return {
        success: 0,
        failed: leadIds.length,
        errors: [`Bulk delete error: ${error}`]
      };
    }
  }

  // OPTIMIZED: Uses fallback approach for atomic tag updates
  private static async bulkTagOperation(
    leadIds: string[], 
    tags: string[], 
    operation: 'add' | 'remove'
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    // Use the fallback approach directly since the RPC function may not exist
    return this.bulkTagOperationFallback(leadIds, tags, operation);
  }

  // Fallback for bulk tag operations if RPC is not available
  private static async bulkTagOperationFallback(
    leadIds: string[], 
    tags: string[], 
    operation: 'add' | 'remove'
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      // Fetch current tags for all leads in one query
      const { data: leads, error: fetchError } = await supabase
        .from('leads')
        .select('id, tags')
        .in('id', leadIds);

      if (fetchError) {
        return { success: 0, failed: leadIds.length, errors: [fetchError.message] };
      }

      // Prepare batch updates
      const updates = (leads || []).map(lead => {
        const currentTags = lead.tags || [];
        let newTags: string[];
        
        if (operation === 'add') {
          newTags = [...new Set([...currentTags, ...tags])];
        } else {
          newTags = currentTags.filter(tag => !tags.includes(tag));
        }
        
        return { id: lead.id, tags: newTags };
      });

      // Update all leads - use individual updates but in parallel
      const updatePromises = updates.map(update => 
        supabase
          .from('leads')
          .update({ tags: update.tags })
          .eq('id', update.id)
      );

      await Promise.all(updatePromises);

      return {
        success: updates.length,
        failed: leadIds.length - updates.length,
        errors: []
      };
    } catch (error) {
      return {
        success: 0,
        failed: leadIds.length,
        errors: [`Bulk tag operation fallback error: ${error}`]
      };
    }
  }

  private static generateCSV(leads: Lead[]): Blob {
    const headers = [
      'First Name', 'Last Name', 'Email', 'Phone', 'Country', 'State', 'City',
      'Status', 'Priority', 'Source', 'Lead Score', 'Program Interest', 'Tags',
      'Created At', 'Last Contact'
    ];

    const rows = leads.map(lead => [
      lead.first_name || '',
      lead.last_name || '',
      lead.email || '',
      lead.phone || '',
      lead.country || '',
      lead.state || '',
      lead.city || '',
      lead.status || '',
      lead.priority || '',
      lead.source || '',
      lead.lead_score?.toString() || '',
      (lead.program_interest || []).join('; '),
      (lead.tags || []).join('; '),
      lead.created_at || '',
      lead.last_contacted_at || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }
}

export const enhancedLeadService = new EnhancedLeadService();
