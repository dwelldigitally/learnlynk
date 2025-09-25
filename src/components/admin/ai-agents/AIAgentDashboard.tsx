import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  UserCheck,
  Activity,
  PlayCircle,
  Shield,
  Zap,
  CheckCircle,
  ExternalLink
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

// Mock Journey AI Agents
const MOCK_JOURNEY_AGENTS = [
  {
    id: 'journey-agent-1',
    name: 'Application Completion Accelerator',
    description: 'Nudges students to complete missing application requirements',
    status: 'active',
    purpose: 'incomplete_docs',
    targetCriteria: {
      programs: ['Undergraduate', 'Graduate'],
      stages: ['Application Started', 'Documents Pending'],
      geography: ['Domestic', 'International'],
      scoreRange: { min: 0, max: 100 },
      studentType: 'all'
    },
    journeyPaths: ['Undergraduate Application', 'Graduate Application'],
    autoAdjustByStage: true,
    dailyActionLimits: { maxActionsPerStudent: 2, maxTotalActions: 150 },
    approvedChannels: ['email', 'sms', 'in_app'],
    toneGuide: 'friendly',
    confidenceSettings: {
      autoActThreshold: 85,
      askApprovalRange: { min: 60, max: 84 },
      skipThreshold: 60
    },
    metrics: {
      studentsProgressed: 156,
      stagesCompleted: 284,
      averageAcceleration: 2.3,
      conversionRate: 78,
      engagementRate: 92
    },
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-22T09:15:00Z'
  },
  {
    id: 'journey-agent-2',
    name: 'Interview Preparation Assistant',
    description: 'Guides students through interview scheduling and preparation',
    status: 'active',
    purpose: 'interview_followup',
    targetCriteria: {
      programs: ['MBA', 'Graduate'],
      stages: ['Interview Invited', 'Interview Scheduled'],
      geography: ['All'],
      scoreRange: { min: 70, max: 100 },
      studentType: 'all'
    },
    journeyPaths: ['Graduate Admissions', 'MBA Program'],
    autoAdjustByStage: true,
    dailyActionLimits: { maxActionsPerStudent: 3, maxTotalActions: 80 },
    approvedChannels: ['email', 'sms'],
    toneGuide: 'formal',
    confidenceSettings: {
      autoActThreshold: 90,
      askApprovalRange: { min: 70, max: 89 },
      skipThreshold: 70
    },
    metrics: {
      studentsProgressed: 89,
      stagesCompleted: 134,
      averageAcceleration: 1.8,
      conversionRate: 85,
      engagementRate: 96
    },
    createdAt: '2024-01-08T14:20:00Z',
    updatedAt: '2024-01-20T16:45:00Z'
  },
  {
    id: 'journey-agent-3',
    name: 'High-Yield Conversion Optimizer',
    description: 'Focuses on converting high-potential admitted students',
    status: 'active',
    purpose: 'high_yield_conversion',
    targetCriteria: {
      programs: ['All Programs'],
      stages: ['Admitted', 'Deposit Pending'],
      geography: ['Domestic', 'International'],
      scoreRange: { min: 85, max: 100 },
      studentType: 'all'
    },
    journeyPaths: ['Post-Admission', 'Enrollment Confirmation'],
    autoAdjustByStage: true,
    dailyActionLimits: { maxActionsPerStudent: 4, maxTotalActions: 100 },
    approvedChannels: ['email', 'sms', 'phone'],
    toneGuide: 'friendly',
    confidenceSettings: {
      autoActThreshold: 80,
      askApprovalRange: { min: 65, max: 79 },
      skipThreshold: 65
    },
    metrics: {
      studentsProgressed: 67,
      stagesCompleted: 89,
      averageAcceleration: 3.1,
      conversionRate: 91,
      engagementRate: 88
    },
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-21T13:30:00Z'
  },
  {
    id: 'journey-agent-4',
    name: 'Student Re-engagement Specialist',
    description: 'Re-activates dormant students who have stalled in their journey',
    status: 'shadow',
    purpose: 'applicant_nurture',
    targetCriteria: {
      programs: ['Undergraduate', 'Certificate'],
      stages: ['Inquiry Made', 'Application Started'],
      geography: ['Domestic'],
      scoreRange: { min: 40, max: 80 },
      studentType: 'domestic'
    },
    journeyPaths: ['Pre-Application', 'Early Interest'],
    autoAdjustByStage: false,
    dailyActionLimits: { maxActionsPerStudent: 1, maxTotalActions: 200 },
    approvedChannels: ['email', 'sms'],
    toneGuide: 'casual',
    confidenceSettings: {
      autoActThreshold: 75,
      askApprovalRange: { min: 50, max: 74 },
      skipThreshold: 50
    },
    metrics: {
      studentsProgressed: 0,
      stagesCompleted: 0,
      averageAcceleration: 0,
      conversionRate: 0,
      engagementRate: 0
    },
    createdAt: '2024-01-18T16:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z'
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
  const navigate = useNavigate();
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
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 bg-background min-h-screen">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground px-4 sm:px-6 lg:px-8 py-6 sm:py-8 rounded-xl shadow-lg">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-4 lg:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold">AI Agents</h1>
            </div>
            <p className="text-primary-foreground/80 text-base sm:text-lg">
              Autonomous agents for admissions counseling and student journey management
            </p>
          </div>
          
          <div className="text-center lg:text-right">
            <div className="mb-2">
              <div className="text-3xl sm:text-4xl font-bold">{activeAgents}</div>
              <div className="text-primary-foreground/80 text-sm">Active Agents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Agent Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-muted/50">
            <TabsTrigger value="admission" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">AI Admission Advisors</span>
              <span className="sm:hidden">Admission</span>
            </TabsTrigger>
            <TabsTrigger value="journey" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Route className="h-4 w-4" />
              <span className="hidden sm:inline">Journey AI Agents</span>
              <span className="sm:hidden">Journey</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleCreateAdmissionAgent}
              variant={activeCategory === 'admission' ? 'default' : 'outline'}
              disabled={activeCategory !== 'admission'}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Admission Agent</span>
              <span className="sm:hidden">Create Admission</span>
            </Button>
            <Button 
              onClick={handleCreateJourneyAgent}
              variant={activeCategory === 'journey' ? 'default' : 'outline'}
              disabled={activeCategory !== 'journey'}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Journey Agent</span>
              <span className="sm:hidden">Create Journey</span>
            </Button>
          </div>
        </div>

        <TabsContent value="admission" className="space-y-6">
          {/* Modern Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{activeAgents}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Active Advisors</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{totalStudentsManaged.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Students Managed</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{totalTasksExecuted.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Tasks Executed</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    {Math.round(MOCK_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.averageConfidence || 0), 0) / MOCK_AGENTS.length)}%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Avg Confidence</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Modern Agents List */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">AI Admission Advisors</h2>
                <p className="text-muted-foreground mt-1">Autonomous agents that handle admissions counselor tasks</p>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1 self-start sm:self-auto">
                {MOCK_AGENTS.length} agents
              </Badge>
            </div>
            
            <div className="space-y-4">
              {MOCK_AGENTS.map((agent) => (
                <Card key={agent.id} className={`p-4 sm:p-6 transition-shadow hover:shadow-md ${agent.status === 'active' ? 'border-green-200 bg-green-50/30' : ''}`}>
                  <div className="space-y-4">
                    {/* Agent Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 rounded-full ${agent.status === 'active' ? 'bg-green-100' : 'bg-muted'}`}>
                            {agent.status === 'active' ? (
                              <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                            ) : (
                              <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold">{agent.name}</h3>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                              <Badge variant={
                                agent.status === 'active' ? 'default' : 
                                agent.status === 'shadow' ? 'secondary' : 
                                'outline'
                              } className="text-xs">
                                {agent.status === 'active' ? 'Active' : 
                                 agent.status === 'shadow' ? 'Shadow Mode' : 
                                 'Paused'}
                              </Badge>
                              {agent.status === 'active' && (
                                <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                                  {agent.metrics?.averageConfidence}% confidence
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground ml-8 sm:ml-12 text-sm">{agent.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 ml-8 sm:ml-12 text-sm">
                          <div>
                            <p className="font-medium text-foreground">Students Managed</p>
                            <p className="text-muted-foreground">{agent.metrics?.studentsManaged || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Tasks Executed</p>
                            <p className="text-muted-foreground">{agent.metrics?.tasksExecuted || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Escalations</p>
                            <p className="text-muted-foreground">{agent.metrics?.escalations || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Yield Impact</p>
                            <p className="text-muted-foreground">+{agent.metrics?.yieldImpact || 0}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/leads/ai/${agent.id}/analytics`)}
                          className="h-8 sm:h-10"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Analytics</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 sm:h-10 w-8 sm:w-auto p-0 sm:px-4">
                          <Settings className="h-4 w-4" />
                          <span className="hidden sm:inline ml-2">Settings</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 sm:h-10 w-8 sm:w-auto p-0 sm:px-4">
                          {agent.status === 'active' ? (
                            <>
                              <Pause className="h-4 w-4" />
                              <span className="hidden sm:inline ml-2">Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              <span className="hidden sm:inline ml-2">Start</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journey" className="space-y-6">
          {/* Modern Journey Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <Route className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    {MOCK_JOURNEY_AGENTS.filter(agent => agent.status === 'active').length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Active Agents</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    {MOCK_JOURNEY_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.studentsProgressed || 0), 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Students Progressed</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    {MOCK_JOURNEY_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.stagesCompleted || 0), 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Stages Completed</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">
                    {Math.round(MOCK_JOURNEY_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.conversionRate || 0), 0) / MOCK_JOURNEY_AGENTS.length)}%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Avg Conversion</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Modern Journey Agents List */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Journey AI Agents</h2>
                <p className="text-muted-foreground mt-1">Agents that accelerate students through their academic journey</p>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1 self-start sm:self-auto">
                {MOCK_JOURNEY_AGENTS.length} agents
              </Badge>
            </div>
            
            <div className="space-y-4">
              {MOCK_JOURNEY_AGENTS.map((agent) => (
                <Card key={agent.id} className={`p-4 sm:p-6 transition-shadow hover:shadow-md ${agent.status === 'active' ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                  <div className="space-y-4">
                    {/* Agent Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 rounded-full ${agent.status === 'active' ? 'bg-blue-100' : 'bg-muted'}`}>
                            {agent.status === 'active' ? (
                              <Route className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                            ) : (
                              <Route className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold">{agent.name}</h3>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                              <Badge variant={
                                agent.status === 'active' ? 'default' : 
                                agent.status === 'shadow' ? 'secondary' : 
                                'outline'
                              } className="text-xs">
                                {agent.status === 'active' ? 'Active' : 
                                 agent.status === 'shadow' ? 'Shadow Mode' : 
                                 'Paused'}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                                {agent.purpose.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground ml-8 sm:ml-12 text-sm">{agent.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 ml-8 sm:ml-12 text-sm">
                          <div>
                            <p className="font-medium text-foreground">Students Progressed</p>
                            <p className="text-muted-foreground">{agent.metrics?.studentsProgressed || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Stages Completed</p>
                            <p className="text-muted-foreground">{agent.metrics?.stagesCompleted || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Acceleration</p>
                            <p className="text-muted-foreground">{agent.metrics?.averageAcceleration || 0}x faster</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Conversion Rate</p>
                            <p className="text-muted-foreground">{agent.metrics?.conversionRate || 0}%</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Engagement</p>
                            <p className="text-muted-foreground">{agent.metrics?.engagementRate || 0}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/leads/ai/${agent.id}/analytics`)}
                          className="h-8 sm:h-10"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Analytics</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 sm:h-10 w-8 sm:w-auto p-0 sm:px-4">
                          <Settings className="h-4 w-4" />
                          <span className="hidden sm:inline ml-2">Settings</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 sm:h-10 w-8 sm:w-auto p-0 sm:px-4">
                          {agent.status === 'active' ? (
                            <>
                              <Pause className="h-4 w-4" />
                              <span className="hidden sm:inline ml-2">Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              <span className="hidden sm:inline ml-2">Start</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
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
                <Activity className="h-5 w-5" />
                Recent AI Activities & Triggers
              </CardTitle>
              <CardDescription>
                Real-time view of AI decision-making and executions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <PlayCircle className="h-4 w-4 mt-1 text-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">Welcome Sequence Executed</p>
                      <Badge variant="default" className="text-xs">AI Play</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">International graduate inquiry triggered personalized welcome</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Sarah Chen • Masters in CS</span>
                      <span>•</span>
                      <span>23 minutes ago</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <Badge variant="outline" className="text-xs">87% confidence</Badge>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Shield className="h-4 w-4 mt-1 text-purple-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">Message Frequency Policy Applied</p>
                      <Badge variant="secondary" className="text-xs">Policy Decision</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Prevented excessive messaging (3+ messages today)</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Michael Rodriguez</span>
                      <span>•</span>
                      <span>1 hour ago</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <Badge variant="outline" className="text-xs">Policy enforced</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Zap className="h-4 w-4 mt-1 text-green-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">Document Request Sent</p>
                      <Badge variant="outline" className="text-xs">Execution Log</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">AI requested missing transcripts via personalized email</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Emma Wilson • Bachelor of Business</span>
                      <span>•</span>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <Badge variant="outline" className="text-xs">92% confidence</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-4 w-4 mt-1 text-orange-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">Complex Financial Aid Query Escalated</p>
                      <Badge variant="destructive" className="text-xs">Escalation</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Scholarship eligibility required human expertise</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>David Park</span>
                      <span>•</span>
                      <span>3 hours ago</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ExternalLink className="h-4 w-4 text-orange-600" />
                    <Badge variant="outline" className="text-xs">34% confidence</Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  View All Activities
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </Tabs>
    </div>
  );
}