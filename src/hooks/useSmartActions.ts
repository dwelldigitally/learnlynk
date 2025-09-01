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
    console.log('[useSmartActions] Starting generation with request:', request);
    setIsGenerating(true);
    try {
      // Get leads based on context
      const leads = await getLeadsForContext(request.context || 'all', request.leadIds);
      console.log('[useSmartActions] Retrieved leads for processing:', leads.length);
      
      if (leads.length === 0) {
        console.warn('[useSmartActions] No leads found - cannot generate actions');
        return [];
      }
      
      // Generate actions using AI
      const actions: SmartAction[] = [];
      
      for (const lead of leads.slice(0, request.maxActions || 10)) {
        console.log(`[useSmartActions] Processing lead: ${lead.first_name} ${lead.last_name} (${lead.id})`);
        const leadActions = await generateActionsForLead(lead, request.actionTypes);
        console.log(`[useSmartActions] Generated ${leadActions.length} actions for ${lead.first_name}`);
        actions.push(...leadActions);
      }

      console.log(`[useSmartActions] Total actions generated: ${actions.length}`);

      // Sort by confidence and priority
      actions.sort((a, b) => {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority];
        const bPriority = priorityWeight[b.priority];
        
        if (aPriority !== bPriority) return bPriority - aPriority;
        return b.confidence - a.confidence;
      });

      console.log('[useSmartActions] Actions sorted and ready to return:', {
        total: actions.length,
        breakdown: actions.reduce((acc, action) => {
          acc[action.type] = (acc[action.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });

      return actions;
    } catch (error) {
      console.error('[useSmartActions] Error generating smart actions:', error);
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
  console.log(`[Smart Actions] Fetching leads for context: ${context}`, { leadIds });
  
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
      case 'all':
      default:
        // For 'all' context, we don't add additional filters
        break;
    }
  }

  const { data, error } = await query.limit(50);
  if (error) {
    console.error('[Smart Actions] Error fetching leads:', error);
    throw error;
  }
  
  console.log(`[Smart Actions] Found ${data?.length || 0} leads:`, data);
  return data || [];
}

async function generateActionsForLead(lead: any, actionTypes?: string[]): Promise<SmartAction[]> {
  const actions: SmartAction[] = [];
  const availableTypes = actionTypes || ['email', 'call', 'follow_up', 'assignment', 'document'];

  console.log(`[Smart Actions] Generating actions for lead: ${lead.first_name} ${lead.last_name}`, {
    leadId: lead.id,
    leadScore: lead.lead_score,
    status: lead.status,
    lastContact: lead.last_contacted_at,
    assignedTo: lead.assigned_to,
    programInterest: lead.program_interest
  });

  // Calculate enhanced lead metrics
  const lastContact = lead.last_contacted_at ? new Date(lead.last_contacted_at) : null;
  const daysSinceContact = lastContact ? Math.floor((Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24)) : 999;
  const leadAge = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const baseLeadScore = lead.lead_score || 0;
  
  // Calculate dynamic lead score if base score is low/missing
  const dynamicScore = calculateDynamicLeadScore(lead, leadAge, daysSinceContact);
  const effectiveLeadScore = Math.max(baseLeadScore, dynamicScore);
  
  console.log(`[Smart Actions] Lead metrics:`, {
    baseScore: baseLeadScore,
    dynamicScore,
    effectiveScore: effectiveLeadScore,
    leadAge,
    daysSinceContact
  });

  // 1. Email Actions - Generate for most leads
  if (availableTypes.includes('email')) {
    let shouldGenerateEmail = false;
    let emailType = 'follow_up';
    let reasoning = '';
    
    if (leadAge === 0) {
      // New lead - welcome email
      shouldGenerateEmail = true;
      emailType = 'welcome';
      reasoning = `New lead created today - welcome sequence recommended`;
    } else if (daysSinceContact > 2) {
      // Follow-up needed
      shouldGenerateEmail = true;
      emailType = 'follow_up';
      reasoning = `${daysSinceContact} days since last contact - re-engagement needed`;
    } else if (lead.status === 'new' && leadAge > 0) {
      // New status but not contacted
      shouldGenerateEmail = true;
      emailType = 'initial_contact';
      reasoning = `Lead in 'new' status for ${leadAge} days - initial contact needed`;
    }

    if (shouldGenerateEmail) {
      const confidence = Math.min(95, 55 + effectiveLeadScore + Math.min(daysSinceContact * 2, 25));
      const emailAction: SmartAction = {
        id: `email_${lead.id}_${Date.now()}`,
        type: 'email',
        title: `Send ${emailType.replace('_', ' ')} email to ${lead.first_name}`,
        description: `Personalized ${emailType} email - ${reasoning}`,
        leadId: lead.id,
        leadName: `${lead.first_name} ${lead.last_name}`,
        confidence,
        priority: effectiveLeadScore > 50 ? 'high' : leadAge === 0 ? 'medium' : 'low',
        aiReasoning: reasoning,
        estimatedImpact: `+${Math.round(confidence * 0.3)}% engagement probability`,
        actionData: {
          leadId: lead.id,
          emailTemplate: emailType,
          subject: getEmailSubject(emailType, lead),
          content: getEmailContent(emailType, lead),
          personalization: {
            program: lead.program_interest?.[0] || 'our programs',
            lastContact: lastContact?.toLocaleDateString(),
            leadAge,
          },
        },
        isAutoExecutable: confidence > 80,
        createdAt: new Date().toISOString(),
      };
      actions.push(emailAction);
      console.log(`[Smart Actions] Generated email action:`, emailAction.title);
    }
  }

  // 2. Call Actions - Lowered threshold and more conditions
  if (availableTypes.includes('call')) {
    let shouldGenerateCall = false;
    let callReasoning = '';
    
    if (effectiveLeadScore > 30 && daysSinceContact > 3) {
      shouldGenerateCall = true;
      callReasoning = `Lead score ${effectiveLeadScore} with ${daysSinceContact} days silence - personal touch needed`;
    } else if (lead.status === 'contacted' && daysSinceContact > 7) {
      shouldGenerateCall = true;
      callReasoning = `Previously contacted lead needs follow-up call after ${daysSinceContact} days`;
    } else if (lead.source === 'phone' || lead.source === 'referral') {
      shouldGenerateCall = true;
      callReasoning = `High-intent source (${lead.source}) - immediate call recommended`;
    }

    if (shouldGenerateCall) {
      const confidence = Math.min(90, 45 + effectiveLeadScore + Math.min(daysSinceContact * 2, 25));
      const callAction: SmartAction = {
        id: `call_${lead.id}_${Date.now()}`,
        type: 'call',
        title: `Schedule call with ${lead.first_name}`,
        description: `Personal outreach call - ${callReasoning}`,
        leadId: lead.id,
        leadName: `${lead.first_name} ${lead.last_name}`,
        confidence,
        priority: effectiveLeadScore > 50 ? 'high' : 'medium',
        aiReasoning: callReasoning,
        estimatedImpact: `+${Math.round(confidence * 0.4)}% conversion probability`,
        actionData: {
          leadId: lead.id,
          callScript: `Discuss ${lead.program_interest?.[0] || 'program'} options and address any concerns`,
          purpose: effectiveLeadScore > 50 ? 'conversion_consultation' : 'qualification_call',
          duration: 30,
        },
        isAutoExecutable: false,
        createdAt: new Date().toISOString(),
      };
      actions.push(callAction);
      console.log(`[Smart Actions] Generated call action:`, callAction.title);
    }
  }

  // 3. Follow-up Actions - For leads needing nurturing
  if (availableTypes.includes('follow_up') && leadAge > 1) {
    const confidence = Math.min(85, 50 + (effectiveLeadScore * 0.5) + (leadAge * 2));
    const followUpAction: SmartAction = {
      id: `followup_${lead.id}_${Date.now()}`,
      type: 'follow_up',
      title: `Schedule follow-up for ${lead.first_name}`,
      description: `Nurturing sequence based on ${leadAge} day lead age`,
      leadId: lead.id,
      leadName: `${lead.first_name} ${lead.last_name}`,
      confidence,
      priority: leadAge > 7 ? 'medium' : 'low',
      aiReasoning: `Lead age ${leadAge} days indicates need for structured follow-up sequence`,
      estimatedImpact: `+${Math.round(confidence * 0.25)}% long-term conversion`,
      actionData: {
        leadId: lead.id,
        followUpType: leadAge > 7 ? 're_engagement' : 'nurturing',
        scheduledDays: leadAge > 7 ? 1 : 3,
        sequence: 'standard_nurturing',
      },
      isAutoExecutable: confidence > 75,
      createdAt: new Date().toISOString(),
    };
    actions.push(followUpAction);
    console.log(`[Smart Actions] Generated follow-up action:`, followUpAction.title);
  }

  // 4. Assignment Actions - For all unassigned leads
  if (availableTypes.includes('assignment') && !lead.assigned_to) {
    const confidence = Math.min(95, 65 + effectiveLeadScore);
    const assignmentAction: SmartAction = {
      id: `assign_${lead.id}_${Date.now()}`,
      type: 'assignment',
      title: `Auto-assign ${lead.first_name} to advisor`,
      description: `Smart routing based on lead profile and advisor capacity`,
      leadId: lead.id,
      leadName: `${lead.first_name} ${lead.last_name}`,
      confidence,
      priority: effectiveLeadScore > 50 ? 'urgent' : 'high',
      aiReasoning: `Unassigned lead with effective score ${effectiveLeadScore}. Immediate assignment improves response time.`,
      estimatedImpact: `+40% response time improvement`,
      actionData: {
        leadId: lead.id,
        advisorId: 'auto_select',
        reason: `Lead profile matches advisor specialization - score: ${effectiveLeadScore}`,
        priority: effectiveLeadScore > 50 ? 'high' : 'medium',
      },
      isAutoExecutable: confidence > 85,
      createdAt: new Date().toISOString(),
    };
    actions.push(assignmentAction);
    console.log(`[Smart Actions] Generated assignment action:`, assignmentAction.title);
  }

  // 5. Document Actions - For new leads or qualification needs
  if (availableTypes.includes('document')) {
    let shouldGenerateDocument = false;
    let docType = 'application_summary';
    let docReasoning = '';
    
    if (leadAge === 0) {
      shouldGenerateDocument = true;
      docType = 'welcome_packet';
      docReasoning = 'New lead - welcome packet with program information';
    } else if (lead.status === 'new' && !lead.program_interest?.length) {
      shouldGenerateDocument = true;
      docType = 'program_overview';
      docReasoning = 'Lead needs program information for qualification';
    } else if (effectiveLeadScore > 40) {
      shouldGenerateDocument = true;
      docType = 'application_summary';
      docReasoning = 'Qualified lead - application summary for next steps';
    }

    if (shouldGenerateDocument) {
      const confidence = Math.min(80, 60 + (effectiveLeadScore * 0.3));
      const documentAction: SmartAction = {
        id: `document_${lead.id}_${Date.now()}`,
        type: 'document',
        title: `Generate ${docType.replace('_', ' ')} for ${lead.first_name}`,
        description: docReasoning,
        leadId: lead.id,
        leadName: `${lead.first_name} ${lead.last_name}`,
        confidence,
        priority: 'low',
        aiReasoning: docReasoning,
        estimatedImpact: `+${Math.round(confidence * 0.2)}% information clarity`,
        actionData: {
          leadId: lead.id,
          documentType: docType,
          template: docType,
          personalized: true,
        },
        isAutoExecutable: confidence > 70,
        createdAt: new Date().toISOString(),
      };
      actions.push(documentAction);
      console.log(`[Smart Actions] Generated document action:`, documentAction.title);
    }
  }

  console.log(`[Smart Actions] Generated ${actions.length} total actions for ${lead.first_name}`);
  return actions;
}

function calculateDynamicLeadScore(lead: any, leadAge: number, daysSinceContact: number): number {
  let score = 20; // Base score for all leads
  
  // Source quality scoring
  const sourceScores: Record<string, number> = {
    'referral': 25,
    'phone': 20,
    'web': 15,
    'social_media': 10,
    'agent': 15,
    'other': 5
  };
  score += sourceScores[lead.source] || 5;
  
  // Recency scoring (newer leads get higher scores)
  if (leadAge === 0) score += 15; // Brand new
  else if (leadAge <= 3) score += 10; // Very recent
  else if (leadAge <= 7) score += 5; // Recent
  
  // Program interest scoring
  if (lead.program_interest?.length > 0) score += 10;
  if (lead.program_interest?.length > 1) score += 5; // Multiple interests
  
  // Contact info completeness
  if (lead.phone) score += 5;
  if (lead.email) score += 5;
  
  // UTM campaign data (indicates marketing engagement)
  if (lead.utm_campaign || lead.utm_source) score += 5;
  
  return Math.min(score, 80); // Cap at 80 for dynamic scoring
}

function getEmailSubject(emailType: string, lead: any): string {
  const program = lead.program_interest?.[0] || 'our programs';
  
  switch (emailType) {
    case 'welcome':
      return `Welcome! Next steps for your ${program} interest`;
    case 'initial_contact':
      return `Your ${program} inquiry - let's connect`;
    case 'follow_up':
      return `Following up on your ${program} interest`;
    default:
      return `Update on your ${program} application`;
  }
}

function getEmailContent(emailType: string, lead: any): string {
  const program = lead.program_interest?.[0] || 'program';
  
  switch (emailType) {
    case 'welcome':
      return `Hi {firstName},\n\nWelcome! Thank you for your interest in our ${program}. I'm excited to help you explore this opportunity.\n\nI'll be in touch soon with more details and next steps.\n\nBest regards`;
    case 'initial_contact':
      return `Hi {firstName},\n\nI noticed you're interested in our ${program}. I'd love to learn more about your goals and see how we can help.\n\nWhen would be a good time for a quick call?\n\nBest regards`;
    case 'follow_up':
      return `Hi {firstName},\n\nI wanted to follow up on your interest in our ${program}. Do you have any questions I can help answer?\n\nI'm here to help you with the next steps.\n\nBest regards`;
    default:
      return `Hi {firstName},\n\nI have some updates regarding your ${program} application. Let's connect to discuss your next steps.\n\nBest regards`;
  }
}