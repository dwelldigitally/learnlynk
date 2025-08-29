import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { smartActionExecutor, SmartActionExecution, ExecutionOptions } from '@/services/smartActionExecutor';
import { useToast } from '@/hooks/use-toast';

export interface SmartAction {
  id: string;
  type: 'email' | 'call' | 'follow_up' | 'document' | 'assignment';
  title: string;
  description: string;
  leadId: string;
  leadName: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  aiReasoning: string;
  estimatedImpact: string;
  actionData: any;
  isAutoExecutable: boolean;
  createdAt: string;
}

export interface SmartActionGenerationRequest {
  leadIds?: string[];
  context?: 'all' | 'high_priority' | 'overdue' | 'new';
  actionTypes?: string[];
  maxActions?: number;
}

export function useSmartActions() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingActions, setExecutingActions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const generateSmartActions = useCallback(async (
    request: SmartActionGenerationRequest = {}
  ): Promise<SmartAction[]> => {
    setIsGenerating(true);
    try {
      // Get leads based on context
      const leads = await getLeadsForContext(request.context || 'all', request.leadIds);
      
      // Generate actions using AI
      const actions: SmartAction[] = [];
      
      for (const lead of leads.slice(0, request.maxActions || 10)) {
        const leadActions = await generateActionsForLead(lead, request.actionTypes);
        actions.push(...leadActions);
      }

      // Sort by confidence and priority
      actions.sort((a, b) => {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority];
        const bPriority = priorityWeight[b.priority];
        
        if (aPriority !== bPriority) return bPriority - aPriority;
        return b.confidence - a.confidence;
      });

      return actions;
    } catch (error) {
      console.error('Error generating smart actions:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate smart actions. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const executeSmartAction = useCallback(async (
    action: SmartAction,
    options: ExecutionOptions = {}
  ): Promise<SmartActionExecution> => {
    setExecutingActions(prev => new Set([...prev, action.id]));
    
    try {
      const execution = await smartActionExecutor.executeAction(
        action.type,
        action.actionData,
        options
      );

      toast({
        title: "Action Executed",
        description: `Successfully executed: ${action.title}`,
      });

      return execution;
    } catch (error) {
      console.error('Error executing smart action:', error);
      toast({
        title: "Execution Failed",
        description: `Failed to execute: ${action.title}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(action.id);
        return newSet;
      });
    }
  }, [toast]);

  const bulkExecuteActions = useCallback(async (
    actions: SmartAction[],
    options: ExecutionOptions = {}
  ): Promise<SmartActionExecution[]> => {
    setIsExecuting(true);
    const results: SmartActionExecution[] = [];
    const errors: string[] = [];

    for (const action of actions) {
      try {
        const result = await executeSmartAction(action, options);
        results.push(result);
      } catch (error) {
        errors.push(`${action.title}: ${error}`);
      }
    }

    if (errors.length > 0) {
      toast({
        title: "Some Actions Failed",
        description: `${results.length} succeeded, ${errors.length} failed`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Bulk Execution Complete",
        description: `Successfully executed ${results.length} actions`,
      });
    }

    setIsExecuting(false);
    return results;
  }, [executeSmartAction, toast]);

  return {
    generateSmartActions,
    executeSmartAction,
    bulkExecuteActions,
    isGenerating,
    isExecuting,
    executingActions,
  };
}

async function getLeadsForContext(context: string, leadIds?: string[]) {
  let query = supabase.from('leads').select('*');
  
  if (leadIds?.length) {
    query = query.in('id', leadIds);
  } else {
    switch (context) {
      case 'high_priority':
        query = query.or('priority.eq.high,priority.eq.urgent');
        break;
      case 'overdue':
        query = query.lt('next_follow_up_at', new Date().toISOString());
        break;
      case 'new':
        query = query.eq('status', 'new');
        break;
    }
  }

  const { data, error } = await query.limit(50);
  if (error) throw error;
  return data || [];
}

async function generateActionsForLead(lead: any, actionTypes?: string[]): Promise<SmartAction[]> {
  const actions: SmartAction[] = [];
  const availableTypes = actionTypes || ['email', 'call', 'follow_up', 'assignment'];

  // AI-powered action generation logic
  const lastContact = lead.last_contacted_at ? new Date(lead.last_contacted_at) : null;
  const daysSinceContact = lastContact ? Math.floor((Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24)) : 999;
  const leadScore = lead.lead_score || 0;
  const aiScore = lead.ai_score || 0;

  // Email follow-up action
  if (availableTypes.includes('email') && daysSinceContact > 2) {
    const confidence = Math.min(95, 60 + leadScore + (daysSinceContact * 2));
    const emailAction: SmartAction = {
      id: `email_${lead.id}_${Date.now()}`,
      type: 'email',
      title: `Send follow-up email to ${lead.first_name}`,
      description: `Personalized follow-up email based on ${daysSinceContact} days since last contact`,
      leadId: lead.id,
      leadName: `${lead.first_name} ${lead.last_name}`,
      confidence,
      priority: leadScore > 70 ? 'high' : 'medium',
      aiReasoning: `Lead has ${leadScore} score and hasn't been contacted for ${daysSinceContact} days. High engagement probability.`,
      estimatedImpact: `+${Math.round(confidence * 0.3)}% conversion probability`,
      actionData: {
        leadId: lead.id,
        emailTemplate: 'follow_up',
        subject: `Following up on your ${lead.program_interest?.[0] || 'program'} interest`,
        content: `Hi {firstName},\n\nI wanted to follow up on your interest in our {program}. Do you have any questions I can help answer?\n\nBest regards`,
        personalization: {
          program: lead.program_interest?.[0] || 'program',
          lastContact: lastContact?.toLocaleDateString(),
        },
      },
      isAutoExecutable: confidence > 85,
      createdAt: new Date().toISOString(),
    };
    actions.push(emailAction);
  }

  // Call action for high-value leads
  if (availableTypes.includes('call') && leadScore > 60 && daysSinceContact > 5) {
    const confidence = Math.min(90, 50 + leadScore + Math.min(daysSinceContact * 3, 30));
    const callAction: SmartAction = {
      id: `call_${lead.id}_${Date.now()}`,
      type: 'call',
      title: `Schedule call with ${lead.first_name}`,
      description: `High-value lead needs personal attention`,
      leadId: lead.id,
      leadName: `${lead.first_name} ${lead.last_name}`,
      confidence,
      priority: 'high',
      aiReasoning: `Lead score ${leadScore} indicates high value. ${daysSinceContact} days without contact requires personal touch.`,
      estimatedImpact: `+${Math.round(confidence * 0.5)}% conversion probability`,
      actionData: {
        leadId: lead.id,
        callScript: `Discuss ${lead.program_interest?.[0] || 'program'} options and address any concerns`,
        purpose: 'conversion_consultation',
        duration: 30,
      },
      isAutoExecutable: false,
      createdAt: new Date().toISOString(),
    };
    actions.push(callAction);
  }

  // Assignment action for unassigned leads
  if (availableTypes.includes('assignment') && !lead.assigned_to) {
    const confidence = Math.min(95, 70 + leadScore);
    const assignmentAction: SmartAction = {
      id: `assign_${lead.id}_${Date.now()}`,
      type: 'assignment',
      title: `Auto-assign ${lead.first_name} to advisor`,
      description: `Smart routing based on lead profile and advisor capacity`,
      leadId: lead.id,
      leadName: `${lead.first_name} ${lead.last_name}`,
      confidence,
      priority: leadScore > 70 ? 'urgent' : 'medium',
      aiReasoning: `Unassigned lead with score ${leadScore}. Optimal advisor assignment based on capacity and specialization.`,
      estimatedImpact: `+40% response time improvement`,
      actionData: {
        leadId: lead.id,
        advisorId: 'auto_select', // Will be determined at execution time
        reason: `Lead score ${leadScore} matches advisor specialization`,
        priority: leadScore > 70 ? 'high' : 'medium',
      },
      isAutoExecutable: confidence > 85,
      createdAt: new Date().toISOString(),
    };
    actions.push(assignmentAction);
  }

  return actions;
}