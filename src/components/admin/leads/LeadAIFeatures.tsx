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
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AgentConfig {
  name: string;
  description: string;
  isActive: boolean;
  personality: string;
  responseStyle: 'professional' | 'friendly' | 'casual';
  maxConcurrentLeads: number;
  handoffThreshold: number;
}

interface FilterRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    field: string;
    operator: string;
    value: string;
  }[];
  isActive: boolean;
}

interface ExemptionRule {
  id: string;
  name: string;
  criteria: string;
  reason: string;
  isActive: boolean;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
}

export function LeadAIFeatures() {
  const { toast } = useToast();
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: "John",
    description: "AI Admissions Agent specializing in program qualification and lead nurturing",
    isActive: true,
    personality: "professional and helpful",
    responseStyle: 'professional',
    maxConcurrentLeads: 45,
    handoffThreshold: 75
  });

  const [filterRules, setFilterRules] = useState<FilterRule[]>([
    {
      id: '1',
      name: 'Low Score Leads',
      description: 'Target leads with scores below 40 for aggressive nurturing',
      conditions: [
        { field: 'lead_score', operator: 'less_than', value: '40' }
      ],
      isActive: true
    },
    {
      id: '2', 
      name: 'Aggressive Sales Intakes',
      description: 'High-touch approach for competitive program intakes',
      conditions: [
        { field: 'intake_sales_approach', operator: 'equals', value: 'aggressive' }
      ],
      isActive: true
    }
  ]);

  const [exemptionRules, setExemptionRules] = useState<ExemptionRule[]>([
    {
      id: '1',
      name: 'VIP Leads',
      criteria: 'Lead score > 90 OR priority = urgent',
      reason: 'High-value leads require immediate human attention',
      isActive: true
    }
  ]);

  const [automationSettings, setAutomationSettings] = useState({
    emailFollowUp: true,
    smsFollowUp: true,
    callScheduling: true,
    autoHandoff: true,
    learningMode: false,
    smartTiming: true
  });

  const [activeTasks, setActiveTasks] = useState<TaskItem[]>([
    { id: '1', title: 'Initial Contact', description: 'Send welcome email to new leads', isActive: true, priority: 'high' },
    { id: '2', title: 'Program Matching', description: 'Analyze lead profile and suggest matching programs', isActive: true, priority: 'high' },
    { id: '3', title: 'Follow-up Sequences', description: 'Execute personalized follow-up campaigns', isActive: true, priority: 'medium' },
    { id: '4', title: 'Qualification Scoring', description: 'Update lead scores based on interactions', isActive: true, priority: 'medium' },
    { id: '5', title: 'Deadline Reminders', description: 'Send application deadline reminders', isActive: false, priority: 'low' }
  ]);

  const updateAgentConfig = (field: keyof AgentConfig, value: any) => {
    setAgentConfig(prev => ({ ...prev, [field]: value }));
  };

  const toggleFilterRule = (ruleId: string) => {
    setFilterRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const toggleExemptionRule = (ruleId: string) => {
    setExemptionRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const toggleTask = (taskId: string) => {
    setActiveTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isActive: !task.isActive } : task
    ));
  };

  const turnOffAI = () => {
    updateAgentConfig('isActive', false);
    toast({
      title: "AI Agent Deactivated",
      description: "John has been turned off. All active leads will be queued for human assignment."
    });
  };

  const reassignLeads = () => {
    toast({
      title: "Reassignment Started",
      description: "All 23 working leads are being reassigned to available human advisors."
    });
  };

  return (
    <div className="p-6 pt-8 w-full max-w-none space-y-8">
      {/* Header with AI Agent Profile */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <div className={`relative p-4 rounded-2xl ${agentConfig.isActive ? 'bg-primary/10' : 'bg-muted'}`}>
            <Bot className={`h-12 w-12 ${agentConfig.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
            {agentConfig.isActive && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{agentConfig.name}</h1>
              <Badge variant={agentConfig.isActive ? "default" : "secondary"}>
                {agentConfig.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              {agentConfig.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>23 leads assigned</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span>89% success rate</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>2.3h avg response time</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {agentConfig.isActive ? (
            <Button onClick={turnOffAI} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Turn Off AI
            </Button>
          ) : (
            <Button onClick={() => updateAgentConfig('isActive', true)}>
              <Play className="h-4 w-4 mr-2" />
              Activate AI
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
                  <Input id="newAgentName" placeholder="e.g., Sarah, MBA Specialist" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newAgentDesc">Description</Label>
                  <Textarea id="newAgentDesc" placeholder="Describe the agent's specialization..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateAgent(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setShowCreateAgent(false);
                    toast({ title: "New Agent Created", description: "Your new AI agent is being configured." });
                  }}>
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
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">of 45 max capacity</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <Progress value={(23/45) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversions Today</p>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-green-600">+12% from yesterday</p>
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
                <p className="text-2xl font-bold">3</p>
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
            Manage leads currently being handled by {agentConfig.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">Current Filter Configuration</h4>
              <p className="text-sm text-muted-foreground">
                {filterRules.filter(r => r.isActive).length} active filters applied
              </p>
              <div className="flex gap-2 mt-2">
                {filterRules.filter(r => r.isActive).map(rule => (
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
                Manage all 23 leads currently assigned to {agentConfig.name}
              </p>
            </div>
            <Button onClick={reassignLeads} variant="outline">
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
                Tasks that {agentConfig.name} is currently executing
              </CardDescription>
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${task.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <CheckCircle className={`h-4 w-4 ${task.isActive ? 'text-green-600' : 'text-gray-600'}`} />
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
                checked={task.isActive}
                onCheckedChange={() => toggleTask(task.id)}
              />
            </div>
          ))}
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
            <div className="space-y-2">
              <Label htmlFor="agentName">Agent Name</Label>
              <Input
                id="agentName"
                value={agentConfig.name}
                onChange={(e) => updateAgentConfig('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responseStyle">Response Style</Label>
              <Select value={agentConfig.responseStyle} onValueChange={(value) => updateAgentConfig('responseStyle', value)}>
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
                  value={agentConfig.maxConcurrentLeads}
                  onChange={(e) => updateAgentConfig('maxConcurrentLeads', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="handoffThreshold">Handoff Threshold (%)</Label>
                <Input
                  id="handoffThreshold"
                  type="number"
                  value={agentConfig.handoffThreshold}
                  onChange={(e) => updateAgentConfig('handoffThreshold', parseInt(e.target.value))}
                />
              </div>
            </div>
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
            {[
              { key: 'emailFollowUp', label: 'Email Follow-ups', icon: Mail },
              { key: 'smsFollowUp', label: 'SMS Follow-ups', icon: MessageSquare },
              { key: 'callScheduling', label: 'Call Scheduling', icon: Phone },
              { key: 'autoHandoff', label: 'Auto Handoff', icon: Users },
              { key: 'smartTiming', label: 'Smart Timing', icon: Clock }
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{label}</span>
                </div>
                <Switch
                  checked={automationSettings[key as keyof typeof automationSettings]}
                  onCheckedChange={(checked) => 
                    setAutomationSettings(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
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
                  <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Filter className={`h-4 w-4 ${rule.isActive ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <span className="font-medium text-sm">{rule.name}</span>
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
                <Switch
                  checked={rule.isActive}
                  onCheckedChange={() => toggleFilterRule(rule.id)}
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
            {exemptionRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-orange-100' : 'bg-gray-100'}`}>
                    <Shield className={`h-4 w-4 ${rule.isActive ? 'text-orange-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <span className="font-medium text-sm">{rule.name}</span>
                    <p className="text-xs text-muted-foreground">{rule.reason}</p>
                  </div>
                </div>
                <Switch
                  checked={rule.isActive}
                  onCheckedChange={() => toggleExemptionRule(rule.id)}
                />
              </div>
            ))}
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
            Live updates from {agentConfig.name}'s current activities
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