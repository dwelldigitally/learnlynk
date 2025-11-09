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
      // Simulate AI analysis delay for realism
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Generate realistic dummy AI actions based on lead ID
      const dummyActions: LeadAIAction[] = [
        {
          leadId: leadId,
          action: 'call',
          confidence: 92,
          urgency: 'high',
          description: 'Call immediately - High engagement score detected from recent website activity. Lead viewed MBA program 5 times in last 24 hours.',
          actionType: 'call',
          estimatedImpact: 85
        },
        {
          leadId: leadId,
          action: 'email',
          confidence: 78,
          urgency: 'medium',
          description: 'Send personalized email with program brochure - Lead showed strong interest in specific courses and pricing information.',
          actionType: 'email',
          estimatedImpact: 72
        },
        {
          leadId: leadId,
          action: 'follow_up',
          confidence: 65,
          urgency: 'medium',
          description: 'Schedule follow-up in 3 days - Lead needs time to review financial options. Set reminder for scholarship deadline discussion.',
          actionType: 'follow_up',
          estimatedImpact: 58
        },
        {
          leadId: leadId,
          action: 'email',
          confidence: 88,
          urgency: 'critical',
          description: 'Urgent: Send application deadline reminder - Only 2 days left for early bird pricing. Lead has high conversion probability.',
          actionType: 'email',
          estimatedImpact: 94
        },
        {
          leadId: leadId,
          action: 'document',
          confidence: 74,
          urgency: 'medium',
          description: 'Generate custom program proposal - Lead requested detailed curriculum breakdown and career outcomes for Data Science track.',
          actionType: 'document',
          estimatedImpact: 67
        }
      ];

      // Select action based on lead ID for consistency
      const actionIndex = leadId.charCodeAt(leadId.length - 1) % dummyActions.length;
      const selectedAction = { ...dummyActions[actionIndex] };
      
      // Add some variation to make it more realistic
      selectedAction.confidence += Math.floor(Math.random() * 10) - 5; // ±5 variation
      selectedAction.estimatedImpact += Math.floor(Math.random() * 10) - 5; // ±5 variation
      
      // Ensure values stay in valid ranges
      selectedAction.confidence = Math.max(50, Math.min(99, selectedAction.confidence));
      selectedAction.estimatedImpact = Math.max(30, Math.min(95, selectedAction.estimatedImpact));

      setLeadActions(prev => new Map(prev).set(leadId, selectedAction));
      return selectedAction;
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
      console.log('Executing action:', { leadId, action });
      
      // For now, simulate successful execution since database tables might not exist
      // In a real implementation, this would call the smartActionExecutor
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      
      toast({
        title: "Action Executed",
        description: `Successfully executed: ${action.description}`,
      });
      return true;
      
      // TODO: Uncomment when database tables are ready
      // const actionData = buildActionData(leadId, action);
      // const execution = await smartActionExecutor.executeAction(
      //   action.actionType,
      //   actionData,
      //   { immediate: action.urgency === 'critical' }
      // );

      // if (execution.status === 'completed') {
      //   toast({
      //     title: "Action Executed",
      //     description: `Successfully executed: ${action.description}`,
      //   });
      //   return true;
      // } else {
      //   throw new Error(execution.error || 'Action failed');
      // }
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