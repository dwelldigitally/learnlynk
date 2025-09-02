import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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

    // Recent activities
    recentActivities: [
      {
        id: 'activity-1',
        timestamp: '2024-01-22T14:30:00Z',
        type: 'email_sent',
        action: 'Sent application reminder email',
        studentName: 'Sarah Johnson',
        studentId: 'student-123',
        trigger: 'Application incomplete for 3 days',
        confidence: 92,
        status: 'completed',
        details: {
          emailSubject: 'Complete Your Application - Missing Documents',
          channel: 'email',
          template: 'application_reminder_v2'
        }
      },
      {
        id: 'activity-2',
        timestamp: '2024-01-22T14:15:00Z',
        type: 'lead_scoring',
        action: 'Updated lead score based on engagement',
        studentName: 'Michael Chen',
        studentId: 'student-124',
        trigger: 'Opened email and clicked scholarship link',
        confidence: 88,
        status: 'completed',
        details: {
          previousScore: 72,
          newScore: 85,
          reason: 'High engagement with financial aid content'
        }
      },
      {
        id: 'activity-3',
        timestamp: '2024-01-22T13:45:00Z',
        type: 'escalation',
        action: 'Escalated complex financial aid question',
        studentName: 'Emily Rodriguez',
        studentId: 'student-125',
        trigger: 'Student asked about FAFSA appeal process',
        confidence: 45,
        status: 'escalated',
        details: {
          escalationReason: 'Complex financial aid policy question',
          assignedTo: 'Financial Aid Specialist',
          urgency: 'medium'
        }
      },
      {
        id: 'activity-4',
        timestamp: '2024-01-22T13:20:00Z',
        type: 'journey_progression',
        action: 'Moved student to next journey stage',
        studentName: 'David Kim',
        studentId: 'student-126',
        trigger: 'Application submitted successfully',
        confidence: 95,
        status: 'completed',
        details: {
          fromStage: 'Application In Progress',
          toStage: 'Application Review',
          nextAction: 'Send confirmation email'
        }
      },
      {
        id: 'activity-5',
        timestamp: '2024-01-22T12:55:00Z',
        type: 'sms_sent',
        action: 'Sent deadline reminder SMS',
        studentName: 'Jessica Martinez',
        studentId: 'student-127',
        trigger: 'Application deadline in 48 hours',
        confidence: 89,
        status: 'completed',
        details: {
          message: 'Hi Jessica! Just a friendly reminder that your application deadline is in 2 days.',
          channel: 'sms',
          responseExpected: true
        }
      }
    ],

    // Triggers and conditions
    activeTriggers: [
      {
        id: 'trigger-1',
        name: 'Application Incomplete',
        description: 'Student has started but not completed application',
        conditions: ['application_status = "incomplete"', 'days_since_start > 2'],
        action: 'Send reminder email',
        frequency: 'daily',
        lastTriggered: '2024-01-22T14:30:00Z',
        timesTriggered: 12,
        successRate: 67
      },
      {
        id: 'trigger-2',
        name: 'High Engagement Score',
        description: 'Student shows high engagement with content',
        conditions: ['email_opens > 3', 'link_clicks > 2', 'page_visits > 5'],
        action: 'Increase lead score and send personalized follow-up',
        frequency: 'immediate',
        lastTriggered: '2024-01-22T14:15:00Z',
        timesTriggered: 8,
        successRate: 84
      },
      {
        id: 'trigger-3',
        name: 'Deadline Approaching',
        description: 'Application deadline is within 48 hours',
        conditions: ['deadline_hours_remaining <= 48', 'application_status != "submitted"'],
        action: 'Send urgent reminder via SMS and email',
        frequency: 'once',
        lastTriggered: '2024-01-22T12:55:00Z',
        timesTriggered: 15,
        successRate: 73
      },
      {
        id: 'trigger-4',
        name: 'Complex Query Detection',
        description: 'Student asks questions requiring specialist knowledge',
        conditions: ['message_complexity_score > 0.8', 'confidence_score < 60'],
        action: 'Escalate to human advisor',
        frequency: 'immediate',
        lastTriggered: '2024-01-22T13:45:00Z',
        timesTriggered: 5,
        successRate: 100
      }
    ]
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'email_sent': return <Mail className="h-4 w-4" />;
    case 'sms_sent': return <MessageSquare className="h-4 w-4" />;
    case 'phone_call': return <Phone className="h-4 w-4" />;
    case 'lead_scoring': return <Target className="h-4 w-4" />;
    case 'escalation': return <AlertTriangle className="h-4 w-4" />;
    case 'journey_progression': return <PlayCircle className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string, status: string) => {
  if (status === 'escalated') return 'text-destructive';
  
  switch (type) {
    case 'email_sent': return 'text-blue-600';
    case 'sms_sent': return 'text-green-600';
    case 'phone_call': return 'text-purple-600';
    case 'lead_scoring': return 'text-orange-600';
    case 'escalation': return 'text-destructive';
    case 'journey_progression': return 'text-emerald-600';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Advisor not found</h2>
          <Button onClick={() => navigate('/admin/leads/ai')}>
            Back to AI Agents
          </Button>
        </div>
      </div>
    );
  }

  const currentAnalytics = advisor.analytics[selectedTimeframe];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
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
      <div className="p-6 space-y-6">
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
                            </div>
                            
                            <div className="text-sm text-muted-foreground">
                              <p><strong>Student:</strong> {activity.studentName}</p>
                              <p><strong>Trigger:</strong> {activity.trigger}</p>
                              {activity.details && (
                                <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
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
                <CardTitle>Active Triggers</CardTitle>
                <CardDescription>
                  Conditions and triggers that activate this AI advisor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {advisor.activeTriggers.map((trigger: any) => (
                    <div key={trigger.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{trigger.name}</h4>
                            <Badge variant="outline">{trigger.frequency}</Badge>
                            <Badge variant="secondary">{trigger.successRate}% success</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{trigger.description}</p>
                          
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
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Last triggered: {new Date(trigger.lastTriggered).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Times triggered: {trigger.timesTriggered}
                          </p>
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
    </div>
  );
}