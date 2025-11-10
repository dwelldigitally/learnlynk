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

interface ScoringRule {
  id: string;
  name: string;
  field: string;
  condition: string;
  value: string;
  points: number;
  enabled: boolean;
  order_index?: number;
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
        order_index: rule.order_index
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

  const totalPossiblePoints = scoringRules
    .filter(rule => rule.enabled)
    .reduce((sum, rule) => sum + rule.points, 0);

  const positivePoints = scoringRules
    .filter(rule => rule.enabled && rule.points > 0)
    .reduce((sum, rule) => sum + rule.points, 0);

  const negativePoints = Math.abs(scoringRules
    .filter(rule => rule.enabled && rule.points < 0)
    .reduce((sum, rule) => sum + rule.points, 0));

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Lead Scoring Engine
          </h1>
          <p className="text-muted-foreground text-lg">
            Configure automated scoring rules to prioritize and qualify leads
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Switch
              checked={autoScoringEnabled}
              onCheckedChange={(enabled) => {
                setAutoScoringEnabled(enabled);
                saveScoringSettings(enabled);
              }}
            />
            <Label className="text-sm font-medium">Auto-scoring {autoScoringEnabled ? 'enabled' : 'disabled'}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => analyzeWithAI('suggestions')} 
              variant="outline"
              size="sm"
              disabled={isAnalyzing}
            >
              <Brain className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'AI Suggestions'}
            </Button>
            <Button 
              onClick={() => analyzeWithAI('revamp')} 
              variant="outline"
              size="sm"
              disabled={isAnalyzing}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              AI Revamp
            </Button>
            <Button onClick={saveRules} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Rules
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Rules</p>
                  <p className="text-3xl font-bold mt-2">{scoringRules.filter(r => r.enabled).length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Positive Points</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">+{positivePoints}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-xl">+</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Negative Points</p>
                  <p className="text-3xl font-bold text-rose-600 mt-2">-{negativePoints}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  <span className="text-rose-600 font-bold text-xl">-</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                  <p className="text-3xl font-bold mt-2">{autoScoringEnabled ? 'Active' : 'Paused'}</p>
                </div>
                <div className={`h-3 w-3 rounded-full ${autoScoringEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scoring Rules */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Scoring Rules</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag to reorder • Positive points for good indicators • Negative points for disqualifiers
                </p>
              </div>
              <Button onClick={addRule} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="scoring-rules">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {scoringRules.map((rule, index) => (
                      <Draggable key={rule.id} draggableId={rule.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 border border-border/50 rounded-lg bg-background space-y-4 transition-all ${
                              snapshot.isDragging ? 'shadow-lg border-primary/40' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <Switch
                                  checked={rule.enabled}
                                  onCheckedChange={(enabled) => updateRule(rule.id, { enabled })}
                                />
                                <Input
                                  value={rule.name}
                                  onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                                  className="font-medium max-w-xs"
                                  placeholder="Rule name"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                {getRuleTypeBadge(rule.points)}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteRule(rule.id)}
                                  className="text-destructive hover:text-destructive h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-12 gap-3 items-end">
                              <div className="col-span-3">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Field</Label>
                                <Select
                                  value={rule.field}
                                  onValueChange={(value) => updateRule(rule.id, { field: value })}
                                >
                                  <SelectTrigger className="mt-1.5">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fieldOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="col-span-3">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Condition</Label>
                                <Select
                                  value={rule.condition}
                                  onValueChange={(value) => updateRule(rule.id, { condition: value })}
                                >
                                  <SelectTrigger className="mt-1.5">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {conditionOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="col-span-4">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Value</Label>
                                <Input
                                  value={rule.value}
                                  onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                                  placeholder="Enter value"
                                  className="mt-1.5"
                                />
                              </div>

                              <div className="col-span-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Points</Label>
                                <Input
                                  type="number"
                                  value={rule.points}
                                  onChange={(e) => updateRule(rule.id, { points: parseInt(e.target.value) || 0 })}
                                  min="-100"
                                  max="100"
                                  className={`mt-1.5 ${getRuleTypeColor(rule.points)}`}
                                />
                              </div>
                            </div>

                            {/* Rule Preview */}
                            <div className="bg-muted/30 p-3 rounded-lg text-sm border border-border/30">
                              <span className="text-muted-foreground">When </span>
                              <span className="font-medium">{fieldOptions.find(f => f.value === rule.field)?.label}</span> 
                              {' '}<span className="text-muted-foreground">{conditionOptions.find(c => c.value === rule.condition)?.label}</span>
                              {' '}<span className="font-medium">"{rule.value}"</span>
                              {' '}<span className="text-muted-foreground">→</span>{' '}
                              <span className={`font-semibold ${getRuleTypeColor(rule.points)}`}>
                                {rule.points > 0 ? '+' : ''}{rule.points} points
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {scoringRules.length === 0 && (
                      <div className="text-center py-16">
                        <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Target className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No Scoring Rules Yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Add your first rule to start scoring leads automatically based on their attributes and behaviors.
                        </p>
                        <Button onClick={addRule}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Rule
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>

        {/* Scoring Tips */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>💡</span> Lead Scoring Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></div>
                <h3 className="font-semibold text-emerald-700">1. Contact Information</h3>
                <p className="text-sm text-muted-foreground">
                  Demographic data indicating quality: location, company, job title, industry sector
                </p>
                <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                  +5 to +25 points
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                <h3 className="font-semibold text-blue-700">2. Interactions & Behavior</h3>
                <p className="text-sm text-muted-foreground">
                  Engagement signals: website visits, form submissions, email interactions, downloads
                </p>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  +10 to +30 points
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 bg-gradient-to-r from-rose-400 to-rose-600 rounded-full"></div>
                <h3 className="font-semibold text-rose-700">3. Disqualifiers</h3>
                <p className="text-sm text-muted-foreground">
                  Negative factors: competitors, wrong-fit personas, unengaged contacts, spam indicators
                </p>
                <Badge variant="outline" className="text-rose-600 border-rose-200">
                  -5 to -20 points
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions Modal */}
      <Dialog open={showAiSuggestions} onOpenChange={setShowAiSuggestions}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Lead Scoring Analysis
            </DialogTitle>
          </DialogHeader>
          
          {aiSuggestions && (
            <div className="space-y-6">
              {aiSuggestions.summary && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h3 className="font-semibold mb-2">Analysis Summary</h3>
                  <p className="text-sm text-muted-foreground">{aiSuggestions.summary}</p>
                </div>
              )}

              {aiSuggestions.newScoringSystem && (
                <div>
                  <h3 className="font-semibold mb-3">Recommended New Scoring System</h3>
                  <div className="space-y-2">
                    {aiSuggestions.newScoringSystem.map((rule: any, index: number) => (
                      <div key={index} className="p-4 border border-border/50 rounded-lg bg-background flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium mb-1">{rule.name}</p>
                          <p className="text-sm text-muted-foreground">{rule.reasoning}</p>
                        </div>
                        <Badge variant={rule.points > 0 ? "default" : "destructive"} className="ml-4">
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
                  <div className="space-y-2">
                    {aiSuggestions.newRules.map((rule: any, index: number) => (
                      <div key={index} className="p-4 border border-border/50 rounded-lg bg-background flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium mb-1">{rule.name}</p>
                          <p className="text-sm text-muted-foreground">{rule.reasoning}</p>
                        </div>
                        <Badge variant={rule.points > 0 ? "default" : "destructive"} className="ml-4">
                          {rule.points > 0 ? '+' : ''}{rule.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowAiSuggestions(false)}>
                  Cancel
                </Button>
                <Button onClick={applyAISuggestions}>
                  <Sparkles className="h-4 w-4 mr-2" />
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
