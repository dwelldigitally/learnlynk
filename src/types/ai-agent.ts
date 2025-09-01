export interface AIAgent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'shadow' | 'inactive';
  createdAt: string;
  updatedAt: string;
  
  // Agent Purpose
  scope: string;
  functionalBoundaries: string[];
  
  // Confidence Thresholds
  confidenceThresholds: {
    fullAutoAction: number; // ≥90% default
    suggestionOnly: { min: number; max: number }; // 60-89% default
    noAction: number; // <60% default
  };
  
  // Personality & Tone
  personality: {
    tone: 'formal' | 'friendly' | 'supportive' | 'custom';
    customPrompts?: string;
    messageTemplates: Record<string, string>;
  };
  
  // Allowed Channels
  allowedChannels: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    phone: boolean;
  };
  
  // Journey/Play Integration
  journeyIntegration: {
    canOverrideSteps: boolean;
    canTriggerPlays: boolean;
    allowedJourneys: string[];
    allowedPlays: string[];
  };
  
  // Guardrails
  guardrails: {
    maxMessagesPerDay: number;
    forbiddenTopics: string[];
    excludedStudentGroups: string[];
    complianceRules: string[];
  };
  
  // Performance Metrics
  metrics?: {
    studentsManaged: number;
    tasksExecuted: number;
    averageConfidence: number;
    escalations: number;
    yieldImpact: number;
    messagePerformance: {
      sent: number;
      opened: number;
      clicked: number;
      replied: number;
      unsubscribed: number;
    };
  };
}

export interface AIAgentAction {
  id: string;
  agentId: string;
  studentId: string;
  type: 'email' | 'sms' | 'journey_move' | 'play_trigger' | 'escalation' | 'document_request';
  action: string;
  confidence: number;
  status: 'executed' | 'suggested' | 'pending_review' | 'rejected';
  timestamp: string;
  context: Record<string, any>;
  result?: {
    success: boolean;
    response?: string;
    error?: string;
  };
}

export interface AIAgentWizardData {
  // Step 1: Agent Purpose
  name: string;
  description: string;
  scope: string;
  functionalBoundaries: string[];
  
  // Step 2: Confidence Thresholds
  confidenceThresholds: AIAgent['confidenceThresholds'];
  
  // Step 3: Personality & Tone
  personality: AIAgent['personality'];
  
  // Step 4: Allowed Channels
  allowedChannels: AIAgent['allowedChannels'];
  
  // Step 5: Journey/Play Integration
  journeyIntegration: AIAgent['journeyIntegration'];
  
  // Step 6: Guardrails
  guardrails: AIAgent['guardrails'];
  
  // Deployment mode
  deploymentMode?: 'shadow' | 'live';
}

export interface AIAgentAnalytics {
  agentId: string;
  timeframe: 'today' | 'week' | 'month';
  actionsTaken: number;
  messagePerformance: {
    ctr: number;
    replyRate: number;
    unsubscribeRate: number;
  };
  escalationsMade: number;
  lagTimeSaved: number; // in hours
  yieldImpact: number; // percentage uplift
  confidenceDistribution: {
    high: number; // >90%
    medium: number; // 60-89%
    low: number; // <60%
  };
}