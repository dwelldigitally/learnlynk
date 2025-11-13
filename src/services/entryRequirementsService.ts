import { supabase } from '@/integrations/supabase/client';
import type { EntryRequirement } from '@/types/program';
import { getAllSampleRequirements, type RequirementTemplate } from './sampleRequirementsService';

export interface EntryRequirementDB {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'academic' | 'language' | 'experience' | 'health' | 'age' | 'other';
  mandatory: boolean;
  details?: string;
  minimum_grade?: string;
  alternatives?: string[];
  category: string;
  usage_count: number;
  is_system_template: boolean;
  applicable_programs: string[];
  linked_document_templates?: string[];
  created_at: string;
  updated_at: string;
}

export interface EntryRequirementFormData {
  title: string;
  description: string;
  type: 'academic' | 'language' | 'experience' | 'health' | 'age' | 'other';
  mandatory: boolean;
  details?: string;
  minimum_grade?: string;
  alternatives?: string[];
  category?: string;
  applicable_programs?: string[];
  linked_document_templates?: string[];
}

export class EntryRequirementsService {
  
  // Get all requirements with optional filtering
  static async getRequirements(filters?: {
    type?: string;
    category?: string;
    mandatory?: boolean;
    includeSystemTemplates?: boolean;
  }): Promise<EntryRequirement[]> {
    try {
      // Try to fetch from database first
      const { data, error } = await supabase
        .from('entry_requirements' as any)
        .select('*')
        .order('usage_count', { ascending: false });

      // If query succeeds (even if empty), return the results
      if (!error) {
        let results = this.transformToFrontend(data || []);
        
        // Apply filters
        if (filters?.type) {
          results = results.filter(req => req.type === filters.type);
        }
        if (filters?.category) {
          results = results.filter(req => (req as any).category === filters.category);
        }
        if (filters?.mandatory !== undefined) {
          results = results.filter(req => req.mandatory === filters.mandatory);
        }
        
        return results;
      }
    } catch (error) {
      console.log('Database error, returning empty array for new users');
    }

    // Return empty array - no fallback to sample data
    return [];
  }

  // Get requirements by type
  static async getRequirementsByType(type: string): Promise<EntryRequirement[]> {
    return this.getRequirements({ type });
  }

  // Get requirements by category
  static async getRequirementsByCategory(category: string): Promise<EntryRequirement[]> {
    return this.getRequirements({ category });
  }

  // Search requirements
  static async searchRequirements(searchTerm: string): Promise<EntryRequirement[]> {
    try {
      const { data, error } = await supabase
        .from('entry_requirements' as any)
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .order('usage_count', { ascending: false });

      if (!error && data) {
        return this.transformToFrontend(data);
      }
    } catch (error) {
      console.log('Database search not available, using sample data');
    }

    // Fallback to sample data search
    const sampleRequirements = getAllSampleRequirements();
    const term = searchTerm.toLowerCase();
    return sampleRequirements
      .filter(req => 
        req.title.toLowerCase().includes(term) ||
        req.description.toLowerCase().includes(term) ||
        req.category.toLowerCase().includes(term)
      )
      .map(req => ({
        id: req.id,
        type: req.type,
        title: req.title,
        description: req.description,
        mandatory: req.mandatory,
        details: req.details,
        minimumGrade: req.minimumGrade,
        alternatives: req.alternatives
      }));
  }

  // Create new requirement
  static async createRequirement(requirementData: EntryRequirementFormData): Promise<EntryRequirement> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const dbData = {
        user_id: user.id,
        title: requirementData.title,
        description: requirementData.description,
        type: requirementData.type,
        mandatory: requirementData.mandatory,
        details: requirementData.details || null,
        minimum_grade: requirementData.minimum_grade || null,
        alternatives: requirementData.alternatives || [],
        category: requirementData.category || 'Custom',
        usage_count: 0,
        is_system_template: false,
        applicable_programs: requirementData.applicable_programs || ['All Programs'],
        linked_document_templates: requirementData.linked_document_templates || []
      };

      const { data, error } = await supabase
        .from('entry_requirements' as any)
        .insert([dbData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this.transformToFrontend([data])[0];
    } catch (error) {
      console.error('Error creating entry requirement - database not ready:', error);
      throw new Error('Database not ready. Please run the migration first.');
    }
  }

  // Update existing requirement
  static async updateRequirement(id: string, updates: Partial<EntryRequirementFormData>): Promise<EntryRequirement> {
    try {
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.mandatory !== undefined) dbUpdates.mandatory = updates.mandatory;
      if (updates.details !== undefined) dbUpdates.details = updates.details;
      if (updates.minimum_grade !== undefined) dbUpdates.minimum_grade = updates.minimum_grade;
      if (updates.alternatives !== undefined) dbUpdates.alternatives = updates.alternatives;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.applicable_programs !== undefined) dbUpdates.applicable_programs = updates.applicable_programs;
      if (updates.linked_document_templates !== undefined) dbUpdates.linked_document_templates = updates.linked_document_templates;

      const { data, error } = await supabase
        .from('entry_requirements' as any)
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this.transformToFrontend([data])[0];
    } catch (error) {
      console.error('Error updating entry requirement - database not ready:', error);
      throw new Error('Database not ready. Please run the migration first.');
    }
  }

  // Delete requirement
  static async deleteRequirement(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('entry_requirements' as any)
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting entry requirement - database not ready:', error);
      throw new Error('Database not ready. Please run the migration first.');
    }
  }

  // Increment usage count
  static async incrementUsage(id: string): Promise<void> {
    try {
      // This RPC function doesn't exist yet, so we'll just log for now
      console.log(`Would increment usage for requirement: ${id}`);
    } catch (error) {
      // Don't throw error for usage counting, it's not critical
      console.log('Usage tracking not available yet');
    }
  }

  // Get most used requirements
  static async getMostUsedRequirements(limit: number = 10): Promise<EntryRequirement[]> {
    try {
      const { data, error } = await supabase
        .from('entry_requirements' as any)
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(limit);

      if (!error && data) {
        return this.transformToFrontend(data);
      }
    } catch (error) {
      console.log('Database not available, using sample data');
    }

    // Fallback to sample data
    const sampleRequirements = getAllSampleRequirements();
    return sampleRequirements
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit)
      .map(req => ({
        id: req.id,
        type: req.type,
        title: req.title,
        description: req.description,
        mandatory: req.mandatory,
        details: req.details,
        minimumGrade: req.minimumGrade,
        alternatives: req.alternatives
      }));
  }

  // Get system templates
  static async getSystemTemplates(): Promise<EntryRequirement[]> {
    return this.getRequirements({ includeSystemTemplates: true });
  }

  // Get requirements by program type
  static async getRequirementsByProgram(programType: string): Promise<EntryRequirement[]> {
    try {
      const { data, error } = await supabase
        .from('entry_requirements' as any)
        .select('*')
        .contains('applicable_programs', [programType])
        .or(`applicable_programs.cs.{"All Programs"}`)
        .order('usage_count', { ascending: false });

      if (!error && data) {
        return this.transformToFrontend(data);
      }
    } catch (error) {
      console.log('Database not available, using sample data');
    }

    // Fallback to sample data
    const sampleRequirements = getAllSampleRequirements();
    return sampleRequirements
      .filter(req => 
        req.applicablePrograms.includes(programType) || 
        req.applicablePrograms.includes('All Programs')
      )
      .map(req => ({
        id: req.id,
        type: req.type,
        title: req.title,
        description: req.description,
        mandatory: req.mandatory,
        details: req.details,
        minimumGrade: req.minimumGrade,
        alternatives: req.alternatives
      }));
  }

  // Transform database format to frontend format
  private static transformToFrontend(dbRequirements: any[]): EntryRequirement[] {
    return dbRequirements.map(req => ({
      id: req.id,
      type: req.type,
      title: req.title,
      description: req.description,
      mandatory: req.mandatory,
      details: req.details || undefined,
      minimumGrade: req.minimum_grade || undefined,
      alternatives: req.alternatives || undefined,
      linkedDocumentTemplates: req.linked_document_templates || undefined
    }));
  }

  // Convert frontend requirement to database format for program wizard
  static requirementToDbFormat(requirement: EntryRequirement): EntryRequirementFormData {
    return {
      title: requirement.title,
      description: requirement.description,
      type: requirement.type,
      mandatory: requirement.mandatory,
      details: requirement.details,
      minimum_grade: requirement.minimumGrade,
      alternatives: requirement.alternatives,
      category: 'Program Requirement',
      applicable_programs: ['All Programs']
    };
  }
}