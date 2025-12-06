import { useState, useEffect } from 'react';
import { presetDocumentService, UploadedDocument, PresetDocumentRequirement } from '@/services/presetDocumentService';

interface DocumentProgress {
  total: number;
  uploaded: number;
  approved: number;
  pending: number;
  rejected: number;
  isComplete: boolean;
}

export const usePresetDocuments = (leadId: string, programName: string) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [requirements, setRequirements] = useState<PresetDocumentRequirement[]>([]);
  const [progress, setProgress] = useState<DocumentProgress>({
    total: 0,
    uploaded: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    isComplete: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load documents and requirements in parallel
      const [docs, reqs] = await Promise.all([
        presetDocumentService.getUploadedDocuments(leadId),
        presetDocumentService.getPresetRequirementsAsync(programName)
      ]);
      
      setDocuments(docs);
      setRequirements(reqs);
      
      // Calculate progress
      const progressData = await presetDocumentService.getDocumentProgressAsync(programName, docs);
      setProgress(progressData);
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
  }, [leadId, programName]);

  const refetchDocuments = () => {
    loadDocuments();
  };

  return {
    documents,
    requirements,
    progress,
    loading,
    error,
    refetchDocuments
  };
};
