import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Brain, MessageSquare, FileText, TrendingUp, Users, Calendar, Zap, Settings, Play, Pause, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { NaturalLanguageCampaignBuilder } from './NaturalLanguageCampaignBuilder';

interface AIAgent {
  id: string;
  name: string;
  type: string;
  department: string;
  status: 'active' | 'inactive' | 'training';
  description: string;
  capabilities: string[];
  lastActive: string;
  successRate: number;
  actionsCount: number;
}

const AIAgentsHub: React.FC = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: '1',
      name: 'Admissions Assistant',
      type: 'follow-up',
      department: 'admissions',
      status: 'active',
      description: 'Automates lead follow-up and application guidance',
      capabilities: ['Email Automation', 'Lead Scoring', 'Document Nudging'],
      lastActive: '2 minutes ago',
      successRate: 94,
      actionsCount: 1247
    },
    {
      id: '2',
      name: 'Document Processor',
      type: 'processing',
      department: 'admissions',
      status: 'active',
      description: 'Reviews and processes application documents',
      capabilities: ['OCR Analysis', 'Document Classification', 'Data Extraction'],
      lastActive: '5 minutes ago',
      successRate: 97,
      actionsCount: 856
    },
    {
      id: '3',
      name: 'Enrollment Advisor',
      type: 'deal-desk',
      department: 'admissions',
      status: 'inactive',
      description: 'Provides enrollment probability and ROI insights',
      capabilities: ['Predictive Analytics', 'ROI Calculation', 'Capacity Planning'],
      lastActive: '1 hour ago',
      successRate: 89,
      actionsCount: 423
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: '',
    department: '',
    description: '',
    capabilities: ''
  });

  const agentTypes = [
    { value: 'follow-up', label: 'Follow-Up Automation', icon: MessageSquare },
    { value: 'processing', label: 'Application Processing', icon: FileText },
    { value: 'deal-desk', label: 'Deal Desk Analytics', icon: TrendingUp },
    { value: 'campaign', label: 'Campaign Builder', icon: Zap },
    { value: 'student-success', label: 'Student Success', icon: Users },
    { value: 'scheduling', label: 'Meeting Scheduler', icon: Calendar }
  ];

  const departments = [
    { value: 'admissions', label: 'Admissions' },
    { value: 'student-success', label: 'Student Success' },
    { value: 'financial-aid', label: 'Financial Aid' },
    { value: 'academic', label: 'Academic Services' },
    { value: 'marketing', label: 'Marketing' }
  ];

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

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.type || !newAgent.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const agent: AIAgent = {
      id: Date.now().toString(),
      name: newAgent.name,
      type: newAgent.type,
      department: newAgent.department,
      status: 'inactive',
      description: newAgent.description,
      capabilities: newAgent.capabilities.split(',').map(c => c.trim()),
      lastActive: 'Never',
      successRate: 0,
      actionsCount: 0
    };

    setAgents(prev => [...prev, agent]);
    setNewAgent({ name: '', type: '', department: '', description: '', capabilities: '' });
    setIsCreating(false);
    
    toast({
      title: "AI Agent Created",
      description: `${agent.name} has been created successfully.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'training': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    const agentType = agentTypes.find(t => t.value === type);
    return agentType ? agentType.icon : Bot;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">AI Agents Hub</h2>
          <p className="text-muted-foreground">Configure and manage your autonomous AI agents</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Bot className="h-4 w-4" />
          Create Agent
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Active Agents</TabsTrigger>
          <TabsTrigger value="campaign-builder">Campaign Builder</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <CardTitle className="text-sm font-medium">Average Success Rate</CardTitle>
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
                <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {agents.reduce((acc, a) => acc + a.actionsCount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">this month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common AI agent management tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                Create Follow-up Agent
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <FileText className="h-4 w-4" />
                Configure Document AI
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                Setup Deal Desk
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <Brain className="h-4 w-4" />
                Train New Model
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <Settings className="h-4 w-4" />
                Bulk Configuration
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <Zap className="h-4 w-4" />
                Campaign Builder
              </Button>
            </CardContent>
          </Card>
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
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Department</Label>
                        <p className="text-sm font-medium capitalize">{agent.department}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Success Rate</Label>
                        <p className="text-sm font-medium">{agent.successRate}%</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Actions</Label>
                        <p className="text-sm font-medium">{agent.actionsCount}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Last Active</Label>
                        <p className="text-sm font-medium">{agent.lastActive}</p>
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
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Agent Performance Analytics</CardTitle>
              <CardDescription>Detailed insights into agent performance and effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard will be available here</p>
                <p className="text-sm">Track success rates, response times, and automation effectiveness</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaign-builder" className="space-y-6">
          <NaturalLanguageCampaignBuilder />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global AI Settings</CardTitle>
              <CardDescription>Configure system-wide AI agent behavior and policies</CardDescription>
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
                    <Label>Max Daily Actions per Agent</Label>
                    <Input type="number" defaultValue="1000" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Agent Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create New AI Agent</CardTitle>
              <CardDescription>Configure a new autonomous AI agent for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Agent Name</Label>
                  <Input
                    value={newAgent.name}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Lead Follow-up Assistant"
                  />
                </div>
                <div>
                  <Label>Agent Type</Label>
                  <Select value={newAgent.type} onValueChange={(value) => setNewAgent(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Department</Label>
                <Select value={newAgent.department} onValueChange={(value) => setNewAgent(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newAgent.description}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this agent will do..."
                />
              </div>
              <div>
                <Label>Capabilities (comma-separated)</Label>
                <Input
                  value={newAgent.capabilities}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, capabilities: e.target.value }))}
                  placeholder="Email Automation, Lead Scoring, Document Processing"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreateAgent}>Create Agent</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIAgentsHub;