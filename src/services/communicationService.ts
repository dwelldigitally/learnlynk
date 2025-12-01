import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Pagination constants
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

export interface PaginatedCommunicationsResponse {
  communications: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class CommunicationService {
  /**
   * Get all communications for the current user (with optional limit)
   */
  static async getCommunications(limit?: number) {
    let query = supabase
      .from('student_communications')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply limit if provided for backward compatibility
    if (limit) {
      query = query.limit(Math.min(limit, MAX_PAGE_SIZE));
    } else {
      // Default limit to prevent unbounded queries
      query = query.limit(DEFAULT_PAGE_SIZE);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching communications:', error);
      return [];
    }

    return (data || []).map(comm => ({
      id: comm.id,
      studentId: comm.student_id,
      type: comm.type,
      subject: comm.subject,
      content: comm.content,
      direction: comm.direction,
      status: comm.status,
      sentAt: comm.sent_at
    }));
  }

  /**
   * NEW: Get paginated communications
   */
  static async getCommunicationsPaginated(
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    filters?: {
      type?: string;
      status?: string;
      direction?: string;
      studentId?: string;
    }
  ): Promise<PaginatedCommunicationsResponse> {
    const limitedPageSize = Math.min(pageSize, MAX_PAGE_SIZE);
    const offset = (page - 1) * limitedPageSize;

    let query = supabase
      .from('student_communications')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.direction) {
      query = query.eq('direction', filters.direction);
    }
    if (filters?.studentId) {
      query = query.eq('student_id', filters.studentId);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitedPageSize - 1);

    if (error) {
      console.error('Error fetching paginated communications:', error);
      return {
        communications: [],
        total: 0,
        page,
        pageSize: limitedPageSize,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      };
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limitedPageSize);

    const communications = (data || []).map(comm => ({
      id: comm.id,
      studentId: comm.student_id,
      type: comm.type,
      subject: comm.subject,
      content: comm.content,
      direction: comm.direction,
      status: comm.status,
      sentAt: comm.sent_at
    }));

    return {
      communications,
      total,
      page,
      pageSize: limitedPageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  /**
   * Get communications for a specific student (with pagination)
   */
  static async getStudentCommunications(
    studentId: string,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE
  ) {
    const limitedPageSize = Math.min(pageSize, MAX_PAGE_SIZE);
    const offset = (page - 1) * limitedPageSize;

    const { data, error, count } = await supabase
      .from('student_communications')
      .select('*', { count: 'exact' })
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitedPageSize - 1);

    if (error) {
      console.error('Error fetching student communications:', error);
      return { data: [], total: 0 };
    }

    return { data: data || [], total: count || 0 };
  }

  /**
   * Create a new communication
   */
  static async createCommunication(communication: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('student_communications')
      .insert({
        ...communication,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating communication:', error);
      throw error;
    }

    return data;
  }

  /**
   * NEW: Bulk create communications (optimized for campaigns)
   */
  static async bulkCreateCommunications(communications: any[]): Promise<{ success: number; failed: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Add user_id to all communications
    const preparedCommunications = communications.map(comm => ({
      ...comm,
      user_id: user.id
    }));

    const { data, error } = await supabase
      .from('student_communications')
      .insert(preparedCommunications)
      .select('id');

    if (error) {
      console.error('Error bulk creating communications:', error);
      return { success: 0, failed: communications.length };
    }

    return {
      success: data?.length || 0,
      failed: communications.length - (data?.length || 0)
    };
  }

  /**
   * Update a communication
   */
  static async updateCommunication(id: string, communication: any) {
    const { data, error } = await supabase
      .from('student_communications')
      .update(communication)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating communication:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a communication
   */
  static async deleteCommunication(id: string) {
    const { error } = await supabase
      .from('student_communications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting communication:', error);
      throw error;
    }
  }

  /**
   * NEW: Bulk delete communications (optimized)
   */
  static async bulkDeleteCommunications(ids: string[]): Promise<{ success: number; failed: number }> {
    const { error } = await supabase
      .from('student_communications')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error bulk deleting communications:', error);
      return { success: 0, failed: ids.length };
    }

    return { success: ids.length, failed: 0 };
  }

  /**
   * Get communication statistics (optimized single query)
   */
  static async getCommunicationStats() {
    const { data: communications, error } = await supabase
      .from('student_communications')
      .select('type, status, direction');

    if (error) {
      console.error('Error fetching communication stats:', error);
      return {
        total: 0,
        sent: 0,
        scheduled: 0,
        byType: {}
      };
    }

    const total = communications?.length || 0;
    const sent = communications?.filter(c => c.status === 'sent').length || 0;
    const scheduled = communications?.filter(c => c.status === 'scheduled').length || 0;
    const byType = communications?.reduce((acc: any, comm: any) => {
      acc[comm.type] = (acc[comm.type] || 0) + 1;
      return acc;
    }, {}) || {};

    return {
      total,
      sent,
      scheduled,
      byType
    };
  }
}

/**
 * React hook to get communications
 */
export function useCommunications() {
  return useQuery({
    queryKey: ['communications'],
    queryFn: () => CommunicationService.getCommunications(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * NEW: React hook to get paginated communications
 */
export function useCommunicationsPaginated(
  page: number,
  pageSize: number,
  filters?: {
    type?: string;
    status?: string;
    direction?: string;
    studentId?: string;
  }
) {
  return useQuery({
    queryKey: ['communications', 'paginated', page, pageSize, filters],
    queryFn: () => CommunicationService.getCommunicationsPaginated(page, pageSize, filters),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * React hook to get communications for a specific student
 */
export function useStudentCommunications(studentId: string) {
  return useQuery({
    queryKey: ['communications', 'student', studentId],
    queryFn: () => CommunicationService.getStudentCommunications(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * React hook to get communication stats
 */
export function useCommunicationStats() {
  return useQuery({
    queryKey: ['communications', 'stats'],
    queryFn: () => CommunicationService.getCommunicationStats(),
    staleTime: 5 * 60 * 1000,
  });
}
