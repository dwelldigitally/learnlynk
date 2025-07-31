import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LeadRoutingRule, AssignmentMethod, LeadSource } from '@/types/lead';
import { Plus, Edit, Trash2, Settings, Users, MapPin, Star } from 'lucide-react';

interface LeadRoutingRulesProps {
  onRuleCreated?: () => void;
}

export function LeadRoutingRules({ onRuleCreated }: LeadRoutingRulesProps) {
  const [rules, setRules] = useState<LeadRoutingRule[]>([]);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<LeadRoutingRule | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock rules for demonstration
  useEffect(() => {
    setRules([
      {
        id: 'rule-1',
        name: 'High Priority Web Leads',
        description: 'Route urgent web leads to top performers',
        priority: 10,
        is_active: true,
        conditions: {
          source: ['web'],
          priority: ['urgent', 'high'],
          program_interest: ['Health Care Assistant']
        },
        assignment_config: {
          method: 'performance',
          advisors: ['advisor-1', 'advisor-2'],
          tier: 'A'
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
        conditions: {
          country: ['Canada'],
          source: ['web', 'social_media']
        },
        assignment_config: {
          method: 'geography',
          advisors: ['advisor-3', 'advisor-4'],
          region: 'Canada'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 5,
    is_active: true,
    conditions: {
      source: [] as LeadSource[],
      priority: [] as string[],
      country: [] as string[],
      program_interest: [] as string[],
      lead_score_min: '',
      lead_score_max: ''
    },
    assignment_config: {
      method: 'round_robin' as AssignmentMethod,
      advisors: [] as string[],
      tier: '',
      region: '',
      max_daily_assignments: ''
    }
  });

  const availableAdvisors = [
    { id: 'advisor-1', name: 'Nicole Ye', tier: 'A' },
    { id: 'advisor-2', name: 'Sarah Johnson', tier: 'A' },
    { id: 'advisor-3', name: 'Mike Chen', tier: 'B' },
    { id: 'advisor-4', name: 'Emma Wilson', tier: 'B' }
  ];

  const programs = [
    'Health Care Assistant',
    'Aviation',
    'Education Assistant',
    'Hospitality',
    'ECE',
    'MLA'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Rule name is required',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      const ruleData = {
        ...formData,
        conditions: {
          ...formData.conditions,
          ...(formData.conditions.lead_score_min && { 
            lead_score_range: {
              min: parseInt(formData.conditions.lead_score_min),
              max: parseInt(formData.conditions.lead_score_max) || 100
            }
          })
        }
      };

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
        const newRule: LeadRoutingRule = {
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

      resetForm();
      setShowRuleForm(false);
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      priority: 5,
      is_active: true,
      conditions: {
        source: [],
        priority: [],
        country: [],
        program_interest: [],
        lead_score_min: '',
        lead_score_max: ''
      },
      assignment_config: {
        method: 'round_robin',
        advisors: [],
        tier: '',
        region: '',
        max_daily_assignments: ''
      }
    });
  };

  const handleEdit = (rule: LeadRoutingRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description || '',
      priority: rule.priority,
      is_active: rule.is_active,
      conditions: {
        source: rule.conditions.source || [],
        priority: rule.conditions.priority || [],
        country: rule.conditions.country || [],
        program_interest: rule.conditions.program_interest || [],
        lead_score_min: rule.conditions.lead_score_range?.min?.toString() || '',
        lead_score_max: rule.conditions.lead_score_range?.max?.toString() || ''
      },
      assignment_config: {
        method: rule.assignment_config.method || 'round_robin',
        advisors: rule.assignment_config.advisors || [],
        tier: rule.assignment_config.tier || '',
        region: rule.assignment_config.region || '',
        max_daily_assignments: rule.assignment_config.max_daily_assignments?.toString() || ''
      }
    });
    setShowRuleForm(true);
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

  const getMethodIcon = (method: AssignmentMethod) => {
    switch (method) {
      case 'round_robin': return <Users className="h-4 w-4" />;
      case 'geography': return <MapPin className="h-4 w-4" />;
      case 'performance': return <Star className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Routing Rules</h2>
          <p className="text-muted-foreground">Configure automated lead assignment and routing</p>
        </div>
        <Dialog open={showRuleForm} onOpenChange={setShowRuleForm}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingRule(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'Edit Routing Rule' : 'Create Routing Rule'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Rule Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority (1-10)</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Conditions</h3>
                
                <div>
                  <Label>Lead Sources</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {['web', 'social_media', 'event', 'agent', 'email', 'referral'].map((source) => (
                      <div key={source} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`source-${source}`}
                          checked={formData.conditions.source.includes(source as LeadSource)}
                          onChange={(e) => {
                            const sources = e.target.checked
                              ? [...formData.conditions.source, source as LeadSource]
                              : formData.conditions.source.filter(s => s !== source);
                            setFormData(prev => ({
                              ...prev,
                              conditions: { ...prev.conditions, source: sources }
                            }));
                          }}
                        />
                        <Label htmlFor={`source-${source}`} className="text-sm capitalize">
                          {source.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Programs of Interest</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {programs.map((program) => (
                      <div key={program} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`program-${program}`}
                          checked={formData.conditions.program_interest.includes(program)}
                          onChange={(e) => {
                            const programs = e.target.checked
                              ? [...formData.conditions.program_interest, program]
                              : formData.conditions.program_interest.filter(p => p !== program);
                            setFormData(prev => ({
                              ...prev,
                              conditions: { ...prev.conditions, program_interest: programs }
                            }));
                          }}
                        />
                        <Label htmlFor={`program-${program}`} className="text-sm">
                          {program}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="score_min">Min Lead Score</Label>
                    <Input
                      id="score_min"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.conditions.lead_score_min}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, lead_score_min: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="score_max">Max Lead Score</Label>
                    <Input
                      id="score_max"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.conditions.lead_score_max}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, lead_score_max: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Assignment Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Assignment Configuration</h3>
                
                <div>
                  <Label htmlFor="method">Assignment Method</Label>
                  <Select 
                    value={formData.assignment_config.method}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      assignment_config: { ...prev.assignment_config, method: value as AssignmentMethod }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round_robin">Round Robin</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="geography">Geography</SelectItem>
                      <SelectItem value="performance">Performance-Based</SelectItem>
                      <SelectItem value="ai_based">AI-Based (Coming Soon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select Advisors</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableAdvisors.map((advisor) => (
                      <div key={advisor.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`advisor-${advisor.id}`}
                          checked={formData.assignment_config.advisors.includes(advisor.id)}
                          onChange={(e) => {
                            const advisors = e.target.checked
                              ? [...formData.assignment_config.advisors, advisor.id]
                              : formData.assignment_config.advisors.filter(a => a !== advisor.id);
                            setFormData(prev => ({
                              ...prev,
                              assignment_config: { ...prev.assignment_config, advisors }
                            }));
                          }}
                        />
                        <Label htmlFor={`advisor-${advisor.id}`} className="text-sm">
                          {advisor.name} (Tier {advisor.tier})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowRuleForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingRule ? 'Update Rule' : 'Create Rule'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No routing rules configured yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first rule to automate lead assignment.</p>
            </CardContent>
          </Card>
        ) : (
          rules
            .sort((a, b) => b.priority - a.priority)
            .map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">Priority: {rule.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={() => toggleRuleStatus(rule.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {rule.description && (
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Conditions</h4>
                      <div className="space-y-1 text-sm">
                        {rule.conditions.source && rule.conditions.source.length > 0 && (
                          <div>Sources: {rule.conditions.source.join(', ')}</div>
                        )}
                        {rule.conditions.program_interest && rule.conditions.program_interest.length > 0 && (
                          <div>Programs: {rule.conditions.program_interest.join(', ')}</div>
                        )}
                        {rule.conditions.country && rule.conditions.country.length > 0 && (
                          <div>Countries: {rule.conditions.country.join(', ')}</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Assignment</h4>
                      <div className="flex items-center gap-2 text-sm">
                        {getMethodIcon(rule.assignment_config.method)}
                        <span className="capitalize">
                          {rule.assignment_config.method.replace('_', ' ')}
                        </span>
                        <span className="text-muted-foreground">
                          • {rule.assignment_config.advisors?.length || 0} advisors
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}