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

      // First get intakes
      const { data: intakes, error: intakesError } = await supabase
        .from('intakes')
        .select('*')
        .eq('user_id', user.id);

      if (intakesError) {
        console.error('Error fetching intakes:', intakesError);
        throw intakesError;
      }

      if (!intakes || intakes.length === 0) {
        return [];
      }

      // Get programs data
      const programIds = [...new Set(intakes.map(intake => intake.program_id))];
      const { data: programs, error: programsError } = await supabase
        .from('programs')
        .select('id, name, type, description')
        .eq('user_id', user.id)
        .in('id', programIds);

      if (programsError) {
        console.error('Error fetching programs:', programsError);
        throw programsError;
      }

      // Create program lookup map
      const programMap = new Map();
      programs?.forEach(program => {
        programMap.set(program.id, program);
      });

      // Get enrollment counts
      const { data: enrollmentData } = await supabase
        .from('students')
        .select('id, program')
        .eq('user_id', user.id)
        .in('stage', ['ACCEPTED', 'ENROLLED', 'ACTIVE']);

      // Calculate enrollment by program name
      const enrollmentByProgram: Record<string, number> = {};
      enrollmentData?.forEach(student => {
        enrollmentByProgram[student.program] = (enrollmentByProgram[student.program] || 0) + 1;
      });

      // Transform and enhance data
      let enhancedIntakes: EnhancedIntake[] = intakes.map(intake => {
        const program = programMap.get(intake.program_id);
        if (!program) return null;

        const enrolled_count = enrollmentByProgram[program.name] || 0;
        const enrollment_percentage = intake.capacity > 0 ? (enrolled_count / intake.capacity) * 100 : 0;
        const capacity_percentage = Math.min(enrollment_percentage, 100);
        
        let health_status: 'healthy' | 'warning' | 'critical' = 'healthy';
        if (enrollment_percentage < 30) health_status = 'critical';
        else if (enrollment_percentage < 70) health_status = 'warning';

        return {
          id: intake.id,
          program_id: intake.program_id,
          program_name: program.name,
          program_type: program.type,
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
      }).filter(Boolean) as EnhancedIntake[];

      // Apply filters
      if (filters?.search) {
        enhancedIntakes = enhancedIntakes.filter(intake => 
          intake.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          intake.program_name.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      if (filters?.program_type) {
        enhancedIntakes = enhancedIntakes.filter(intake => intake.program_type === filters.program_type);
      }
      if (filters?.delivery_method) {
        enhancedIntakes = enhancedIntakes.filter(intake => intake.delivery_method === filters.delivery_method);
      }
      if (filters?.campus) {
        enhancedIntakes = enhancedIntakes.filter(intake => intake.campus === filters.campus);
      }
      if (filters?.status) {
        enhancedIntakes = enhancedIntakes.filter(intake => intake.status === filters.status);
      }
      if (filters?.sales_approach) {
        enhancedIntakes = enhancedIntakes.filter(intake => intake.sales_approach === filters.sales_approach);
      }
      if (filters?.start_date_from) {
        enhancedIntakes = enhancedIntakes.filter(intake => intake.start_date >= filters.start_date_from!);
      }
      if (filters?.start_date_to) {
        enhancedIntakes = enhancedIntakes.filter(intake => intake.start_date <= filters.start_date_to!);
      }

      // Apply sorting
      if (sort) {
        enhancedIntakes.sort((a, b) => {
          let aValue, bValue;
          switch (sort.field) {
            case 'program_name':
              aValue = a.program_name;
              bValue = b.program_name;
              break;
            case 'enrollment_percentage':
              aValue = a.enrollment_percentage;
              bValue = b.enrollment_percentage;
              break;
            case 'capacity':
              aValue = a.capacity;
              bValue = b.capacity;
              break;
            default:
              aValue = a[sort.field];
              bValue = b[sort.field];
          }

          if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
          return 0;
        });
      } else {
        enhancedIntakes.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
      }

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

  async updateIntakeStatus(intakeId: string, status: 'open' | 'closed'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('intakes')
        .update({ status })
        .eq('id', intakeId);

      if (error) {
        console.error('Error updating intake status:', error);
        throw error;
      }

      toast.success(`Intake ${status === 'open' ? 'opened' : 'closed'} successfully`);
      return true;

    } catch (error) {
      console.error('Failed to update intake status:', error);
      toast.error('Failed to update intake status');
      return false;
    }
  }

  async getFilterOptions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {};

      const { data: intakes } = await supabase
        .from('intakes')
        .select('delivery_method, campus, status, program_id')
        .eq('user_id', user.id);

      const { data: programs } = await supabase
        .from('programs')
        .select('type')
        .eq('user_id', user.id);

      if (!intakes && !programs) return {};

      const programTypes = programs ? [...new Set(programs.map(p => p.type))] : [];
      const deliveryMethods = intakes ? [...new Set(intakes.map(i => i.delivery_method))] : [];
      const campuses = intakes ? [...new Set(intakes.map(i => i.campus).filter(Boolean))] : [];
      const statuses = intakes ? [...new Set(intakes.map(i => i.status))] : [];

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