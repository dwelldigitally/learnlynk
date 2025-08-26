import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Plus, Edit, Trash2, Clock, Mail, Phone, MessageSquare, Settings, Shield, Cog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'time_based' | 'event_based' | 'score_based';
    conditions: any;
  };
  actions: {
    type: 'email' | 'sms' | 'call_task' | 'update_stage';
    config: any;
  }[];
  is_active: boolean;
  created_at: string;
  execution_count: number;
  success_rate: number;
}

export function EnrollmentAutomationRules() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    trigger_type: 'time_based',
    action_type: 'email',
    conditions: {},
    config: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAutomationRules();
  }, []);

  const loadAutomationRules = async () => {
    try {
      // Mock automation rules data - in real implementation this would come from database
      const mockRules: AutomationRule[] = [
        {
          id: '1',
          name: 'Application Reminder - 48 Hours',
          description: 'Send reminder email to prospects who haven\'t completed application after 48 hours',
          trigger: {
            type: 'time_based',
            conditions: { delay_hours: 48, stage: 'application_started' }
          },
          actions: [
            {
              type: 'email',
              config: { 
                template_id: 'app_reminder',
                subject: 'Complete Your Application - We\'re Here to Help!'
              }
            }
          ],
          is_active: true,
          created_at: '2024-01-15',
          execution_count: 156,
          success_rate: 73.2
        },
        {
          id: '2',
          name: 'High Score Fast Track',
          description: 'Automatically assign priority counselor when lead score exceeds 80',
          trigger: {
            type: 'score_based',
            conditions: { threshold: 80, score_type: 'yield_score' }
          },
          actions: [
            {
              type: 'call_task',
              config: { 
                priority: 'high',
                assigned_to: 'auto',
                due_minutes: 15
              }
            },
            {
              type: 'email',
              config: { 
                template_id: 'priority_welcome',
                delay_minutes: 5
              }
            }
          ],
          is_active: true,
          created_at: '2024-01-10',
          execution_count: 89,
          success_rate: 91.0
        },
        {
          id: '3',
          name: 'Document Chase Sequence',
          description: 'Multi-touch sequence for missing transcript documents',
          trigger: {
            type: 'event_based',
            conditions: { event: 'document_missing', document_type: 'transcript' }
          },
          actions: [
            {
              type: 'email',
              config: { 
                template_id: 'doc_reminder_1',
                delay_hours: 24
              }
            },
            {
              type: 'sms',
              config: { 
                message: 'Hi {name}, we still need your transcript to process your application. Upload here: {link}',
                delay_hours: 72
              }
            },
            {
              type: 'call_task',
              config: { 
                priority: 'medium',
                delay_hours: 120
              }
            }
          ],
          is_active: false,
          created_at: '2024-01-05',
          execution_count: 234,
          success_rate: 65.8
        }
      ];

      setRules(mockRules);
    } catch (error) {
      console.error('Error loading automation rules:', error);
      toast({
        title: "Error",
        description: "Failed to load automation rules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      // In real implementation, this would update the database
      setRules(rules.map(rule => 
        rule.id === ruleId ? { ...rule, is_active: isActive } : rule
      ));

      toast({
        title: isActive ? "Rule Activated" : "Rule Deactivated",
        description: `Automation rule has been ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast({
        title: "Error",
        description: "Failed to update rule status",
        variant: "destructive"
      });
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'time_based': return Clock;
      case 'event_based': return Zap;
      case 'score_based': return Badge;
      default: return Zap;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'call_task': return Phone;
      default: return Zap;
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Navigation Hints */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Playbooks</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Manager-friendly business recipes with simple on/off switches.
              </p>
              <a href="/admin/enrollment/playbooks" className="text-sm text-blue-600 hover:underline">
                ← Simpler Interface
              </a>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Policies</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Safety rules that control when/how these automation rules can execute.
              </p>
              <a href="/admin/enrollment/policies" className="text-sm text-blue-600 hover:underline">
                Configure Policies →
              </a>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Cog className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Automation Rules (This Page)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Advanced technical interface for complex triggers and custom conditions.
              </p>
              <Badge variant="default" className="text-xs">You Are Here</Badge>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-background border rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Advanced Interface:</strong> Use this for complex scenarios that don't fit standard Playbooks. 
              Most users should start with Playbooks for 80% of automation needs.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automation Rules</h1>
          <p className="text-muted-foreground">
            Configure automated workflows to optimize enrollment processes
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Automation Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    placeholder="Enter rule name"
                  />
                </div>
                <div>
                  <Label htmlFor="trigger-type">Trigger Type</Label>
                  <Select value={newRule.trigger_type} onValueChange={(value) => 
                    setNewRule({ ...newRule, trigger_type: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time_based">Time Based</SelectItem>
                      <SelectItem value="event_based">Event Based</SelectItem>
                      <SelectItem value="score_based">Score Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Describe when this rule should trigger"
                />
              </div>
              
              <div>
                <Label htmlFor="action-type">Primary Action</Label>
                <Select value={newRule.action_type} onValueChange={(value) => 
                  setNewRule({ ...newRule, action_type: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Send Email</SelectItem>
                    <SelectItem value="sms">Send SMS</SelectItem>
                    <SelectItem value="call_task">Create Call Task</SelectItem>
                    <SelectItem value="update_stage">Update Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Implementation for creating rule
                  toast({
                    title: "Rule Created",
                    description: "New automation rule has been created successfully",
                  });
                  setIsCreateDialogOpen(false);
                }}>
                  Create Rule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold text-foreground">{rules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Badge className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold text-foreground">
                  {rules.filter(r => r.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold text-foreground">
                  {rules.reduce((acc, rule) => acc + rule.execution_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Success Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {(rules.reduce((acc, rule) => acc + rule.success_rate, 0) / rules.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map(rule => {
          const TriggerIcon = getTriggerIcon(rule.trigger.type);
          
          return (
            <Card key={rule.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      rule.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <TriggerIcon className="h-5 w-5" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground">{rule.name}</h3>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {rule.trigger.type.replace('_', ' ')}
                        </Badge>
                        
                        <div className="flex items-center space-x-1">
                          {rule.actions.map((action, index) => {
                            const ActionIcon = getActionIcon(action.type);
                            return (
                              <ActionIcon key={index} className="h-3 w-3 text-muted-foreground" />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">{rule.execution_count}</p>
                      <p className="text-xs text-muted-foreground">Executions</p>
                    </div>
                    
                    <div className="text-center">
                      <p className={`text-lg font-semibold ${getSuccessRateColor(rule.success_rate)}`}>
                        {rule.success_rate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                      />
                      
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}