import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Bot, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Clock,
  Target,
  BarChart3,
  Activity,
  PlayCircle,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from "lucide-react";

interface RecentActivity {
  id: string;
  timestamp: string;
  type: 'ai_play' | 'policy_decision' | 'execution_log' | 'escalation';
  title: string;
  description: string;
  confidence?: number;
  outcome: 'success' | 'failed' | 'pending' | 'escalated';
  context: {
    studentId?: string;
    studentName?: string;
    program?: string;
    triggerReason?: string;
    policyName?: string;
    playName?: string;
  };
}

interface AIPlay {
  id: string;
  name: string;
  executionCount: number;
  successRate: number;
  averageConfidence: number;
  lastExecuted: string;
  decisionFactors: string[];
  outcomes: {
    completed: number;
    failed: number;
    escalated: number;
  };
}

interface PolicyDecision {
  id: string;
  policyName: string;
  decisionsCount: number;
  influenceLevel: 'high' | 'medium' | 'low';
  conditions: string[];
  outcomes: {
    allowed: number;
    blocked: number;
    modified: number;
  };
}

const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act-1',
    timestamp: '2024-01-23T14:30:00Z',
    type: 'ai_play',
    title: 'Welcome Sequence Executed',
    description: 'AI triggered welcome sequence for new international graduate inquiry',
    confidence: 87,
    outcome: 'success',
    context: {
      studentId: 'std-456',
      studentName: 'Sarah Chen',
      program: 'Masters in Computer Science',
      triggerReason: 'High engagement score + International status',
      playName: 'International Graduate Welcome'
    }
  },
  {
    id: 'act-2',
    timestamp: '2024-01-23T13:45:00Z',
    type: 'policy_decision',
    title: 'Message Frequency Policy Applied',
    description: 'Policy prevented excessive messaging to student who already received 3 messages today',
    outcome: 'success',
    context: {
      studentId: 'std-789',
      studentName: 'Michael Rodriguez',
      policyName: 'Daily Message Limit',
      triggerReason: 'Student reached daily message threshold'
    }
  },
  {
    id: 'act-3',
    timestamp: '2024-01-23T12:15:00Z',
    type: 'execution_log',
    title: 'Document Request Sent',
    description: 'AI agent requested missing transcripts from student via personalized email',
    confidence: 92,
    outcome: 'success',
    context: {
      studentId: 'std-123',
      studentName: 'Emma Wilson',
      program: 'Bachelor of Business',
      triggerReason: 'Application 80% complete, missing transcripts for 5+ days'
    }
  },
  {
    id: 'act-4',
    timestamp: '2024-01-23T11:30:00Z',
    type: 'escalation',
    title: 'Complex Financial Aid Query Escalated',
    description: 'Student inquiry about scholarship eligibility required human expertise',
    confidence: 34,
    outcome: 'escalated',
    context: {
      studentId: 'std-345',
      studentName: 'David Park',
      triggerReason: 'Low confidence score, complex financial aid topic'
    }
  },
  {
    id: 'act-5',
    timestamp: '2024-01-23T10:20:00Z',
    type: 'ai_play',
    title: 'Re-engagement Campaign Triggered',
    description: 'AI detected dormant application and initiated re-engagement sequence',
    confidence: 78,
    outcome: 'pending',
    context: {
      studentId: 'std-678',
      studentName: 'Lisa Thompson',
      program: 'MBA Program',
      triggerReason: 'No activity for 14 days, high initial interest score',
      playName: 'Dormant Application Revival'
    }
  }
];

const MOCK_AI_PLAYS: AIPlay[] = [
  {
    id: 'play-1',
    name: 'International Graduate Welcome',
    executionCount: 156,
    successRate: 89,
    averageConfidence: 86,
    lastExecuted: '2024-01-23T14:30:00Z',
    decisionFactors: ['International status', 'Graduate program', 'High engagement score'],
    outcomes: { completed: 139, failed: 12, escalated: 5 }
  },
  {
    id: 'play-2',
    name: 'Document Completion Reminder',
    executionCount: 234,
    successRate: 76,
    averageConfidence: 82,
    lastExecuted: '2024-01-23T12:15:00Z',
    decisionFactors: ['Incomplete application', 'Time since last activity', 'Missing critical documents'],
    outcomes: { completed: 178, failed: 41, escalated: 15 }
  },
  {
    id: 'play-3',
    name: 'High-Yield Conversion Push',
    executionCount: 89,
    successRate: 94,
    averageConfidence: 91,
    lastExecuted: '2024-01-23T09:45:00Z',
    decisionFactors: ['High lead score', 'Program fit', 'Geographic preference'],
    outcomes: { completed: 84, failed: 3, escalated: 2 }
  }
];

const MOCK_POLICY_DECISIONS: PolicyDecision[] = [
  {
    id: 'pol-1',
    policyName: 'Daily Message Limit',
    decisionsCount: 45,
    influenceLevel: 'high',
    conditions: ['Max 3 messages per day', 'Exclude weekends', 'Respect time zones'],
    outcomes: { allowed: 278, blocked: 45, modified: 12 }
  },
  {
    id: 'pol-2',
    policyName: 'Quiet Hours Protection',
    decisionsCount: 23,
    influenceLevel: 'medium',
    conditions: ['No messages 10PM-8AM local time', 'Holiday restrictions'],
    outcomes: { allowed: 456, blocked: 23, modified: 0 }
  },
  {
    id: 'pol-3',
    policyName: 'Content Appropriateness Filter',
    decisionsCount: 8,
    influenceLevel: 'high',
    conditions: ['No financial advice', 'No visa guidance', 'FERPA compliance'],
    outcomes: { allowed: 892, blocked: 8, modified: 34 }
  }
];

export function AIAdvisorAnalytics() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock agent data - in real app, would fetch based on agentId
  const agentName = agentId === 'agent-1' ? 'Domestic Undergrad Assistant' : 'AI Agent';
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ai_play': return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'policy_decision': return <Shield className="h-4 w-4 text-purple-600" />;
      case 'execution_log': return <Zap className="h-4 w-4 text-green-600" />;
      case 'escalation': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'escalated': return <ExternalLink className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/admin/leads/ai')}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to AI Agents
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{agentName} Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and activity tracking for AI agent performance
          </p>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students Managed</p>
                <p className="text-2xl font-bold">234</p>
                <p className="text-xs text-green-600">+12% this week</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actions Executed</p>
                <p className="text-2xl font-bold">1,456</p>
                <p className="text-xs text-green-600">+8% this week</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-green-600">+3% this week</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold">42.3h</p>
                <p className="text-xs text-green-600">This week</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Recent Activities
          </TabsTrigger>
          <TabsTrigger value="plays" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            AI Plays & Policies
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent AI Activities & Triggers
              </CardTitle>
              <CardDescription>
                Real-time view of AI decision-making, executions, and escalations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_RECENT_ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{activity.title}</h4>
                            <Badge variant={
                              activity.type === 'ai_play' ? 'default' : 
                              activity.type === 'policy_decision' ? 'secondary' : 
                              activity.type === 'execution_log' ? 'outline' : 
                              'destructive'
                            } className="text-xs">
                              {activity.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          
                          {/* Context Details */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                            {activity.context.studentName && (
                              <div>
                                <span className="font-medium">Student:</span> {activity.context.studentName}
                              </div>
                            )}
                            {activity.context.program && (
                              <div>
                                <span className="font-medium">Program:</span> {activity.context.program}
                              </div>
                            )}
                            {activity.context.triggerReason && (
                              <div className="col-span-2 md:col-span-1">
                                <span className="font-medium">Trigger:</span> {activity.context.triggerReason}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {activity.confidence && (
                          <Badge variant="outline" className="text-xs">
                            {activity.confidence}% confidence
                          </Badge>
                        )}
                        {getOutcomeIcon(activity.outcome)}
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plays" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Plays */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  AI Plays Execution
                </CardTitle>
                <CardDescription>
                  Automated plays executed by the AI agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_AI_PLAYS.map((play) => (
                    <div key={play.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{play.name}</h4>
                        <Badge variant="outline">{play.executionCount} executions</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-medium">{play.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Confidence</p>
                          <p className="font-medium">{play.averageConfidence}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Run</p>
                          <p className="font-medium">
                            {new Date(play.lastExecuted).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Decision Factors:</p>
                        <div className="flex flex-wrap gap-1">
                          {play.decisionFactors.map((factor, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Outcomes:</p>
                        <div className="flex gap-4 text-xs">
                          <span className="text-green-600">✓ {play.outcomes.completed} completed</span>
                          <span className="text-red-600">✗ {play.outcomes.failed} failed</span>
                          <span className="text-orange-600">↗ {play.outcomes.escalated} escalated</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Policy Decisions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Policy Decisions
                </CardTitle>
                <CardDescription>
                  Governing policies and their influence on AI decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_POLICY_DECISIONS.map((policy) => (
                    <div key={policy.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{policy.policyName}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            policy.influenceLevel === 'high' ? 'default' : 
                            policy.influenceLevel === 'medium' ? 'secondary' : 
                            'outline'
                          } className="text-xs">
                            {policy.influenceLevel} influence
                          </Badge>
                          <Badge variant="outline">{policy.decisionsCount} decisions</Badge>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Conditions:</p>
                        <div className="space-y-1">
                          {policy.conditions.map((condition, index) => (
                            <p key={index} className="text-xs text-muted-foreground">• {condition}</p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Outcomes:</p>
                        <div className="flex gap-4 text-xs">
                          <span className="text-green-600">✓ {policy.outcomes.allowed} allowed</span>
                          <span className="text-red-600">✗ {policy.outcomes.blocked} blocked</span>
                          <span className="text-yellow-600">⚠ {policy.outcomes.modified} modified</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Email Response Rate</span>
                      <span className="font-medium">17.5%</span>
                    </div>
                    <Progress value={17.5} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Application Completion</span>
                      <span className="font-medium">34.2%</span>
                    </div>
                    <Progress value={34.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Journey Progression</span>
                      <span className="font-medium">78.9%</span>
                    </div>
                    <Progress value={78.9} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Avg Response Time</p>
                      <p className="text-2xl font-bold">1.2s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Processing Speed</p>
                      <p className="text-2xl font-bold">847ms</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Uptime</p>
                      <p className="text-xl font-bold text-green-600">99.9%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Error Rate</p>
                      <p className="text-xl font-bold text-red-600">0.8%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}