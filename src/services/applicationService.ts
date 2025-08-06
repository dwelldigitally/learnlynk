import { supabase } from '@/integrations/supabase/client';

export class ApplicationService {
  /**
   * Add dummy applications for the current user
   */
  static async addDummyApplications() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const dummyApplications = [
      {
        user_id: user.id,
        student_name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0123',
        program: 'Health Care Assistant',
        status: 'under-review',
        priority: 'high',
        progress: 75,
        advisor_assigned: 'Dr. Smith',
        documents_submitted: ['transcript.pdf', 'id_copy.pdf'],
        notes: 'Strong academic background, excellent references'
      },
      {
        user_id: user.id,
        student_name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1-555-0124',
        program: 'Medical Assistant',
        status: 'submitted',
        priority: 'medium',
        progress: 25,
        advisor_assigned: null,
        documents_submitted: ['application_form.pdf'],
        notes: 'Waiting for transcript submission'
      },
      {
        user_id: user.id,
        student_name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '+1-555-0125',
        program: 'Healthcare Management',
        status: 'approved',
        priority: 'low',
        progress: 100,
        advisor_assigned: 'Prof. Johnson',
        documents_submitted: ['transcript.pdf', 'id_copy.pdf', 'references.pdf'],
        notes: 'Application approved - excellent candidate'
      },
      {
        user_id: user.id,
        student_name: 'David Kim',
        email: 'david.kim@email.com',
        phone: '+1-555-0126',
        program: 'Pharmacy Technician',
        status: 'pending-documents',
        priority: 'high',
        progress: 50,
        advisor_assigned: 'Dr. Wilson',
        documents_submitted: ['application_form.pdf', 'id_copy.pdf'],
        notes: 'Missing official transcript - urgent follow-up needed'
      },
      {
        user_id: user.id,
        student_name: 'Jessica Brown',
        email: 'jessica.brown@email.com',
        phone: '+1-555-0127',
        program: 'Dental Assistant',
        status: 'rejected',
        priority: 'low',
        progress: 100,
        advisor_assigned: 'Dr. Martinez',
        documents_submitted: ['application_form.pdf', 'transcript.pdf'],
        notes: 'Did not meet minimum GPA requirements'
      }
    ];

    const { data, error } = await supabase
      .from('applications')
      .insert(dummyApplications)
      .select();

    if (error) {
      throw new Error(`Failed to add dummy applications: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all applications for the current user
   */
  static async getApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Delete all applications for the current user (for testing)
   */
  static async clearApplications() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      throw new Error(`Failed to clear applications: ${error.message}`);
    }

    return true;
  }
}