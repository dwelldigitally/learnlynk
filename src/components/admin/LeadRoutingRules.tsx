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
    { id: 'advisors', label: 'Advisor Management', icon: UserCheck }
  ];

  const renderRulesContent = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 hover:border-border transition-colors duration-300 bg-gradient-to-br from-card to-card/50 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Rules</p>
                <p className="text-3xl font-semibold text-foreground tracking-tight">{rules.length}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
                <Settings className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 hover:border-border transition-colors duration-300 bg-gradient-to-br from-card to-card/50 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Rules</p>
                <p className="text-3xl font-semibold text-foreground tracking-tight">{rules.filter(r => r.is_active).length}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
                <Zap className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 hover:border-border transition-colors duration-300 bg-gradient-to-br from-card to-card/50 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Created</p>
                <p className="text-3xl font-semibold text-foreground tracking-tight">{rules.length}</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ring-1 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {rules.map(rule => {
          return (
            <Card 
              key={rule.id} 
              className={`
                group relative overflow-hidden
                transition-all duration-300 ease-out
                hover:shadow-lg hover:shadow-primary/5
                border border-border/50
                ${!rule.is_active ? 'opacity-60' : ''}
                bg-gradient-to-br from-card to-card/50
              `}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-6">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-border/40">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Icon Badge */}
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ring-1 ring-primary/10">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-semibold text-lg text-foreground tracking-tight">{rule.name}</h3>
                        <Badge variant="outline" className="text-xs px-2.5 py-0.5 bg-muted/50 text-muted-foreground border-border/50 font-medium">
                          Priority {rule.priority}
                        </Badge>
                      </div>
                      {rule.is_active ? (
                        <div className="flex items-center gap-2">
                          <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">Active & Running</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                          <span className="text-xs text-muted-foreground/60 font-medium">Inactive</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      >
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                  {/* Sources Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">Sources</span>
                    </div>
                    {rule.sources && rule.sources.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pl-10">
                        {rule.sources.slice(0, 3).map((source: string) => (
                          <Badge 
                            key={source} 
                            variant="outline" 
                            className="text-xs py-1 px-2.5 bg-background/50 text-foreground border-border/50 font-normal rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            {source.replace('_', ' ')}
                          </Badge>
                        ))}
                        {rule.sources.length > 3 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs py-1 px-2.5 bg-background/50 text-muted-foreground border-border/50 font-normal rounded-lg"
                          >
                            +{rule.sources.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground pl-10">All sources</p>
                    )}
                  </div>

                  {/* Conditions Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">Conditions</span>
                    </div>
                    <div className="pl-10">
                      <ConditionGroupsDisplay groups={rule.condition_groups} maxVisible={3} />
                    </div>
                  </div>

                  {/* Assignment Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">Assignment</span>
                    </div>
                    <div className="pl-10">
                      <AssignmentDisplay config={rule.assignment_config} />
                    </div>
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
      {/* Page Header */}
      <div className="pb-4 border-b border-border/50">
        <h1 className="text-3xl font-bold text-foreground mb-2">Lead Routing Rules</h1>
        <p className="text-muted-foreground">
          Configure intelligent lead assignment and routing rules to automatically distribute leads to the right team members
        </p>
      </div>

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
      {activeView === 'advisors' && <AdvisorManagement onAdvisorUpdated={onRuleCreated} />}
    </div>
  );
}