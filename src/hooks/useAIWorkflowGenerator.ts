import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WorkflowElement {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  conditionGroups?: any[];
}

interface GeneratedWorkflow {
  name: string;
  description: string;
  elements: WorkflowElement[];
}

export function useAIWorkflowGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<GeneratedWorkflow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateWorkflow = async (
    description: string,
    existingElements?: WorkflowElement[]
  ): Promise<GeneratedWorkflow | null> => {
    setIsGenerating(true);
    setError(null);
    setGeneratedWorkflow(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-automation', {
        body: { 
          description,
          existingElements: existingElements?.length ? existingElements : undefined
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data?.success || !data?.workflow) {
        throw new Error(data?.error || 'Failed to generate workflow');
      }

      setGeneratedWorkflow(data.workflow);
      return data.workflow;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate workflow';
      setError(message);
      toast({
        title: "Generation Failed",
        description: message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearGenerated = () => {
    setGeneratedWorkflow(null);
    setError(null);
  };

  return {
    generateWorkflow,
    isGenerating,
    generatedWorkflow,
    error,
    clearGenerated,
  };
}
