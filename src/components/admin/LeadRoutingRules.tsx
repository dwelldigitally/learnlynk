import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AssignmentMethod } from '@/types/lead';
import { EnhancedRoutingRule } from '@/types/routing';
import { supabase } from '@/integrations/supabase/client';
import { RuleWizard } from './routing/RuleWizard';
import { TeamManagement } from './routing/TeamManagement';
import { AdvisorManagement } from './routing/AdvisorManagement';
import { Plus, Edit, Trash2, Settings, Users, MapPin, Star, Zap, BarChart3, UserCheck, MoreVertical, Filter, GitBranch, Power, PowerOff } from 'lucide-react';
import { ConditionGroupsDisplay, AssignmentDisplay, getPriorityColor } from './routing/RuleCardHelpers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Fetch rules from database
  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      // Use any to bypass TypeScript errors until types are regenerated
      const { data, error } = await (supabase as any)
        .from('lead_routing_rules')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      
      // Transform database format to component format
      const transformedRules = (data || []).map((rule: any) => ({
        ...rule,
        sources: rule.sources || [],
        condition_groups: rule.conditions || [],
        schedule: rule.schedule || undefined,
        performance_config: rule.performance_config || undefined
      }));
      
      setRules(transformedRules);
    } catch (error) {
      console.error('Error fetching routing rules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load routing rules',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRule = async (ruleData: Omit<EnhancedRoutingRule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      if (editingRule) {
        // Update existing rule
        const { error } = await (supabase as any)
          .from('lead_routing_rules')
          .update({
            name: ruleData.name,
            description: ruleData.description,
            priority: ruleData.priority,
            is_active: ruleData.is_active,
            conditions: ruleData.condition_groups,
            assignment_config: ruleData.assignment_config
          })
          .eq('id', editingRule.id);

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Routing rule updated successfully'
        });
      } else {
        // Create new rule
        const { error } = await (supabase as any)
          .from('lead_routing_rules')
          .insert([{
            name: ruleData.name,
            description: ruleData.description,
            priority: ruleData.priority,
            is_active: ruleData.is_active,
            conditions: ruleData.condition_groups,
            assignment_config: ruleData.assignment_config
          }]);

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Routing rule created successfully'
        });
      }

      await fetchRules();
      setShowRuleWizard(false);
      setEditingRule(null);
      
      if (onRuleCreated) {
        onRuleCreated();
      }
    } catch (error) {
      console.error('Error saving rule:', error);
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
      const { error } = await (supabase as any)
        .from('lead_routing_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
      
      await fetchRules();
      toast({
        title: 'Success',
        description: 'Routing rule deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete routing rule',
        variant: 'destructive'
      });
    }
  };

  const toggleRuleStatus = async (ruleId: string) => {
    try {
      const rule = rules.find(r => r.id === ruleId);
      if (!rule) return;

      const { error } = await (supabase as any)
        .from('lead_routing_rules')
        .update({ is_active: !rule.is_active })
        .eq('id', ruleId);

      if (error) throw error;
      
      await fetchRules();
      toast({
        title: 'Success',
        description: `Rule ${rule.is_active ? 'disabled' : 'enabled'} successfully`
      });
    } catch (error) {
      console.error('Error updating rule status:', error);
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
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Rules</p>
                <p className="text-2xl font-semibold text-foreground">{rules.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Rules</p>
                <p className="text-2xl font-semibold text-foreground">{rules.filter(r => r.is_active).length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Zap className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Created</p>
                <p className="text-2xl font-semibold text-foreground">{rules.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="grid gap-3">
        {rules.map(rule => {
          return (
            <Card 
              key={rule.id} 
              className={`
                transition-all duration-200 hover:shadow-sm
                ${!rule.is_active ? 'opacity-50 bg-muted/30' : 'bg-card'}
                border border-border
              `}
            >
              <div className="p-5">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4 pb-3 border-b border-border/50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-foreground">{rule.name}</h3>
                        <Badge variant="outline" className="text-xs px-2 py-0 h-5 bg-muted text-muted-foreground border-border">
                          Priority {rule.priority}
                        </Badge>
                      </div>
                      {rule.is_active ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                          <span className="text-xs text-muted-foreground font-medium">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                          <span className="text-xs text-muted-foreground/60 font-medium">Inactive</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleRuleStatus(rule.id)}>
                        {rule.is_active ? (
                          <>
                            <PowerOff className="h-4 w-4 mr-2" />
                            Disable Rule
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-2" />
                            Enable Rule
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(rule)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Rule
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(rule.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Rule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sources Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sources</span>
                    </div>
                    {rule.sources && rule.sources.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {rule.sources.slice(0, 3).map((source: string) => (
                          <Badge key={source} variant="outline" className="text-xs py-0.5 px-2 bg-muted/50 text-foreground border-border font-normal">
                            {source.replace('_', ' ')}
                          </Badge>
                        ))}
                        {rule.sources.length > 3 && (
                          <Badge variant="outline" className="text-xs py-0.5 px-2 bg-muted/50 text-muted-foreground border-border font-normal">
                            +{rule.sources.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">All sources</p>
                    )}
                  </div>

                  {/* Conditions Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Conditions</span>
                    </div>
                    <ConditionGroupsDisplay groups={rule.condition_groups} maxVisible={3} />
                  </div>

                  {/* Assignment Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assignment</span>
                    </div>
                    <AssignmentDisplay config={rule.assignment_config} />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
        
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
      <div className="flex items-center justify-end">
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