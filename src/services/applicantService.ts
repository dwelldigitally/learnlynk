import { supabase } from "@/integrations/supabase/client";
import { Applicant, ApplicantFormData, ApplicantSearchFilters } from "@/types/applicant";
import { MasterRecordService } from "./masterRecordService";

export class ApplicantService {
  static async createApplicant(data: ApplicantFormData): Promise<Applicant> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data: result, error } = await supabase
      .from('applicants')
      .insert([{
        ...data,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;

    // Update master record stage to applicant
    await MasterRecordService.transitionStage({
      master_record_id: data.master_record_id,
      to_stage: 'applicant',
      to_substage: 'application_started',
      transition_reason: 'Application started'
    });

    return result as Applicant;
  }

  static async createSampleApplicant(): Promise<Applicant> {
    // Create a sample master record first
    const master = await MasterRecordService.createMasterRecord({
      first_name: 'Alex',
      last_name: 'Johnson',
      email: `alex.johnson.${Date.now()}@example.com`,
      phone: '555-123-4567',
      source: 'direct',
      current_stage: 'lead'
    });

    // Create the applicant pointing to the master record
    const applicant = await this.createApplicant({
      master_record_id: master.id,
      application_type: 'direct_enrollment' as any,
      program: 'HCA',
      payment_amount: 100,
      priority: 'medium',
      notes: 'Sample applicant auto-created for demo'
    });

    // Add a couple of submitted documents to better demo the UI
    const updated = await this.updateApplicant(applicant.id, {
      documents_submitted: ['ID_Document.pdf', 'Transcript.pdf'] as any
    });

    return updated;
  }

  static async getApplicants(filters?: ApplicantSearchFilters, page = 1, limit = 50): Promise<{ applicants: Applicant[]; total: number }> {
    let query = supabase
      .from('applicants')
      .select('*, master_records!inner(*)', { count: 'exact' });

    // Apply filters
    if (filters?.substage && filters.substage.length > 0) {
      query = query.in('substage', filters.substage);
    }

    if (filters?.application_type && filters.application_type.length > 0) {
      query = query.in('application_type', filters.application_type);
    }

    if (filters?.payment_status && filters.payment_status.length > 0) {
      query = query.in('payment_status', filters.payment_status);
    }

    if (filters?.decision && filters.decision.length > 0) {
      query = query.in('decision', filters.decision);
    }

    if (filters?.priority && filters.priority.length > 0) {
      query = query.in('priority', filters.priority);
    }

    if (filters?.assigned_to && filters.assigned_to.length > 0) {
      query = query.in('assigned_to', filters.assigned_to);
    }

    if (filters?.program && filters.program.length > 0) {
      query = query.in('program', filters.program);
    }

    if (filters?.date_range) {
      query = query
        .gte('created_at', filters.date_range.start.toISOString())
        .lte('created_at', filters.date_range.end.toISOString());
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      applicants: (data || []) as Applicant[],
      total: count || 0
    };
  }

  static async getApplicantById(id: string): Promise<Applicant | null> {
    const { data, error } = await supabase
      .from('applicants')
      .select('*, master_records!inner(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Applicant;
  }

  static async updateApplicant(id: string, updates: Partial<Applicant>): Promise<Applicant> {
    const { data, error } = await supabase
      .from('applicants')
      .update(updates)
      .eq('id', id)
      .select('*, master_records!inner(*)')
      .single();

    if (error) throw error;
    return data as Applicant;
  }

  static async updateApplicantSubstage(id: string, substage: string, notes?: string): Promise<Applicant> {
    const applicant = await this.getApplicantById(id);
    if (!applicant) throw new Error('Applicant not found');

    // Update applicant substage
    const updatedApplicant = await this.updateApplicant(id, { substage: substage as any });

    // Update master record substage
    await MasterRecordService.updateMasterRecord(applicant.master_record_id, {
      current_substage: substage as any
    });

    return updatedApplicant;
  }

  static async approveApplicant(id: string, notes?: string): Promise<void> {
    const applicant = await this.getApplicantById(id);
    if (!applicant) throw new Error('Applicant not found');

    // Update applicant decision
    await this.updateApplicant(id, {
      decision: 'approved',
      decision_date: new Date().toISOString(),
      decision_notes: notes,
      substage: 'approved'
    });

    // Transition to student stage
    await MasterRecordService.transitionStage({
      master_record_id: applicant.master_record_id,
      to_stage: 'student',
      to_substage: 'enrolled',
      transition_reason: notes || 'Application approved'
    });
  }

  static async rejectApplicant(id: string, notes?: string): Promise<void> {
    await this.updateApplicant(id, {
      decision: 'rejected',
      decision_date: new Date().toISOString(),
      decision_notes: notes,
      substage: 'rejected'
    });
  }

  static async getApplicantStats(): Promise<{
    total: number;
    by_substage: Record<string, number>;
    by_decision: Record<string, number>;
    by_payment_status: Record<string, number>;
  }> {
    const { data, error } = await supabase
      .from('applicants')
      .select('substage, decision, payment_status');

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      by_substage: {} as Record<string, number>,
      by_decision: {} as Record<string, number>,
      by_payment_status: {} as Record<string, number>
    };

    data?.forEach(applicant => {
      // Count by substage
      stats.by_substage[applicant.substage] = (stats.by_substage[applicant.substage] || 0) + 1;
      
      // Count by decision
      if (applicant.decision) {
        stats.by_decision[applicant.decision] = (stats.by_decision[applicant.decision] || 0) + 1;
      }
      
      // Count by payment status
      stats.by_payment_status[applicant.payment_status] = (stats.by_payment_status[applicant.payment_status] || 0) + 1;
    });

    return stats;
  }

  static async deleteApplicant(id: string): Promise<void> {
    const { error } = await supabase
      .from('applicants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}