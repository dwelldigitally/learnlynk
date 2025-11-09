import { useState, useEffect } from 'react';
import { requirementVerificationService } from '@/services/requirementVerificationService';

export function useRequirementVerification(documentId?: string) {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVerifications = async () => {
    if (!documentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await requirementVerificationService.getDocumentVerifications(documentId);
      setVerifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verifications');
      console.error('Error loading verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifications();
  }, [documentId]);

  return {
    verifications,
    loading,
    error,
    refetch: loadVerifications
  };
}
