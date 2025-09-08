export interface PendingAIAction {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  leadSource: string;
  leadStatus: string;
  triggerEvent: string;
  triggerTimestamp: string;
  triggerDetails: string;
  recommendedAction: {
    type: 'call' | 'email' | 'sms' | 'meeting' | 'document' | 'nurture';
    title: string;
    description: string;
    playbook: string;
    playbookDescription: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    confidenceScore: number;
    estimatedImpact: number;
    expectedOutcome: string;
  };
  boundPolicies: {
    name: string;
    impact: string;
    status: 'compliant' | 'delayed' | 'blocked';
  }[];
  aiReasoning: {
    primaryFactors: string[];
    riskFactors: string[];
    opportunityScore: number;
    similarCases: number;
    successRate: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AIActionBulkPreview {
  totalActions: number;
  byType: Record<string, number>;
  byUrgency: Record<string, number>;
  policyConflicts: number;
  estimatedExecutionTime: number;
  projectedImpact: string;
}