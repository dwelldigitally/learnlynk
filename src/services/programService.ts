import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export class ProgramService {
  /**
   * Get all programs for the current user
   */
  static async getPrograms() {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching programs:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Create a new program
   */
  static async createProgram(program: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Prepare the program data with proper JSONB field mapping
    const programData = {
      name: program.name,
      type: program.type,
      description: program.description,
      duration: program.duration,
      tuition: program.tuition,
      next_intake: program.next_intake,
      enrollment_status: program.enrollment_status || 'open',
      requirements: program.requirements || [],
      // New JSONB fields
      entry_requirements: program.entryRequirements || [],
      document_requirements: program.documentRequirements || [],
      fee_structure: program.feeStructure || {},
      custom_questions: program.customQuestions || [],
      practicum_config: program.practicum || null,
      metadata: {
        images: program.images || [],
        campus: program.campus || [],
        deliveryMethod: program.deliveryMethod || 'in-person',
        color: program.color || '#0ea5e9',
        status: program.status || 'draft',
        category: program.category || '',
        tags: program.tags || [],
        urlSlug: program.urlSlug || '',
        shortDescription: program.shortDescription || '',
        marketingCopy: program.marketingCopy || '',
        createdBy: user.id,
        ...program.metadata
      },
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('programs')
      .insert(programData)
      .select()
      .single();

    if (error) {
      console.error('Error creating program:', error);
      throw error;
    }

    // TODO: Handle practicum program creation in future enhancement

    return data;
  }

  /**
   * Update a program
   */
  static async updateProgram(id: string, program: any) {
    // Prepare the update data with proper JSONB field mapping
    const updateData = {
      name: program.name,
      type: program.type,
      description: program.description,
      duration: program.duration,
      tuition: program.tuition,
      next_intake: program.next_intake,
      enrollment_status: program.enrollment_status,
      requirements: program.requirements,
      // New JSONB fields
      entry_requirements: program.entryRequirements || program.entry_requirements,
      document_requirements: program.documentRequirements || program.document_requirements,
      fee_structure: program.feeStructure || program.fee_structure,
      custom_questions: program.customQuestions || program.custom_questions,
      practicum_config: program.practicum !== undefined ? program.practicum : undefined,
      metadata: {
        ...(program.metadata || {}),
        images: program.images || [],
        campus: program.campus || [],
        deliveryMethod: program.deliveryMethod,
        color: program.color,
        status: program.status,
        category: program.category,
        tags: program.tags || [],
        urlSlug: program.urlSlug,
        shortDescription: program.shortDescription,
        marketingCopy: program.marketingCopy
      }
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from('programs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating program:', error);
      throw error;
    }

    // TODO: Handle practicum program updates in future enhancement

    return data;
  }

  /**
   * Delete a program
   */
  static async deleteProgram(id: string) {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }
}

/**
 * React hook to get programs with conditional demo data
 */
export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: () => ProgramService.getPrograms(),
    staleTime: 5 * 60 * 1000,
  });
}