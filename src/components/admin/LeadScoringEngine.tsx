import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';
import { Lead } from '@/types/lead';
import { Brain, Settings, BarChart, TrendingUp, Target } from 'lucide-react';

interface ScoringRule {
  id: string;
  name: string;
  field: string;
  condition: string;
  value: string;
  points: number;
  weight: number;
  enabled: boolean;
}

export function LeadScoringEngine() {
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([]);
  const [autoScoringEnabled, setAutoScoringEnabled] = useState(true);
  const [aiScoringEnabled, setAiScoringEnabled] = useState(false);
  const [scoringStats, setScoringStats] = useState({
    totalLeads: 0,
    averageScore: 0,
    highQualityLeads: 0,
    scoredToday: 0
  });
  const { toast } = useToast();

  // Initialize default scoring rules
  useEffect(() => {
    setScoringRules([
      {
        id: 'rule-1',
        name: 'High Priority Lead',
        field: 'priority',
        condition: 'equals',
        value: 'urgent',
        points: 25,
        weight: 1.5,
        enabled: true
      },
      {
        id: 'rule-2',
        name: 'Healthcare Program Interest',
        field: 'program_interest',
        condition: 'contains',
        value: 'Health Care Assistant',
        points: 20,
        weight: 1.2,
        enabled: true
      },
      {
        id: 'rule-3',
        name: 'Phone Number Provided',
        field: 'phone',
        condition: 'not_empty',
        value: '',
        points: 15,
        weight: 1.0,
        enabled: true
      },
      {
        id: 'rule-4',
        name: 'Web Source',
        field: 'source',
        condition: 'equals',
        value: 'web',
        points: 10,
        weight: 1.0,
        enabled: true
      },
      {
        id: 'rule-5',
        name: 'Has UTM Campaign',
        field: 'utm_campaign',
        condition: 'not_empty',
        value: '',
        points: 5,
        weight: 0.8,
        enabled: true
      },
      {
        id: 'rule-6',
        name: 'Social Media Source',
        field: 'source',
        condition: 'equals',
        value: 'social_media',
        points: 8,
        weight: 0.9,
        enabled: true
      }
    ]);

    // Mock stats
    setScoringStats({
      totalLeads: 1247,
      averageScore: 42,
      highQualityLeads: 123,
      scoredToday: 28
    });
  }, []);

  const calculateLeadScore = (lead: Lead): number => {
    let totalScore = 0;
    let totalWeight = 0;

    scoringRules.forEach(rule => {
      if (!rule.enabled) return;

      let matches = false;
      const fieldValue = (lead as any)[rule.field];

      switch (rule.condition) {
        case 'equals':
          matches = fieldValue === rule.value;
          break;
        case 'contains':
          matches = Array.isArray(fieldValue) 
            ? fieldValue.includes(rule.value)
            : String(fieldValue || '').toLowerCase().includes(rule.value.toLowerCase());
          break;
        case 'not_empty':
          matches = fieldValue && String(fieldValue).trim() !== '';
          break;
        case 'greater_than':
          matches = Number(fieldValue) > Number(rule.value);
          break;
        case 'less_than':
          matches = Number(fieldValue) < Number(rule.value);
          break;
      }

      if (matches) {
        totalScore += rule.points * rule.weight;
        totalWeight += rule.weight;
      }
    });

    // Normalize score to 0-100 range
    return Math.min(100, Math.round(totalScore));
  };

  const runBulkScoring = async () => {
    try {
      const { leads } = await LeadService.getLeads({}, 1, 1000); // Get all leads
      
      let scoredCount = 0;
      for (const lead of leads) {
        const newScore = calculateLeadScore(lead);
        if (newScore !== lead.lead_score) {
          await LeadService.updateLead(lead.id, { lead_score: newScore });
          scoredCount++;
        }
      }

      toast({
        title: 'Bulk Scoring Complete',
        description: `Updated scores for ${scoredCount} leads`
      });

      // Update stats
      setScoringStats(prev => ({
        ...prev,
        scoredToday: prev.scoredToday + scoredCount
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to run bulk scoring',
        variant: 'destructive'
      });
    }
  };

  const addScoringRule = () => {
    const newRule: ScoringRule = {
      id: `rule-${Date.now()}`,
      name: 'New Scoring Rule',
      field: 'source',
      condition: 'equals',
      value: '',
      points: 10,
      weight: 1.0,
      enabled: true
    };
    setScoringRules(prev => [...prev, newRule]);
  };

  const updateScoringRule = (id: string, updates: Partial<ScoringRule>) => {
    setScoringRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  const deleteScoringRule = (id: string) => {
    setScoringRules(prev => prev.filter(rule => rule.id !== id));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    if (score >= 40) return 'outline';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scoring Engine</h1>
          <p className="text-muted-foreground">Automate lead qualification with intelligent scoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-scoring"
              checked={autoScoringEnabled}
              onCheckedChange={setAutoScoringEnabled}
            />
            <Label htmlFor="auto-scoring">Auto-scoring</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="ai-scoring"
              checked={aiScoringEnabled}
              onCheckedChange={setAiScoringEnabled}
            />
            <Label htmlFor="ai-scoring">AI Enhancement</Label>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scoringStats.totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(scoringStats.averageScore)}`}>
              {scoringStats.averageScore}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Quality (80+)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{scoringStats.highQualityLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scored Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scoringStats.scoredToday}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Scoring Rules</TabsTrigger>
          <TabsTrigger value="preview">Score Preview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Scoring Rules Configuration
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={runBulkScoring} variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Run Bulk Scoring
                  </Button>
                  <Button onClick={addScoringRule}>
                    Add Rule
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoringRules.map((rule) => (
                  <Card key={rule.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Input
                          value={rule.name}
                          onChange={(e) => updateScoringRule(rule.id, { name: e.target.value })}
                          className="max-w-xs font-medium"
                        />
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(enabled) => updateScoringRule(rule.id, { enabled })}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteScoringRule(rule.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <Label className="text-xs">Field</Label>
                          <select
                            value={rule.field}
                            onChange={(e) => updateScoringRule(rule.id, { field: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          >
                            <option value="source">Source</option>
                            <option value="priority">Priority</option>
                            <option value="program_interest">Program Interest</option>
                            <option value="phone">Phone</option>
                            <option value="country">Country</option>
                            <option value="utm_campaign">UTM Campaign</option>
                            <option value="utm_source">UTM Source</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-xs">Condition</Label>
                          <select
                            value={rule.condition}
                            onChange={(e) => updateScoringRule(rule.id, { condition: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          >
                            <option value="equals">Equals</option>
                            <option value="contains">Contains</option>
                            <option value="not_empty">Not Empty</option>
                            <option value="greater_than">Greater Than</option>
                            <option value="less_than">Less Than</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-xs">Value</Label>
                          <Input
                            value={rule.value}
                            onChange={(e) => updateScoringRule(rule.id, { value: e.target.value })}
                            className="text-sm"
                            placeholder="Condition value"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Points: {rule.points}</Label>
                          <Slider
                            value={[rule.points]}
                            onValueChange={([points]) => updateScoringRule(rule.id, { points })}
                            max={50}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Weight: {rule.weight}x</Label>
                          <Slider
                            value={[rule.weight]}
                            onValueChange={([weight]) => updateScoringRule(rule.id, { weight })}
                            max={2}
                            min={0.1}
                            step={0.1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {scoringRules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No scoring rules configured. Add your first rule to start automated scoring.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Score Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Test your scoring rules with sample lead data to see how scores are calculated.
                </p>
                
                {/* Sample leads with calculated scores */}
                <div className="space-y-3">
                  {[
                    {
                      name: 'John Doe',
                      source: 'web',
                      priority: 'urgent',
                      program_interest: ['Health Care Assistant'],
                      phone: '+1-555-0123',
                      utm_campaign: 'healthcare_2024'
                    },
                    {
                      name: 'Jane Smith',
                      source: 'social_media',
                      priority: 'medium',
                      program_interest: ['Aviation'],
                      phone: '',
                      utm_campaign: ''
                    },
                    {
                      name: 'Mike Johnson',
                      source: 'referral',
                      priority: 'high',
                      program_interest: ['Health Care Assistant', 'ECE'],
                      phone: '+1-555-0456',
                      utm_campaign: 'referral_program'
                    }
                  ].map((sampleLead, index) => {
                    const score = calculateLeadScore(sampleLead as any);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{sampleLead.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {sampleLead.source} • {sampleLead.priority} • {sampleLead.program_interest.join(', ')}
                          </div>
                        </div>
                        <Badge variant={getScoreBadgeVariant(score)}>
                          Score: {score}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Scoring Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Score Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">80-100 (Excellent)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="w-1/4 bg-green-600 h-2 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">60-79 (Good)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="w-1/3 bg-yellow-600 h-2 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">33%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">40-59 (Fair)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="w-1/4 bg-orange-600 h-2 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">0-39 (Poor)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="w-1/6 bg-red-600 h-2 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">17%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Top Performing Rules</h4>
                  <div className="space-y-2">
                    {scoringRules
                      .filter(rule => rule.enabled)
                      .sort((a, b) => (b.points * b.weight) - (a.points * a.weight))
                      .slice(0, 5)
                      .map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{rule.name}</span>
                          <Badge variant="outline">
                            {Math.round(rule.points * rule.weight)} pts
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>

                {aiScoringEnabled && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Enhancement Insights
                    </h4>
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <p className="text-sm">
                        • AI has identified that leads with "healthcare" in their notes convert 32% better
                      </p>
                      <p className="text-sm">
                        • Evening time submissions (5-8 PM) show 18% higher engagement rates
                      </p>
                      <p className="text-sm">
                        • Leads from mobile devices are 25% more likely to provide phone numbers
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}