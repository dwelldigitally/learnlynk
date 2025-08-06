import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Users, 
  Calendar, 
  Zap, 
  Settings, 
  Shield,
  Eye,
  Wrench,
  Activity,
  BarChart3,
  Database,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EnhancedAIAgent {
  id: string;
  name: string;
  type: string;
  category: 'intelligence' | 'automation' | 'analysis' | 'communication';
  department: string;
  status: 'active' | 'inactive' | 'training' | 'error';
  description: string;
  capabilities: string[];
  model: string;
  lastActive: string;
  successRate: number;
  actionsCount: number;
  costPerAction: number;
  responseTime: number;
  version: string;
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
}

const EnhancedAIAgentsHub: React.FC = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<EnhancedAIAgent[]>([
    {
      id: '1',
      name: 'Conversation AI Agent',
      type: 'conversation',
      category: 'communication',
      department: 'admissions',
      status: 'active',
      description: 'Real-time chat support for leads and students with natural language understanding',
      capabilities: ['Natural Language Processing', 'Multi-language Support', 'Sentiment Analysis', 'Context Retention'],
      model: 'gpt-4-turbo',
      lastActive: '1 minute ago',
      successRate: 96,
      actionsCount: 2847,
      costPerAction: 0.03,
      responseTime: 850,
      version: '2.1.0',
      systemPrompt: 'You are a helpful admissions assistant...',
      maxTokens: 2000,
      temperature: 0.7
    },
    {
      id: '2',
      name: 'Predictive Analytics Agent',
      type: 'analytics',
      category: 'analysis',
      department: 'admissions',
      status: 'active',
      description: 'Advanced machine learning for enrollment probability forecasting and risk assessment',
      capabilities: ['Enrollment Prediction', 'Risk Scoring', 'Cohort Analysis', 'Trend Forecasting'],
      model: 'claude-3-opus',
      lastActive: '3 minutes ago',
      successRate: 94,
      actionsCount: 1205,
      costPerAction: 0.15,
      responseTime: 1200,
      version: '1.8.2',
      systemPrompt: 'Analyze student data patterns to predict...',
      maxTokens: 4000,
      temperature: 0.2
    },
    {
      id: '3',
      name: 'Content Generation Agent',
      type: 'content',
      category: 'automation',
      department: 'marketing',
      status: 'training',
      description: 'Automated creation of personalized emails, documents, and marketing materials',
      capabilities: ['Email Generation', 'Document Creation', 'Content Personalization', 'Brand Consistency'],
      model: 'gpt-4o',
      lastActive: '15 minutes ago',
      successRate: 89,
      actionsCount: 856,
      costPerAction: 0.08,
      responseTime: 2100,
      version: '1.5.1',
      systemPrompt: 'Generate engaging content that matches...',
      maxTokens: 3000,
      temperature: 0.8
    },
    {
      id: '4',
      name: 'Quality Assurance Agent',
      type: 'qa',
      category: 'intelligence',
      department: 'admissions',
      status: 'active',
      description: 'Monitors and improves the performance of other AI agents with continuous learning',
      capabilities: ['Performance Monitoring', 'Error Detection', 'Quality Scoring', 'Agent Optimization'],
      model: 'claude-3-sonnet',
      lastActive: '5 minutes ago',
      successRate: 98,
      actionsCount: 423,
      costPerAction: 0.05,
      responseTime: 650,
      version: '2.0.3',
      systemPrompt: 'Monitor agent performance and identify...',
      maxTokens: 1500,
      temperature: 0.1
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<EnhancedAIAgent | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const agentTypes = [
    { value: 'conversation', label: 'Conversation AI', icon: MessageSquare, category: 'communication' },
    { value: 'analytics', label: 'Predictive Analytics', icon: TrendingUp, category: 'analysis' },
    { value: 'content', label: 'Content Generation', icon: FileText, category: 'automation' },
    { value: 'qa', label: 'Quality Assurance', icon: Shield, category: 'intelligence' },
    { value: 'integration', label: 'Integration Agent', icon: Globe, category: 'automation' },
    { value: 'compliance', label: 'Compliance Agent', icon: Shield, category: 'intelligence' },
    { value: 'scheduling', label: 'Smart Scheduler', icon: Calendar, category: 'automation' },
    { value: 'document', label: 'Document Processor', icon: FileText, category: 'automation' }
  ];

  const aiModels = [
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI' },
    { value: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus', provider: 'Anthropic' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku', provider: 'Anthropic' },
    { value: 'local-llama', label: 'Local Llama 3', provider: 'Local' }
  ];

  const departments = [
    { value: 'admissions', label: 'Admissions' },
    { value: 'student-success', label: 'Student Success' },
    { value: 'financial-aid', label: 'Financial Aid' },
    { value: 'academic', label: 'Academic Services' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'training': return 'bg-warning text-warning-foreground';
      case 'error': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'intelligence': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'automation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'analysis': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'communication': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    const agentType = agentTypes.find(t => t.value === type);
    return agentType ? agentType.icon : Bot;
  };

  const handleToggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
        : agent
    ));
    toast({
      title: "Agent Status Updated",
      description: "AI agent status has been changed successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Enhanced AI Agents Hub</h2>
          <p className="text-muted-foreground">Manage advanced AI agents with comprehensive configuration and monitoring</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Bot className="h-4 w-4" />
          Create Advanced Agent
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Active Agents</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{agents.filter(a => a.status === 'active').length}</div>
                <p className="text-xs text-muted-foreground">of {agents.length} total agents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(agents.reduce((acc, a) => acc + a.successRate, 0) / agents.length)}%
                </div>
                <p className="text-xs text-muted-foreground">across all agents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Cost</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${agents.reduce((acc, a) => acc + (a.actionsCount * a.costPerAction), 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">estimated today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(agents.reduce((acc, a) => acc + a.responseTime, 0) / agents.length)}ms
                </div>
                <p className="text-xs text-muted-foreground">average latency</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Categories</CardTitle>
                <CardDescription>Distribution by functional category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['intelligence', 'automation', 'analysis', 'communication'].map(category => {
                    const count = agents.filter(a => a.category === category).length;
                    const percentage = Math.round((count / agents.length) * 100);
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(category)}>
                            {category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{count} agents</span>
                        </div>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Usage</CardTitle>
                <CardDescription>AI models currently in use</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(agents.map(a => a.model))).map(model => {
                    const count = agents.filter(a => a.model === model).length;
                    const modelInfo = aiModels.find(m => m.value === model);
                    return (
                      <div key={model} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-sm font-medium">{modelInfo?.label || model}</span>
                          <Badge variant="outline" className="text-xs">
                            {modelInfo?.provider}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{count} agents</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid gap-4">
            {agents.map((agent) => {
              const IconComponent = getTypeIcon(agent.type);
              return (
                <Card key={agent.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <Badge className={getCategoryColor(agent.category)}>
                              {agent.category}
                            </Badge>
                          </div>
                          <CardDescription>{agent.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(agent.status)}>
                          {agent.status}
                        </Badge>
                        <Switch
                          checked={agent.status === 'active'}
                          onCheckedChange={() => handleToggleAgent(agent.id)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Model</Label>
                        <p className="text-sm font-medium">{aiModels.find(m => m.value === agent.model)?.label}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Success Rate</Label>
                        <p className="text-sm font-medium">{agent.successRate}%</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Actions</Label>
                        <p className="text-sm font-medium">{agent.actionsCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Cost/Action</Label>
                        <p className="text-sm font-medium">${agent.costPerAction}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Response Time</Label>
                        <p className="text-sm font-medium">{agent.responseTime}ms</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Version</Label>
                        <p className="text-sm font-medium">v{agent.version}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.capabilities.map((capability, index) => (
                        <Badge key={index} variant="secondary">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedAgent(agent)}>
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Analytics
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Monitor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>Configure and manage AI models across all agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {aiModels.map((model) => (
                  <Card key={model.value} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{model.label}</CardTitle>
                          <CardDescription>Provider: {model.provider}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {agents.filter(a => a.model === model.value).length} agents
                          </Badge>
                          <Switch defaultChecked={agents.some(a => a.model === model.value)} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs">Max Tokens</Label>
                          <Input type="number" defaultValue="4000" />
                        </div>
                        <div>
                          <Label className="text-xs">Temperature</Label>
                          <Slider defaultValue={[0.7]} max={1} step={0.1} className="mt-2" />
                        </div>
                        <div>
                          <Label className="text-xs">Cost per 1K tokens</Label>
                          <Input type="number" step="0.001" defaultValue="0.03" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Agent performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Performance analytics dashboard</p>
                  <p className="text-sm">Success rates, response times, and cost tracking</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Usage costs and optimization opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Cost optimization insights</p>
                  <p className="text-sm">Token usage, model efficiency, and budget tracking</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring</CardTitle>
              <CardDescription>Live agent status and performance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Real-time monitoring dashboard</p>
                <p className="text-sm">Live agent status, alerts, and system health</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global AI Settings</CardTitle>
              <CardDescription>System-wide AI configuration and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable AI Agents</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Human Approval Required</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Debug Mode</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Cost Monitoring</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Default AI Provider</Label>
                    <Select defaultValue="openai">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="local">Local Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Daily Budget Limit ($)</Label>
                    <Input type="number" defaultValue="1000" />
                  </div>
                  <div>
                    <Label>Max Response Time (ms)</Label>
                    <Input type="number" defaultValue="3000" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Agent Configuration Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Configure {selectedAgent.name}</CardTitle>
              <CardDescription>Advanced agent configuration and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="model">Model Settings</TabsTrigger>
                  <TabsTrigger value="prompts">Prompts</TabsTrigger>
                  <TabsTrigger value="limits">Limits & Safety</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Agent Name</Label>
                      <Input defaultValue={selectedAgent.name} />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Select defaultValue={selectedAgent.department}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea defaultValue={selectedAgent.description} />
                  </div>
                </TabsContent>

                <TabsContent value="model" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>AI Model</Label>
                      <Select defaultValue={selectedAgent.model}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {aiModels.map(model => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label} ({model.provider})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Max Tokens</Label>
                      <Input type="number" defaultValue={selectedAgent.maxTokens} />
                    </div>
                  </div>
                  <div>
                    <Label>Temperature: {selectedAgent.temperature}</Label>
                    <Slider 
                      defaultValue={[selectedAgent.temperature]} 
                      max={1} 
                      step={0.1} 
                      className="mt-2" 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="prompts" className="space-y-4">
                  <div>
                    <Label>System Prompt</Label>
                    <Textarea 
                      defaultValue={selectedAgent.systemPrompt} 
                      rows={8}
                      placeholder="Enter the system prompt that defines the agent's behavior..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="limits" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Daily Action Limit</Label>
                      <Input type="number" defaultValue="1000" />
                    </div>
                    <div>
                      <Label>Daily Cost Limit ($)</Label>
                      <Input type="number" defaultValue="100" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Content Filter</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Rate Limiting</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Human Escalation</Label>
                      <Switch />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedAgent(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setSelectedAgent(null)}>
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedAIAgentsHub;