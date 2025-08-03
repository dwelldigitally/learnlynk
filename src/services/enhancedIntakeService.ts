import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EnhancedIntake {
  id: string;
  program_id: string;
  program_name: string;
  program_type: string;
  name: string;
  start_date: string;
  application_deadline?: string;
  capacity: number;
  study_mode: string;
  delivery_method: string;
  campus?: string;
  status: string;
  sales_approach: 'aggressive' | 'balanced' | 'neutral';
  enrolled_count: number;
  enrollment_percentage: number;
  capacity_percentage: number;
  health_status: 'healthy' | 'warning' | 'critical';
}

export interface IntakeFilters {
  search?: string;
  program_type?: string;
  delivery_method?: string;
  campus?: string;
  status?: string;
  sales_approach?: string;
  start_date_from?: string;
  start_date_to?: string;
}

export interface SortOptions {
  field: 'start_date' | 'enrollment_percentage' | 'program_name' | 'campus' | 'capacity';
  direction: 'asc' | 'desc';
}

class EnhancedIntakeService {
  
  async getIntakesWithProgramData(filters?: IntakeFilters, sort?: SortOptions): Promise<EnhancedIntake[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get intakes with program data
      let query = supabase
        .from('intakes')
        .select(`
          *,
          programs!inner (
            name,
            type,
            description
          )
        `)
        .eq('user_id', user.id);

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,programs.name.ilike.%${filters.search}%`);
      }
      if (filters?.program_type) {
        query = query.eq('programs.type', filters.program_type);
      }
      if (filters?.delivery_method) {
        query = query.eq('delivery_method', filters.delivery_method);
      }
      if (filters?.campus) {
        query = query.eq('campus', filters.campus);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.sales_approach) {
        query = query.eq('sales_approach', filters.sales_approach);
      }
      if (filters?.start_date_from) {
        query = query.gte('start_date', filters.start_date_from);
      }
      if (filters?.start_date_to) {
        query = query.lte('start_date', filters.start_date_to);
      }

      // Apply sorting
      if (sort) {
        if (sort.field === 'program_name') {
          query = query.order('programs.name', { ascending: sort.direction === 'asc' });
        } else {
          query = query.order(sort.field, { ascending: sort.direction === 'asc' });
        }
      } else {
        query = query.order('start_date', { ascending: true });
      }

      const { data: intakes, error } = await query;

      if (error) {
        console.error('Error fetching intakes:', error);
        throw error;
      }

      if (!intakes) return [];

      // Get enrollment counts for each intake
      const intakeIds = intakes.map(intake => intake.id);
      const { data: enrollmentData } = await supabase
        .from('students')
        .select('id, program')
        .eq('user_id', user.id)
        .in('stage', ['ACCEPTED', 'ENROLLED', 'ACTIVE']);

      // Calculate enrollment by matching program names
      const enrollmentByProgram: Record<string, number> = {};
      enrollmentData?.forEach(student => {
        enrollmentByProgram[student.program] = (enrollmentByProgram[student.program] || 0) + 1;
      });

      // Transform and enhance data
      const enhancedIntakes: EnhancedIntake[] = intakes.map(intake => {
        const enrolled_count = enrollmentByProgram[intake.programs.name] || 0;
        const enrollment_percentage = intake.capacity > 0 ? (enrolled_count / intake.capacity) * 100 : 0;
        const capacity_percentage = Math.min(enrollment_percentage, 100);
        
        let health_status: 'healthy' | 'warning' | 'critical' = 'healthy';
        if (enrollment_percentage < 30) health_status = 'critical';
        else if (enrollment_percentage < 70) health_status = 'warning';

        return {
          id: intake.id,
          program_id: intake.program_id,
          program_name: intake.programs.name,
          program_type: intake.programs.type,
          name: intake.name,
          start_date: intake.start_date,
          application_deadline: intake.application_deadline,
          capacity: intake.capacity,
          study_mode: intake.study_mode,
          delivery_method: intake.delivery_method,
          campus: intake.campus,
          status: intake.status,
          sales_approach: intake.sales_approach as 'aggressive' | 'balanced' | 'neutral',
          enrolled_count,
          enrollment_percentage,
          capacity_percentage,
          health_status
        };
      });

      return enhancedIntakes;

    } catch (error) {
      console.error('Failed to fetch enhanced intakes:', error);
      toast.error('Failed to fetch intake data');
      return [];
    }
  }

  async updateSalesApproach(intakeId: string, approach: 'aggressive' | 'balanced' | 'neutral'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('intakes')
        .update({ sales_approach: approach })
        .eq('id', intakeId);

      if (error) {
        console.error('Error updating sales approach:', error);
        throw error;
      }

      toast.success(`Sales approach updated to ${approach}`);
      return true;

    } catch (error) {
      console.error('Failed to update sales approach:', error);
      toast.error('Failed to update sales approach');
      return false;
    }
  }

  async getFilterOptions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {};

      const { data: intakes } = await supabase
        .from('intakes')
        .select(`
          delivery_method,
          campus,
          status,
          programs!inner (type)
        `)
        .eq('user_id', user.id);

      if (!intakes) return {};

      const programTypes = [...new Set(intakes.map(i => i.programs.type))];
      const deliveryMethods = [...new Set(intakes.map(i => i.delivery_method))];
      const campuses = [...new Set(intakes.map(i => i.campus).filter(Boolean))];
      const statuses = [...new Set(intakes.map(i => i.status))];

      return {
        programTypes,
        deliveryMethods,
        campuses,
        statuses,
        salesApproaches: ['aggressive', 'balanced', 'neutral']
      };

    } catch (error) {
      console.error('Failed to fetch filter options:', error);
      return {};
    }
  }

  getSalesApproachStrategy(approach: 'aggressive' | 'balanced' | 'neutral') {
    const strategies = {
      aggressive: {
        description: "Maximize enrollment with prioritized resources",
        actions: [
          "Assign leads to top performers",
          "Prepare targeted email campaigns", 
          "Increase marketing budget allocation",
          "Prioritize follow-ups and outreach"
        ],
        color: "hsl(var(--destructive))"
      },
      balanced: {
        description: "Equitable lead distribution with standard follow-up",
        actions: [
          "Distribute leads evenly across team",
          "Standard follow-up sequence",
          "Normal marketing budget",
          "Regular engagement tracking"
        ],
        color: "hsl(var(--primary))"
      },
      neutral: {
        description: "Passive enrollment with self-service focus",
        actions: [
          "Self-service registration priority",
          "Minimal direct outreach",
          "Reduced marketing spend",
          "Automated workflows only"
        ],
        color: "hsl(var(--muted-foreground))"
      }
    };

    return strategies[approach];
  }
}

export const enhancedIntakeService = new EnhancedIntakeService();