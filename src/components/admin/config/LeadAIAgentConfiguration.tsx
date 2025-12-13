import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  Plus, 
  Users, 
  Zap,
  Play,
  Pause,
  Edit,
  Shield,
  BarChart3,
  Copy,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { useLeadAIAgent } from "@/hooks/useLeadAIAgent";
import { JourneyBasedAIAgentWizard } from "../wizard/JourneyBasedAIAgentWizard";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LeadAIAgentConfiguration() {
  const {
    agents,
    isLoading,
    createAgent,
    updateAgent,
    toggleAgent,
    loadAgents
  } = useLeadAIAgent();

  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

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
    try {
      await toggleAgent(agentId, isActive);
      toast({
        title: isActive ? "Agent Activated" : "Agent Paused",
        description: `AI Agent has been ${isActive ? 'activated' : 'paused'}.`
      });
      loadAgents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle agent status.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Journey-Based AI Agents</h2>
          <p className="text-muted-foreground">
            AI agents that work with academic journeys, policies, and plays to optimize student conversion
          </p>
        </div>
        <Button onClick={handleCreateAgent}>
          <Plus className="h-4 w-4 mr-2" />
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
                      <p className="text-2xl font-bold">{agents.filter(a => a.is_active).length}</p>
                    </div>
                    <Bot className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                      <p className="text-2xl font-bold">{agents.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Max Concurrent Leads</p>
                      <p className="text-2xl font-bold">{agents.reduce((sum, a) => sum + (a.max_concurrent_leads || 0), 0)}</p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Handoff Threshold</p>
                      <p className="text-2xl font-bold">
                        {agents.length > 0 
                          ? Math.round(agents.reduce((sum, a) => sum + (a.handoff_threshold || 0), 0) / agents.length)
                          : 0}%
                      </p>
                    </div>
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agent Cards */}
            {agents.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No AI Agents Configured</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first AI agent to start automating lead engagement
                  </p>
                  <Button onClick={handleCreateAgent}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create AI Agent
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {agents.map((agent) => (
                  <Card key={agent.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            agent.is_active ? 'bg-green-100' : 'bg-muted'
                          }`}>
                            <Bot className={`h-6 w-6 ${
                              agent.is_active ? 'text-green-600' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <CardTitle>{agent.name}</CardTitle>
                            <CardDescription>{agent.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={agent.is_active ? "default" : "secondary"}>
                            {agent.is_active ? 'Active' : 'Paused'}
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
                              <DropdownMenuItem 
                                onClick={() => handleToggleAgent(agent.id, !agent.is_active)}
                              >
                                {agent.is_active ? (
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
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Response Style</p>
                          <p className="font-medium capitalize">{agent.response_style}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max Concurrent Leads</p>
                          <p className="font-medium">{agent.max_concurrent_leads}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Handoff Threshold</p>
                          <p className="font-medium">{agent.handoff_threshold}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Personality</p>
                          <p className="font-medium capitalize">{agent.personality || 'Default'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Agent Management</CardTitle>
              <CardDescription>
                View and manage all AI agents in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No agents created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bot className={`h-5 w-5 ${agent.is_active ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">{agent.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={agent.is_active ? "default" : "secondary"}>
                          {agent.is_active ? 'Active' : 'Paused'}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => handleEditAgent(agent)}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {wizardOpen && (
        <JourneyBasedAIAgentWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          onSave={handleWizardSave}
          editingAgent={editingAgent}
        />
      )}
    </div>
  );
}
