import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus,
  Settings,
  Play,
  Pause,
  Trash2,
  Edit,
  Copy,
  Zap,
  Brain,
  Target,
  Clock,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: 'lead_qualification' | 'assignment' | 'follow_up' | 'nurturing' | 'analytics';
  status: 'active' | 'inactive' | 'testing';
  priority: number;
  triggerType: string;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  executionCount: number;
  successRate: number;
  lastExecuted: string;
  createdAt: string;
  isMLEnhanced: boolean;
}

interface AutomationCondition {
  id: string;
  field: string;
  operator: string;
  value: any;
  type: 'lead_field' | 'behavior' | 'predictive' | 'external';
}

interface AutomationAction {
  id: string;
  type: string;
  config: Record<string, any>;
  delay?: number;
}

const AutomationRulesEngine: React.FC = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'High-Value Lead Detection',
      description: 'Automatically identifies and fast-tracks high-value leads using AI scoring',
      category: 'lead_qualification',
      status: 'active',
      priority: 10,
      triggerType: 'lead_created',
      conditions: [
        {
          id: 'c1',
          field: 'ai_score',
          operator: 'greater_than',
          value: 85,
          type: 'predictive'
        }
      ],
      actions: [
        {
          id: 'a1',
          type: 'assign_to_top_advisor',
          config: { tier: 'premium' }
        },
        {
          id: 'a2',
          type: 'send_priority_notification',
          config: { channel: 'slack', urgency: 'high' }
        }
      ],
      executionCount: 247,
      successRate: 94,
      lastExecuted: '2 hours ago',
      createdAt: '2024-01-15',
      isMLEnhanced: true
    },
    {
      id: '2',
      name: 'Behavioral Re-engagement',
      description: 'Re-engages leads based on website activity and interaction patterns',
      category: 'nurturing',
      status: 'active',
      priority: 7,
      triggerType: 'behavior_change',
      conditions: [
        {
          id: 'c2',
          field: 'page_views',
          operator: 'greater_than',
          value: 5,
          type: 'behavior'
        },
        {
          id: 'c3',
          field: 'last_interaction',
          operator: 'older_than',
          value: '7_days',
          type: 'lead_field'
        }
      ],
      actions: [
        {
          id: 'a3',
          type: 'send_personalized_email',
          config: { template: 'behavioral_reengagement' }
        }
      ],
      executionCount: 156,
      successRate: 78,
      lastExecuted: '45 minutes ago',
      createdAt: '2024-01-10',
      isMLEnhanced: true
    },
    {
      id: '3',
      name: 'Document Completion Reminder',
      description: 'Smart reminders for incomplete document submissions with escalation',
      category: 'follow_up',
      status: 'active',
      priority: 5,
      triggerType: 'time_based',
      conditions: [
        {
          id: 'c4',
          field: 'documents_complete',
          operator: 'equals',
          value: false,
          type: 'lead_field'
        }
      ],
      actions: [
        {
          id: 'a4',
          type: 'send_reminder_sequence',
          config: { sequence: 'document_completion' },
          delay: 24
        }
      ],
      executionCount: 89,
      successRate: 85,
      lastExecuted: '1 day ago',
      createdAt: '2024-01-08',
      isMLEnhanced: false
    }
  ]);

  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const triggerTypes = [
    { value: 'lead_created', label: 'Lead Created', icon: Users },
    { value: 'lead_updated', label: 'Lead Updated', icon: Edit },
    { value: 'behavior_change', label: 'Behavior Change', icon: Brain },
    { value: 'score_change', label: 'Score Change', icon: TrendingUp },
    { value: 'time_based', label: 'Time-based', icon: Clock },
    { value: 'external_event', label: 'External Event', icon: Zap },
    { value: 'predictive_trigger', label: 'AI Prediction', icon: Brain }
  ];

  const conditionOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'in', label: 'In List' },
    { value: 'not_in', label: 'Not In List' },
    { value: 'older_than', label: 'Older Than' },
    { value: 'newer_than', label: 'Newer Than' }
  ];

  const actionTypes = [
    { value: 'send_email', label: 'Send Email', icon: Mail },
    { value: 'send_personalized_email', label: 'Send AI-Generated Email', icon: Mail },
    { value: 'assign_to_advisor', label: 'Assign to Advisor', icon: Users },
    { value: 'assign_to_top_advisor', label: 'Assign to Top Advisor', icon: Target },
    { value: 'create_task', label: 'Create Task', icon: CheckCircle2 },
    { value: 'send_notification', label: 'Send Notification', icon: MessageSquare },
    { value: 'send_priority_notification', label: 'Priority Notification', icon: AlertTriangle },
    { value: 'schedule_call', label: 'Schedule Call', icon: Calendar },
    { value: 'update_score', label: 'Update Score', icon: TrendingUp },
    { value: 'add_to_campaign', label: 'Add to Campaign', icon: Zap },
    { value: 'generate_report', label: 'Generate Report', icon: FileText },
    { value: 'update_database', label: 'Update Database', icon: Database }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'testing': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lead_qualification': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'assignment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'follow_up': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'nurturing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'analytics': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' }
        : rule
    ));
    toast({
      title: "Rule Status Updated",
      description: "Automation rule status has been changed successfully."
    });
  };

  const handleDuplicateRule = (rule: AutomationRule) => {
    const newRule = {
      ...rule,
      id: Date.now().toString(),
      name: `${rule.name} (Copy)`,
      status: 'inactive' as const,
      executionCount: 0,
      lastExecuted: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRules(prev => [...prev, newRule]);
    toast({
      title: "Rule Duplicated",
      description: "Rule has been duplicated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Automation Rules Engine</h2>
          <p className="text-muted-foreground">Advanced automation with AI-powered triggers and intelligent actions</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rules">Active Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="testing">Testing Lab</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {rules.filter(r => r.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">of {rules.length} total rules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(rules.reduce((acc, r) => acc + r.successRate, 0) / rules.length)}%
                </div>
                <p className="text-xs text-muted-foreground">across all rules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {rules.reduce((acc, r) => acc + r.executionCount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">this month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {rule.isMLEnhanced ? (
                          <Brain className="h-5 w-5 text-primary" />
                        ) : (
                          <Zap className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{rule.name}</CardTitle>
                          <Badge className={getCategoryColor(rule.category)}>
                            {rule.category.replace('_', ' ')}
                          </Badge>
                          {rule.isMLEnhanced && (
                            <Badge variant="outline" className="gap-1">
                              <Brain className="h-3 w-3" />
                              AI Enhanced
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{rule.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(rule.status)}>
                        {rule.status}
                      </Badge>
                      <Switch
                        checked={rule.status === 'active'}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Priority</Label>
                      <p className="text-sm font-medium">{rule.priority}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Success Rate</Label>
                      <p className="text-sm font-medium">{rule.successRate}%</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Executions</Label>
                      <p className="text-sm font-medium">{rule.executionCount}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Last Executed</Label>
                      <p className="text-sm font-medium">{rule.lastExecuted}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Created</Label>
                      <p className="text-sm font-medium">{rule.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label className="text-xs text-muted-foreground mb-2 block">Conditions ({rule.conditions.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {rule.conditions.map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {condition.field} {condition.operator} {condition.value}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs text-muted-foreground mb-2 block">Actions ({rule.actions.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {rule.actions.map((action, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {actionTypes.find(a => a.value === action.type)?.label || action.type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedRule(rule)}>
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDuplicateRule(rule)}>
                      <Copy className="h-3 w-3 mr-1" />
                      Duplicate
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Analytics
                    </Button>
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rule Performance Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and optimization insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Rule performance analytics dashboard</p>
                <p className="text-sm">Execution rates, success metrics, and optimization recommendations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rule Templates</CardTitle>
              <CardDescription>Pre-built automation rules for common scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Rule templates library</p>
                <p className="text-sm">Pre-configured rules for common automation scenarios</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testing Laboratory</CardTitle>
              <CardDescription>Test and validate automation rules before deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Rule testing environment</p>
                <p className="text-sm">Simulate conditions and test rule execution</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engine Settings</CardTitle>
              <CardDescription>Global automation engine configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Automation engine settings</p>
                <p className="text-sm">Global configuration, limits, and safety settings</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rule Configuration Modal */}
      {selectedRule && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Configure {selectedRule.name}</CardTitle>
              <CardDescription>Advanced rule configuration and condition setup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Advanced rule configuration interface</p>
                <p className="text-sm">Detailed trigger, condition, and action configuration</p>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedRule(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setSelectedRule(null)}>
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

export default AutomationRulesEngine;