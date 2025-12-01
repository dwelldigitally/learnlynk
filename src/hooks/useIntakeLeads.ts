import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface IntakeLeadStats {
  intakeId: string;
  totalLeads: number;
  leadsByStatus: Record<string, number>;
  conversionRate: number;
  pipelineStrength: number;
}

export interface IntakeEnrollmentStats {
  intakeId: string;
  enrolledCount: number;
  capacity: number;
  enrollmentRate: number;
}

/**
 * Fetch lead statistics for all intakes
 */
export function useIntakeLeadStats() {
  return useQuery({
    queryKey: ['intake-lead-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch all leads with preferred_intake_id
      const { data: leads, error } = await supabase
        .from('leads')
        .select('id, preferred_intake_id, status')
        .eq('user_id', user.id)
        .not('preferred_intake_id', 'is', null);

      if (error) throw error;

      // Group leads by intake
      const statsByIntake: Record<string, IntakeLeadStats> = {};
      
      leads?.forEach(lead => {
        const intakeId = lead.preferred_intake_id;
        if (!intakeId) return;

        if (!statsByIntake[intakeId]) {
          statsByIntake[intakeId] = {
            intakeId,
            totalLeads: 0,
            leadsByStatus: {},
            conversionRate: 0,
            pipelineStrength: 0
          };
        }

        statsByIntake[intakeId].totalLeads++;
        const status = lead.status || 'unknown';
        statsByIntake[intakeId].leadsByStatus[status] = 
          (statsByIntake[intakeId].leadsByStatus[status] || 0) + 1;
      });

      // Calculate conversion rate (converted leads / total leads)
      Object.values(statsByIntake).forEach(stats => {
        const converted = stats.leadsByStatus['converted'] || 0;
        stats.conversionRate = stats.totalLeads > 0 
          ? Math.round((converted / stats.totalLeads) * 100) 
          : 0;
      });

      return statsByIntake;
    }
  });
}

/**
 * Fetch leads for a specific intake
 */
export function useLeadsByIntake(intakeId: string | null) {
  return useQuery({
    queryKey: ['leads-by-intake', intakeId],
    queryFn: async () => {
      if (!intakeId) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .eq('preferred_intake_id', intakeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!intakeId
  });
}

/**
 * Fetch enrollment stats by counting students/master_records in the final academic journey stage
 */
export function useIntakeEnrollmentStats() {
  return useQuery({
    queryKey: ['intake-enrollment-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get the last academic journey stage (highest order_index = enrolled)
      const { data: stages } = await supabase
        .from('academic_journey_stages')
        .select('id, name, order_index')
        .order('order_index', { ascending: false })
        .limit(1);

      const finalStageId = stages?.[0]?.id;

      // Get students with their journey progress
      const { data: students, error } = await supabase
        .from('students')
        .select('id, program, stage, substage, master_record_id')
        .eq('user_id', user.id);

      if (error) throw error;

      // Also get master_records to check current_stage
      const { data: masterRecords } = await supabase
        .from('master_records')
        .select('id, current_stage, current_substage')
        .eq('user_id', user.id)
        .eq('current_stage', 'student');

      // Get leads with converted status and preferred_intake_id to calculate enrollment per intake
      const { data: convertedLeads } = await supabase
        .from('leads')
        .select('id, preferred_intake_id')
        .eq('user_id', user.id)
        .eq('status', 'converted')
        .not('preferred_intake_id', 'is', null);

      // Count enrolled students per intake based on converted leads
      const enrollmentByIntake: Record<string, number> = {};
      
      convertedLeads?.forEach(lead => {
        const intakeId = lead.preferred_intake_id;
        if (intakeId) {
          enrollmentByIntake[intakeId] = (enrollmentByIntake[intakeId] || 0) + 1;
        }
      });

      return enrollmentByIntake;
    }
  });
}

/**
 * Fetch applicants for a specific intake (from applications table)
 */
export function useApplicantsByIntake(intakeId: string | null, programName: string | null) {
  return useQuery({
    queryKey: ['applicants-by-intake', intakeId, programName],
    queryFn: async () => {
      if (!intakeId || !programName) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get applicants for the program (applications table)
      const { data, error } = await supabase
        .from('applicants')
        .select(`
          id,
          substage,
          decision,
          documents_submitted,
          payment_status,
          created_at,
          master_record_id,
          master_records!inner (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('user_id', user.id)
        .eq('program', programName);

      if (error) throw error;
      return data || [];
    },
    enabled: !!intakeId && !!programName
  });
}

/**
 * Calculate pipeline strength based on lead stages and capacity
 */
export function calculatePipelineStrength(
  totalLeads: number,
  capacity: number,
  leadsByStatus: Record<string, number>
): number {
  if (capacity === 0) return 0;
  
  // Weight different lead stages
  const weights: Record<string, number> = {
    'new': 0.1,
    'contacted': 0.2,
    'qualified': 0.4,
    'nurturing': 0.5,
    'converted': 1.0
  };

  let weightedSum = 0;
  let totalCount = 0;

  Object.entries(leadsByStatus).forEach(([status, count]) => {
    const weight = weights[status] || 0.1;
    weightedSum += count * weight;
    totalCount += count;
  });

  // Pipeline strength = (weighted leads / capacity) * 100, capped at 100
  const strength = Math.min(100, Math.round((weightedSum / capacity) * 100));
  return strength;
}
