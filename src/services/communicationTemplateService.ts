import { supabase } from '@/integrations/supabase/client';
import { CommunicationTemplate, TemplateFormData, TEMPLATE_VARIABLES } from '@/types/leadEnhancements';
import { Lead } from '@/types/lead';
import { supabaseWrapper } from './supabaseWrapper';

export class CommunicationTemplateService {
  static async getTemplates(type?: string): Promise<CommunicationTemplate[]> {
    return supabaseWrapper.retryOperation(async () => {
      let query = supabase
        .from('communication_templates')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching templates:', error);
        throw new Error('Failed to fetch templates');
      }

      return (data || []) as CommunicationTemplate[];
    });
  }

  static async createTemplate(templateData: TemplateFormData): Promise<CommunicationTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Extract variables from content
    const variables = this.extractVariables(templateData.content);

    const { data, error } = await supabase
      .from('communication_templates')
      .insert({
        user_id: user.id,
        ...templateData,
        variables,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    }

    return data as CommunicationTemplate;
  }

  static async updateTemplate(id: string, updates: Partial<TemplateFormData>): Promise<CommunicationTemplate> {
    const updateData: any = { ...updates };
    
    // Update variables if content changed
    if (updates.content) {
      updateData.variables = this.extractVariables(updates.content);
    }

    const { data, error } = await supabase
      .from('communication_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating template:', error);
      throw new Error('Failed to update template');
    }

    return data as CommunicationTemplate;
  }

  static async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('communication_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      throw new Error('Failed to delete template');
    }
  }

  static async incrementUsage(id: string): Promise<void> {
    // Get current usage count and increment
    const { data: template, error: fetchError } = await supabase
      .from('communication_templates')
      .select('usage_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching template for usage increment:', fetchError);
      return;
    }

    const { error } = await supabase
      .from('communication_templates')
      .update({ usage_count: (template?.usage_count || 0) + 1 })
      .eq('id', id);

    if (error) {
      console.error('Error incrementing template usage:', error);
    }
  }

  static extractVariables(content: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      const variable = `{{${match[1]}}}`;
      if (!variables.includes(variable)) {
        variables.push(variable);
      }
    }

    return variables;
  }

  static personalizeContent(template: CommunicationTemplate, lead: Lead, agentName?: string): {
    subject?: string;
    content: string;
  } {
    const replacements: Record<string, string> = {
      '{{first_name}}': lead.first_name || '',
      '{{last_name}}': lead.last_name || '',
      '{{email}}': lead.email || '',
      '{{phone}}': lead.phone || '',
      '{{program_interest}}': lead.program_interest?.join(', ') || '',
      '{{agent_name}}': agentName || '',
      '{{today}}': new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
    };

    const personalizedContent = this.replaceVariables(template.content, replacements);
    const personalizedSubject = template.subject ? 
      this.replaceVariables(template.subject, replacements) : undefined;

    return {
      subject: personalizedSubject,
      content: personalizedContent,
    };
  }

  private static replaceVariables(text: string, replacements: Record<string, string>): string {
    let result = text;
    for (const [variable, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    }
    return result;
  }

  static getAvailableVariables() {
    return TEMPLATE_VARIABLES;
  }
}