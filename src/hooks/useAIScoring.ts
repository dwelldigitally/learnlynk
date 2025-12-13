import { useState, useCallback } from 'react';
import { aiScoringService, AIScoreResult, AIModelInfo, TrainingDataStats } from '@/services/aiScoringService';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';

export function useAIScoring() {
  const { tenantId } = useTenant();
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [isScoringAll, setIsScoringAll] = useState(false);
  const [model, setModel] = useState<AIModelInfo | null>(null);
  const [trainingStats, setTrainingStats] = useState<TrainingDataStats | null>(null);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);

  const calculateScore = useCallback(async (leadId: string): Promise<AIScoreResult | null> => {
    if (!tenantId) return null;
    
    setIsCalculating(true);
    try {
      const result = await aiScoringService.calculateScore(leadId, tenantId);
      if (!result.success) {
        toast({
          title: 'Score calculation failed',
          description: result.error || 'Unable to calculate AI score',
          variant: 'destructive'
        });
      }
      return result;
    } finally {
      setIsCalculating(false);
    }
  }, [tenantId, toast]);

  const calculateScoresBatch = useCallback(async (leadIds: string[]) => {
    if (!tenantId) return new Map<string, AIScoreResult>();
    
    setIsCalculating(true);
    setProgress({ completed: 0, total: leadIds.length });
    try {
      return await aiScoringService.calculateScoresBatch(leadIds, tenantId, (completed, total) => {
        setProgress({ completed, total });
      });
    } finally {
      setIsCalculating(false);
      setProgress(null);
    }
  }, [tenantId]);

  const trainModel = useCallback(async (forceRetrain = false) => {
    if (!tenantId) return;
    
    setIsTraining(true);
    try {
      const result = await aiScoringService.trainModel(tenantId, forceRetrain);
      
      if (result.success) {
        toast({
          title: 'Model trained successfully',
          description: `AI scoring model v${result.model?.model_version} is now active`
        });
        if (result.model) {
          setModel(result.model);
        }
      } else {
        toast({
          title: 'Training failed',
          description: result.error || 'Unable to train AI model',
          variant: 'destructive'
        });
      }
      
      return result;
    } finally {
      setIsTraining(false);
    }
  }, [tenantId, toast]);

  const snapshotOutcome = useCallback(async (leadId: string, outcome: 'converted' | 'lost') => {
    if (!tenantId) return false;
    return aiScoringService.snapshotTrainingData(leadId, tenantId, outcome);
  }, [tenantId]);

  const loadModel = useCallback(async () => {
    if (!tenantId) return;
    const activeModel = await aiScoringService.getActiveModel(tenantId);
    setModel(activeModel);
    return activeModel;
  }, [tenantId]);

  const loadTrainingStats = useCallback(async () => {
    if (!tenantId) return;
    const stats = await aiScoringService.getTrainingDataStats(tenantId);
    setTrainingStats(stats);
    return stats;
  }, [tenantId]);

  const getScoreHistory = useCallback(async (leadId: string) => {
    return aiScoringService.getScoreHistory(leadId);
  }, []);

  const getModelAccuracy = useCallback(async () => {
    if (!tenantId) return null;
    return aiScoringService.getModelAccuracy(tenantId);
  }, [tenantId]);

  const backfillTrainingData = useCallback(async () => {
    if (!tenantId) return { success: 0, failed: 0 };
    
    setIsBackfilling(true);
    setProgress({ completed: 0, total: 0 });
    try {
      const result = await aiScoringService.backfillTrainingData(tenantId, (completed, total) => {
        setProgress({ completed, total });
      });
      
      if (result.success > 0) {
        toast({
          title: 'Training data backfilled',
          description: `Captured ${result.success} lead outcomes for training`
        });
        await loadTrainingStats();
      }
      
      return result;
    } finally {
      setIsBackfilling(false);
      setProgress(null);
    }
  }, [tenantId, toast, loadTrainingStats]);

  const scoreAllLeads = useCallback(async () => {
    if (!tenantId) return { success: 0, failed: 0 };
    
    setIsScoringAll(true);
    setProgress({ completed: 0, total: 0 });
    try {
      const result = await aiScoringService.scoreAllLeads(tenantId, (completed, total) => {
        setProgress({ completed, total });
      });
      
      toast({
        title: 'Batch scoring complete',
        description: `Scored ${result.success} leads${result.failed > 0 ? `, ${result.failed} failed` : ''}`
      });
      
      return result;
    } finally {
      setIsScoringAll(false);
      setProgress(null);
    }
  }, [tenantId, toast]);

  const trainAndScoreAll = useCallback(async () => {
    if (!tenantId) return;
    
    // First train the model
    const trainResult = await trainModel(true);
    if (!trainResult?.success) return;
    
    // Then score all active leads
    await scoreAllLeads();
  }, [tenantId, trainModel, scoreAllLeads]);

  return {
    // State
    isCalculating,
    isTraining,
    isBackfilling,
    isScoringAll,
    model,
    trainingStats,
    progress,
    
    // Actions
    calculateScore,
    calculateScoresBatch,
    trainModel,
    snapshotOutcome,
    loadModel,
    loadTrainingStats,
    getScoreHistory,
    getModelAccuracy,
    backfillTrainingData,
    scoreAllLeads,
    trainAndScoreAll
  };
}
