import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Save, Target } from 'lucide-react';

interface ScoringRule {
  id: string;
  name: string;
  field: string;
  condition: string;
  value: string;
  points: number;
  enabled: boolean;
}

export function LeadScoringEngine() {
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([
    {
      id: 'rule-1',
      name: 'High Priority Leads',
      field: 'priority',
      condition: 'equals',
      value: 'urgent',
      points: 25,
      enabled: true
    },
    {
      id: 'rule-2',
      name: 'Healthcare Interest',
      field: 'program_interest',
      condition: 'contains',
      value: 'Health Care Assistant',
      points: 20,
      enabled: true
    },
    {
      id: 'rule-3',
      name: 'Canadian Leads',
      field: 'country',
      condition: 'equals',
      value: 'Canada',
      points: 10,
      enabled: true
    }
  ]);

  const [autoScoringEnabled, setAutoScoringEnabled] = useState(true);
  const { toast } = useToast();

  const fieldOptions = [
    { value: 'priority', label: 'Lead Priority' },
    { value: 'program_interest', label: 'Program Interest' },
    { value: 'country', label: 'Country' },
    { value: 'state', label: 'State/Province' },
    { value: 'city', label: 'City' },
    { value: 'source', label: 'Lead Source' },
    { value: 'qualification_stage', label: 'Qualification Stage' }
  ];

  const conditionOptions = [
    { value: 'equals', label: 'is equal to' },
    { value: 'contains', label: 'contains' },
    { value: 'not_equals', label: 'is not equal to' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'ends_with', label: 'ends with' }
  ];

  const addRule = () => {
    const newRule: ScoringRule = {
      id: `rule-${Date.now()}`,
      name: 'New Rule',
      field: 'priority',
      condition: 'equals',
      value: '',
      points: 10,
      enabled: true
    };
    setScoringRules([...scoringRules, newRule]);
  };

  const updateRule = (id: string, updates: Partial<ScoringRule>) => {
    setScoringRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, ...updates } : rule
      )
    );
  };

  const deleteRule = (id: string) => {
    setScoringRules(rules => rules.filter(rule => rule.id !== id));
  };

  const saveRules = () => {
    toast({
      title: 'Success',
      description: 'Scoring rules saved successfully'
    });
  };

  const totalPossiblePoints = scoringRules
    .filter(rule => rule.enabled)
    .reduce((sum, rule) => sum + rule.points, 0);

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
              onCheckedChange={setAutoScoringEnabled}
            />
            <Label>Auto-scoring enabled</Label>
          </div>
          <Button onClick={saveRules}>
            <Save className="h-4 w-4 mr-2" />
            Save Rules
          </Button>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="text-sm font-medium text-muted-foreground">Max Possible Score</p>
                <p className="text-2xl font-bold">{totalPossiblePoints}</p>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">points</Badge>
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

      {/* Scoring Rules */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Scoring Rules</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Define conditions that automatically assign points to leads. Higher scores indicate higher quality leads.
            </p>
          </div>
          <Button onClick={addRule} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoringRules.map(rule => (
              <div key={rule.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(enabled) => updateRule(rule.id, { enabled })}
                    />
                    <Input
                      value={rule.name}
                      onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                      className="font-medium"
                      placeholder="Rule name"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      +{rule.points} points
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <Label className="text-sm">Field</Label>
                    <Select
                      value={rule.field}
                      onValueChange={(value) => updateRule(rule.id, { field: value })}
                    >
                      <SelectTrigger>
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
                    <Label className="text-sm">Condition</Label>
                    <Select
                      value={rule.condition}
                      onValueChange={(value) => updateRule(rule.id, { condition: value })}
                    >
                      <SelectTrigger>
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
                    <Label className="text-sm">Value</Label>
                    <Input
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                      placeholder="Enter value to match"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label className="text-sm">Points</Label>
                    <Input
                      type="number"
                      value={rule.points}
                      onChange={(e) => updateRule(rule.id, { points: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {/* Rule Preview */}
                <div className="bg-muted/50 p-3 rounded text-sm">
                  <span className="font-medium">Rule: </span>
                  When <span className="font-medium">{fieldOptions.find(f => f.value === rule.field)?.label}</span> 
                  {' '}<span className="font-medium">{conditionOptions.find(c => c.value === rule.condition)?.label}</span>
                  {' '}<span className="font-medium">"{rule.value}"</span>
                  {' '}→ Add <span className="font-medium text-green-600">+{rule.points} points</span>
                </div>
              </div>
            ))}

            {scoringRules.length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No scoring rules configured yet.</p>
                <p className="text-sm text-muted-foreground">Add your first rule to start scoring leads automatically.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Helpful Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">💡 Scoring Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Start simple:</strong> Begin with 3-5 basic rules for your most important lead qualities</li>
            <li>• <strong>Point values:</strong> Use 5-10 points for minor factors, 15-25 for major factors</li>
            <li>• <strong>High-quality leads:</strong> Typically score 50+ points</li>
            <li>• <strong>Review regularly:</strong> Check your rules monthly and adjust based on conversion data</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}