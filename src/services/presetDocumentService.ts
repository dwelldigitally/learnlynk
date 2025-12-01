import { supabase } from '@/integrations/supabase/client';

export interface PresetDocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  programName: string;
}

export interface UploadedDocument {
  id: string;
  lead_id: string;
  user_id: string;
  requirement_id: string | null;
  document_name: string;
  file_path: string | null;
  file_size: number | null;
  document_type: string;
  status: string | null;
  admin_status: string | null;
  admin_comments: string | null;
  admin_reviewed_by: string | null;
  admin_reviewed_at: string | null;
  metadata: any;
  ai_insight: string | null;
  original_filename: string | null;
  upload_date: string | null;
  required: boolean | null;
  created_at: string;
  updated_at: string;
}

class PresetDocumentService {
  /**
   * Get document requirements for a program from database
   * First checks program's document_requirements field, then falls back to document_templates
   */
  async getPresetRequirementsAsync(programName: string): Promise<PresetDocumentRequirement[]> {
    try {
      // First, try to get requirements from program's document_requirements field
      const { data: programs, error: programError } = await supabase
        .from('master_programs')
        .select('document_requirements')
        .or(`name.eq.${programName},code.eq.${programName}`)
        .limit(1);

      if (!programError && programs?.[0]?.document_requirements) {
        const requirements = programs[0].document_requirements as any[];
        if (Array.isArray(requirements) && requirements.length > 0) {
          return requirements.map((req: any, index: number) => ({
            id: req.id || `req-${index}`,
            name: req.name || req.title || 'Unknown Document',
            description: req.description || '',
            required: req.mandatory ?? req.required ?? false,
            programName
          }));
        }
      }

      // Fallback: Get from document_templates table
      const { data: templates, error: templateError } = await supabase
        .from('document_templates')
        .select('*')
        .order('stage', { ascending: true })
        .order('name', { ascending: true });

      if (templateError) {
        console.error('Error fetching document templates:', templateError);
        return [];
      }

      // Filter templates that apply to this program or have no program restriction
      const filteredTemplates = (templates || []).filter(template => {
        if (!template.applicable_programs || template.applicable_programs.length === 0) {
          return true;
        }
        return template.applicable_programs.includes(programName);
      });

      return filteredTemplates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        required: template.mandatory,
        programName
      }));
    } catch (error) {
      console.error('Error in getPresetRequirementsAsync:', error);
      return [];
    }
  }

  /**
   * Synchronous version that returns empty array
   * Use getPresetRequirementsAsync for actual data
   * @deprecated Use getPresetRequirementsAsync instead
   */
  getPresetRequirements(programName: string): PresetDocumentRequirement[] {
    console.warn('getPresetRequirements is deprecated. Use getPresetRequirementsAsync instead.');
    return [];
  }

  /**
   * Get all available programs from database
   */
  async getAvailableProgramsAsync(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('master_programs')
        .select('name')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching programs:', error);
        return [];
      }

      return (data || []).map(p => p.name);
    } catch (error) {
      console.error('Error in getAvailableProgramsAsync:', error);
      return [];
    }
  }

  /**
   * @deprecated Use getAvailableProgramsAsync instead
   */
  getAvailablePrograms(): string[] {
    console.warn('getAvailablePrograms is deprecated. Use getAvailableProgramsAsync instead.');
    return [];
  }

  // Get uploaded documents for a lead
  async getUploadedDocuments(leadId: string): Promise<UploadedDocument[]> {
    const { data, error } = await supabase
      .from('lead_documents')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Upload a document for a specific requirement
  async uploadDocument(
    leadId: string,
    file: File,
    requirementId: string,
    programName: string
  ): Promise<UploadedDocument> {
    // Generate unique file path
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${leadId}/${requirementId}_${timestamp}.${fileExtension}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lead-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Find the requirement details from database
    const requirements = await this.getPresetRequirementsAsync(programName);
    const requirement = requirements.find(r => r.id === requirementId);
    
    const documentName = requirement?.name || file.name;

    // Create document record
    const { data, error } = await supabase
      .from('lead_documents')
      .insert({
        lead_id: leadId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        document_name: documentName,
        document_type: file.type,
        file_path: uploadData.path,
        file_size: file.size,
        requirement_id: requirementId,
        admin_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update document status (approve/reject)
  async updateDocumentStatus(
    documentId: string,
    status: string,
    comments?: string
  ): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    const { error } = await supabase
      .from('lead_documents')
      .update({
        admin_status: status,
        admin_reviewed_by: userId,
        admin_reviewed_at: new Date().toISOString(),
        admin_comments: comments
      })
      .eq('id', documentId);

    if (error) throw error;
  }

  // Delete a document
  async deleteDocument(documentId: string): Promise<void> {
    // Get document info first
    const { data: doc, error: fetchError } = await supabase
      .from('lead_documents')
      .select('file_path')
      .eq('id', documentId)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    if (doc?.file_path) {
      await supabase.storage
        .from('lead-documents')
        .remove([doc.file_path]);
    }

    // Delete from database
    const { error } = await supabase
      .from('lead_documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
  }

  // Get document URL for viewing
  async getDocumentUrl(filePath: string): Promise<string> {
    const { data } = await supabase.storage
      .from('lead-documents')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    return data?.signedUrl || '';
  }

  // Check if all required documents are approved for a program
  async getDocumentProgressAsync(programName: string, uploadedDocs: UploadedDocument[]): Promise<{
    total: number;
    uploaded: number;
    approved: number;
    pending: number;
    rejected: number;
    isComplete: boolean;
  }> {
    const requirements = await this.getPresetRequirementsAsync(programName);
    const requiredDocs = requirements.filter(req => req.required);
    
    const uploaded = uploadedDocs.length;
    const approved = uploadedDocs.filter(doc => doc.admin_status === 'approved').length;
    const pending = uploadedDocs.filter(doc => doc.admin_status === 'pending').length;
    const rejected = uploadedDocs.filter(doc => doc.admin_status === 'rejected').length;
    
    // Check if all required documents are approved
    const approvedRequirementIds = uploadedDocs
      .filter(doc => doc.admin_status === 'approved')
      .map(doc => doc.requirement_id);
    
    const allRequiredApproved = requiredDocs.every(req => 
      approvedRequirementIds.includes(req.id)
    );

    return {
      total: requiredDocs.length,
      uploaded,
      approved,
      pending,
      rejected,
      isComplete: allRequiredApproved
    };
  }

  /**
   * @deprecated Use getDocumentProgressAsync instead
   */
  getDocumentProgress(programName: string, uploadedDocs: UploadedDocument[]): {
    total: number;
    uploaded: number;
    approved: number;
    pending: number;
    rejected: number;
    isComplete: boolean;
  } {
    const uploaded = uploadedDocs.length;
    const approved = uploadedDocs.filter(doc => doc.admin_status === 'approved').length;
    const pending = uploadedDocs.filter(doc => doc.admin_status === 'pending').length;
    const rejected = uploadedDocs.filter(doc => doc.admin_status === 'rejected').length;

    return {
      total: 0,
      uploaded,
      approved,
      pending,
      rejected,
      isComplete: false
    };
  }
}

export const presetDocumentService = new PresetDocumentService();
