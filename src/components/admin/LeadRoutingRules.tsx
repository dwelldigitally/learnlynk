import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AssignmentMethod } from '@/types/lead';
import { EnhancedRoutingRule } from '@/types/routing';
import { RuleWizard } from './routing/RuleWizard';
import { TeamManagement } from './routing/TeamManagement';
import { AdvisorManagement } from './routing/AdvisorManagement';
import { Plus, Edit, Trash2, Settings, Users, MapPin, Star, Zap, BarChart3, UserCheck } from 'lucide-react';

interface LeadRoutingRulesProps {
  onRuleCreated?: () => void;
}

export function LeadRoutingRules({ onRuleCreated }: LeadRoutingRulesProps) {
  const [rules, setRules] = useState<EnhancedRoutingRule[]>([]);
  const [showRuleWizard, setShowRuleWizard] = useState(false);
  const [editingRule, setEditingRule] = useState<EnhancedRoutingRule | null>(null);
  const [activeView, setActiveView] = useState<'rules' | 'teams' | 'advisors'>('rules');
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

  const navigationItems = [
    { id: 'rules', label: 'Routing Rules', icon: Settings },
    { id: 'teams', label: 'Team Management', icon: Users },
    { id: 'advisors', label: 'Advisor Management', icon: UserCheck }
  ];

  const renderRulesContent = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="text-sm font-medium text-muted-foreground">Rules Created</p>
                <p className="text-2xl font-bold">{rules.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
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
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Routing Rules</h1>
          <p className="text-muted-foreground">Configure intelligent lead assignment and routing</p>
        </div>
        {activeView === 'rules' && (
          <Button onClick={() => { setEditingRule(null); setShowRuleWizard(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {navigationItems.map(item => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "secondary" : "ghost"}
              onClick={() => setActiveView(item.id as 'rules' | 'teams' | 'advisors')}
              className="flex items-center gap-2"
            >
              <IconComponent className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* Content based on active view */}
      {activeView === 'rules' && renderRulesContent()}
      {activeView === 'teams' && <TeamManagement onTeamCreated={onRuleCreated} />}
      {activeView === 'advisors' && <AdvisorManagement onAdvisorUpdated={onRuleCreated} />}
    </div>
  );
}