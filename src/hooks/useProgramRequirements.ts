import { useState, useEffect } from 'react';
import { programRequirementsService } from '@/services/programRequirementsService';

export function useProgramRequirements(programId?: string) {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRequirements = async () => {
    if (!programId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await programRequirementsService.getRequirementsForProgram(programId);
      setRequirements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load program requirements');
      console.error('Error loading program requirements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequirements();
  }, [programId]);

  return {
    requirements,
    loading,
    error,
    refetch: loadRequirements
  };
}
