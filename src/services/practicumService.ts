import { supabase } from "@/integrations/supabase/client";
import { supabaseWrapper } from "./supabaseWrapper";
import type {
  PracticumSite,
  PracticumProgram,
  PracticumJourney,
  PracticumAssignment,
  PracticumRecord,
  PracticumEvaluation,
  PracticumCompetency,
  PracticumUserRole,
  PracticumSiteInsert,
  PracticumProgramInsert,
  PracticumJourneyInsert,
  PracticumAssignmentInsert,
  PracticumRecordInsert,
  PracticumOverview,
  StudentProgress,
  PracticumFilters
} from "@/types/practicum";

export class PracticumService {
  // Site Management
  static async createSite(siteData: PracticumSiteInsert): Promise<PracticumSite> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_sites')
        .insert(siteData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  }

  static async getSites(userId: string): Promise<PracticumSite[]> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_sites')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    });
  }

  static async updateSite(id: string, updates: Partial<PracticumSiteInsert>): Promise<PracticumSite> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_sites')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  }

  // Program Management
  static async createProgram(programData: PracticumProgramInsert): Promise<PracticumProgram> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_programs')
        .insert(programData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  }

  static async getPrograms(userId: string): Promise<PracticumProgram[]> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_programs')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('program_name');
      
      if (error) throw error;
      return data || [];
    });
  }

  // Journey Management
  static async createJourney(journeyData: PracticumJourneyInsert): Promise<PracticumJourney> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_journeys')
        .insert(journeyData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  }

  static async getJourneys(userId: string): Promise<PracticumJourney[]> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_journeys')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('journey_name');
      
      if (error) throw error;
      return data || [];
    });
  }

  // Assignment Management
  static async createAssignment(assignmentData: PracticumAssignmentInsert): Promise<PracticumAssignment> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_assignments')
        .insert(assignmentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  }

  static async getAssignments(userId: string, filters?: PracticumFilters): Promise<PracticumAssignment[]> {
    return supabaseWrapper.withRetry(async () => {
      let query = supabase
        .from('practicum_assignments')
        .select(`
          *,
          practicum_sites(name, address, city, state),
          practicum_programs(program_name),
          leads(first_name, last_name, email)
        `)
        .eq('user_id', userId);

      if (filters?.program_id) {
        query = query.eq('program_id', filters.program_id);
      }
      if (filters?.site_id) {
        query = query.eq('site_id', filters.site_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    });
  }

  // Dashboard Overview
  static async getDashboardOverview(userId: string): Promise<PracticumOverview> {
    return supabaseWrapper.withRetry(async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Get assignments ready to end (end_date within 2 weeks)
      const { data: readyToEnd, error: endError } = await supabase
        .from('practicum_assignments')
        .select(`
          *,
          leads(first_name, last_name),
          practicum_sites(name),
          practicum_programs(program_name)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('end_date', today)
        .lte('end_date', new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Get assignments ready to begin (start_date within 1 week)
      const { data: readyToBegin, error: beginError } = await supabase
        .from('practicum_assignments')
        .select(`
          *,
          leads(first_name, last_name),
          practicum_sites(name),
          practicum_programs(program_name)
        `)
        .eq('user_id', userId)
        .eq('status', 'assigned')
        .gte('start_date', today)
        .lte('start_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Get pending approvals
      const { data: pendingApprovals, error: approvalsError } = await supabase
        .from('practicum_records')
        .select(`
          *,
          practicum_assignments!inner(
            user_id,
            leads(first_name, last_name),
            practicum_sites(name)
          )
        `)
        .eq('practicum_assignments.user_id', userId)
        .in('final_status', ['pending', 'preceptor_approved']);

      if (endError || beginError || approvalsError) {
        throw endError || beginError || approvalsError;
      }

      return {
        ready_to_end: readyToEnd || [],
        ready_to_begin: readyToBegin || [],
        missing_documents: [], // TODO: Implement document tracking
        delayed_students: [], // TODO: Implement delay tracking
        pending_approvals: pendingApprovals || []
      };
    });
  }

  // Record Management
  static async createRecord(recordData: PracticumRecordInsert): Promise<PracticumRecord> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_records')
        .insert(recordData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  }

  static async approveRecord(
    recordId: string, 
    approverType: 'preceptor' | 'admin', 
    approverId: string, 
    feedback?: string
  ): Promise<PracticumRecord> {
    return supabaseWrapper.withRetry(async () => {
      const updates: any = { instructor_feedback: feedback };
      
      if (approverType === 'preceptor') {
        updates.preceptor_approved_at = new Date().toISOString();
        updates.preceptor_approved_by = approverId;
        updates.final_status = 'preceptor_approved';
      } else {
        updates.instructor_approved_at = new Date().toISOString();
        updates.instructor_approved_by = approverId;
        updates.final_status = 'instructor_approved';
      }

      const { data, error } = await supabase
        .from('practicum_records')
        .update(updates)
        .eq('id', recordId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  }

  // Student Progress Tracking
  static async getStudentProgress(assignmentId: string): Promise<StudentProgress | null> {
    return supabaseWrapper.withRetry(async () => {
      const { data: assignment, error } = await supabase
        .from('practicum_assignments')
        .select(`
          *,
          leads(first_name, last_name),
          practicum_sites(name),
          practicum_programs(program_name, total_hours_required)
        `)
        .eq('id', assignmentId)
        .single();

      if (error) throw error;
      if (!assignment) return null;

      // Get approved hours
      const { data: records } = await supabase
        .from('practicum_records')
        .select('hours_submitted')
        .eq('assignment_id', assignmentId)
        .eq('final_status', 'instructor_approved');

      const hoursApproved = records?.reduce((sum, record) => sum + (record.hours_submitted || 0), 0) || 0;

      // Get submitted hours
      const { data: allRecords } = await supabase
        .from('practicum_records')
        .select('hours_submitted')
        .eq('assignment_id', assignmentId)
        .in('final_status', ['pending', 'preceptor_approved', 'instructor_approved']);

      const hoursSubmitted = allRecords?.reduce((sum, record) => sum + (record.hours_submitted || 0), 0) || 0;

      // Get competency progress
      const { data: competencies } = await supabase
        .from('practicum_competencies')
        .select('*')
        .eq('program_id', assignment.program_id);

      const competenciesCompleted = competencies?.filter(c => c.is_required).length || 0;
      const competenciesRequired = competencies?.length || 0;

      const totalHours = assignment.hours_approved || 0;
      const overallProgress = Math.min(100, totalHours > 0 ? (hoursApproved / totalHours) * 100 : 0);

      return {
        assignment_id: assignmentId,
        student_name: `${assignment.leads?.first_name} ${assignment.leads?.last_name}`,
        program_name: assignment.practicum_programs?.program_name || '',
        site_name: assignment.practicum_sites?.name || '',
        hours_submitted: hoursSubmitted,
        hours_approved: hoursApproved,
        hours_required: totalHours,
        competencies_completed: competenciesCompleted,
        competencies_required: competenciesRequired,
        forms_pending: 0, // TODO: Calculate pending forms
        overall_progress: overallProgress,
        status: assignment.status
      };
    });
  }

  // User Role Management
  static async createUserRole(roleData: Omit<PracticumUserRole, 'id' | 'created_at' | 'updated_at'>): Promise<PracticumUserRole> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_user_roles')
        .insert(roleData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  }

  static async getUserRoles(userId: string): Promise<PracticumUserRole[]> {
    return supabaseWrapper.withRetry(async () => {
      const { data, error } = await supabase
        .from('practicum_user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    });
  }
}