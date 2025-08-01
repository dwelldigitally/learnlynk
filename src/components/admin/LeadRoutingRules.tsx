import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AssignmentMethod } from '@/types/lead';
import { EnhancedRoutingRule } from '@/types/routing';
import { RuleWizard } from './routing/RuleWizard';
import { TeamManagement } from './routing/TeamManagement';
import { Plus, Edit, Trash2, Settings, Users, MapPin, Star, Activity, Zap, TrendingUp } from 'lucide-react';

interface LeadRoutingRulesProps {
  onRuleCreated?: () => void;
}

export function LeadRoutingRules({ onRuleCreated }: LeadRoutingRulesProps) {
  const [rules, setRules] = useState<EnhancedRoutingRule[]>([]);
  const [showRuleWizard, setShowRuleWizard] = useState(false);
  const [editingRule, setEditingRule] = useState<EnhancedRoutingRule | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Enhanced mock rules for demonstration
  useEffect(() => {
    setRules([
      {
        id: 'rule-1',
        name: 'High Priority Web Leads',
        description: 'Route urgent web leads to top performers',
        priority: 10,
        is_active: true,
        sources: ['web', 'forms'],
        condition_groups: [
          {
            id: 'group-1',
            operator: 'AND',
            conditions: [
              {
                id: 'cond-1',
                type: 'score',
                field: 'priority',
                operator: 'in',
                value: ['urgent', 'high']
              },
              {
                id: 'cond-2',
                type: 'program',
                field: 'program_interest',
                operator: 'contains',
                value: ['Health Care Assistant']
              }
            ]
          }
        ],
        assignment_config: {
          method: 'performance',
          advisors: ['advisor-1', 'advisor-2'],
          workload_balance: true,
          max_assignments_per_advisor: 5
        },
        performance_config: {
          track_analytics: true,
          conversion_weight: 0.8,
          response_time_weight: 0.2
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'rule-2',
        name: 'Geographic Routing - Canada',
        description: 'Route Canadian leads to local advisors',
        priority: 5,
        is_active: true,
        sources: ['web', 'social_media', 'chatbot'],
        condition_groups: [
          {
            id: 'group-2',
            operator: 'AND',
            conditions: [
              {
                id: 'cond-3',
                type: 'location',
                field: 'country',
                operator: 'equals',
                value: 'Canada'
              }
            ]
          }
        ],
        assignment_config: {
          method: 'geography',
          teams: ['team-canada'],
          geographic_preference: true,
          fallback_method: 'round_robin'
        },
        schedule: {
          enabled: true,
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_time: '09:00',
          end_time: '17:00',
          timezone: 'America/Toronto'
        },
        performance_config: {
          track_analytics: true,
          conversion_weight: 0.6,
          response_time_weight: 0.4
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  }, []);

  const [executionLogs, setExecutionLogs] = useState([
    {
      id: 'log-1',
      rule_name: 'High Priority Web Leads',
      lead_id: 'lead-123',
      execution_result: 'matched',
      assigned_to: 'Nicole Ye',
      execution_time_ms: 45,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'log-2',
      rule_name: 'Geographic Routing - Canada',
      lead_id: 'lead-124',
      execution_result: 'matched',
      assigned_to: 'Mike Chen',
      execution_time_ms: 32,
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ]);

  const [analytics, setAnalytics] = useState({
    total_executions: 247,
    successful_matches: 198,
    failed_matches: 49,
    avg_execution_time: 38,
    conversion_rate: 23.5,
    top_performing_rule: 'High Priority Web Leads'
  });

  const handleSaveRule = async (ruleData: Omit<EnhancedRoutingRule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      if (editingRule) {
        // Update existing rule
        const updatedRule = {
          ...editingRule,
          ...ruleData,
          updated_at: new Date().toISOString()
        };
        setRules(prev => prev.map(rule => rule.id === editingRule.id ? updatedRule : rule));
        toast({
          title: 'Success',
          description: 'Routing rule updated successfully'
        });
      } else {
        // Create new rule
        const newRule: EnhancedRoutingRule = {
          id: `rule-${Date.now()}`,
          ...ruleData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setRules(prev => [...prev, newRule]);
        toast({
          title: 'Success',
          description: 'Routing rule created successfully'
        });
      }

      setShowRuleWizard(false);
      setEditingRule(null);
      
      if (onRuleCreated) {
        onRuleCreated();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save routing rule',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule: EnhancedRoutingRule) => {
    setEditingRule(rule);
    setShowRuleWizard(true);
  };

  const handleDelete = async (ruleId: string) => {
    try {
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
      toast({
        title: 'Success',
        description: 'Routing rule deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete routing rule',
        variant: 'destructive'
      });
    }
  };

  const toggleRuleStatus = async (ruleId: string) => {
    try {
      setRules(prev => prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, is_active: !rule.is_active, updated_at: new Date().toISOString() }
          : rule
      ));
      
      const rule = rules.find(r => r.id === ruleId);
      toast({
        title: 'Success',
        description: `Rule ${rule?.is_active ? 'disabled' : 'enabled'} successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update rule status',
        variant: 'destructive'
      });
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'round_robin': return <Users className="h-4 w-4" />;
      case 'geography': return <MapPin className="h-4 w-4" />;
      case 'performance': return <Star className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  if (showRuleWizard) {
    return (
      <RuleWizard
        onSave={handleSaveRule}
        onCancel={() => {
          setShowRuleWizard(false);
          setEditingRule(null);
        }}
        editingRule={editingRule || undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Routing Rules</h2>
          <p className="text-muted-foreground">Configure intelligent lead assignment and routing</p>
        </div>
        <Button onClick={() => { setEditingRule(null); setShowRuleWizard(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Routing Rules</TabsTrigger>
          <TabsTrigger value="teams">Team Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Rules</p>
                    <p className="text-2xl font-bold">{rules.length}</p>
                  </div>
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Rules</p>
                    <p className="text-2xl font-bold">{rules.filter(r => r.is_active).length}</p>
                  </div>
                  <Zap className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">{analytics.conversion_rate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                    <p className="text-2xl font-bold">{analytics.avg_execution_time}ms</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rules List */}
          <div className="grid gap-4">
            {rules.map(rule => (
              <Card key={rule.id} className={!rule.is_active ? 'opacity-75' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getMethodIcon(rule.assignment_config.method)}
                        {rule.name}
                        <Badge variant={rule.is_active ? "default" : "secondary"}>
                          Priority {rule.priority}
                        </Badge>
                        {!rule.is_active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </CardTitle>
                      {rule.description && (
                        <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleRuleStatus(rule.id)}
                        variant="outline"
                        size="sm"
                      >
                        {rule.is_active ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        onClick={() => handleEdit(rule)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(rule.id)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Sources: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {rule.sources.map((source: string) => (
                          <Badge key={source} variant="outline">
                            {source.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Conditions: </span>
                      <p className="text-sm text-muted-foreground">
                        {rule.condition_groups.length === 0 
                          ? 'No specific conditions' 
                          : `${rule.condition_groups.length} condition group(s)`
                        }
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">Assignment: </span>
                      <p className="text-sm text-muted-foreground">
                        {rule.assignment_config.method.replace('_', ' ')} method
                        {rule.assignment_config.workload_balance && ' • Workload balanced'}
                        {rule.assignment_config.geographic_preference && ' • Geographic preference'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {rules.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No routing rules configured yet. Create your first rule to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="teams">
          <TeamManagement onTeamCreated={onRuleCreated} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rule Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{analytics.total_executions}</p>
                  <p className="text-sm text-muted-foreground">Total Executions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analytics.successful_matches}</p>
                  <p className="text-sm text-muted-foreground">Successful Matches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{analytics.failed_matches}</p>
                  <p className="text-sm text-muted-foreground">Failed Matches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{analytics.avg_execution_time}ms</p>
                  <p className="text-sm text-muted-foreground">Avg Execution Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{analytics.conversion_rate}%</p>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{analytics.top_performing_rule}</p>
                  <p className="text-sm text-muted-foreground">Top Performing Rule</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Rule Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executionLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{log.rule_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Lead {log.lead_id} • {log.execution_result === 'matched' ? 'Assigned to' : 'Failed to assign'} {log.assigned_to}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={log.execution_result === 'matched' ? 'default' : 'destructive'}>
                        {log.execution_result}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.execution_time_ms}ms • {new Date(log.created_at).toLocaleTimeString()}
                      </p>
                    </div>
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