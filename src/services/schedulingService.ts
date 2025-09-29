import { supabase } from "@/integrations/supabase/client";
import { 
  StudentBatch, 
  BatchStudent, 
  SchedulingSession, 
  SiteCapacityTracking, 
  SmartAssignmentSuggestion,
  SiteSuggestion,
  BatchAssignmentRequest,
  SchedulingConflict
} from "@/types/scheduling";
import { PracticumAssignment, PracticumSite, PracticumProgram } from "@/types/practicum";

interface PracticumAssignmentWithRelations extends PracticumAssignment {
  leads?: { first_name: string; last_name: string };
  practicum_programs?: { id: string; program_name: string };
  practicum_sites?: { name: string };
}

export class SchedulingService {
  
  // Batch Management
  static async createBatch(batchData: Omit<StudentBatch, 'id' | 'created_at' | 'updated_at'>): Promise<StudentBatch> {
    const { data, error } = await supabase
      .from('student_batches')
      .insert(batchData)
      .select()
      .single();

    if (error) throw error;
    return data as StudentBatch;
  }

  static async getBatches(userId: string): Promise<StudentBatch[]> {
    const { data, error } = await supabase
      .from('student_batches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as StudentBatch[];
  }

  static async addStudentsToBatch(batchId: string, assignmentIds: string[]): Promise<void> {
    const batchStudents = assignmentIds.map(assignmentId => ({
      batch_id: batchId,
      assignment_id: assignmentId
    }));

    const { error } = await supabase
      .from('batch_students')
      .insert(batchStudents);

    if (error) throw error;
  }

  static async getBatchStudents(batchId: string): Promise<PracticumAssignmentWithRelations[]> {
    const { data, error } = await supabase
      .from('batch_students')
      .select(`
        practicum_assignments!inner (
          *,
          leads (first_name, last_name),
          practicum_programs (id, program_name),
          practicum_sites (name)
        )
      `)
      .eq('batch_id', batchId);

    if (error) throw error;
    return data?.map((item: any) => item.practicum_assignments) || [];
  }

  // Site Capacity Management
  static async getSiteCapacity(userId: string): Promise<SiteCapacityTracking[]> {
    const { data, error } = await supabase
      .from('site_capacity_tracking')
      .select(`
        *,
        practicum_sites!inner (
          user_id,
          name,
          specializations
        ),
        practicum_programs (program_name)
      `)
      .eq('practicum_sites.user_id', userId)
      .gte('period_end', new Date().toISOString().split('T')[0]);

    if (error) throw error;
    return data || [];
  }

  static async updateSiteCapacity(
    siteId: string, 
    programId: string, 
    newAssignments: number
  ): Promise<void> {
    const { error } = await supabase
      .from('site_capacity_tracking')
      .update({ current_assignments: newAssignments })
      .eq('site_id', siteId)
      .eq('program_id', programId);

    if (error) throw error;
  }

  // Smart Assignment Algorithm
  static async generateSmartAssignments(batchId: string): Promise<SmartAssignmentSuggestion[]> {
    // Get batch students
    const students = await this.getBatchStudents(batchId);
    
    // Get available sites with capacity
    const { data: capacityData, error: capacityError } = await supabase
      .from('site_capacity_tracking')
      .select(`
        *,
        practicum_sites!inner (
          id,
          name,
          specializations,
          latitude,
          longitude,
          address
        ),
        practicum_programs (
          id,
          program_name
        )
      `)
      .gt('available_spots', 0);

    if (capacityError) throw capacityError;

    const suggestions: SmartAssignmentSuggestion[] = [];

    for (const student of students) {
      if (!student.practicum_programs?.id) continue;

      const eligibleSites = capacityData?.filter(capacity => 
        capacity.practicum_programs?.id === student.practicum_programs?.id
      ) || [];

      const siteSuggestions: SiteSuggestion[] = eligibleSites.map(capacity => {
        const site = capacity.practicum_sites;
        
        // Calculate scores
        const programMatchScore = 100; // Perfect match since we filtered by program
        const capacityScore = Math.min(100, (capacity.available_spots / capacity.max_capacity) * 100);
        
        // Specialization bonus
        let specializationBonus = 0;
        if (site?.specializations && Array.isArray(site.specializations)) {
          specializationBonus = site.specializations.length > 0 ? 20 : 0;
        }

        const overallScore = (programMatchScore + capacityScore + specializationBonus) / 3;

        const reasoning = [
          `Program eligibility: ${student.practicum_programs?.program_name || 'Unknown'}`,
          `Available spots: ${capacity.available_spots}/${capacity.max_capacity}`,
          ...(specializationBonus > 0 ? [`Specialized programs available`] : [])
        ];

        return {
          site_id: capacity.site_id,
          site_name: site?.name || 'Unknown Site',
          program_match_score: programMatchScore,
          capacity_score: capacityScore,
          overall_score: overallScore,
          available_spots: capacity.available_spots,
          max_capacity: capacity.max_capacity,
          specializations: site?.specializations || [],
          reasoning
        };
      });

      // Sort by overall score
      siteSuggestions.sort((a, b) => b.overall_score - a.overall_score);

      suggestions.push({
        assignment_id: student.id,
        student_name: `${student.leads?.first_name || ''} ${student.leads?.last_name || ''}`.trim(),
        program_name: student.practicum_programs?.program_name || 'Unknown Program',
        suggested_sites: siteSuggestions.slice(0, 3), // Top 3 suggestions
        confidence_score: siteSuggestions[0]?.overall_score || 0,
        reasoning: [
          `Student enrolled in ${student.practicum_programs?.program_name || 'Unknown Program'}`,
          `Found ${siteSuggestions.length} eligible sites`,
          `Top recommendation: ${siteSuggestions[0]?.site_name || 'None available'}`
        ]
      });
    }

    return suggestions;
  }

  // Batch Assignment
  static async executeBatchAssignment(request: BatchAssignmentRequest): Promise<{
    successful: number;
    conflicts: SchedulingConflict[];
  }> {
    const conflicts: SchedulingConflict[] = [];
    let successful = 0;

    // Validate capacity before proceeding
    for (const assignment of request.assignments) {
      const { data: capacityData } = await supabase
        .from('site_capacity_tracking')
        .select('available_spots, max_capacity')
        .eq('site_id', assignment.site_id)
        .single();

      if (!capacityData || capacityData.available_spots <= 0) {
        conflicts.push({
          type: 'capacity_exceeded',
          assignment_id: assignment.assignment_id,
          site_id: assignment.site_id,
          message: 'Site has no available capacity',
          suggested_alternatives: []
        });
        continue;
      }

      // Update practicum assignment
      const { error: updateError } = await supabase
        .from('practicum_assignments')
        .update({
          site_id: assignment.site_id,
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', assignment.assignment_id);

      if (updateError) {
        conflicts.push({
          type: 'program_mismatch',
          assignment_id: assignment.assignment_id,
          site_id: assignment.site_id,
          message: 'Failed to update assignment',
          suggested_alternatives: []
        });
        continue;
      }

      // Update capacity tracking
      await this.updateSiteCapacity(
        assignment.site_id,
        '', // We'll need to get the program_id from the assignment
        capacityData.max_capacity - capacityData.available_spots + 1
      );

      successful++;
    }

    return { successful, conflicts };
  }

  // Scheduling Sessions
  static async createSchedulingSession(sessionData: Omit<SchedulingSession, 'id' | 'started_at'>): Promise<SchedulingSession> {
    const { data, error } = await supabase
      .from('scheduling_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) throw error;
    return data as SchedulingSession;
  }

  static async getSchedulingSessions(userId: string): Promise<SchedulingSession[]> {
    const { data, error } = await supabase
      .from('scheduling_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return (data || []) as SchedulingSession[];
  }

  // Unassigned Students
  static async getUnassignedStudents(userId: string): Promise<PracticumAssignmentWithRelations[]> {
    const { data, error } = await supabase
      .from('practicum_assignments')
      .select(`
        *,
        leads (first_name, last_name),
        practicum_programs (id, program_name),
        practicum_sites (name)
      `)
      .eq('user_id', userId)
      .is('site_id', null)
      .eq('status', 'pending');

    if (error) throw error;
    return data || [];
  }

  // Available Sites by Program
  static async getAvailableSites(programId: string, userId: string): Promise<SiteCapacityTracking[]> {
    const { data, error } = await supabase
      .from('site_capacity_tracking')
      .select(`
        *,
        practicum_sites!inner (
          user_id,
          name,
          address,
          specializations
        ),
        practicum_programs (program_name)
      `)
      .eq('program_id', programId)
      .eq('practicum_sites.user_id', userId)
      .gt('available_spots', 0);

    if (error) throw error;
    return data || [];
  }
}