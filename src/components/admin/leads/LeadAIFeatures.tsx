import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Phone, 
  Mail, 
  MessageSquare, 
  Settings, 
  Users, 
  Target, 
  Clock, 
  Shield,
  Zap,
  Filter,
  Eye,
  Play,
  Pause,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  ArrowRight,
  Activity,
  BarChart3,
  Calendar,
  Brain,
  RefreshCw,
  Edit,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAIAgent } from "@/hooks/useAIAgent";

export function LeadAIFeatures() {
  const { toast } = useToast();
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentDescription, setNewAgentDescription] = useState("");
  const [newAgentResponseStyle, setNewAgentResponseStyle] = useState<'professional' | 'friendly' | 'casual'>('professional');
  
  const {
    agents,
    activeAgent,
    filterRules,
    tasks,
    agentLeads,
    performanceMetrics,
    isLoading,
    createAgent,
    updateAgent,
    toggleAgent,
    createFilterRule,
    updateFilterRule,
    createTask,
    toggleTask,
    reassignLeadsToHumans,
    loadAgents
  } = useAIAgent();

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) {
      toast({
        title: "Error",
        description: "Agent name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createAgent({
        name: newAgentName,
        description: newAgentDescription,
        response_style: newAgentResponseStyle,
        max_concurrent_leads: 50,
        handoff_threshold: 75,
        configuration: {}
      });
      
      setShowCreateAgent(false);
      setNewAgentName("");
      setNewAgentDescription("");
      setNewAgentResponseStyle('professional');
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleToggleAgent = async (agentId: string, isActive: boolean) => {
    await toggleAgent(agentId, isActive);
  };

  const handleUpdateAgentConfig = async (field: string, value: any) => {
    if (!activeAgent) return;
    
    await updateAgent(activeAgent.id, { [field]: value });
  };

  if (isLoading) {
    return (
      <div className="p-6 pt-8 w-full max-w-none space-y-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-8 w-full max-w-none space-y-8">
      {/* Header with AI Agent Profile */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <div className={`relative p-4 rounded-2xl ${activeAgent?.is_active ? 'bg-primary/10' : 'bg-muted'}`}>
            <Bot className={`h-12 w-12 ${activeAgent?.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
            {activeAgent?.is_active && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{activeAgent?.name || "No Active Agent"}</h1>
              <Badge variant={activeAgent?.is_active ? "default" : "secondary"}>
                {activeAgent?.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              {activeAgent?.description || "No agent is currently active"}
            </p>
            {activeAgent && performanceMetrics && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>{performanceMetrics.active_leads_count} leads assigned</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>{performanceMetrics.success_rate}% success rate</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{performanceMetrics.average_response_time}h avg response time</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeAgent ? (
            <Button 
              onClick={() => handleToggleAgent(activeAgent.id, !activeAgent.is_active)} 
              variant="outline"
            >
              {activeAgent.is_active ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Turn Off AI
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Activate AI
                </>
              )}
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              No Agent Available
            </Button>
          )}
          
          <Dialog open={showCreateAgent} onOpenChange={setShowCreateAgent}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New AI Agent</DialogTitle>
                <DialogDescription>
                  Set up a new AI agent for specialized lead management
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="newAgentName">Agent Name</Label>
                  <Input 
                    id="newAgentName" 
                    placeholder="e.g., Sarah, MBA Specialist"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newAgentDesc">Description</Label>
                  <Textarea 
                    id="newAgentDesc" 
                    placeholder="Describe the agent's specialization..."
                    value={newAgentDescription}
                    onChange={(e) => setNewAgentDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responseStyle">Response Style</Label>
                  <Select 
                    value={newAgentResponseStyle} 
                    onValueChange={(value: 'professional' | 'friendly' | 'casual') => setNewAgentResponseStyle(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateAgent(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAgent}>
                    Create Agent
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Current Operations Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Leads</p>
                <p className="text-2xl font-bold">{performanceMetrics?.active_leads_count || 0}</p>
                <p className="text-xs text-muted-foreground">of {activeAgent?.max_concurrent_leads || 0} max capacity</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <Progress 
              value={activeAgent ? ((performanceMetrics?.active_leads_count || 0) / activeAgent.max_concurrent_leads) * 100 : 0} 
              className="mt-3" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics?.conversion_rate.toFixed(1) || 0}%</p>
                <p className="text-xs text-green-600">Total leads handled: {performanceMetrics?.total_leads_handled || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Handoffs Pending</p>
                <p className="text-2xl font-bold">{performanceMetrics?.handoffs_count || 0}</p>
                <p className="text-xs text-orange-600">Requires human attention</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Management Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Lead Management Controls
          </CardTitle>
          <CardDescription>
            Manage leads currently being handled by {activeAgent?.name || "AI agent"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">Current Filter Configuration</h4>
              <p className="text-sm text-muted-foreground">
                {filterRules.filter(r => r.is_active).length} active filters applied
              </p>
              <div className="flex gap-2 mt-2">
                {filterRules.filter(r => r.is_active).map(rule => (
                  <Badge key={rule.id} variant="secondary">{rule.name}</Badge>
                ))}
              </div>
            </div>
            <Button variant="outline">
              Modify Filters
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Bulk Actions</h4>
              <p className="text-sm text-muted-foreground">
                Manage all {agentLeads.length} leads currently assigned to {activeAgent?.name || "agent"}
              </p>
            </div>
            <Button onClick={reassignLeadsToHumans} variant="outline" disabled={agentLeads.length === 0}>
              <UserCheck className="h-4 w-4 mr-2" />
              Reassign All to Humans
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Active Tasks
              </CardTitle>
              <CardDescription>
                Tasks that {activeAgent?.name || "the AI agent"} is currently executing
              </CardDescription>
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.length > 0 ? tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${task.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CheckCircle className={`h-4 w-4 ${task.is_active ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{task.title}</span>
                    <Badge variant={task.priority === 'high' ? 'default' : task.priority === 'medium' ? 'secondary' : 'outline'}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
              </div>
              <Switch
                checked={task.is_active}
                onCheckedChange={() => toggleTask(task.id, !task.is_active)}
              />
            </div>
          )) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No tasks configured for this agent</p>
              <p className="text-sm">Click "Add Task" to create tasks</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agent Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAgent ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    value={activeAgent.name}
                    onChange={(e) => handleUpdateAgentConfig('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responseStyle">Response Style</Label>
                  <Select 
                    value={activeAgent.response_style} 
                    onValueChange={(value) => handleUpdateAgentConfig('response_style', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxLeads">Max Concurrent Leads</Label>
                    <Input
                      id="maxLeads"
                      type="number"
                      value={activeAgent.max_concurrent_leads}
                      onChange={(e) => handleUpdateAgentConfig('max_concurrent_leads', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="handoffThreshold">Handoff Threshold (%)</Label>
                    <Input
                      id="handoffThreshold"
                      type="number"
                      value={activeAgent.handoff_threshold}
                      onChange={(e) => handleUpdateAgentConfig('handoff_threshold', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active agent</p>
                <p className="text-sm">Create or activate an agent to configure settings</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          </CardContent>
        </Card>

        {/* Filter Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Rules
              </CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filterRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${rule.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Filter className={`h-4 w-4 ${rule.is_active ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <span className="font-medium text-sm">{rule.name}</span>
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
                <Switch
                  checked={rule.is_active}
                  onCheckedChange={() => updateFilterRule(rule.id, { is_active: !rule.is_active })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Exemption Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Exemption Rules
              </CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Exemption
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Exemption rules would be loaded from database in a similar way to filter rules */}
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No exemption rules configured</p>
              <p className="text-sm">Click "Add Exemption" to create exemption rules</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Activity Monitor
          </CardTitle>
          <CardDescription>
            Live updates from {activeAgent?.name || "the AI agent"}'s current activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "2 min ago", action: "Sent follow-up email to Sarah Chen", type: "email" },
              { time: "5 min ago", action: "Qualified lead: MBA Program match (85% score)", type: "qualification" },
              { time: "8 min ago", action: "Scheduled call with Michael Rodriguez", type: "scheduling" },
              { time: "12 min ago", action: "Handoff initiated for VIP lead", type: "handoff" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {activity.type === 'email' && <Mail className="h-4 w-4 text-primary" />}
                  {activity.type === 'qualification' && <Target className="h-4 w-4 text-primary" />}
                  {activity.type === 'scheduling' && <Calendar className="h-4 w-4 text-primary" />}
                  {activity.type === 'handoff' && <Users className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}