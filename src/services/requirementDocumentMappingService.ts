import { supabase } from '@/integrations/supabase/client';
import { MasterRequirement } from '@/types/requirement';
import { DocumentTemplate, DocumentTemplateService } from './documentTemplateService';

/**
 * Service for managing the mapping between requirements and document templates
 */
class RequirementDocumentMappingService {
  /**
   * Find which requirement a document template belongs to
   * @param templateId - The document template ID
   * @returns The master requirement that is linked to this template, or null if none found
   */
  async getRequirementByDocumentTemplate(templateId: string): Promise<MasterRequirement | null> {
    try {
      const { data, error } = await supabase
        .from('master_requirements')
        .select('*')
        .contains('linked_document_templates', [templateId])
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - this is expected if no requirement is linked
          return null;
        }
        throw error;
      }

      return data ? {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      } as MasterRequirement : null;
    } catch (error) {
      console.error('Error finding requirement by template:', error);
      return null;
    }
  }

  /**
   * Get all document templates linked to a requirement
   * @param requirementId - The requirement ID
   * @returns Array of document templates
   */
  async getLinkedTemplates(requirementId: string): Promise<DocumentTemplate[]> {
    try {
      // First get the requirement to find linked template IDs
      const { data: requirement, error: reqError } = await supabase
        .from('master_requirements')
        .select('linked_document_templates')
        .eq('id', requirementId)
        .single();

      if (reqError) throw reqError;

      const templateIds = requirement?.linked_document_templates || [];
      
      if (templateIds.length === 0) {
        return [];
      }

      // Then fetch the actual templates
      return await DocumentTemplateService.getTemplatesByIds(templateIds);
    } catch (error) {
      console.error('Error getting linked templates:', error);
      return [];
    }
  }

  /**
   * Automatically link a requirement to an uploaded document based on its template
   * @param documentId - The uploaded document ID
   * @param templateId - The document template ID
   */
  async autoLinkRequirement(documentId: string, templateId: string): Promise<void> {
    try {
      // Find the requirement linked to this template
      const requirement = await this.getRequirementByDocumentTemplate(templateId);

      if (!requirement) {
        console.log('No requirement found for template:', templateId);
        return;
      }

      // Update the document with the requirement_id
      const { error } = await supabase
        .from('student_document_uploads')
        .update({ 
          requirement_id: requirement.id,
          requirement_verification_status: 'not_checked'
        })
        .eq('id', documentId);

      if (error) throw error;

      console.log('Successfully auto-linked requirement:', requirement.name);
    } catch (error) {
      console.error('Error auto-linking requirement:', error);
      throw error;
    }
  }

  /**
   * Update the linked templates for a requirement
   * @param requirementId - The requirement ID
   * @param templateIds - Array of document template IDs to link
   */
  async updateLinkedTemplates(requirementId: string, templateIds: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('master_requirements')
        .update({ linked_document_templates: templateIds })
        .eq('id', requirementId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating linked templates:', error);
      throw error;
    }
  }
}

export const requirementDocumentMappingService = new RequirementDocumentMappingService();
