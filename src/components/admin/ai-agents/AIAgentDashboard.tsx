import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Plus, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  Play,
  Pause,
  Settings,
  BarChart3,
  Clock,
  Target,
  Eye,
  Route,
  UserCheck
} from "lucide-react";
import { AIAgent, AIAgentAnalytics } from "@/types/ai-agent";
import { AIAgentWizard } from "./AIAgentWizard";
import { JourneyBasedAIAgentWizard } from "../wizard/JourneyBasedAIAgentWizard";
import { useLeadAIAgent } from "@/hooks/useLeadAIAgent";
import { useRegistrarAIAgent } from "@/hooks/useRegistrarAIAgent";

// Mock data - in real app, this would come from API
const MOCK_AGENTS: AIAgent[] = [
  {
    id: 'agent-1',
    name: 'Domestic Undergrad Assistant',
    description: 'Handles domestic undergraduate student inquiries and nurturing',
    status: 'active',
    scope: 'Domestic Undergraduate Funnel',
    functionalBoundaries: ['Lead Prioritization', 'Email Communication', 'Journey Management'],
    confidenceThresholds: { fullAutoAction: 90, suggestionOnly: { min: 60, max: 89 }, noAction: 60 },
    personality: { tone: 'friendly', messageTemplates: {} },
    allowedChannels: { email: true, sms: true, whatsapp: false, phone: false },
    journeyIntegration: { canOverrideSteps: true, canTriggerPlays: true, allowedJourneys: ['domestic-undergrad'], allowedPlays: ['welcome-sequence', 're-engage'] },
    guardrails: { maxMessagesPerDay: 5, forbiddenTopics: ['Financial Aid Advice'], excludedStudentGroups: [], complianceRules: ['FERPA'] },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    metrics: {
      studentsManaged: 234,
      tasksExecuted: 1456,
      averageConfidence: 87,
      escalations: 23,
      yieldImpact: 12,
      messagePerformance: { sent: 892, opened: 758, clicked: 342, replied: 156, unsubscribed: 4 }
    }
  },
  {
    id: 'agent-2',
    name: 'International Graduate Recruiter',
    description: 'Specialized agent for international graduate student recruitment',
    status: 'shadow',
    scope: 'International Graduate Programs',
    functionalBoundaries: ['Lead Prioritization', 'Email Communication', 'Document Processing'],
    confidenceThresholds: { fullAutoAction: 95, suggestionOnly: { min: 70, max: 94 }, noAction: 70 },
    personality: { tone: 'formal', messageTemplates: {} },
    allowedChannels: { email: true, sms: false, whatsapp: true, phone: false },
    journeyIntegration: { canOverrideSteps: false, canTriggerPlays: true, allowedJourneys: ['international'], allowedPlays: ['welcome-sequence'] },
    guardrails: { maxMessagesPerDay: 3, forbiddenTopics: ['Visa Guidance', 'Immigration Law'], excludedStudentGroups: [], complianceRules: ['FERPA', 'GDPR'] },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    metrics: {
      studentsManaged: 87,
      tasksExecuted: 234,
      averageConfidence: 92,
      escalations: 8,
      yieldImpact: 0,
      messagePerformance: { sent: 0, opened: 0, clicked: 0, replied: 0, unsubscribed: 0 }
    }
  }
];

const MOCK_ANALYTICS: AIAgentAnalytics[] = [
  {
    agentId: 'agent-1',
    timeframe: 'today',
    actionsTaken: 23,
    messagePerformance: { ctr: 38.2, replyRate: 17.5, unsubscribeRate: 0.4 },
    escalationsMade: 2,
    lagTimeSaved: 4.2,
    yieldImpact: 12,
    confidenceDistribution: { high: 65, medium: 28, low: 7 }
  }
];

interface AIAgentDashboardProps {
  onCreateAgent?: () => void;
}

export function AIAgentDashboard({ onCreateAgent }: AIAgentDashboardProps) {
  const [showAdmissionWizard, setShowAdmissionWizard] = useState(false);
  const [showJourneyWizard, setShowJourneyWizard] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('admission');

  const handleCreateAdmissionAgent = () => {
    setShowAdmissionWizard(true);
    onCreateAgent?.();
  };

  const handleCreateJourneyAgent = () => {
    setShowJourneyWizard(true);
    onCreateAgent?.();
  };

  const handleAdmissionWizardComplete = (data: any) => {
    console.log('Admission agent created:', data);
    setShowAdmissionWizard(false);
    // In real app, would save to backend
  };

  const handleJourneyWizardComplete = (data: any) => {
    console.log('Journey agent created:', data);
    setShowJourneyWizard(false);
    // In real app, would save to backend
  };

  const handleWizardCancel = () => {
    setShowAdmissionWizard(false);
    setShowJourneyWizard(false);
  };

  if (showAdmissionWizard) {
    return (
      <AIAgentWizard
        onComplete={handleAdmissionWizardComplete}
        onCancel={handleWizardCancel}
      />
    );
  }

  if (showJourneyWizard) {
    return (
      <JourneyBasedAIAgentWizard
        open={true}
        onOpenChange={(open) => !open && setShowJourneyWizard(false)}
        onSave={handleJourneyWizardComplete}
      />
    );
  }

  const totalStudentsManaged = MOCK_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.studentsManaged || 0), 0);
  const totalTasksExecuted = MOCK_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.tasksExecuted || 0), 0);
  const activeAgents = MOCK_AGENTS.filter(agent => agent.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agents</h1>
          <p className="text-muted-foreground">
            Autonomous agents for admissions counseling and student journey management
          </p>
        </div>
      </div>

      {/* Agent Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="admission" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              AI Admission Advisors
            </TabsTrigger>
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Journey AI Agents
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateAdmissionAgent}
              variant={activeCategory === 'admission' ? 'default' : 'outline'}
              disabled={activeCategory !== 'admission'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Admission Agent
            </Button>
            <Button 
              onClick={handleCreateJourneyAgent}
              variant={activeCategory === 'journey' ? 'default' : 'outline'}
              disabled={activeCategory !== 'journey'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Journey Agent
            </Button>
          </div>
        </div>

        <TabsContent value="admission" className="space-y-6">
          {/* Admission Agents Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Advisors</p>
                    <p className="text-2xl font-bold">{activeAgents}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Students Managed</p>
                    <p className="text-2xl font-bold">{totalStudentsManaged.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tasks Executed</p>
                    <p className="text-2xl font-bold">{totalTasksExecuted.toLocaleString()}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Confidence</p>
                    <p className="text-2xl font-bold">
                      {Math.round(MOCK_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.averageConfidence || 0), 0) / MOCK_AGENTS.length)}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admission Agents List */}
          <Card>
            <CardHeader>
              <CardTitle>AI Admission Advisors</CardTitle>
              <CardDescription>
                Autonomous agents that handle admissions counselor tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_AGENTS.map((agent) => (
                  <div key={agent.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{agent.name}</h3>
                          <Badge variant={
                            agent.status === 'active' ? 'default' : 
                            agent.status === 'shadow' ? 'secondary' : 
                            'outline'
                          }>
                            {agent.status === 'active' ? 'Active' : 
                             agent.status === 'shadow' ? 'Shadow Mode' : 
                             'Paused'}
                          </Badge>
                          {agent.status === 'active' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {agent.metrics?.averageConfidence}% avg confidence
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Students Managed</p>
                            <p className="text-muted-foreground">{agent.metrics?.studentsManaged || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium">Tasks Executed</p>
                            <p className="text-muted-foreground">{agent.metrics?.tasksExecuted || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium">Escalations</p>
                            <p className="text-muted-foreground">{agent.metrics?.escalations || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium">Yield Impact</p>
                            <p className="text-muted-foreground">+{agent.metrics?.yieldImpact || 0}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          {agent.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journey" className="space-y-6">
          {/* Journey Agents Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Journey Agents</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <Route className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Journey Steps Managed</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Students Progressed</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Acceleration Rate</p>
                    <p className="text-2xl font-bold">0%</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Journey Agents List */}
          <Card>
            <CardHeader>
              <CardTitle>Journey AI Agents</CardTitle>
              <CardDescription>
                Agents that accelerate students through their academic journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Route className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Journey Agents Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first Journey AI agent to help students move through their academic journey stages more efficiently.
                </p>
                <Button onClick={handleCreateJourneyAgent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Journey Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      {/* Performance Overview */}
      {MOCK_AGENTS.some(agent => agent.status === 'active') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Today's Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_ANALYTICS.map((analytics) => {
                const agent = MOCK_AGENTS.find(a => a.id === analytics.agentId);
                return (
                  <div key={analytics.agentId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{agent?.name}</span>
                      <Badge variant="outline">{analytics.actionsTaken} actions</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Click Rate</p>
                        <p className="font-medium">{analytics.messagePerformance.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Reply Rate</p>
                        <p className="font-medium">{analytics.messagePerformance.replyRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time Saved</p>
                        <p className="font-medium">{analytics.lagTimeSaved}h</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Escalations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Student visa question escalated</p>
                    <p className="text-xs text-muted-foreground">Domestic Undergrad Assistant • 23 minutes ago</p>
                  </div>
                  <Badge variant="outline" className="text-xs">45% confidence</Badge>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Complex financial aid inquiry</p>
                    <p className="text-xs text-muted-foreground">Domestic Undergrad Assistant • 1 hour ago</p>
                  </div>
                  <Badge variant="outline" className="text-xs">32% confidence</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </Tabs>
    </div>
  );
}