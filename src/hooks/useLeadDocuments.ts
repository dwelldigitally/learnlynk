import { useState, useEffect } from 'react';
import { documentService, LeadDocument } from '@/services/documentService';

export function useLeadDocuments(leadId: string) {
  const [documents, setDocuments] = useState<LeadDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    if (!leadId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await documentService.getLeadDocuments(leadId);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [leadId]);

  return {
    documents,
    loading,
    error,
    refetch: loadDocuments
  };
}