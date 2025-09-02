import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { 
  ArrowLeft,
  Bot, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Target,
  Activity,
  Zap,
  Eye,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  PlayCircle
} from 'lucide-react';

// Mock data for individual advisor analytics
const MOCK_ADVISOR_DATA = {
  'agent-1': {
    id: 'agent-1',
    name: 'Domestic Undergrad Assistant',
    description: 'Handles domestic undergraduate student inquiries and nurturing',
    status: 'active',
    scope: 'Domestic Undergraduate Funnel',
    
    // Analytics data
    analytics: {
      today: {
        actionsTaken: 23,
        studentsContacted: 18,
        escalations: 2,
        averageConfidence: 87,
        messagesSent: 31,
        emailsOpened: 24,
        repliesReceived: 12,
        conversionsToday: 3
      },
      thisWeek: {
        actionsTaken: 156,
        studentsContacted: 89,
        escalations: 8,
        averageConfidence: 84,
        messagesSent: 198,
        emailsOpened: 158,
        repliesReceived: 67,
        conversionsThisWeek: 14
      },
      thisMonth: {
        actionsTaken: 642,
        studentsContacted: 234,
        escalations: 23,
        averageConfidence: 87,
        messagesSent: 892,
        emailsOpened: 758,
        repliesReceived: 342,
        conversionsThisMonth: 45
      }
    },

    // Recent AI activities with actual play executions
    recentActivities: [
      {
        id: 'activity-1',
        timestamp: '2024-01-22T14:30:00Z',
        type: 'play_execution',
        action: 'Executed "Application Deadline Reminder" play',
        studentName: 'Sarah Johnson',
        studentId: 'student-123',
        playName: 'Application Deadline Reminder',
        playId: 'play-001',
        trigger: 'Application incomplete for 3 days + Deadline in 48 hours',
        confidence: 92,
        status: 'completed',
        details: {
          policyApplied: 'Aggressive Follow-up Policy',
          executionTime: '2.3s',
          channel: 'email + sms',
          template: 'deadline_reminder_urgent',
          nextAction: 'Schedule follow-up call if no response in 24h',
          outcome: 'Email opened, application resumed'
        }
      },
      {
        id: 'activity-2',
        timestamp: '2024-01-22T14:15:00Z',
        type: 'policy_decision',
        action: 'Applied "High-Value Lead Prioritization" policy',
        studentName: 'Michael Chen',
        studentId: 'student-124',
        playName: 'VIP Lead Nurturing',
        playId: 'play-002',
        trigger: 'Lead score > 85 + High engagement pattern detected',
        confidence: 88,
        status: 'completed',
        details: {
          policyApplied: 'VIP Lead Treatment Policy',
          executionTime: '1.8s',
          scoreIncrease: '+13 points (72 → 85)',
          channel: 'personalized email',
          assignedTo: 'Senior Advisor',
          outcome: 'Lead upgraded to priority status'
        }
      },
      {
        id: 'activity-3',
        timestamp: '2024-01-22T13:45:00Z',
        type: 'escalation_decision',
        action: 'Escalated due to complexity threshold exceeded',
        studentName: 'Emily Rodriguez',
        studentId: 'student-125',
        playName: 'Complex Query Handler',
        playId: 'play-003',
        trigger: 'Financial aid complexity score > 0.8',
        confidence: 45,
        status: 'escalated',
        details: {
          policyApplied: 'Complexity Escalation Policy',
          executionTime: '0.5s',
          escalationReason: 'FAFSA appeal process requires specialist knowledge',
          assignedTo: 'Financial Aid Specialist',
          urgency: 'medium',
          outcome: 'Successfully escalated to human expert'
        }
      },
      {
        id: 'activity-4',
        timestamp: '2024-01-22T13:20:00Z',
        type: 'journey_progression',
        action: 'Executed "Application Success" play',
        studentName: 'David Kim',
        studentId: 'student-126',
        playName: 'Application Success Celebration',
        playId: 'play-004',
        trigger: 'Application status changed to submitted',
        confidence: 95,
        status: 'completed',
        details: {
          policyApplied: 'Journey Progression Policy',
          executionTime: '1.2s',
          fromStage: 'Application In Progress',
          toStage: 'Application Review',
          nextPlay: 'Document Collection Reminder',
          outcome: 'Student transitioned to next stage'
        }
      },
      {
        id: 'activity-5',
        timestamp: '2024-01-22T12:55:00Z',
        type: 'play_execution',
        action: 'Executed "Deadline Alert" play',
        studentName: 'Jessica Martinez',
        studentId: 'student-127',
        playName: 'Deadline Alert Notification',
        playId: 'play-005',
        trigger: 'Deadline proximity rule triggered (48h remaining)',
        confidence: 89,
        status: 'completed',
        details: {
          policyApplied: 'Time-Sensitive Communication Policy',
          executionTime: '1.5s',
          channel: 'sms',
          message: 'Urgent: Application deadline in 2 days',
          responseExpected: true,
          outcome: 'SMS delivered, awaiting response'
        }
      }
    ],

    // Active AI plays and policy triggers
    activeTriggers: [
      {
        id: 'play-trigger-1',
        name: 'Application Deadline Reminder Play',
        description: 'Automatically triggers urgent reminders for incomplete applications near deadline',
        playId: 'play-001',
        conditions: [
          'application_status = "incomplete"', 
          'deadline_hours_remaining <= 48', 
          'last_contact_hours > 24'
        ],
        policyName: 'Aggressive Follow-up Policy',
        action: 'Send multi-channel reminder (email + SMS) with personalized deadline countdown',
        frequency: 'once per deadline period',
        lastTriggered: '2024-01-22T14:30:00Z',
        timesTriggered: 12,
        successRate: 73,
        outcomeMetrics: {
          responsesReceived: 9,
          applicationsCompleted: 7,
          conversationRate: 58
        }
      },
      {
        id: 'play-trigger-2',
        name: 'High-Value Lead Prioritization Play',
        description: 'Automatically identifies and prioritizes high-scoring leads for VIP treatment',
        playId: 'play-002',
        conditions: [
          'lead_score > 80', 
          'engagement_score > 70', 
          'program_interest IN ["MBA", "Graduate"]'
        ],
        policyName: 'VIP Lead Treatment Policy',
        action: 'Assign to senior advisor, send personalized welcome sequence, schedule priority call',
        frequency: 'immediate on qualification',
        lastTriggered: '2024-01-22T14:15:00Z',
        timesTriggered: 8,
        successRate: 84,
        outcomeMetrics: {
          leadsUpgraded: 8,
          meetingsScheduled: 6,
          conversationRate: 75
        }
      },
      {
        id: 'play-trigger-3',
        name: 'Complex Query Detection Play',
        description: 'Identifies queries requiring human expertise and routes to appropriate specialists',
        playId: 'play-003',
        conditions: [
          'message_complexity_score > 0.8', 
          'confidence_score < 60',
          'topic IN ["financial_aid", "visa", "legal"]'
        ],
        policyName: 'Complexity Escalation Policy',
        action: 'Escalate to appropriate specialist with context and suggested response',
        frequency: 'immediate on detection',
        lastTriggered: '2024-01-22T13:45:00Z',
        timesTriggered: 5,
        successRate: 100,
        outcomeMetrics: {
          queriesEscalated: 5,
          resolutionTime: '24 minutes avg',
          studentSatisfaction: 92
        }
      },
      {
        id: 'play-trigger-4',
        name: 'Journey Stage Progression Play',
        description: 'Automatically moves students through application stages and triggers appropriate next actions',
        playId: 'play-004',
        conditions: [
          'stage_completion_detected = true',
          'all_requirements_met = true',
          'next_stage_available = true'
        ],
        policyName: 'Journey Progression Policy',
        action: 'Update stage, send congratulatory message, initiate next stage requirements',
        frequency: 'immediate on completion',
        lastTriggered: '2024-01-22T13:20:00Z',
        timesTriggered: 15,
        successRate: 91,
        outcomeMetrics: {
          stageProgressions: 15,
          timeToNextStage: '2.3 days avg',
          completionRate: 87
        }
      },
      {
        id: 'play-trigger-5',
        name: 'Re-engagement Play',
        description: 'Attempts to re-engage dormant leads with personalized content and incentives',
        playId: 'play-006',
        conditions: [
          'days_since_last_activity > 7',
          'lead_score > 50',
          'application_status != "submitted"'
        ],
        policyName: 'Lead Recovery Policy',
        action: 'Send personalized re-engagement sequence with program highlights and deadline reminders',
        frequency: 'weekly for dormant leads',
        lastTriggered: '2024-01-22T10:30:00Z',
        timesTriggered: 23,
        successRate: 41,
        outcomeMetrics: {
          leadsReactivated: 9,
          applicationsResumed: 6,
          recoveryRate: 26
        }
      }
    ]
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'play_execution': return <PlayCircle className="h-4 w-4" />;
    case 'policy_decision': return <Target className="h-4 w-4" />;
    case 'escalation_decision': return <AlertTriangle className="h-4 w-4" />;
    case 'journey_progression': return <CheckCircle className="h-4 w-4" />;
    case 'email_sent': return <Mail className="h-4 w-4" />;
    case 'sms_sent': return <MessageSquare className="h-4 w-4" />;
    case 'phone_call': return <Phone className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string, status: string) => {
  if (status === 'escalated') return 'text-destructive';
  
  switch (type) {
    case 'play_execution': return 'text-emerald-600';
    case 'policy_decision': return 'text-purple-600';
    case 'escalation_decision': return 'text-orange-600';
    case 'journey_progression': return 'text-blue-600';
    case 'email_sent': return 'text-blue-600';
    case 'sms_sent': return 'text-green-600';
    case 'phone_call': return 'text-purple-600';
    default: return 'text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-3 w-3 text-success" />;
    case 'escalated': return <AlertTriangle className="h-3 w-3 text-destructive" />;
    case 'pending': return <Clock className="h-3 w-3 text-muted-foreground" />;
    default: return <XCircle className="h-3 w-3 text-muted-foreground" />;
  }
};

export function AIAdvisorAnalytics() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'thisWeek' | 'thisMonth'>('today');
  const [advisor, setAdvisor] = useState<any>(null);

  useEffect(() => {
    if (agentId && MOCK_ADVISOR_DATA[agentId as keyof typeof MOCK_ADVISOR_DATA]) {
      setAdvisor(MOCK_ADVISOR_DATA[agentId as keyof typeof MOCK_ADVISOR_DATA]);
    }
  }, [agentId]);

  if (!advisor) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">Advisor not found</h2>
            <Button onClick={() => navigate('/admin/leads/ai')}>
              Back to AI Agents
            </Button>
          </div>
        </div>
      </ModernAdminLayout>
    );
  }

  const currentAnalytics = advisor.analytics[selectedTimeframe];

  return (
    <ModernAdminLayout>
      {/* Header */}
      <div className="border-b bg-card px-6 py-4 -mx-6 -mt-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/leads/ai')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to AI Agents
            </Button>
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{advisor.name}</h1>
                <p className="text-sm text-muted-foreground">{advisor.description}</p>
              </div>
              <Badge variant={advisor.status === 'active' ? 'default' : 'secondary'}>
                {advisor.status === 'active' ? 'Active' : 'Shadow Mode'}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={selectedTimeframe === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('today')}
            >
              Today
            </Button>
            <Button 
              variant={selectedTimeframe === 'thisWeek' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('thisWeek')}
            >
              This Week
            </Button>
            <Button 
              variant={selectedTimeframe === 'thisMonth' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('thisMonth')}
            >
              This Month
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Actions Taken</p>
                  <p className="text-2xl font-bold">{currentAnalytics.actionsTaken}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedTimeframe === 'today' && '+12% from yesterday'}
                    {selectedTimeframe === 'thisWeek' && '+8% from last week'}
                    {selectedTimeframe === 'thisMonth' && '+15% from last month'}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Students Contacted</p>
                  <p className="text-2xl font-bold">{currentAnalytics.studentsContacted}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((currentAnalytics.studentsContacted / currentAnalytics.messagesSent) * 100)}% contact rate
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold">{currentAnalytics.averageConfidence}%</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${currentAnalytics.averageConfidence}%` }}
                    />
                  </div>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Escalations</p>
                  <p className="text-2xl font-bold">{currentAnalytics.escalations}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((currentAnalytics.escalations / currentAnalytics.actionsTaken) * 100)}% escalation rate
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Communication Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Performance</CardTitle>
            <CardDescription>Message engagement and response metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Messages Sent</p>
                <p className="text-xl font-bold">{currentAnalytics.messagesSent}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Open Rate</p>
                <p className="text-xl font-bold">
                  {Math.round((currentAnalytics.emailsOpened / currentAnalytics.messagesSent) * 100)}%
                </p>
                <Progress value={(currentAnalytics.emailsOpened / currentAnalytics.messagesSent) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Reply Rate</p>
                <p className="text-xl font-bold">
                  {Math.round((currentAnalytics.repliesReceived / currentAnalytics.messagesSent) * 100)}%
                </p>
                <Progress value={(currentAnalytics.repliesReceived / currentAnalytics.messagesSent) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Conversions</p>
                <p className="text-xl font-bold">{currentAnalytics.conversionsToday || currentAnalytics.conversionsThisWeek || currentAnalytics.conversionsThisMonth}</p>
                <p className="text-xs text-muted-foreground">Students progressed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="activities" className="space-y-6">
          <TabsList>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            <TabsTrigger value="triggers">Active Triggers</TabsTrigger>
            <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest actions taken by the AI advisor with trigger information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {advisor.recentActivities.map((activity: any) => (
                    <div key={activity.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`mt-1 ${getActivityColor(activity.type, activity.status)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{activity.action}</h4>
                              {getStatusIcon(activity.status)}
                              <Badge variant="outline" className="text-xs">
                                {activity.confidence}% confidence
                              </Badge>
                              {activity.playName && (
                                <Badge variant="secondary" className="text-xs">
                                  {activity.playName}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-sm text-muted-foreground">
                              <p><strong>Student:</strong> {activity.studentName}</p>
                              <p><strong>Trigger:</strong> {activity.trigger}</p>
                              {activity.details && (
                                <div className="mt-2 p-2 bg-muted/50 rounded text-xs space-y-1">
                                  {Object.entries(activity.details).map(([key, value]) => (
                                    <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="triggers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active AI Plays & Policies</CardTitle>
                <CardDescription>
                  AI plays being executed and policies that guide decision-making
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {advisor.activeTriggers.map((trigger: any) => (
                    <div key={trigger.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <PlayCircle className="h-4 w-4 text-primary" />
                            <h4 className="font-medium">{trigger.name}</h4>
                            <Badge variant="outline">{trigger.frequency}</Badge>
                            <Badge variant="secondary">{trigger.successRate}% success</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{trigger.description}</p>
                          
                          {trigger.policyName && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-muted-foreground">GOVERNING POLICY:</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {trigger.policyName}
                              </Badge>
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">CONDITIONS:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {trigger.conditions.map((condition: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {condition}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">ACTION:</p>
                              <p className="text-sm">{trigger.action}</p>
                            </div>
                            
                            {trigger.outcomeMetrics && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">OUTCOME METRICS:</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                                  {Object.entries(trigger.outcomeMetrics).map(([key, value]) => (
                                    <div key={key} className="text-xs">
                                      <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span> {String(value)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Last executed: {new Date(trigger.lastTriggered).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Executions: {trigger.timesTriggered}
                          </p>
                          {trigger.playId && (
                            <p className="text-xs text-muted-foreground">
                              Play ID: {trigger.playId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Historical performance data and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p>Performance trends visualization would go here</p>
                  <p className="text-sm">Charts showing confidence scores, success rates, and activity volume over time</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModernAdminLayout>
  );
}