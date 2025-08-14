import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Trash2, Save, Target, GripVertical, Brain, Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { RuleTypeDisplay } from './scoring/RuleTypeComponents';
import { RuleGrouping, RuleGroupCard, getRuleGroupProps } from './scoring/RuleGrouping';

interface ScoringRule {
  id: string;
  name: string;
  field: string;
  condition: string;
  value: string | any[];
  points: number;
  enabled: boolean;
  order_index?: number;
  description?: string;
}

export function LeadScoringEngine() {
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([]);
  const [autoScoringEnabled, setAutoScoringEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchScoringRules();
    fetchScoringSettings();
  }, []);

  const fetchScoringRules = async () => {
    try {
      setLoading(true);
      // Use any to bypass TypeScript errors until types are regenerated
      const { data, error } = await (supabase as any)
        .from('lead_scoring_rules')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      // Transform database format to component format
      const transformedRules = (data || []).map((rule: any) => ({
        id: rule.id,
        name: rule.name,
        field: rule.field,
        condition: rule.condition,
        value: rule.value,
        points: rule.points,
        enabled: rule.enabled,
        order_index: rule.order_index,
        description: rule.description
      }));
      
      setScoringRules(transformedRules);
    } catch (error) {
      console.error('Error fetching scoring rules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load scoring rules',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchScoringSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('lead_scoring_settings')
        .select('auto_scoring_enabled')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setAutoScoringEnabled(data.auto_scoring_enabled);
      }
    } catch (error) {
      console.error('Error fetching scoring settings:', error);
    }
  };

  const saveScoringSettings = async (enabled: boolean) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await (supabase as any)
        .from('lead_scoring_settings')
        .upsert({
          user_id: user.user.id,
          name: 'Default Settings',
          auto_scoring_enabled: enabled,
          is_active: true,
          scoring_algorithm: 'weighted',
          max_score: 100
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving scoring settings:', error);
    }
  };

  const fieldOptions = [
    { value: 'priority', label: 'Lead Priority' },
    { value: 'program_interest', label: 'Program Interest' },
    { value: 'country', label: 'Country' },
    { value: 'state', label: 'State/Province' },
    { value: 'city', label: 'City' },
    { value: 'source', label: 'Lead Source' },
    { value: 'qualification_stage', label: 'Qualification Stage' },
    { value: 'email', label: 'Email Address' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'company', label: 'Company' },
    { value: 'job_title', label: 'Job Title' }
  ];

  const conditionOptions = [
    { value: 'equals', label: 'is equal to' },
    { value: 'contains', label: 'contains' },
    { value: 'not_equals', label: 'is not equal to' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'ends_with', label: 'ends with' }
  ];

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(scoringRules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for all items
    const updates = items.map((item, index) => ({
      ...item,
      order_index: index
    }));

    setScoringRules(updates);
    await saveScoringRules(updates);
  };

  const addRule = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const newRule = {
        user_id: user.user.id,
        name: 'New Rule',
        field: 'priority',
        condition: 'equals',
        value: '',
        points: 10,
        enabled: true,
        order_index: scoringRules.length
      };

      const { error } = await (supabase as any)
        .from('lead_scoring_rules')
        .insert([newRule]);

      if (error) throw error;
      await fetchScoringRules();
    } catch (error) {
      console.error('Error adding rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to add new rule',
        variant: 'destructive'
      });
    }
  };

  const updateRule = async (id: string, updates: Partial<ScoringRule>) => {
    // Update local state immediately for responsiveness
    setScoringRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, ...updates } : rule
      )
    );

    try {
      const { error } = await (supabase as any)
        .from('lead_scoring_rules')
        .update({
          name: updates.name,
          field: updates.field,
          condition: updates.condition,
          value: updates.value,
          points: updates.points,
          enabled: updates.enabled
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating rule:', error);
      // Revert local state on error
      await fetchScoringRules();
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('lead_scoring_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchScoringRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete rule',
        variant: 'destructive'
      });
    }
  };

  const saveScoringRules = async (rules: ScoringRule[]) => {
    try {
      const updates = rules.map(rule => ({
        id: rule.id,
        name: rule.name,
        field: rule.field,
        condition: rule.condition,
        value: rule.value,
        points: rule.points,
        enabled: rule.enabled,
        order_index: rule.order_index || 0
      }));

      for (const update of updates) {
        const { error } = await (supabase as any)
          .from('lead_scoring_rules')
          .update(update)
          .eq('id', update.id);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving rules:', error);
      throw error;
    }
  };

  const saveRules = async () => {
    try {
      await saveScoringRules(scoringRules);
      toast({
        title: 'Success',
        description: 'Scoring rules saved successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save scoring rules',
        variant: 'destructive'
      });
    }
  };

  const analyzeWithAI = async (type: 'suggestions' | 'revamp') => {
    setIsAnalyzing(true);
    try {
      // Mock lead data - in real app, this would come from your database
      const mockLeadData = [
        { priority: 'urgent', program_interest: 'Health Care Assistant', country: 'Canada', email: 'john@hospital.com', converted: true },
        { priority: 'low', program_interest: 'Aviation', country: 'USA', email: 'test@competitor.com', converted: false },
        { priority: 'medium', program_interest: 'Education', country: 'Canada', email: 'mary@school.ca', converted: true }
      ];

      const response = await fetch('https://rpxygdaimdiarjpfmswl.supabase.co/functions/v1/ai-lead-scoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentRules: scoringRules,
          leadData: mockLeadData,
          analysisType: type
        })
      });

      if (!response.ok) throw new Error('Failed to analyze');

      const suggestions = await response.json();
      setAiSuggestions(suggestions);
      setShowAiSuggestions(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze lead scoring. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyAISuggestions = () => {
    if (aiSuggestions?.newScoringSystem) {
      // Complete revamp
      const newRules = aiSuggestions.newScoringSystem.map((rule: any, index: number) => ({
        id: `ai-rule-${index + 1}`,
        name: rule.name,
        field: rule.field,
        condition: rule.condition,
        value: rule.value,
        points: rule.points,
        enabled: true
      }));
      setScoringRules(newRules);
    } else if (aiSuggestions?.newRules) {
      // Add new suggested rules
      const newRules = aiSuggestions.newRules.map((rule: any, index: number) => ({
        id: `suggested-rule-${index + 1}`,
        name: rule.name,
        field: rule.field,
        condition: rule.condition,
        value: rule.value,
        points: rule.points,
        enabled: true
      }));
      setScoringRules(prev => [...prev, ...newRules]);
    }

    setShowAiSuggestions(false);
    toast({
      title: 'Applied',
      description: 'AI suggestions have been applied to your scoring rules'
    });
  };

  const calculateRulePoints = (rule: ScoringRule): number => {
    // For complex rules with JSON value structures, calculate total from conditions
    if (typeof rule.value === 'string' && rule.value.startsWith('[')) {
      try {
        const conditions = JSON.parse(rule.value);
        if (Array.isArray(conditions)) {
          return conditions.reduce((sum, cond) => sum + (cond.points || 0), 0);
        }
      } catch {
        // Fallback to rule points
      }
    }
    return rule.points;
  };

  const totalPossiblePoints = scoringRules
    .filter(rule => rule.enabled)
    .reduce((sum, rule) => sum + calculateRulePoints(rule), 0);

  const positivePoints = scoringRules
    .filter(rule => rule.enabled)
    .reduce((sum, rule) => {
      const points = calculateRulePoints(rule);
      return points > 0 ? sum + points : sum;
    }, 0);

  const negativePoints = Math.abs(scoringRules
    .filter(rule => rule.enabled)
    .reduce((sum, rule) => {
      const points = calculateRulePoints(rule);
      return points < 0 ? sum + points : sum;
    }, 0));

  const getRuleTypeColor = (points: number) => {
    if (points > 0) return 'text-green-600';
    if (points < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRuleTypeBadge = (points: number) => {
    if (points > 0) return <Badge variant="default" className="bg-green-100 text-green-800">+{points}</Badge>;
    if (points < 0) return <Badge variant="destructive" className="bg-red-100 text-red-800">{points}</Badge>;
    return <Badge variant="secondary">0</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Scoring</h1>
          <p className="text-muted-foreground">Configure automatic lead scoring rules to prioritize your best prospects</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoScoringEnabled}
              onCheckedChange={(enabled) => {
                setAutoScoringEnabled(enabled);
                saveScoringSettings(enabled);
              }}
            />
            <Label>Auto-scoring enabled</Label>
          </div>
          <Button 
            onClick={() => analyzeWithAI('suggestions')} 
            variant="outline"
            disabled={isAnalyzing}
          >
            <Brain className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'AI Suggestions'}
          </Button>
          <Button 
            onClick={() => analyzeWithAI('revamp')} 
            variant="outline"
            disabled={isAnalyzing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            AI Complete Revamp
          </Button>
          <Button onClick={saveRules}>
            <Save className="h-4 w-4 mr-2" />
            Save Rules
          </Button>
        </div>
      </div>

      {/* Enhanced Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">{scoringRules.filter(r => r.enabled).length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Positive Points</p>
                <p className="text-2xl font-bold text-green-600">+{positivePoints}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">+</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Negative Points</p>
                <p className="text-2xl font-bold text-red-600">-{negativePoints}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">-</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-2xl font-bold">{autoScoringEnabled ? 'Active' : 'Paused'}</p>
              </div>
              <div className={`h-3 w-3 rounded-full ${autoScoringEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Scoring Rules Display */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Active Scoring Rules</h2>
            <p className="text-muted-foreground">
              Sophisticated rules for accurate lead qualification and prioritization
            </p>
          </div>
          <Button onClick={addRule} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Simple Rule
          </Button>
        </div>

        <RuleGrouping rules={scoringRules}>
          {(groupedRules) => (
            <div className="space-y-6">
              {Object.entries(groupedRules).map(([groupType, rules]) => {
                const groupProps = getRuleGroupProps(groupType);
                return (
                  <RuleGroupCard
                    key={groupType}
                    title={groupType}
                    rules={rules}
                    icon={groupProps.icon}
                    colorClass={groupProps.colorClass}
                  >
                    <div className="space-y-4">
                      {rules.map((rule) => (
                        <div key={rule.id} className="relative">
                          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={(enabled) => updateRule(rule.id, { enabled })}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRule(rule.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <RuleTypeDisplay rule={rule} />
                        </div>
                      ))}
                    </div>
                  </RuleGroupCard>
                );
              })}

              {scoringRules.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No scoring rules configured</h3>
                    <p className="text-muted-foreground mb-4">
                      Add sophisticated scoring rules to automatically qualify and prioritize your leads
                    </p>
                    <Button onClick={addRule}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Rule
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </RuleGrouping>
      </div>

      {/* Enhanced Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 3 Pillars of Lead Scoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
              <h3 className="font-semibold text-green-700">1. Contact Information</h3>
              <p className="text-sm text-muted-foreground">Demographic data that indicates quality: location, company, job title, sector</p>
              <p className="text-xs text-green-600">+5 to +25 points</p>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
              <h3 className="font-semibold text-blue-700">2. Interactions & Behaviours</h3>
              <p className="text-sm text-muted-foreground">Engagement signals: website visits, form submissions, email interactions</p>
              <p className="text-xs text-blue-600">+10 to +30 points</p>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-gradient-to-r from-red-400 to-red-600 rounded"></div>
              <h3 className="font-semibold text-red-700">3. Negatives</h3>
              <p className="text-sm text-muted-foreground">Disqualifying factors: competitors, wrong fit personas, unengaged contacts</p>
              <p className="text-xs text-red-600">-5 to -20 points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions Modal */}
      <Dialog open={showAiSuggestions} onOpenChange={setShowAiSuggestions}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Lead Scoring Analysis
            </DialogTitle>
          </DialogHeader>
          
          {aiSuggestions && (
            <div className="space-y-6">
              {aiSuggestions.summary && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Analysis Summary</h3>
                  <p className="text-sm">{aiSuggestions.summary}</p>
                </div>
              )}

              {aiSuggestions.newScoringSystem && (
                <div>
                  <h3 className="font-semibold mb-3">Recommended New Scoring System</h3>
                  <div className="space-y-3">
                    {aiSuggestions.newScoringSystem.map((rule: any, index: number) => (
                      <div key={index} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-muted-foreground">{rule.reasoning}</p>
                        </div>
                        <Badge variant={rule.points > 0 ? "default" : "destructive"}>
                          {rule.points > 0 ? '+' : ''}{rule.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiSuggestions.newRules && (
                <div>
                  <h3 className="font-semibold mb-3">Suggested New Rules</h3>
                  <div className="space-y-3">
                    {aiSuggestions.newRules.map((rule: any, index: number) => (
                      <div key={index} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-muted-foreground">{rule.reasoning}</p>
                        </div>
                        <Badge variant={rule.points > 0 ? "default" : "destructive"}>
                          {rule.points > 0 ? '+' : ''}{rule.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAiSuggestions(false)}>
                  Cancel
                </Button>
                <Button onClick={applyAISuggestions}>
                  Apply Suggestions
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}