import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface IntakeData {
  id?: string;
  name: string;
  program_id: string;
  start_date: string;
  application_deadline?: string;
  capacity: number;
  sales_approach?: 'aggressive' | 'balanced' | 'neutral';
  status?: 'open' | 'closed' | 'full';
  delivery_method?: 'on-campus' | 'online' | 'hybrid';
  study_mode?: 'full-time' | 'part-time';
  campus?: string;
  user_id?: string;
  tenant_id?: string;
}

export class IntakeService {
  /**
   * Get tenant_id for current user
   */
  private static async getTenantId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single();
    
    return tenantUser?.tenant_id || null;
  }

  /**
   * Get all intakes for a specific program
   */
  static async getIntakesByProgramId(programId: string) {
    const { data, error } = await supabase
      .from('intakes')
      .select('*')
      .eq('program_id', programId)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching intakes:', error);
      toast.error('Failed to fetch intakes');
      return [];
    }

    return data || [];
  }

  /**
   * Get all intakes for the current tenant
   */
  static async getAllIntakes(tenantId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const effectiveTenantId = tenantId || await this.getTenantId();

    // Build intakes query
    let intakesQuery = supabase
      .from('intakes')
      .select('*')
      .order('start_date', { ascending: true });

    // Filter by tenant if available, otherwise fall back to user_id
    if (effectiveTenantId) {
      intakesQuery = intakesQuery.eq('tenant_id', effectiveTenantId);
    } else {
      intakesQuery = intakesQuery.eq('user_id', user.id);
    }

    const { data: intakes, error: intakesError } = await intakesQuery;

    if (intakesError) {
      console.error('Error fetching intakes:', intakesError);
      toast.error('Failed to fetch intakes');
      return [];
    }

    if (!intakes || intakes.length === 0) {
      return [];
    }

    // Get unique program IDs
    const programIds = [...new Set(intakes.map(intake => intake.program_id))];
    
    // Build programs query
    let programsQuery = supabase
      .from('programs')
      .select('id, name, type, duration')
      .in('id', programIds);

    if (effectiveTenantId) {
      programsQuery = programsQuery.eq('tenant_id', effectiveTenantId);
    } else {
      programsQuery = programsQuery.eq('user_id', user.id);
    }

    const { data: programs, error: programsError } = await programsQuery;

    if (programsError) {
      console.error('Error fetching programs:', programsError);
      return intakes.map(intake => ({
        ...intake,
        program_name: 'Unknown Program'
      }));
    }

    // Create program lookup map
    const programMap = new Map();
    programs?.forEach(program => {
      programMap.set(program.id, program);
    });

    // Combine intakes with program data
    return intakes.map(intake => {
      const program = programMap.get(intake.program_id);
      return {
        ...intake,
        program_name: program?.name || 'Unknown Program',
        program_type: program?.type || 'Unknown',
        program_duration: program?.duration || 'Unknown'
      };
    });
  }

  /**
   * Create a new intake
   */
  static async createIntake(intake: IntakeData, tenantId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const effectiveTenantId = tenantId || intake.tenant_id || await this.getTenantId();

    const { data, error } = await supabase
      .from('intakes')
      .insert({
        ...intake,
        user_id: user.id,
        tenant_id: effectiveTenantId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating intake:', error);
      toast.error('Failed to create intake');
      throw error;
    }

    toast.success('Intake created successfully');
    return data;
  }

  /**
   * Update an intake
   */
  static async updateIntake(id: string, intake: Partial<IntakeData>) {
    // Remove tenant_id from updates to prevent changing it
    const { tenant_id, ...safeUpdates } = intake;

    const { data, error } = await supabase
      .from('intakes')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating intake:', error);
      toast.error('Failed to update intake');
      throw error;
    }

    toast.success('Intake updated successfully');
    return data;
  }

  /**
   * Delete an intake
   */
  static async deleteIntake(id: string) {
    const { error } = await supabase
      .from('intakes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting intake:', error);
      toast.error('Failed to delete intake');
      throw error;
    }

    toast.success('Intake deleted successfully');
  }

  /**
   * Update sales approach for an intake
   */
  static async updateSalesApproach(id: string, approach: 'aggressive' | 'balanced' | 'neutral') {
    const { error } = await supabase
      .from('intakes')
      .update({ sales_approach: approach })
      .eq('id', id);

    if (error) {
      console.error('Error updating sales approach:', error);
      toast.error('Failed to update sales approach');
      throw error;
    }

    toast.success(`Sales approach updated to ${approach}`);
  }
}
