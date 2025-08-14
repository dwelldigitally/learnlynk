import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export class DocumentService {
  /**
   * Get all documents for the current user
   */
  static async getDocuments() {
    const { data, error } = await supabase
      .from('student_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }

    // Transform database format to match demo data format
    return (data || []).map(doc => ({
      id: doc.id,
      studentId: doc.student_id,
      name: doc.name,
      type: doc.type,
      fileSize: doc.file_size,
      status: doc.status,
      uploadedAt: doc.uploaded_at,
      reviewedAt: doc.reviewed_at,
      comments: doc.comments
    }));
  }

  /**
   * Get documents for a specific student
   */
  static async getStudentDocuments(studentId: string) {
    const { data, error } = await supabase
      .from('student_documents')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching student documents:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Create a new document
   */
  static async createDocument(document: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('student_documents')
      .insert({
        ...document,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating document:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update a document
   */
  static async updateDocument(id: string, document: any) {
    const { data, error } = await supabase
      .from('student_documents')
      .update(document)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating document:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete a document
   */
  static async deleteDocument(id: string) {
    const { error } = await supabase
      .from('student_documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Get document statistics
   */
  static async getDocumentStats() {
    const { data: documents, error } = await supabase
      .from('student_documents')
      .select('status');

    if (error) {
      console.error('Error fetching document stats:', error);
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        underReview: 0
      };
    }

    const total = documents?.length || 0;
    const pending = documents?.filter(d => d.status === 'pending').length || 0;
    const approved = documents?.filter(d => d.status === 'approved').length || 0;
    const rejected = documents?.filter(d => d.status === 'rejected').length || 0;
    const underReview = documents?.filter(d => d.status === 'under_review').length || 0;

    return {
      total,
      pending,
      approved,
      rejected,
      underReview
    };
  }
}

/**
 * React hook to get documents
 */
export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => DocumentService.getDocuments(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * React hook to get documents for a specific student
 */
export function useStudentDocuments(studentId: string) {
  // Check if studentId is a valid UUID format (for real data) vs demo data (like "s1", "s2")
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId);
  
  return useQuery({
    queryKey: ['documents', 'student', studentId],
    queryFn: () => DocumentService.getStudentDocuments(studentId),
    enabled: !!studentId && isValidUUID,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * React hook to get document stats
 */
export function useDocumentStats() {
  return useQuery({
    queryKey: ['documents', 'stats'],
    queryFn: () => DocumentService.getDocumentStats(),
    staleTime: 5 * 60 * 1000,
  });
}