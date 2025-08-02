import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export class CommunicationService {
  /**
   * Get all communications for the current user
   */
  static async getCommunications() {
    const { data, error } = await supabase
      .from('student_communications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching communications:', error);
      return [];
    }

    // Transform database format to match demo data format
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
   * Get communications for a specific student
   */
  static async getStudentCommunications(studentId: string) {
    const { data, error } = await supabase
      .from('student_communications')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching student communications:', error);
      return [];
    }

    return data || [];
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
   * Get communication statistics
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