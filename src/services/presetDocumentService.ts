import { supabase } from '@/integrations/supabase/client';

export interface PresetDocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  programName: string;
  entryRequirementId?: string; // Links to the entry requirement this doc satisfies
}

export interface UploadedDocument {
  id: string;
  lead_id: string;
  user_id: string;
  requirement_id: string | null;
  entry_requirement_id: string | null;
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
      console.log('[PresetDocumentService] Fetching requirements for program:', programName);
      
      // First, try to get requirements from program's document_requirements field
      const { data: programs, error: programError } = await supabase
        .from('master_programs')
        .select('document_requirements')
        .or(`name.eq.${programName},code.eq.${programName}`)
        .limit(1);

      if (!programError && programs?.[0]?.document_requirements) {
        const requirements = programs[0].document_requirements as any[];
        if (Array.isArray(requirements) && requirements.length > 0) {
          console.log('[PresetDocumentService] Found program document_requirements:', requirements.length);
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
        console.error('[PresetDocumentService] Error fetching document templates:', templateError);
        return [];
      }

      // Filter templates that apply to this program or have no program restriction
      const filteredTemplates = (templates || []).filter(template => {
        if (!template.applicable_programs || template.applicable_programs.length === 0) {
          return true;
        }
        return template.applicable_programs.includes(programName);
      });

      console.log('[PresetDocumentService] Using document_templates fallback:', filteredTemplates.length);
      return filteredTemplates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        required: template.mandatory,
        programName
      }));
    } catch (error) {
      console.error('[PresetDocumentService] Error in getPresetRequirementsAsync:', error);
      return [];
    }
  }

  /**
   * Synchronous version that returns empty array
   * Use getPresetRequirementsAsync for actual data
   * @deprecated Use getPresetRequirementsAsync instead
   */
  getPresetRequirements(programName: string): PresetDocumentRequirement[] {
    console.warn('[PresetDocumentService] getPresetRequirements is deprecated. Use getPresetRequirementsAsync instead.');
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
        console.error('[PresetDocumentService] Error fetching programs:', error);
        return [];
      }

      return (data || []).map(p => p.name);
    } catch (error) {
      console.error('[PresetDocumentService] Error in getAvailableProgramsAsync:', error);
      return [];
    }
  }

  /**
   * @deprecated Use getAvailableProgramsAsync instead
   */
  getAvailablePrograms(): string[] {
    console.warn('[PresetDocumentService] getAvailablePrograms is deprecated. Use getAvailableProgramsAsync instead.');
    return [];
  }

  // Get uploaded documents for a lead
  async getUploadedDocuments(leadId: string): Promise<UploadedDocument[]> {
    console.log('[PresetDocumentService] Fetching uploaded documents for lead:', leadId);
    
    const { data, error } = await supabase
      .from('lead_documents')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[PresetDocumentService] Error fetching documents:', error);
      throw error;
    }
    
    console.log('[PresetDocumentService] Found documents:', data?.length || 0);
    return data || [];
  }

  // Upload a document for a specific requirement
  async uploadDocument(
    leadId: string,
    file: File,
    requirementId: string,
    programName: string,
    entryRequirementId?: string
  ): Promise<UploadedDocument> {
    console.log('[PresetDocumentService] Starting document upload:', {
      leadId,
      requirementId,
      programName,
      entryRequirementId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    try {
      // Get current user for storage path (required by RLS policy)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('[PresetDocumentService] User authentication error:', userError);
        throw new Error('User not authenticated');
      }

      console.log('[PresetDocumentService] Authenticated user:', user.id);

      // Generate unique file path using user_id as first folder (required by RLS policy)
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || 'bin';
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${user.id}/${leadId}/${requirementId}_${timestamp}_${sanitizedFileName}`;

      console.log('[PresetDocumentService] Uploading to storage path:', fileName);

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lead-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('[PresetDocumentService] Storage upload error:', {
          error: uploadError,
          message: uploadError.message,
          name: uploadError.name
        });
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      console.log('[PresetDocumentService] Storage upload successful:', uploadData.path);

      // Find the requirement details from database
      const requirements = await this.getPresetRequirementsAsync(programName);
      const requirement = requirements.find(r => r.id === requirementId);
      
      const documentName = requirement?.name || file.name;

      console.log('[PresetDocumentService] Creating document record with name:', documentName);

      // Create document record in database
      const { data, error } = await supabase
        .from('lead_documents')
        .insert({
          lead_id: leadId,
          user_id: user.id,
          document_name: documentName,
          document_type: file.type,
          file_path: uploadData.path,
          file_size: file.size,
          requirement_id: requirementId,
          entry_requirement_id: entryRequirementId || null,
          admin_status: 'pending',
          original_filename: file.name
        })
        .select()
        .single();

      if (error) {
        console.error('[PresetDocumentService] Database insert error:', error);
        // Try to clean up the uploaded file if database insert fails
        await supabase.storage.from('lead-documents').remove([uploadData.path]);
        throw new Error(`Failed to create document record: ${error.message}`);
      }

      console.log('[PresetDocumentService] Document record created successfully:', data.id);
      return data;
    } catch (error) {
      console.error('[PresetDocumentService] uploadDocument failed:', error);
      throw error;
    }
  }

  // Update document status (approve/reject)
  async updateDocumentStatus(
    documentId: string,
    status: string,
    comments?: string
  ): Promise<void> {
    console.log('[PresetDocumentService] Updating document status:', { documentId, status, comments });
    
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

    if (error) {
      console.error('[PresetDocumentService] Error updating document status:', error);
      throw error;
    }
    
    console.log('[PresetDocumentService] Document status updated successfully');
  }

  // Delete a document
  async deleteDocument(documentId: string): Promise<void> {
    console.log('[PresetDocumentService] Deleting document:', documentId);
    
    // Get document info first
    const { data: doc, error: fetchError } = await supabase
      .from('lead_documents')
      .select('file_path')
      .eq('id', documentId)
      .single();

    if (fetchError) {
      console.error('[PresetDocumentService] Error fetching document for deletion:', fetchError);
      throw fetchError;
    }

    // Delete from storage
    if (doc?.file_path) {
      console.log('[PresetDocumentService] Deleting file from storage:', doc.file_path);
      const { error: storageError } = await supabase.storage
        .from('lead-documents')
        .remove([doc.file_path]);
        
      if (storageError) {
        console.warn('[PresetDocumentService] Storage deletion warning:', storageError);
        // Continue with database deletion even if storage fails
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('lead_documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      console.error('[PresetDocumentService] Error deleting document record:', error);
      throw error;
    }
    
    console.log('[PresetDocumentService] Document deleted successfully');
  }

  // Get document URL for viewing
  async getDocumentUrl(filePath: string): Promise<string> {
    console.log('[PresetDocumentService] Getting signed URL for:', filePath);
    
    const { data, error } = await supabase.storage
      .from('lead-documents')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.error('[PresetDocumentService] Error creating signed URL:', error);
      return '';
    }

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
