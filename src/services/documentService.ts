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

export interface PaginatedDocumentsResponse {
  documents: LeadDocument[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Pagination constants
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

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
    
    const requirements = data?.document_requirements;
    if (Array.isArray(requirements)) {
      return requirements as unknown as DocumentRequirement[];
    }
    return [];
  }

  // OPTIMIZED: Added pagination support
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

  // NEW: Paginated document fetching for large datasets
  async getLeadDocumentsPaginated(
    leadId: string,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedDocumentsResponse> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      return {
        documents: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      };
    }

    const limitedPageSize = Math.min(pageSize, MAX_PAGE_SIZE);
    const offset = (page - 1) * limitedPageSize;

    const { data, error, count } = await supabase
      .from('lead_documents')
      .select('*', { count: 'exact' })
      .eq('lead_id', leadId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limitedPageSize - 1);

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / limitedPageSize);

    return {
      documents: data || [],
      total,
      page,
      pageSize: limitedPageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  // NEW: Get document count without fetching data (optimized for stats)
  async getLeadDocumentCount(leadId: string): Promise<number> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return 0;

    const { count, error } = await supabase
      .from('lead_documents')
      .select('*', { count: 'exact', head: true })
      .eq('lead_id', leadId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting document count:', error);
      return 0;
    }

    return count || 0;
  }

  // NEW: Get all documents for user with pagination
  async getAllDocumentsPaginated(
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    filters?: {
      status?: string;
      adminStatus?: string;
      documentType?: string;
    }
  ): Promise<PaginatedDocumentsResponse> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      return {
        documents: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      };
    }

    const limitedPageSize = Math.min(pageSize, MAX_PAGE_SIZE);
    const offset = (page - 1) * limitedPageSize;

    let query = supabase
      .from('lead_documents')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.adminStatus) {
      query = query.eq('admin_status', filters.adminStatus);
    }
    if (filters?.documentType) {
      query = query.eq('document_type', filters.documentType);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitedPageSize - 1);

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / limitedPageSize);

    return {
      documents: data || [],
      total,
      page,
      pageSize: limitedPageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  // NEW: Get document statistics (optimized single query)
  async getDocumentStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }

    const { data, error } = await supabase
      .from('lead_documents')
      .select('admin_status')
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting document stats:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(d => d.admin_status === 'pending').length || 0,
      approved: data?.filter(d => d.admin_status === 'approved').length || 0,
      rejected: data?.filter(d => d.admin_status === 'rejected').length || 0
    };

    return stats;
  }

  async uploadDocument(
    leadId: string,
    file: File,
    requirementId?: string,
    documentName?: string
  ): Promise<LeadDocument> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('User not authenticated');

    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}/${leadId}/${timestamp}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lead-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

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
  ): Promise<{ transitioned: boolean }> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Get the lead_id for this document first
    const { data: doc, error: docError } = await supabase
      .from('lead_documents')
      .select('lead_id')
      .eq('id', documentId)
      .single();
    
    if (docError) throw docError;
    
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

    // If document was approved, check for automatic stage transitions
    let transitioned = false;
    if (status === 'approved' && doc?.lead_id) {
      try {
        const { stageTransitionService } = await import('./stageTransitionService');
        transitioned = await stageTransitionService.checkTransitionOnDocumentApproval(doc.lead_id, documentId);
      } catch (err) {
        console.error('Error checking stage transition:', err);
      }
    }

    return { transitioned };
  }

  // NEW: Bulk update document status (optimized single query)
  async bulkUpdateDocumentStatus(
    documentIds: string[],
    status: string,
    comments?: string
  ): Promise<{ success: number; failed: number }> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return { success: 0, failed: documentIds.length };

    const { data, error } = await supabase
      .from('lead_documents')
      .update({
        admin_status: status,
        admin_reviewed_by: userId,
        admin_reviewed_at: new Date().toISOString(),
        admin_comments: comments
      })
      .in('id', documentIds)
      .eq('user_id', userId)
      .select('id');

    if (error) {
      console.error('Bulk update error:', error);
      return { success: 0, failed: documentIds.length };
    }

    return {
      success: data?.length || 0,
      failed: documentIds.length - (data?.length || 0)
    };
  }

  async deleteDocument(documentId: string): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    const { data: doc, error: fetchError } = await supabase
      .from('lead_documents')
      .select('file_path')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    if (doc?.file_path) {
      await supabase.storage
        .from('lead-documents')
        .remove([doc.file_path]);
    }

    const { error } = await supabase
      .from('lead_documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // NEW: Bulk delete documents (optimized)
  async bulkDeleteDocuments(documentIds: string[]): Promise<{ success: number; failed: number }> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return { success: 0, failed: documentIds.length };

    // Get file paths first
    const { data: docs, error: fetchError } = await supabase
      .from('lead_documents')
      .select('id, file_path')
      .in('id', documentIds)
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Error fetching documents for deletion:', fetchError);
      return { success: 0, failed: documentIds.length };
    }

    // Delete from storage in batch
    const filePaths = (docs || [])
      .map(d => d.file_path)
      .filter((path): path is string => !!path);
    
    if (filePaths.length > 0) {
      await supabase.storage
        .from('lead-documents')
        .remove(filePaths);
    }

    // Delete from database in single query
    const { error } = await supabase
      .from('lead_documents')
      .delete()
      .in('id', documentIds)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting documents:', error);
      return { success: 0, failed: documentIds.length };
    }

    return {
      success: docs?.length || 0,
      failed: documentIds.length - (docs?.length || 0)
    };
  }

  async getDocumentUrl(filePath: string): Promise<string> {
    const { data } = await supabase.storage
      .from('lead-documents')
      .createSignedUrl(filePath, 3600);

    return data?.signedUrl || '';
  }
}

export const documentService = new DocumentService();
