import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AITriageResult {
  prioritizedItems: Array<{
    id: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    reason: string;
    suggestedAction: string;
  }>;
  summary: string;
}

interface AIAssignmentResult {
  assignments: Array<{
    leadId: string;
    advisorId: string;
    reason: string;
    confidence: number;
  }>;
}

interface AIDraftResult {
  emailSubject: string;
  emailBody: string;
  smsMessage?: string;
  confidence: number;
}

export function useAIActions() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const performAITriage = async (items: any[]): Promise<AITriageResult> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-lead-scoring', {
        body: {
          currentRules: [],
          leadData: items,
          analysisType: 'triage'
        }
      });

      if (error) throw error;

      toast({
        title: "AI Triage Complete",
        description: `Analyzed ${items.length} items and provided prioritization recommendations.`
      });

      return data.result;
    } catch (error) {
      console.error('AI Triage error:', error);
      toast({
        title: "AI Triage Failed",
        description: "Unable to perform AI analysis. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const performAIAssignment = async (leadIds: string[], availableAdvisors: string[]): Promise<AIAssignmentResult> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-lead-scoring', {
        body: {
          leadIds,
          availableAdvisors,
          analysisType: 'assignment'
        }
      });

      if (error) throw error;

      toast({
        title: "AI Assignment Complete",
        description: `Generated assignment recommendations for ${leadIds.length} leads.`
      });

      return data.result;
    } catch (error) {
      console.error('AI Assignment error:', error);
      toast({
        title: "AI Assignment Failed",
        description: "Unable to generate assignments. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAIDraft = async (leadId: string, context: any): Promise<AIDraftResult> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-lead-scoring', {
        body: {
          leadId,
          context,
          analysisType: 'draft_outreach'
        }
      });

      if (error) throw error;

      toast({
        title: "AI Draft Generated",
        description: "Generated personalized outreach content based on lead context."
      });

      return data.result;
    } catch (error) {
      console.error('AI Draft error:', error);
      toast({
        title: "AI Draft Failed", 
        description: "Unable to generate draft. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    performAITriage,
    performAIAssignment,
    generateAIDraft
  };
}