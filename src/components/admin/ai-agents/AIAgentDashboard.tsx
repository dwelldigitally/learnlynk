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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="space-y-8 p-6 lg:p-8">
        {/* Hero Header with Modern Design */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/95 to-primary/85 text-primary-foreground shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-50"></div>
          <div className="relative px-8 py-12 lg:px-12 lg:py-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-foreground/10 rounded-2xl backdrop-blur-sm">
                    <Bot className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">AI Agents</h1>
                    <p className="text-primary-foreground/80 text-lg mt-2">
                      Autonomous intelligence for admissions & student success
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold">{activeAgents}</div>
                  <div className="text-primary-foreground/80 text-sm">Active Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{totalStudentsManaged.toLocaleString()}</div>
                  <div className="text-primary-foreground/80 text-sm">Students Managed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <TabsList className="bg-card border border-border/50 shadow-lg rounded-xl p-1 grid grid-cols-2 w-full lg:w-auto">
              <TabsTrigger 
                value="admission" 
                className="flex items-center gap-3 py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
              >
                <UserCheck className="h-5 w-5" />
                <div className="text-left hidden sm:block">
                  <div className="font-semibold">Admission Advisors</div>
                  <div className="text-xs opacity-80">AI-powered counseling</div>
                </div>
                <span className="sm:hidden font-medium">Admission</span>
              </TabsTrigger>
              <TabsTrigger 
                value="journey" 
                className="flex items-center gap-3 py-3 px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
              >
                <Route className="h-5 w-5" />
                <div className="text-left hidden sm:block">
                  <div className="font-semibold">Journey Agents</div>
                  <div className="text-xs opacity-80">Student progression</div>
                </div>
                <span className="sm:hidden font-medium">Journey</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleCreateAdmissionAgent}
                variant={activeCategory === 'admission' ? 'default' : 'outline'}
                disabled={activeCategory !== 'admission'}
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create {activeCategory === 'admission' ? 'Admission' : 'Journey'} Agent
              </Button>
              <Button 
                onClick={handleCreateJourneyAgent}
                variant={activeCategory === 'journey' ? 'default' : 'outline'}
                disabled={activeCategory !== 'journey'}
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create {activeCategory === 'journey' ? 'Journey' : 'Admission'} Agent
              </Button>
            </div>
          </div>

        <TabsContent value="admission" className="space-y-6">
          {/* Modern Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Advisors</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{activeAgents}</p>
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12% this month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                    <UserCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Students Managed</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{totalStudentsManaged.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>+8% this week</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-2xl group-hover:bg-green-500/20 transition-colors">
                    <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Tasks Executed</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{totalTasksExecuted.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>+15% today</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                    <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Confidence</p>
                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                      {Math.round(MOCK_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.averageConfidence || 0), 0) / MOCK_AGENTS.length)}%
                    </p>
                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <Target className="w-3 h-3" />
                      <span>High accuracy</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500/20 transition-colors">
                    <Target className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
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
            
            <div className="space-y-6">
              {MOCK_AGENTS.map((agent, index) => (
                <Card key={agent.id} className={`group relative overflow-hidden border-0 bg-gradient-to-r ${
                  agent.status === 'active' 
                    ? 'from-green-50 via-white to-green-50/50 dark:from-green-950/20 dark:via-background dark:to-green-950/10 shadow-lg shadow-green-100/50' 
                    : 'from-gray-50 via-white to-gray-50/50 dark:from-gray-950/20 dark:via-background dark:to-gray-950/10'
                } hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Status Indicator */}
                  <div className={`absolute top-0 left-0 w-2 h-full ${
                    agent.status === 'active' ? 'bg-gradient-to-b from-green-400 to-green-600' : 'bg-gradient-to-b from-gray-300 to-gray-500'
                  }`}></div>
                  
                  <CardContent className="p-8 relative">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1 space-y-6">
                        {/* Agent Header */}
                        <div className="flex items-start gap-4">
                          <div className={`p-4 rounded-2xl ${
                            agent.status === 'active' 
                              ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-200 dark:ring-green-800' 
                              : 'bg-gray-100 dark:bg-gray-800/30'
                          } transition-all group-hover:scale-110`}>
                            <Bot className={`w-8 h-8 ${
                              agent.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{agent.name}</h3>
                              <Badge variant={agent.status === 'active' ? 'default' : agent.status === 'shadow' ? 'secondary' : 'outline'} 
                                     className="px-3 py-1">
                                {agent.status === 'active' ? 'Active' : agent.status === 'shadow' ? 'Shadow Mode' : 'Paused'}
                              </Badge>
                              {agent.status === 'active' && (
                                <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 px-3 py-1">
                                  {agent.metrics?.averageConfidence}% confidence
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed">{agent.description}</p>
                          </div>
                        </div>
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="text-center p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl">
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{agent.metrics?.studentsManaged || 0}</div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">Students Managed</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl">
                            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{agent.metrics?.tasksExecuted || 0}</div>
                            <div className="text-sm text-purple-600 dark:text-purple-400">Tasks Executed</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-xl">
                            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{agent.metrics?.escalations || 0}</div>
                            <div className="text-sm text-orange-600 dark:text-orange-400">Escalations</div>
                          </div>
                          <div className="text-center p-4 bg-green-50/50 dark:bg-green-950/20 rounded-xl">
                            <div className="text-2xl font-bold text-green-700 dark:text-green-300">+{agent.metrics?.yieldImpact || 0}%</div>
                            <div className="text-sm text-green-600 dark:text-green-400">Yield Impact</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex lg:flex-col gap-3">
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => navigate(`/admin/leads/ai/${agent.id}/analytics`)}
                          className="flex-1 lg:flex-none shadow-md hover:shadow-lg transition-all group/btn"
                        >
                          <BarChart3 className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="lg" className="flex-1 lg:flex-none shadow-md hover:shadow-lg transition-all group/btn">
                          <Settings className="h-5 w-5 mr-2 group-hover/btn:rotate-90 transition-transform" />
                          Settings
                        </Button>
                        <Button variant="outline" size="lg" className="flex-1 lg:flex-none shadow-md hover:shadow-lg transition-all group/btn">
                          {agent.status === 'active' ? (
                            <>
                              <Pause className="h-5 w-5 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5 mr-2" />
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journey" className="space-y-6">
          {/* Modern Journey Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Agents</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {MOCK_JOURNEY_AGENTS.filter(agent => agent.status === 'active').length}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>+5% this month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                    <Route className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Students Progressed</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                      {MOCK_JOURNEY_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.studentsProgressed || 0), 0)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>+18% this week</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-2xl group-hover:bg-green-500/20 transition-colors">
                    <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Stages Completed</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {MOCK_JOURNEY_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.stagesCompleted || 0), 0)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>+22% today</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                    <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Conversion</p>
                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                      {Math.round(MOCK_JOURNEY_AGENTS.reduce((sum, agent) => sum + (agent.metrics?.conversionRate || 0), 0) / MOCK_JOURNEY_AGENTS.length)}%
                    </p>
                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <Target className="w-3 h-3" />
                      <span>Above target</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-2xl group-hover:bg-orange-500/20 transition-colors">
                    <MessageSquare className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
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
            
            <div className="space-y-6">
              {MOCK_JOURNEY_AGENTS.map((agent, index) => (
                <Card key={agent.id} className={`group relative overflow-hidden border-0 bg-gradient-to-r ${
                  agent.status === 'active' 
                    ? 'from-blue-50 via-white to-blue-50/50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/10 shadow-lg shadow-blue-100/50' 
                    : 'from-gray-50 via-white to-gray-50/50 dark:from-gray-950/20 dark:via-background dark:to-gray-950/10'
                } hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Status Indicator */}
                  <div className={`absolute top-0 left-0 w-2 h-full ${
                    agent.status === 'active' ? 'bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-gradient-to-b from-gray-300 to-gray-500'
                  }`}></div>
                  
                  <CardContent className="p-8 relative">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1 space-y-6">
                        {/* Agent Header */}
                        <div className="flex items-start gap-4">
                          <div className={`p-4 rounded-2xl ${
                            agent.status === 'active' 
                              ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-200 dark:ring-blue-800' 
                              : 'bg-gray-100 dark:bg-gray-800/30'
                          } transition-all group-hover:scale-110`}>
                            <Route className={`w-8 h-8 ${
                              agent.status === 'active' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{agent.name}</h3>
                              <Badge variant={agent.status === 'active' ? 'default' : agent.status === 'shadow' ? 'secondary' : 'outline'} 
                                     className="px-3 py-1">
                                {agent.status === 'active' ? 'Active' : agent.status === 'shadow' ? 'Shadow Mode' : 'Paused'}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1">
                                {agent.purpose.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-lg leading-relaxed">{agent.description}</p>
                          </div>
                        </div>
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                          <div className="text-center p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl">
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{agent.metrics?.studentsProgressed || 0}</div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">Students Progressed</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl">
                            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{agent.metrics?.stagesCompleted || 0}</div>
                            <div className="text-sm text-purple-600 dark:text-purple-400">Stages Completed</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-xl">
                            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{agent.metrics?.averageAcceleration || 0}x</div>
                            <div className="text-sm text-orange-600 dark:text-orange-400">Acceleration</div>
                          </div>
                          <div className="text-center p-4 bg-green-50/50 dark:bg-green-950/20 rounded-xl">
                            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{agent.metrics?.conversionRate || 0}%</div>
                            <div className="text-sm text-green-600 dark:text-green-400">Conversion Rate</div>
                          </div>
                          <div className="text-center p-4 bg-pink-50/50 dark:bg-pink-950/20 rounded-xl">
                            <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">{agent.metrics?.engagementRate || 0}%</div>
                            <div className="text-sm text-pink-600 dark:text-pink-400">Engagement</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex lg:flex-col gap-3">
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => navigate(`/admin/leads/ai/${agent.id}/analytics`)}
                          className="flex-1 lg:flex-none shadow-md hover:shadow-lg transition-all group/btn"
                        >
                          <BarChart3 className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="lg" className="flex-1 lg:flex-none shadow-md hover:shadow-lg transition-all group/btn">
                          <Settings className="h-5 w-5 mr-2 group-hover/btn:rotate-90 transition-transform" />
                          Settings
                        </Button>
                        <Button variant="outline" size="lg" className="flex-1 lg:flex-none shadow-md hover:shadow-lg transition-all group/btn">
                          {agent.status === 'active' ? (
                            <>
                              <Pause className="h-5 w-5 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5 mr-2" />
                              Start
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
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
    </div>
  );
}