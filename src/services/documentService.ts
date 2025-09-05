import { supabase } from '@/integrations/supabase/client';

export interface DocumentRequirement {
  id: string;
  name: string;
  type: string;
  description: string;
  required: boolean;
  order: number;
}

export interface LeadDocument {
  id: string;
  lead_id: string;
  requirement_id?: string;
  document_name: string;
  original_filename?: string;
  file_path?: string;
  file_size?: number;
  document_type: string;
  status: string;
  upload_date?: string;
  required?: boolean;
  ai_insight?: string;
  admin_comments?: string;
  admin_reviewed_by?: string;
  admin_reviewed_at?: string;
  admin_status?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Program {
  id: string;
  name: string;
  type: string;
  document_requirements?: any;
}

class DocumentService {
  async getPrograms(): Promise<Program[]> {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
    return data || [];
  }

  async getDocumentRequirements(programName: string): Promise<DocumentRequirement[]> {
    const { data, error } = await supabase
      .from('programs')
      .select('document_requirements')
      .eq('name', programName)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (error) throw error;
    
    // Parse the JSONB document_requirements
    const requirements = data?.document_requirements;
    if (Array.isArray(requirements)) {
      return requirements as unknown as DocumentRequirement[];
    }
    return [];
  }

  async getLeadDocuments(leadId: string): Promise<LeadDocument[]> {
    const { data, error } = await supabase
      .from('lead_documents')
      .select('*')
      .eq('lead_id', leadId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async uploadDocument(
    leadId: string,
    file: File,
    requirementId?: string,
    documentName?: string
  ): Promise<LeadDocument> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    // Generate unique file path
    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}/${leadId}/${timestamp}_${file.name}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lead-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Create document record
    const { data, error } = await supabase
      .from('lead_documents')
      .insert({
        lead_id: leadId,
        requirement_id: requirementId,
        user_id: userId,
        document_name: documentName || file.name,
        original_filename: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        document_type: file.type,
        status: 'uploaded',
        admin_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

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
      .eq('id', documentId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async deleteDocument(documentId: string): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Get document info first
    const { data: doc, error: fetchError } = await supabase
      .from('lead_documents')
      .select('file_path')
      .eq('id', documentId)
      .eq('user_id', userId)
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
      .eq('id', documentId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getDocumentUrl(filePath: string): Promise<string> {
    const { data } = await supabase.storage
      .from('lead-documents')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    return data?.signedUrl || '';
  }
}

export const documentService = new DocumentService();