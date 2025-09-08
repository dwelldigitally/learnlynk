import { useState } from 'react';
import { AITaskIntelligenceService, StudentEngagement } from '@/services/aiTaskIntelligence';
import { smartActionExecutor } from '@/services/smartActionExecutor';
import { useToast } from '@/hooks/use-toast';

export interface LeadAIAction {
  leadId: string;
  action: string;
  confidence: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  actionType: 'email' | 'call' | 'follow_up' | 'document';
  estimatedImpact: number;
}

export interface BulkActionResult {
  successful: string[];
  failed: { leadId: string; error: string }[];
  total: number;
}

export function useLeadAIActions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [leadActions, setLeadActions] = useState<Map<string, LeadAIAction>>(new Map());
  const { toast } = useToast();

  const generateActionForLead = async (leadId: string): Promise<LeadAIAction | null> => {
    try {
      const engagement = await AITaskIntelligenceService.analyzeLeadEngagement(leadId);
      if (!engagement) return null;

      const action = mapEngagementToAction(engagement);
      setLeadActions(prev => new Map(prev).set(leadId, action));
      return action;
    } catch (error) {
      console.error('Error generating action for lead:', leadId, error);
      return null;
    }
  };

  const generateActionsForLeads = async (leadIds: string[]): Promise<Map<string, LeadAIAction>> => {
    setIsGenerating(true);
    const actions = new Map<string, LeadAIAction>();

    try {
      const promises = leadIds.map(async (leadId) => {
        const action = await generateActionForLead(leadId);
        if (action) actions.set(leadId, action);
      });

      await Promise.all(promises);
      setLeadActions(actions);
      
      toast({
        title: "AI Actions Generated",
        description: `Generated ${actions.size} intelligent actions for your leads`,
      });

      return actions;
    } catch (error) {
      console.error('Error generating bulk actions:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI actions. Please try again.",
        variant: "destructive",
      });
      return actions;
    } finally {
      setIsGenerating(false);
    }
  };

  const executeAction = async (leadId: string, action: LeadAIAction): Promise<boolean> => {
    setIsExecuting(true);
    
    try {
      const actionData = buildActionData(leadId, action);
      const execution = await smartActionExecutor.executeAction(
        action.actionType,
        actionData,
        { immediate: action.urgency === 'critical' }
      );

      if (execution.status === 'completed') {
        toast({
          title: "Action Executed",
          description: `Successfully executed: ${action.description}`,
        });
        return true;
      } else {
        throw new Error(execution.error || 'Action failed');
      }
    } catch (error) {
      console.error('Error executing action:', error);
      toast({
        title: "Execution Failed",
        description: `Failed to execute action: ${action.description}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsExecuting(false);
    }
  };

  const executeBulkActions = async (selectedLeadIds: string[]): Promise<BulkActionResult> => {
    setIsExecuting(true);
    const result: BulkActionResult = {
      successful: [],
      failed: [],
      total: selectedLeadIds.length
    };

    try {
      const promises = selectedLeadIds.map(async (leadId) => {
        const action = leadActions.get(leadId);
        if (!action) return { leadId, success: false, error: 'No action found' };

        try {
          const success = await executeAction(leadId, action);
          return { leadId, success, error: null };
        } catch (error) {
          return { 
            leadId, 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      });

      const results = await Promise.all(promises);
      
      results.forEach(executionResult => {
        if (executionResult.success) {
          result.successful.push(executionResult.leadId);
        } else {
          result.failed.push({ leadId: executionResult.leadId, error: executionResult.error || 'Unknown error' });
        }
      });

      toast({
        title: "Bulk Execution Complete",
        description: `${result.successful.length}/${result.total} actions executed successfully`,
        variant: result.failed.length > 0 ? "destructive" : "default",
      });

      return result;
    } catch (error) {
      console.error('Error in bulk execution:', error);
      toast({
        title: "Bulk Execution Failed",
        description: "Failed to execute bulk actions. Please try again.",
        variant: "destructive",
      });
      return result;
    } finally {
      setIsExecuting(false);
    }
  };

  const mapEngagementToAction = (engagement: StudentEngagement): LeadAIAction => {
    const confidence = Math.round(engagement.conversion_probability * 100);
    
    let actionType: LeadAIAction['actionType'] = 'email';
    let description = engagement.next_best_action;

    // Map next best action to specific action types
    if (engagement.next_best_action.toLowerCase().includes('call')) {
      actionType = 'call';
    } else if (engagement.next_best_action.toLowerCase().includes('follow')) {
      actionType = 'follow_up';
    } else if (engagement.next_best_action.toLowerCase().includes('document')) {
      actionType = 'document';
    }

    // Enhance description with confidence
    if (confidence > 80) {
      description = `${engagement.next_best_action} - ${confidence}% conversion probability`;
    } else if (confidence > 60) {
      description = `${engagement.next_best_action} - Good opportunity (${confidence}%)`;
    } else {
      description = `${engagement.next_best_action} - Standard follow-up (${confidence}%)`;
    }

    return {
      leadId: engagement.student_id,
      action: engagement.next_best_action,
      confidence,
      urgency: engagement.urgency_level,
      description,
      actionType,
      estimatedImpact: Math.round(engagement.conversion_probability * engagement.engagement_score * 100)
    };
  };

  const buildActionData = (leadId: string, action: LeadAIAction) => {
    const baseData = { leadId };

    switch (action.actionType) {
      case 'email':
        return {
          ...baseData,
          emailTemplate: 'personalized_follow_up',
          subject: 'Following up on your program interest',
          content: 'Hi {firstName}, I wanted to follow up on your interest in {program}...',
          personalization: { urgency: action.urgency }
        };
      case 'call':
        return {
          ...baseData,
          callScript: 'Introduction and program discussion',
          purpose: action.description,
          duration: action.urgency === 'critical' ? 30 : 15
        };
      case 'follow_up':
        return {
          ...baseData,
          followUpType: 'general',
          delay: action.urgency === 'critical' ? 0 : 1,
          content: action.description
        };
      case 'document':
        return {
          ...baseData,
          documentType: 'application_summary',
          data: { purpose: action.description }
        };
      default:
        return baseData;
    }
  };

  return {
    isGenerating,
    isExecuting,
    leadActions,
    generateActionForLead,
    generateActionsForLeads,
    executeAction,
    executeBulkActions,
  };
}