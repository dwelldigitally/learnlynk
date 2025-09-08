import { useState, useEffect } from 'react';
import { PendingAIAction, AIActionBulkPreview } from '@/types/pendingAIAction';
import { useToast } from '@/hooks/use-toast';

export function usePendingAIActions() {
  const [actions, setActions] = useState<PendingAIAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    generateDemoActions();
  }, []);

  const generateDemoActions = () => {
    const demoActions: PendingAIAction[] = [
      {
        id: 'ai-action-1',
        leadId: 'lead-001',
        leadName: 'Sarah Martinez',
        leadEmail: 'sarah.martinez@email.com',
        leadPhone: '+1 (555) 234-5678',
        leadSource: 'web',
        leadStatus: 'new',
        triggerEvent: 'High engagement detected',
        triggerTimestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        triggerDetails: 'Visited pricing page 4 times, downloaded brochure, spent 12 minutes on program details',
        recommendedAction: {
          type: 'call',
          title: 'Priority Call - Hot Lead',
          description: 'Immediate phone outreach to capitalize on high buying intent',
          playbook: 'hot-lead-immediate-response',
          playbookDescription: '5-minute callback playbook with pricing discussion and application assistance',
          urgency: 'critical',
          confidenceScore: 94,
          estimatedImpact: 87,
          expectedOutcome: '85% chance of scheduling enrollment call'
        },
        boundPolicies: [
          {
            name: 'Business Hours Only',
            impact: 'Action will execute immediately (within business hours)',
            status: 'compliant'
          },
          {
            name: 'No Consecutive Calls',
            impact: 'No restrictions (first contact attempt)',
            status: 'compliant'
          }
        ],
        aiReasoning: {
          primaryFactors: [
            'Multiple pricing page visits in last hour',
            'Downloaded brochure and program guide',
            'Extended time on website (12+ minutes)',
            'High lead score (89/100)'
          ],
          riskFactors: [
            'New lead - no previous interaction history'
          ],
          opportunityScore: 94,
          similarCases: 147,
          successRate: 78
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: 'ai-action-2',
        leadId: 'lead-002',
        leadName: 'Michael Chen',
        leadEmail: 'mchen@company.com',
        leadPhone: '+1 (555) 345-6789',
        leadSource: 'referral',
        leadStatus: 'contacted',
        triggerEvent: 'Email engagement drop',
        triggerTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        triggerDetails: 'Last 3 emails unopened, previously high engagement, competitor research detected',
        recommendedAction: {
          type: 'email',
          title: 'Re-engagement Email Campaign',
          description: 'Personalized email with new approach to re-capture interest',
          playbook: 'stalled-lead-recovery',
          playbookDescription: 'Question-based email with success stories and social proof',
          urgency: 'high',
          confidenceScore: 82,
          estimatedImpact: 71,
          expectedOutcome: '65% chance of re-engagement within 48 hours'
        },
        boundPolicies: [
          {
            name: 'Email Frequency Limit',
            impact: 'Last email sent 3 days ago - safe to proceed',
            status: 'compliant'
          },
          {
            name: 'Competitor Mention Alert',
            impact: 'Use approved competitive positioning content',
            status: 'compliant'
          }
        ],
        aiReasoning: {
          primaryFactors: [
            'Previous high engagement (85% email open rate)',
            'Competitive research activity detected',
            'LinkedIn profile visits suggest active program search',
            'Similar leads respond well to question-based approach'
          ],
          riskFactors: [
            'Recent email engagement decline',
            'Possible competitor evaluation in progress'
          ],
          opportunityScore: 82,
          similarCases: 89,
          successRate: 64
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ai-action-3',
        leadId: 'lead-003',
        leadName: 'Jennifer Wilson',
        leadEmail: 'j.wilson@email.com',
        leadSource: 'social_media',
        leadStatus: 'qualified',
        triggerEvent: 'Application abandoned',
        triggerTimestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        triggerDetails: 'Started application, completed 70%, abandoned at financial aid section',
        recommendedAction: {
          type: 'call',
          title: 'Application Assistance Call',
          description: 'Help complete application and address financial aid concerns',
          playbook: 'application-abandonment-recovery',
          playbookDescription: 'Proactive assistance call focusing on financial aid options and support',
          urgency: 'high',
          confidenceScore: 88,
          estimatedImpact: 76,
          expectedOutcome: '73% chance of application completion'
        },
        boundPolicies: [
          {
            name: 'Application Support Priority',
            impact: 'High priority - execute within 4 hours',
            status: 'compliant'
          },
          {
            name: 'Financial Discussion Guidelines',
            impact: 'Use certified financial aid advisor if needed',
            status: 'compliant'
          }
        ],
        aiReasoning: {
          primaryFactors: [
            'High application completion rate (70%)',
            'Specific abandonment at financial section',
            'Previous positive interactions',
            'Strong qualification indicators'
          ],
          riskFactors: [
            'Financial concerns may indicate budget constraints'
          ],
          opportunityScore: 88,
          similarCases: 203,
          successRate: 71
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    setActions(demoActions);
    setLoading(false);
  };

  const approveAction = async (actionId: string) => {
    try {
      setActions(prev => prev.map(action => 
        action.id === actionId 
          ? { ...action, status: 'approved' as const }
          : action
      ));

      const action = actions.find(a => a.id === actionId);
      toast({
        title: "Action Approved",
        description: `${action?.recommendedAction.title} will be executed according to policies.`,
      });
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Unable to approve action. Please try again.",
        variant: "destructive"
      });
    }
  };

  const rejectAction = async (actionId: string) => {
    try {
      setActions(prev => prev.map(action => 
        action.id === actionId 
          ? { ...action, status: 'rejected' as const }
          : action
      ));

      toast({
        title: "Action Rejected",
        description: "AI recommendation has been declined.",
      });
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "Unable to reject action. Please try again.",
        variant: "destructive"
      });
    }
  };

  const bulkApprove = async (actionIds: string[]) => {
    try {
      setActions(prev => prev.map(action => 
        actionIds.includes(action.id)
          ? { ...action, status: 'approved' as const }
          : action
      ));

      toast({
        title: "Bulk Approval Complete",
        description: `${actionIds.length} actions approved and will be executed according to policies.`,
      });

      setSelectedActions(new Set());
    } catch (error) {
      toast({
        title: "Bulk Approval Failed",
        description: "Unable to approve actions. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleSelection = (actionId: string) => {
    setSelectedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const pendingActions = actions.filter(action => action.status === 'pending');
    setSelectedActions(new Set(pendingActions.map(action => action.id)));
  };

  const clearSelection = () => {
    setSelectedActions(new Set());
  };

  const getBulkPreview = (): AIActionBulkPreview => {
    const selectedActionsData = actions.filter(action => selectedActions.has(action.id));
    
    const byType = selectedActionsData.reduce((acc, action) => {
      acc[action.recommendedAction.type] = (acc[action.recommendedAction.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byUrgency = selectedActionsData.reduce((acc, action) => {
      acc[action.recommendedAction.urgency] = (acc[action.recommendedAction.urgency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const policyConflicts = selectedActionsData.reduce((count, action) => {
      return count + action.boundPolicies.filter(p => p.status !== 'compliant').length;
    }, 0);

    const estimatedExecutionTime = selectedActionsData.length * 2; // 2 minutes per action average
    
    const avgImpact = selectedActionsData.reduce((sum, action) => 
      sum + action.recommendedAction.estimatedImpact, 0) / selectedActionsData.length;

    return {
      totalActions: selectedActionsData.length,
      byType,
      byUrgency,
      policyConflicts,
      estimatedExecutionTime,
      projectedImpact: `${Math.round(avgImpact)}% average impact score`
    };
  };

  const pendingActions = actions.filter(action => action.status === 'pending');

  return {
    actions: pendingActions,
    loading,
    selectedActions,
    approveAction,
    rejectAction,
    bulkApprove,
    toggleSelection,
    selectAll,
    clearSelection,
    getBulkPreview
  };
}