import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIntakeLeadStats, useIntakeEnrollmentStats, calculatePipelineStrength } from './useIntakeLeads';

export interface RealIntake {
  id: string;
  name: string;
  program_id: string;
  program_name: string;
  start_date: string;
  application_deadline: string | null;
  capacity: number;
  enrolled: number;
  status: 'open' | 'closed' | 'full' | 'planning';
  sales_approach: 'aggressive' | 'balanced' | 'neutral';
  campus: string | null;
  study_mode: string | null;
  delivery_method: string | null;
  // Calculated fields
  totalLeads: number;
  conversionRate: number;
  pipelineStrength: number;
  leadsByStatus: Record<string, number>;
}

/**
 * Main hook to fetch all intakes with enriched data
 */
export function useRealIntakes() {
  const { data: leadStats, isLoading: leadStatsLoading } = useIntakeLeadStats();
  const { data: enrollmentStats, isLoading: enrollmentLoading } = useIntakeEnrollmentStats();

  return useQuery({
    queryKey: ['real-intakes', leadStats, enrollmentStats],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch intakes with program data
      const { data: intakes, error } = await supabase
        .from('intakes')
        .select(`
          id,
          name,
          program_id,
          start_date,
          application_deadline,
          capacity,
          status,
          sales_approach,
          campus,
          study_mode,
          delivery_method
        `)
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Fetch programs for names
      const programIds = [...new Set(intakes?.map(i => i.program_id) || [])];
      const { data: programs } = await supabase
        .from('programs')
        .select('id, name')
        .in('id', programIds);

      const programMap = new Map(programs?.map(p => [p.id, p.name]) || []);

      // Enrich intakes with lead stats and enrollment counts
      const enrichedIntakes: RealIntake[] = (intakes || []).map(intake => {
        const stats = leadStats?.[intake.id] || {
          totalLeads: 0,
          leadsByStatus: {},
          conversionRate: 0,
          pipelineStrength: 0
        };
        
        const enrolled = enrollmentStats?.[intake.id] || 0;
        const pipelineStrength = calculatePipelineStrength(
          stats.totalLeads,
          intake.capacity,
          stats.leadsByStatus
        );

        return {
          id: intake.id,
          name: intake.name,
          program_id: intake.program_id,
          program_name: programMap.get(intake.program_id) || 'Unknown Program',
          start_date: intake.start_date,
          application_deadline: intake.application_deadline,
          capacity: intake.capacity,
          enrolled,
          status: (intake.status as RealIntake['status']) || 'planning',
          sales_approach: (intake.sales_approach as RealIntake['sales_approach']) || 'balanced',
          campus: intake.campus,
          study_mode: intake.study_mode,
          delivery_method: intake.delivery_method,
          totalLeads: stats.totalLeads,
          conversionRate: stats.conversionRate,
          pipelineStrength,
          leadsByStatus: stats.leadsByStatus
        };
      });

      return enrichedIntakes;
    },
    enabled: !leadStatsLoading && !enrollmentLoading
  });
}

/**
 * Create a new intake
 */
export function useCreateIntake() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intake: {
      name: string;
      program_id: string;
      start_date: string;
      application_deadline?: string;
      capacity: number;
      campus?: string;
      study_mode?: string;
      delivery_method?: string;
      status?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('intakes')
        .insert({
          ...intake,
          user_id: user.id,
          status: intake.status || 'planning',
          sales_approach: 'balanced'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['real-intakes'] });
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
      toast.success('Intake created successfully');
    },
    onError: (error) => {
      console.error('Error creating intake:', error);
      toast.error('Failed to create intake');
    }
  });
}

/**
 * Update intake status with smart validation
 */
export function useUpdateIntakeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      intakeId, 
      status,
      enrolled,
      capacity,
      startDate
    }: { 
      intakeId: string; 
      status: 'open' | 'closed' | 'full' | 'planning';
      enrolled: number;
      capacity: number;
      startDate: string;
    }) => {
      // Smart status validation
      const now = new Date();
      const intakeStartDate = new Date(startDate);

      // Cannot open if:
      // 1. Already full (enrolled >= capacity)
      if (status === 'open' && enrolled >= capacity) {
        throw new Error('Cannot open intake: Already at full capacity');
      }

      // 2. Start date has passed
      if (status === 'open' && intakeStartDate < now) {
        throw new Error('Cannot open intake: Start date has passed');
      }

      const { error } = await supabase
        .from('intakes')
        .update({ status })
        .eq('id', intakeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['real-intakes'] });
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
      toast.success('Intake status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update intake status');
    }
  });
}

/**
 * Update intake sales approach
 */
export function useUpdateSalesApproach() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      intakeId, 
      salesApproach 
    }: { 
      intakeId: string; 
      salesApproach: 'aggressive' | 'balanced' | 'neutral';
    }) => {
      const { error } = await supabase
        .from('intakes')
        .update({ sales_approach: salesApproach })
        .eq('id', intakeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['real-intakes'] });
      toast.success('Sales approach updated');
    },
    onError: () => {
      toast.error('Failed to update sales approach');
    }
  });
}

/**
 * Delete an intake
 */
export function useDeleteIntake() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (intakeId: string) => {
      const { error } = await supabase
        .from('intakes')
        .delete()
        .eq('id', intakeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['real-intakes'] });
      queryClient.invalidateQueries({ queryKey: ['intakes'] });
      toast.success('Intake deleted');
    },
    onError: () => {
      toast.error('Failed to delete intake');
    }
  });
}
