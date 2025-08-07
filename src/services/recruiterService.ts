import { supabase } from "@/integrations/supabase/client";
import type { RecruiterCompany, RecruiterUser, RecruiterApplication, RecruiterCommunication, RecruiterDocument, StudentApplicationFormData } from "@/types/recruiter";

export class RecruiterService {
  // Recruiter Company Management
  static async getRecruiterCompanies(): Promise<RecruiterCompany[]> {
    const { data, error } = await supabase
      .from('recruiter_companies')
      .select('*')
      .order('name');

    if (error) throw error;
    return (data || []) as RecruiterCompany[];
  }

  static async createRecruiterCompany(company: Partial<RecruiterCompany>): Promise<RecruiterCompany> {
    const { data, error } = await supabase
      .from('recruiter_companies')
      .insert(company as any)
      .select()
      .single();

    if (error) throw error;
    return data as RecruiterCompany;
  }

  static async updateRecruiterCompany(id: string, updates: Partial<RecruiterCompany>): Promise<RecruiterCompany> {
    const { data, error } = await supabase
      .from('recruiter_companies')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as RecruiterCompany;
  }

  // Recruiter User Management
  static async getRecruiterUsers(): Promise<RecruiterUser[]> {
    const { data, error } = await supabase
      .from('recruiter_users')
      .select(`
        *,
        company:recruiter_companies(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as RecruiterUser[];
  }

  static async getRecruiterProfile(): Promise<RecruiterUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('recruiter_users')
      .select(`
        *,
        company:recruiter_companies(*)
      `)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as RecruiterUser | null;
  }

  static async createRecruiterUser(userData: Partial<RecruiterUser>): Promise<RecruiterUser> {
    const { data, error } = await supabase
      .from('recruiter_users')
      .insert(userData as any)
      .select(`
        *,
        company:recruiter_companies(*)
      `)
      .single();

    if (error) throw error;
    return data as RecruiterUser;
  }

  // Recruiter Applications
  static async getRecruiterApplications(recruiterId?: string): Promise<RecruiterApplication[]> {
    let query = supabase
      .from('recruiter_applications')
      .select(`
        *,
        recruiter:recruiter_users(*),
        company:recruiter_companies(*)
      `)
      .order('submitted_at', { ascending: false });

    if (recruiterId) {
      query = query.eq('recruiter_id', recruiterId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as RecruiterApplication[];
  }

  static async getRecruiterApplication(id: string): Promise<RecruiterApplication> {
    const { data, error } = await supabase
      .from('recruiter_applications')
      .select(`
        *,
        recruiter:recruiter_users(*),
        company:recruiter_companies(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as RecruiterApplication;
  }

  static async createRecruiterApplication(formData: StudentApplicationFormData): Promise<RecruiterApplication> {
    const recruiterProfile = await this.getRecruiterProfile();
    if (!recruiterProfile) throw new Error('Recruiter profile not found');

    // Create the application record
    const { data: application, error } = await supabase
      .from('recruiter_applications')
      .insert({
        recruiter_id: recruiterProfile.id,
        company_id: recruiterProfile.company_id,
        program: formData.program,
        intake_date: formData.intake_date,
        notes_to_registrar: formData.notes_to_registrar,
      })
      .select(`
        *,
        recruiter:recruiter_users(*),
        company:recruiter_companies(*)
      `)
      .single();

    if (error) throw error;

    // Create student record if needed
    if (formData.first_name && formData.last_name && formData.email) {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          program: formData.program,
          stage: 'application',
          recruiter_id: recruiterProfile.id,
          recruiter_company_id: recruiterProfile.company_id,
          student_id: 'AUTO_GENERATED',
          user_id: 'TBD'
        } as any)
        .select()
        .single();

      if (!studentError && student) {
        // Link the application to the student
        await supabase
          .from('recruiter_applications')
          .update({ student_id: student.id })
          .eq('id', application.id);
      }
    }

    return application as RecruiterApplication;
  }

  static async updateRecruiterApplicationStatus(
    id: string, 
    status: RecruiterApplication['status'],
    feedback?: string
  ): Promise<RecruiterApplication> {
    const updates: any = { status };
    
    if (status === 'approved') {
      updates.approved_at = new Date().toISOString();
    }
    if (status === 'in_review') {
      updates.reviewed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('recruiter_applications')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        recruiter:recruiter_users(*),
        company:recruiter_companies(*)
      `)
      .single();

    if (error) throw error;

    // Add communication if feedback provided
    if (feedback) {
      await this.createCommunication(id, 'internal', feedback);
    }

    return data as RecruiterApplication;
  }

  // Communications
  static async getCommunications(applicationId: string): Promise<RecruiterCommunication[]> {
    const { data, error } = await supabase
      .from('recruiter_communications')
      .select('*')
      .eq('recruiter_application_id', applicationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as RecruiterCommunication[];
  }

  static async createCommunication(
    applicationId: string,
    senderType: 'recruiter' | 'internal',
    message: string
  ): Promise<RecruiterCommunication> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('recruiter_communications')
      .insert({
        recruiter_application_id: applicationId,
        sender_type: senderType,
        sender_id: user.id,
        message,
      })
      .select()
      .single();

    if (error) throw error;
    return data as RecruiterCommunication;
  }

  // Documents
  static async getApplicationDocuments(applicationId: string): Promise<RecruiterDocument[]> {
    const { data, error } = await supabase
      .from('recruiter_documents')
      .select('*')
      .eq('recruiter_application_id', applicationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as RecruiterDocument[];
  }

  static async uploadDocument(
    applicationId: string,
    file: File,
    documentType: string
  ): Promise<RecruiterDocument> {
    const recruiterProfile = await this.getRecruiterProfile();
    if (!recruiterProfile) throw new Error('Recruiter profile not found');

    // For now, we'll store document metadata without actual file upload
    // File upload would require storage bucket setup
    const { data, error } = await supabase
      .from('recruiter_documents')
      .insert({
        recruiter_application_id: applicationId,
        uploaded_by: recruiterProfile.id,
        document_name: file.name,
        document_type: documentType,
        file_size: file.size,
      })
      .select()
      .single();

    if (error) throw error;
    return data as RecruiterDocument;
  }

  static async updateDocumentStatus(
    id: string,
    status: 'approved' | 'rejected',
    feedback?: string
  ): Promise<RecruiterDocument> {
    const { data, error } = await supabase
      .from('recruiter_documents')
      .update({ status, feedback })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as RecruiterDocument;
  }

  // Analytics
  static async getRecruiterStats(recruiterId?: string) {
    let applicationsQuery = supabase
      .from('recruiter_applications')
      .select('status, commission_amount');

    if (recruiterId) {
      applicationsQuery = applicationsQuery.eq('recruiter_id', recruiterId);
    }

    const { data: applications, error } = await applicationsQuery;
    if (error) throw error;

    const stats = {
      totalApplications: applications?.length || 0,
      approvedApplications: applications?.filter(app => app.status === 'approved').length || 0,
      pendingApplications: applications?.filter(app => app.status === 'submitted' || app.status === 'in_review').length || 0,
      rejectedApplications: applications?.filter(app => app.status === 'rejected').length || 0,
      commissionOwed: applications?.reduce((sum, app) => sum + (app.commission_amount || 0), 0) || 0,
    };

    return stats;
  }
}