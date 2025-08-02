import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export class ScholarshipService {
  /**
   * Get all scholarship applications for the current user
   */
  static async getScholarshipApplications() {
    const { data, error } = await supabase
      .from('scholarship_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scholarship applications:', error);
      return [];
    }

    // Transform database format to match demo data format
    return (data || []).map(app => ({
      id: app.id,
      studentName: app.student_name,
      scholarshipName: app.scholarship_name,
      scholarshipType: app.scholarship_type,
      amount: app.amount,
      applicationDate: app.application_date,
      deadline: app.deadline,
      status: app.status,
      eligibilityScore: app.eligibility_score,
      documentsSubmitted: app.documents_submitted
    }));
  }

  /**
   * Create a new scholarship application
   */
  static async createScholarshipApplication(application: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('scholarship_applications')
      .insert({
        ...application,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating scholarship application:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update a scholarship application
   */
  static async updateScholarshipApplication(id: string, application: any) {
    const { data, error } = await supabase
      .from('scholarship_applications')
      .update(application)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating scholarship application:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a scholarship application
   */
  static async deleteScholarshipApplication(id: string) {
    const { error } = await supabase
      .from('scholarship_applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting scholarship application:', error);
      throw error;
    }
  }

  /**
   * Get scholarship statistics
   */
  static async getScholarshipStats() {
    const { data: applications, error } = await supabase
      .from('scholarship_applications')
      .select('status, amount');

    if (error) {
      console.error('Error fetching scholarship stats:', error);
      return {
        total: 0,
        totalAmount: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      };
    }

    const total = applications?.length || 0;
    const totalAmount = applications?.reduce((sum, app) => sum + (app.amount || 0), 0) || 0;
    const pending = applications?.filter(a => a.status === 'submitted').length || 0;
    const approved = applications?.filter(a => a.status === 'approved').length || 0;
    const rejected = applications?.filter(a => a.status === 'rejected').length || 0;

    return {
      total,
      totalAmount,
      pending,
      approved,
      rejected
    };
  }
}

/**
 * React hook to get scholarship applications
 */
export function useScholarshipApplications() {
  return useQuery({
    queryKey: ['scholarship-applications'],
    queryFn: () => ScholarshipService.getScholarshipApplications(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * React hook to get scholarship stats
 */
export function useScholarshipStats() {
  return useQuery({
    queryKey: ['scholarship-applications', 'stats'],
    queryFn: () => ScholarshipService.getScholarshipStats(),
    staleTime: 5 * 60 * 1000,
  });
}