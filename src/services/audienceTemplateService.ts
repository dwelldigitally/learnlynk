import { supabase } from '@/integrations/supabase/client';
import { EnhancedLeadFilters } from './enhancedLeadService';

export interface AudienceTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  filters: EnhancedLeadFilters;
  audience_count: number;
  created_at: string;
  updated_at: string;
}

export type AudienceTemplateInsert = Omit<AudienceTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type AudienceTemplateUpdate = Partial<AudienceTemplateInsert>;

export class AudienceTemplateService {
  /**
   * Get all audience templates for the current user
   */
  static async getTemplates(): Promise<AudienceTemplate[]> {
    const { data, error } = await supabase
      .from('audience_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching audience templates:', error);
      throw error;
    }

    return (data || []).map(template => ({
      ...template,
      filters: template.filters as EnhancedLeadFilters
    }));
  }

  /**
   * Get a single audience template by ID
   */
  static async getTemplate(id: string): Promise<AudienceTemplate | null> {
    const { data, error } = await supabase
      .from('audience_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching audience template:', error);
      throw error;
    }

    return data ? { ...data, filters: data.filters as EnhancedLeadFilters } : null;
  }

  /**
   * Create a new audience template
   */
  static async createTemplate(template: AudienceTemplateInsert): Promise<AudienceTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create templates');
    }

    const { data, error } = await supabase
      .from('audience_templates')
      .insert([{
        user_id: user.id,
        name: template.name,
        description: template.description || null,
        filters: template.filters as any,
        audience_count: template.audience_count || 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating audience template:', error);
      throw error;
    }

    return { ...data, filters: data.filters as EnhancedLeadFilters };
  }

  /**
   * Update an existing audience template
   */
  static async updateTemplate(id: string, updates: AudienceTemplateUpdate): Promise<AudienceTemplate> {
    const updateData: any = { ...updates };
    if (updateData.filters) {
      updateData.filters = updateData.filters as any;
    }

    const { data, error } = await supabase
      .from('audience_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating audience template:', error);
      throw error;
    }

    return { ...data, filters: data.filters as EnhancedLeadFilters };
  }

  /**
   * Delete an audience template
   */
  static async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('audience_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting audience template:', error);
      throw error;
    }
  }

  /**
   * Check if a template name already exists for the current user
   */
  static async templateNameExists(name: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('audience_templates')
      .select('id')
      .eq('name', name);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error checking template name:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  }
}
