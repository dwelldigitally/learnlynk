import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AssignmentMethod } from '@/types/lead';
import { EnhancedRoutingRule } from '@/types/routing';
import { supabase } from '@/integrations/supabase/client';
import { RuleWizard } from './routing/RuleWizard';
import { ReEnrollDialog } from './routing/ReEnrollDialog';
import { ReEnrollAllDialog } from './routing/ReEnrollAllDialog';
import { TeamManagement } from './routing/TeamManagement';
import { AdvisorManagement } from './routing/AdvisorManagement';
import { Plus, Edit, Trash2, Settings, Users, MapPin, Star, Zap, BarChart3, UserCheck, MoreVertical, Filter, GitBranch, Power, PowerOff, RefreshCw } from 'lucide-react';
import { ConditionGroupsDisplay, AssignmentDisplay, getPriorityColor } from './routing/RuleCardHelpers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LeadRoutingRulesProps {
  onRuleCreated?: () => void;
}

export function LeadRoutingRules({
  onRuleCreated
}: LeadRoutingRulesProps) {
  const [rules, setRules] = useState<EnhancedRoutingRule[]>([]);
  const [showRuleWizard, setShowRuleWizard] = useState(false);
  const [editingRule, setEditingRule] = useState<EnhancedRoutingRule | null>(null);
  const [reEnrollRule, setReEnrollRule] = useState<EnhancedRoutingRule | null>(null);
  const [showReEnrollAll, setShowReEnrollAll] = useState(false);
  const [activeView, setActiveView] = useState<'rules' | 'teams' | 'advisors'>('rules');
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();

  // Fetch rules from database
  useEffect(() => {
    fetchRules();
  }, []);
  const fetchRules = async () => {
    try {
      setLoading(true);
      // Use any to bypass TypeScript errors until types are regenerated
      const {
        data,
        error
      } = await (supabase as any).from('lead_routing_rules').select('*').order('priority', {
        ascending: false
      });
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
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (editingRule) {
        // Update existing rule
        const {
          error
        } = await (supabase as any).from('lead_routing_rules').update({
          name: ruleData.name,
          description: ruleData.description,
          priority: ruleData.priority,
          is_active: ruleData.is_active,
          conditions: ruleData.condition_groups,
          assignment_config: ruleData.assignment_config
        }).eq('id', editingRule.id);
        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Routing rule updated successfully'
        });
      } else {
        // Create new rule
        const {
          error
        } = await (supabase as any).from('lead_routing_rules').insert([{
          name: ruleData.name,
          description: ruleData.description,
          priority: ruleData.priority,
          is_active: ruleData.is_active,
          conditions: ruleData.condition_groups,
          assignment_config: ruleData.assignment_config,
          user_id: user.id
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
      const {
        error
      } = await (supabase as any).from('lead_routing_rules').delete().eq('id', ruleId);
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
      const {
        error
      } = await (supabase as any).from('lead_routing_rules').update({
        is_active: !rule.is_active
      }).eq('id', ruleId);
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
      case 'round_robin':
        return <Users className="h-4 w-4" />;
      case 'geography':
        return <MapPin className="h-4 w-4" />;
      case 'performance':
        return <Star className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };
  if (showRuleWizard) {
    return <RuleWizard onSave={handleSaveRule} onCancel={() => {
      setShowRuleWizard(false);
      setEditingRule(null);
    }} editingRule={editingRule || undefined} />;
  }
  const navigationItems = [{
    id: 'rules',
    label: 'Routing Rules',
    icon: Settings
  }, {
    id: 'advisors',
    label: 'Advisor Management',
    icon: UserCheck
  }];
  const renderRulesContent = () => <div className="space-y-8">
      {/* Quick Stats */}
      

      {/* Rules List */}
      <div className="space-y-5">{rules.map(rule => {
        return <Card key={rule.id} className={`
                group relative overflow-hidden
                transition-all duration-300
                hover:shadow-lg hover:border-primary/20
                border border-border/50
                ${!rule.is_active ? 'opacity-60' : ''}
                bg-card/50 backdrop-blur-sm
              `}>
              
              <div className="relative p-6">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Icon Badge */}
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-base text-foreground">{rule.name}</h3>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                          Priority {rule.priority}
                        </Badge>
                        {rule.is_active ? (
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-xs text-muted-foreground">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                            <span className="text-xs text-muted-foreground/60">Inactive</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleRuleStatus(rule.id)}>
                        {rule.is_active ? <>
                            <PowerOff className="h-4 w-4 mr-2" />
                            Disable Rule
                          </> : <>
                            <Power className="h-4 w-4 mr-2" />
                            Enable Rule
                          </>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(rule)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Rule
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setReEnrollRule(rule)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Re-enroll Existing Leads
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(rule.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Rule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/40">
                  {/* Sources Section */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sources</span>
                    </div>
                    {rule.sources && rule.sources.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {rule.sources.slice(0, 3).map((source: string) => (
                          <Badge key={source} variant="outline" className="text-xs py-0.5 px-2 bg-background">
                            {source.replace('_', ' ')}
                          </Badge>
                        ))}
                        {rule.sources.length > 3 && (
                          <Badge variant="outline" className="text-xs py-0.5 px-2">
                            +{rule.sources.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">All sources</p>
                    )}
                  </div>

                  {/* Conditions Section */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Conditions</span>
                    </div>
                    <div>
                      <ConditionGroupsDisplay groups={rule.condition_groups} maxVisible={3} />
                    </div>
                  </div>

                  {/* Assignment Section */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assignment</span>
                    </div>
                    <div>
                      <AssignmentDisplay config={rule.assignment_config} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>;
      })}
        {rules.length === 0 && <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <Settings className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Routing Rules Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first routing rule to automatically assign leads to the right team members based on conditions you define.
              </p>
              <Button onClick={() => {
            setEditingRule(null);
            setShowRuleWizard(true);
          }} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Rule
              </Button>
            </CardContent>
          </Card>}
      </div>
    </div>;
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Lead Routing Rules</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Configure intelligent lead assignment and routing rules to automatically distribute leads to the right team members
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Navigation Tabs */}
          <div className="flex gap-2 bg-muted/30 p-1.5 rounded-xl backdrop-blur-sm border border-border/50">
            {navigationItems.map(item => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;
            return <Button key={item.id} variant={isActive ? "default" : "ghost"} onClick={() => setActiveView(item.id as 'rules' | 'advisors')} className={`flex items-center gap-2 rounded-lg transition-all ${isActive ? 'shadow-sm' : 'hover:bg-muted/50'}`}>
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Button>;
          })}
          </div>

          {/* Action Buttons */}
          {activeView === 'rules' && (
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowReEnrollAll(true)}
                className="border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-enroll All Leads
              </Button>
              <Button onClick={() => {
                setEditingRule(null);
                setShowRuleWizard(true);
              }} className="shadow-lg hover:shadow-xl transition-all" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create New Rule
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeView === 'rules' && renderRulesContent()}
          {activeView === 'advisors' && <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-8">
              <AdvisorManagement onAdvisorUpdated={onRuleCreated} />
            </div>}
        </div>
      </div>

      {/* Re-enroll Dialog for specific rule */}
      {reEnrollRule && (
        <ReEnrollDialog
          open={!!reEnrollRule}
          onOpenChange={(open) => !open && setReEnrollRule(null)}
          rule={reEnrollRule}
          onSuccess={() => {
            fetchRules();
            toast({
              title: "Re-enrollment Complete",
              description: `Successfully re-enrolled leads for "${reEnrollRule.name}"`
            });
          }}
        />
      )}

      {/* Re-enroll All Leads Dialog */}
      <ReEnrollAllDialog
        open={showReEnrollAll}
        onOpenChange={setShowReEnrollAll}
        onSuccess={() => {
          fetchRules();
        }}
      />
    </div>;
}