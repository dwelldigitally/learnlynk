import { supabase } from '@/integrations/supabase/client';

export interface ApplicationData {
  id?: string;
  user_id?: string;
  student_id?: string;
  application_number?: string;
  program_id?: string | null;
  program_name?: string; // For backward compatibility
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  stage: 'personal_info' | 'education' | 'work_experience' | 'essays' | 'questions' | 'documents' | 'payment' | 'review';
  progress: number | null;
  documents?: any;
  requirements?: any;
  application_data?: Record<string, any>; // For storing step data
  application_deadline?: string | null;
  submission_date?: string | null;
  next_step?: string | null;
  acceptance_likelihood?: number | null;
  estimated_decision?: string | null;
  created_at?: string;
  updated_at?: string;
}

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

  /**
   * Create a new application
   */
  static async createApplication(applicationData: ApplicationData) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('student_applications')
      .insert({
        user_id: user.id,
        student_id: user.id,
        application_number: `APP-${Date.now()}`,
        program_id: applicationData.program_id,
        status: applicationData.status,
        stage: applicationData.stage,
        progress: applicationData.progress || 0,
        documents: applicationData.application_data || {},
        requirements: applicationData.requirements || {}
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  }

  /**
   * Update an existing application
   */
  static async updateApplication(applicationId: string, applicationData: ApplicationData) {
    const { error } = await supabase
      .from('student_applications')
      .update({
        program_id: applicationData.program_id,
        status: applicationData.status,
        stage: applicationData.stage,
        progress: applicationData.progress,
        documents: applicationData.application_data,
        requirements: applicationData.requirements,
        submission_date: applicationData.submission_date,
        next_step: applicationData.next_step
      })
      .eq('id', applicationId);

    if (error) {
      throw new Error(`Failed to update application: ${error.message}`);
    }

    return true;
  }

  /**
   * Auto-save application (same as update but silent)
   */
  static async autoSaveApplication(applicationId: string, applicationData: ApplicationData) {
    return this.updateApplication(applicationId, applicationData);
  }
}