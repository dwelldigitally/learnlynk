import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  AlertCircle
} from "lucide-react";
import { useLeadAIAgent } from "@/hooks/useLeadAIAgent";
import { AIAgentWizard } from "../wizard/AIAgentWizard";
import { useToast } from "@/hooks/use-toast";

export function LeadAIAgentConfiguration() {
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
  const { toast } = useToast();

  const handleCreateAgent = () => {
    setEditingAgent(null);
    setWizardOpen(true);
  };

  const handleEditAgent = (agent: any) => {
    setEditingAgent(agent);
    setWizardOpen(true);
  };

  const handleWizardSave = async (agentData: any) => {
    try {
      if (editingAgent) {
        await updateAgent(editingAgent.id, agentData);
        toast({
          title: "Agent Updated",
          description: "Lead AI Agent has been updated successfully."
        });
      } else {
        await createAgent(agentData);
        toast({
          title: "Agent Created",
          description: "Lead AI Agent has been created and is now active."
        });
      }
      setWizardOpen(false);
      loadAgents(); // Refresh the data
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
        title: isActive ? "Agent Activated" : "Agent Deactivated",
        description: `Lead AI Agent has been ${isActive ? 'activated' : 'deactivated'}.`
      });
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
          <h2 className="text-2xl font-bold tracking-tight">Lead AI Agents</h2>
          <p className="text-muted-foreground">
            Manage AI-powered lead nurturing and qualification agents
          </p>
        </div>
        <Button onClick={handleCreateAgent}>
          <Plus className="h-4 w-4 mr-2" />
          Create AI Agent
        </Button>
      </div>

      {/* Active Agent Overview */}
      {activeAgent ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeAgent.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Bot className={`h-6 w-6 ${activeAgent.is_active ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <CardTitle>{activeAgent.name}</CardTitle>
                  <CardDescription>{activeAgent.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={activeAgent.is_active ? "default" : "secondary"}>
                  {activeAgent.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAgent(activeAgent)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant={activeAgent.is_active ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleToggleAgent(activeAgent.id, !activeAgent.is_active)}
                >
                  {activeAgent.is_active ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mx-auto mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">{activeAgent.max_concurrent_leads}</div>
                <div className="text-sm text-muted-foreground">Max Concurrent</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{activeAgent.handoff_threshold}%</div>
                <div className="text-sm text-muted-foreground">Handoff Threshold</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 mx-auto mb-2">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold">{performanceMetrics?.total_leads_handled || 0}</div>
                <div className="text-sm text-muted-foreground">Leads Processed</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mx-auto mb-2">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold">{performanceMetrics?.success_rate || 0}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No AI Agent Active</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first Lead AI Agent to start automating lead nurturing and qualification processes.
            </p>
            <Button onClick={handleCreateAgent}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First AI Agent
            </Button>
          </CardContent>
        </Card>
      )}

      {/* All Agents List */}
      {agents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Lead AI Agents</CardTitle>
            <CardDescription>
              Manage and configure your Lead AI agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${agent.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Bot className={`h-4 w-4 ${agent.is_active ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-muted-foreground">{agent.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={agent.is_active ? "default" : "secondary"}>
                      {agent.is_active ? 'Active' : 'Inactive'}
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
                      variant={agent.is_active ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleAgent(agent.id, !agent.is_active)}
                    >
                      {agent.is_active ? (
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

      {/* AI Agent Wizard */}
      <AIAgentWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        editingAgent={editingAgent}
        onSave={handleWizardSave}
      />
    </div>
  );
}