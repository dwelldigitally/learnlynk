import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

export function AgenticAIConfiguration() {
  const { toast } = useToast();
  
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: "Agentic Admissions AI",
    description: "Your AI-powered admissions assistant that handles lead nurturing and qualification",
    isActive: true,
    personality: "professional and helpful",
    responseStyle: 'professional',
    maxConcurrentLeads: 50,
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
      name: 'Dead Leads Revival',
      description: 'Re-engage leads with no activity for 30+ days',
      conditions: [
        { field: 'last_activity', operator: 'older_than', value: '30' },
        { field: 'status', operator: 'equals', value: 'lost' }
      ],
      isActive: false
    },
    {
      id: '3',
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
    },
    {
      id: '2',
      name: 'Partner Referrals',
      criteria: 'Source = partner_referral',
      reason: 'Partner relationships require personal touch',
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

  const saveConfiguration = () => {
    toast({
      title: "Configuration Saved",
      description: "Agentic AI configuration has been updated successfully."
    });
  };

  const testConfiguration = () => {
    toast({
      title: "Test Started",
      description: "Running configuration test with sample leads..."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agentic Admissions AI</h2>
          <p className="text-muted-foreground">
            Configure your AI assistant for automated lead nurturing and qualification
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={agentConfig.isActive ? "default" : "secondary"}>
            {agentConfig.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Button onClick={testConfiguration} variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Test Config
          </Button>
          <Button onClick={saveConfiguration}>
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="exemptions">Exemptions</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* General Configuration */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Agent Configuration
              </CardTitle>
              <CardDescription>
                Configure your AI assistant's identity and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    value={agentConfig.name}
                    onChange={(e) => updateAgentConfig('name', e.target.value)}
                    placeholder="Enter AI agent name"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={agentConfig.description}
                  onChange={(e) => updateAgentConfig('description', e.target.value)}
                  placeholder="Describe your AI agent's purpose and role"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personality">Personality & Tone</Label>
                <Textarea
                  id="personality"
                  value={agentConfig.personality}
                  onChange={(e) => updateAgentConfig('personality', e.target.value)}
                  placeholder="Define the AI's personality and communication style"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLeads">Max Concurrent Leads</Label>
                  <Input
                    id="maxLeads"
                    type="number"
                    value={agentConfig.maxConcurrentLeads}
                    onChange={(e) => updateAgentConfig('maxConcurrentLeads', parseInt(e.target.value))}
                    min="1"
                    max="200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="handoffThreshold">Handoff Threshold (%)</Label>
                  <Input
                    id="handoffThreshold"
                    type="number"
                    value={agentConfig.handoffThreshold}
                    onChange={(e) => updateAgentConfig('handoffThreshold', parseInt(e.target.value))}
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lead score threshold for automatic handoff to human advisors
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${agentConfig.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Bot className={`h-4 w-4 ${agentConfig.isActive ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <span className="font-medium">AI Agent Status</span>
                    <p className="text-sm text-muted-foreground">
                      {agentConfig.isActive ? 'AI is actively managing leads' : 'AI is paused'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={agentConfig.isActive}
                  onCheckedChange={(checked) => updateAgentConfig('isActive', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Communication Automation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'emailFollowUp', label: 'Email Follow-ups', icon: Mail, description: 'Automated email sequences' },
                  { key: 'smsFollowUp', label: 'SMS Follow-ups', icon: MessageSquare, description: 'Text message campaigns' },
                  { key: 'callScheduling', label: 'Call Scheduling', icon: Phone, description: 'Automatic meeting booking' }
                ].map(({ key, label, icon: Icon, description }) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{label}</span>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Smart Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'autoHandoff', label: 'Auto Handoff', icon: Users, description: 'Automatic human escalation' },
                  { key: 'learningMode', label: 'Learning Mode', icon: Target, description: 'Continuous AI improvement' },
                  { key: 'smartTiming', label: 'Smart Timing', icon: Clock, description: 'Optimal contact timing' }
                ].map(({ key, label, icon: Icon, description }) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{label}</span>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
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
          </div>
        </TabsContent>

        {/* Filter Rules */}
        <TabsContent value="filters" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    AI Activation Filters
                  </CardTitle>
                  <CardDescription>
                    Define which leads the AI should actively manage
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filterRules.map((rule) => (
                <div key={rule.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Filter className={`h-4 w-4 ${rule.isActive ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <span className="font-medium">{rule.name}</span>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => toggleFilterRule(rule.id)}
                      />
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">CONDITIONS</Label>
                    {rule.conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                        <Badge variant="outline">{condition.field}</Badge>
                        <span>{condition.operator}</span>
                        <Badge variant="secondary">{condition.value}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exemption Rules */}
        <TabsContent value="exemptions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Exemption Rules
                  </CardTitle>
                  <CardDescription>
                    Define leads that should never be handled by AI
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exemption
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {exemptionRules.map((rule) => (
                <div key={rule.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-red-100' : 'bg-gray-100'}`}>
                        <Shield className={`h-4 w-4 ${rule.isActive ? 'text-red-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <span className="font-medium">{rule.name}</span>
                        <p className="text-sm text-muted-foreground">{rule.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => toggleExemptionRule(rule.id)}
                      />
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">CRITERIA</Label>
                    <div className="text-sm bg-muted p-2 rounded font-mono">
                      {rule.criteria}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  Active Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">23</div>
                <p className="text-xs text-muted-foreground">Currently managed by AI</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-xs text-muted-foreground">Lead progression rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Handoffs Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <p className="text-xs text-muted-foreground">Escalated to humans</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent AI Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '2 min ago', action: 'Email sent to John Doe', status: 'success' },
                  { time: '5 min ago', action: 'Lead scored and prioritized', status: 'success' },
                  { time: '12 min ago', action: 'Call scheduled with Sarah Wilson', status: 'success' },
                  { time: '18 min ago', action: 'Handoff to human advisor', status: 'warning' },
                  { time: '25 min ago', action: 'SMS follow-up sent', status: 'success' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm">{activity.action}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}