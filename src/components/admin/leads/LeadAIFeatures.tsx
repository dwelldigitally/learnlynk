import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Plus, 
  Settings, 
  Users, 
  TrendingUp,
  Zap,
  Play,
  Pause,
  Edit,
  AlertCircle,
  Route,
  Shield,
  BookOpen,
  Target,
  BarChart3,
  Clock,
  MapPin,
  Brain,
  Activity,
  CheckCircle,
  XCircle,
  Eye,
  Copy,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { useLeadAIAgent } from "@/hooks/useLeadAIAgent";
import { JourneyBasedAIAgentWizard } from "@/components/admin/wizard/JourneyBasedAIAgentWizard";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Purpose mapping for better display
const PURPOSE_LABELS = {
  'applicant_nurture': 'Applicant Nurturing',
  'incomplete_docs': 'Document Recovery',
  'interview_followup': 'Interview Follow-up',
  'high_yield_conversion': 'High-Yield Conversion',
  'custom': 'Custom Purpose'
};

// Mock data for demonstration
const MOCK_AGENTS = [
  {
    id: '1',
    name: 'Yield Booster – UG Science Funnel',
    description: 'Re-engage students at drop-off stage',
    purpose: 'high_yield_conversion',
    audienceSize: 312,
    activePlays: ['Re-Engage Play', 'Deadline Reminder', 'Interview Nudge', 'Doc Follow-up', 'Conversion Boost'],
    status: 'active',
    confidenceSettings: { auto: 80, suggest: 60, skip: 60 },
    interventionsToday: { executed: 43, escalated: 8, blocked: 2 },
    upliftMetrics: { docCompletion: 17, appConversion: 9 },
    lastEdited: 'August 28, 2025 by Tash',
    journeyPaths: ['UG Science Application', 'International Student Journey'],
    policyViolations: 0,
    nextScheduledAction: 'Document reminder in 2 hours'
  },
  {
    id: '2', 
    name: 'International Docs Recovery',
    description: 'Help international students complete documentation',
    purpose: 'incomplete_docs',
    audienceSize: 156,
    activePlays: ['Doc Reminder', 'Language Support', 'Video Tutorial', 'Live Chat Offer'],
    status: 'active',
    confidenceSettings: { auto: 85, suggest: 70, skip: 70 },
    interventionsToday: { executed: 28, escalated: 3, blocked: 0 },
    upliftMetrics: { docCompletion: 23, appConversion: 12 },
    lastEdited: 'August 27, 2025 by Maria',
    journeyPaths: ['International Student Journey'],
    policyViolations: 0,
    nextScheduledAction: 'Check pending documents in 1 hour'
  },
  {
    id: '3',
    name: 'Interview Follow-up Specialist',
    description: 'Nurture leads post-interview for conversion',
    purpose: 'interview_followup',
    audienceSize: 89,
    activePlays: ['Thank You Follow-up', 'Next Steps Clarification', 'Program Benefits', 'Deadline Nudge'],
    status: 'paused',
    confidenceSettings: { auto: 75, suggest: 55, skip: 55 },
    interventionsToday: { executed: 0, escalated: 0, blocked: 0 },
    upliftMetrics: { docCompletion: 31, appConversion: 18 },
    lastEdited: 'August 26, 2025 by David',
    journeyPaths: ['General Application Journey', 'Graduate Interview Process'],
    policyViolations: 1,
    nextScheduledAction: 'Agent paused - no scheduled actions'
  }
];

export function LeadAIFeatures() {
  const {
    agents,
    activeAgent,
    isLoading,
    performanceMetrics,
    createAgent,
    updateAgent,
    toggleAgent,
    loadAgents
  } = useLeadAIAgent();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  // Use mock data for now
  const displayAgents = MOCK_AGENTS;

  const handleCreateAgent = () => {
    setEditingAgent(null);
    setWizardOpen(true);
  };

  const handleEditAgent = (agent: any) => {
    setEditingAgent(agent);
    setWizardOpen(true);
  };

  const handleCloneAgent = (agent: any) => {
    setEditingAgent({ ...agent, name: `${agent.name} (Copy)` });
    setWizardOpen(true);
  };

  const handleWizardSave = async (agentData: any) => {
    try {
      if (editingAgent) {
        await updateAgent(editingAgent.id, agentData);
        toast({
          title: "Agent Updated",
          description: "AI Agent has been updated successfully."
        });
      } else {
        await createAgent(agentData);
        toast({
          title: "Agent Created", 
          description: "AI Agent has been created and is now active."
        });
      }
      setWizardOpen(false);
      loadAgents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save agent configuration.",
        variant: "destructive"
      });
    }
  };

  const handleToggleAgent = async (agentId: string, isActive: boolean) => {
    toast({
      title: isActive ? "Agent Activated" : "Agent Paused",
      description: `AI Agent has been ${isActive ? 'activated' : 'paused'}.`
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 pt-8 w-full max-w-none space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading AI configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-8 w-full max-w-none space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Journey-Based AI Agents</h2>
          <p className="text-lg text-muted-foreground">
            AI agents that work with academic journeys, policies, and plays to optimize student conversion
          </p>
        </div>
        <Button onClick={handleCreateAgent} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create AI Agent
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agent Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {/* AI Agents Dashboard */}
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                      <p className="text-2xl font-bold">{displayAgents.filter(a => a.status === 'active').length}</p>
                    </div>
                    <Bot className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Students Managed</p>
                      <p className="text-2xl font-bold">{displayAgents.reduce((sum, a) => sum + a.audienceSize, 0)}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Today's Actions</p>
                      <p className="text-2xl font-bold">{displayAgents.reduce((sum, a) => sum + a.interventionsToday.executed, 0)}</p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Policy Violations</p>
                      <p className="text-2xl font-bold text-red-600">{displayAgents.reduce((sum, a) => sum + a.policyViolations, 0)}</p>
                    </div>
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Agent Cards */}
            <div className="space-y-4">
              {displayAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          agent.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Bot className={`h-6 w-6 ${
                            agent.status === 'active' ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {agent.name}
                            {agent.policyViolations > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {agent.policyViolations} Policy Violation{agent.policyViolations > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{agent.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={agent.status === 'active' ? "default" : "secondary"}>
                          {agent.status === 'active' ? 'Active' : 'Paused'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditAgent(agent)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCloneAgent(agent)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Clone
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleAgent(agent.id, agent.status !== 'active')}
                            >
                              {agent.status === 'active' ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <Separator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                      {/* Purpose & Audience */}
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Purpose</p>
                          <div className="space-y-2">
                            <Badge variant="secondary" className="text-xs">
                              {PURPOSE_LABELS[agent.purpose as keyof typeof PURPOSE_LABELS] || agent.purpose}
                            </Badge>
                            <p className="text-sm">{agent.description}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Audience Size</p>
                          <p className="text-lg font-semibold">{agent.audienceSize} students</p>
                        </div>
                      </div>

                      {/* Active Plays */}
                      <div className="lg:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Active Plays</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.activePlays.slice(0, 3).map((play, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {play}
                            </Badge>
                          ))}
                          {agent.activePlays.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{agent.activePlays.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Confidence Settings */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Confidence</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Auto:</span>
                            <span className="font-medium">{agent.confidenceSettings.auto}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Suggest:</span>
                            <span className="font-medium">{agent.confidenceSettings.suggest}-{agent.confidenceSettings.auto}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Skip:</span>
                            <span className="font-medium">&lt;{agent.confidenceSettings.skip}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Today's Activity */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Today</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Executed:</span>
                            <span className="font-medium text-green-600">{agent.interventionsToday.executed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Escalated:</span>
                            <span className="font-medium text-yellow-600">{agent.interventionsToday.escalated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Blocked:</span>
                            <span className="font-medium text-red-600">{agent.interventionsToday.blocked}</span>
                          </div>
                        </div>
                      </div>

                      {/* Uplift Metrics */}
                      <div className="lg:col-span-1">
                        <p className="text-sm font-medium text-muted-foreground mb-2">30d Uplift</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Doc Complete:</span>
                            <span className="font-medium text-green-600">+{agent.upliftMetrics.docCompletion}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Conversion:</span>
                            <span className="font-medium text-green-600">+{agent.upliftMetrics.appConversion}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>Last edited: {agent.lastEdited}</span>
                        <span>•</span>
                        <span>Journey Paths: {agent.journeyPaths.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{agent.nextScheduledAction}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agents">
          {/* Agent Management */}
          <div className="space-y-6">
            {displayAgents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No AI Agents Created</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Create your first Journey-Based AI Agent to start automating student engagement based on academic journeys, policies, and plays.
                  </p>
                  <Button onClick={handleCreateAgent}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First AI Agent
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>All AI Agents</CardTitle>
                  <CardDescription>
                    Manage your journey-based AI agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {displayAgents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${agent.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Bot className={`h-4 w-4 ${agent.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
                          </div>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">{agent.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={agent.status === 'active' ? "default" : "secondary"}>
                            {agent.status === 'active' ? 'Active' : 'Paused'}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAgent(agent)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant={agent.status === 'active' ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleToggleAgent(agent.id, agent.status !== 'active')}
                          >
                            {agent.status === 'active' ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Journey-Based AI Agent Wizard */}
      <JourneyBasedAIAgentWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        editingAgent={editingAgent}
        onSave={handleWizardSave}
      />
    </div>
  );
}