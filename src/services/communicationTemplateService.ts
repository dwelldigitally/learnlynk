import { supabase } from '@/integrations/supabase/client';
import { CommunicationTemplate, TemplateFormData, TEMPLATE_VARIABLES, AttachmentMetadata } from '@/types/leadEnhancements';
import { Lead } from '@/types/lead';
import { supabaseWrapper } from './supabaseWrapper';

export class CommunicationTemplateService {
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

  static async getTemplates(type?: string, tenantId?: string): Promise<CommunicationTemplate[]> {
    return supabaseWrapper.retryOperation(async () => {
      const effectiveTenantId = tenantId || await this.getTenantId();

      let query = supabase
        .from('communication_templates')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (effectiveTenantId) {
        query = query.eq('tenant_id', effectiveTenantId);
      }

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

  static async createTemplate(templateData: TemplateFormData, tenantId?: string): Promise<CommunicationTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const effectiveTenantId = tenantId || await this.getTenantId();

    // Extract variables from content
    const variables = this.extractVariables(templateData.content);

    const { data, error} = await supabase
      .from('communication_templates')
      .insert([{
        user_id: user.id,
        tenant_id: effectiveTenantId,
        name: templateData.name,
        type: templateData.type,
        subject: templateData.subject,
        content: templateData.content,
        html_content: templateData.html_content,
        content_format: templateData.content_format || 'plain',
        attachments: (templateData.attachments || []) as any,
        variables,
      }])
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

    // Remove tenant_id from updates to prevent changing it
    delete updateData.tenant_id;

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
    // First, get the template to access attachments
    const { data: template } = await supabase
      .from('communication_templates')
      .select('attachments')
      .eq('id', id)
      .single();

    // Delete the template
    const { error } = await supabase
      .from('communication_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      throw new Error('Failed to delete template');
    }

    // Clean up attachments from storage
    if (template?.attachments) {
      await this.deleteTemplateAttachments(template.attachments as any as AttachmentMetadata[]);
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

  // Attachment management methods
  static async validateAttachment(file: File): Promise<{ valid: boolean; error?: string }> {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['application/pdf'];

    if (file.size > MAX_SIZE) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Only PDF files are allowed' };
    }

    return { valid: true };
  }

  static async uploadAttachment(file: File, userId: string): Promise<AttachmentMetadata> {
    const validation = await this.validateAttachment(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('email-attachments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading attachment:', uploadError);
      throw new Error('Failed to upload attachment');
    }

    const metadata: AttachmentMetadata = {
      id: fileName,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      uploaded_at: new Date().toISOString(),
    };

    return metadata;
  }

  static async removeAttachment(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from('email-attachments')
      .remove([filePath]);

    if (error) {
      console.error('Error removing attachment:', error);
      throw new Error('Failed to remove attachment');
    }
  }

  static async getAttachmentUrl(filePath: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('email-attachments')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.error('Error getting attachment URL:', error);
      throw new Error('Failed to get attachment URL');
    }

    return data.signedUrl;
  }

  static async deleteTemplateAttachments(attachments: AttachmentMetadata[]): Promise<void> {
    if (!attachments || attachments.length === 0) return;

    const filePaths = attachments.map(a => a.file_path);
    const { error } = await supabase.storage
      .from('email-attachments')
      .remove(filePaths);

    if (error) {
      console.error('Error deleting template attachments:', error);
    }
  }
}
