import { useState, useEffect } from 'react';
import { presetDocumentService, UploadedDocument } from '@/services/presetDocumentService';

export const usePresetDocuments = (leadId: string, programName: string) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await presetDocumentService.getUploadedDocuments(leadId);
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      loadDocuments();
    }
  }, [leadId]);

  const refetchDocuments = () => {
    loadDocuments();
  };

  return {
    documents,
    loading,
    error,
    refetchDocuments
  };
};