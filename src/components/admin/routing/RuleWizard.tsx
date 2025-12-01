import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ConditionBuilder } from './ConditionBuilder';
import { TargetSelector } from './TargetSelector';
import { EnhancedRoutingRule, ConditionGroup } from '@/types/routing';
import { ChevronLeft, ChevronRight, Check, Settings, Eye, Users } from 'lucide-react';

interface RuleWizardProps {
  onSave: (rule: Omit<EnhancedRoutingRule, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  editingRule?: EnhancedRoutingRule;
}

const WIZARD_STEPS = [
  { id: 'basics', title: 'Rule Basics', icon: Settings },
  { id: 'conditions', title: 'Conditions', icon: Users },
  { id: 'assignment', title: 'Assignment & Targets', icon: Users },
  { id: 'preview', title: 'Preview', icon: Eye }
];

const ASSIGNMENT_METHODS = [
  { value: 'round_robin', label: 'Round Robin', description: 'Distribute leads evenly among advisors' },
  { value: 'performance', label: 'Performance-Based', description: 'Assign to highest performing advisors first' },
  { value: 'geography', label: 'Geographic', description: 'Assign based on location matching' },
  { value: 'team_based', label: 'Team-Based', description: 'Assign to specific teams' },
  { value: 'workload_based', label: 'Workload-Based', description: 'Balance advisor workloads' },
  { value: 'ai_based', label: 'AI-Based', description: 'Let AI decide the best assignment' }
];

export function RuleWizard({ onSave, onCancel, editingRule }: RuleWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Omit<EnhancedRoutingRule, 'id' | 'created_at' | 'updated_at'>>({
    name: editingRule?.name || '',
    description: editingRule?.description || '',
    priority: editingRule?.priority || 5,
    is_active: editingRule?.is_active ?? true,
    sources: editingRule?.sources || [],
    condition_groups: editingRule?.condition_groups || [],
    assignment_config: editingRule?.assignment_config || {
      method: 'round_robin',
      max_assignments_per_advisor: 10,
      target_type: 'teams',
      advisors: [],
      teams: []
    },
    schedule: editingRule?.schedule || {
      enabled: false,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      start_time: '09:00',
      end_time: '17:00',
      timezone: 'UTC'
    },
    performance_config: editingRule?.performance_config || {
      track_analytics: true,
      conversion_weight: 0.7,
      response_time_weight: 0.3
    }
  });

  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Rule name is required',
        variant: 'destructive'
      });
      return;
    }

    // Validate targets
    const targetType = formData.assignment_config.target_type || 'teams';
    if (targetType === 'teams' && (!formData.assignment_config.teams || formData.assignment_config.teams.length === 0)) {
      toast({
        title: 'Error',
        description: 'At least one team must be selected',
        variant: 'destructive'
      });
      return;
    }

    if (targetType === 'advisors' && (!formData.assignment_config.advisors || formData.assignment_config.advisors.length === 0)) {
      toast({
        title: 'Error',
        description: 'At least one advisor must be selected',
        variant: 'destructive'
      });
      return;
    }

    onSave(formData);
  };

  const renderStepContent = () => {
    switch (WIZARD_STEPS[currentStep].id) {
      case 'basics':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Rule Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., High Priority Web Leads"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Describe what this rule does and when it should be applied..."
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
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 5 }))}
                />
                <p className="text-sm text-muted-foreground mt-1">Higher numbers = higher priority</p>
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
        );

      case 'conditions':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Routing Conditions</Label>
              <p className="text-sm text-muted-foreground">
                Define when this rule should be triggered based on lead characteristics
              </p>
            </div>
            
            <ConditionBuilder
              conditionGroups={formData.condition_groups}
              onChange={(groups: ConditionGroup[]) => 
                setFormData(prev => ({ ...prev, condition_groups: groups }))
              }
            />
          </div>
        );

      case 'assignment':
        return (
          <div className="space-y-8">
            <div>
              <Label className="text-base font-semibold">Assignment Configuration</Label>
              <p className="text-sm text-muted-foreground">Configure how leads should be assigned</p>
            </div>
            
            <div>
              <Label htmlFor="method">Assignment Method</Label>
              <Select
                value={formData.assignment_config.method}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  assignment_config: { ...prev.assignment_config, method: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNMENT_METHODS.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      <div>
                        <div className="font-medium">{method.label}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="max_assignments">Max Assignments per Advisor</Label>
              <Input
                id="max_assignments"
                type="number"
                min="1"
                value={formData.assignment_config.max_assignments_per_advisor || 10}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  assignment_config: {
                    ...prev.assignment_config,
                    max_assignments_per_advisor: parseInt(e.target.value) || 10
                  }
                }))}
              />
            </div>

            <div className="border-t pt-6">
              <TargetSelector
                targetType={formData.assignment_config.target_type || 'teams'}
                selectedAdvisors={formData.assignment_config.advisors || []}
                selectedTeams={formData.assignment_config.teams || []}
                onTargetTypeChange={(type) =>
                  setFormData(prev => ({
                    ...prev,
                    assignment_config: {
                      ...prev.assignment_config,
                      target_type: type,
                      advisors: type === 'advisors' ? prev.assignment_config.advisors : [],
                      teams: type === 'teams' ? prev.assignment_config.teams : []
                    }
                  }))
                }
                onAdvisorsChange={(advisors) =>
                  setFormData(prev => ({
                    ...prev,
                    assignment_config: { ...prev.assignment_config, advisors }
                  }))
                }
                onTeamsChange={(teams) =>
                  setFormData(prev => ({
                    ...prev,
                    assignment_config: { ...prev.assignment_config, teams }
                  }))
                }
              />
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Rule Preview</Label>
              <p className="text-sm text-muted-foreground">Review your routing rule configuration</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>{formData.name}</CardTitle>
                {formData.description && (
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <p className="text-sm">{formData.priority}/10</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant={formData.is_active ? "default" : "secondary"}>
                      {formData.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Conditions</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.condition_groups.length === 0
                      ? 'No specific conditions defined'
                      : `${formData.condition_groups.length} condition group(s) defined`
                    }
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Assignment Method</Label>
                  <p className="text-sm">
                    {ASSIGNMENT_METHODS.find(m => m.value === formData.assignment_config.method)?.label || formData.assignment_config.method}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Assignment Targets</Label>
                  {formData.assignment_config.target_type === 'teams' ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.assignment_config.teams && formData.assignment_config.teams.length > 0 ? (
                        formData.assignment_config.teams.map(teamId => (
                          <Badge key={teamId} variant="outline">
                            {teamId}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No teams selected</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.assignment_config.advisors && formData.assignment_config.advisors.length > 0 ? (
                        formData.assignment_config.advisors.map(advisorId => (
                          <Badge key={advisorId} variant="outline">
                            {advisorId}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No advisors selected</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingRule ? 'Edit Routing Rule' : 'Create Routing Rule'}
              </h2>
              <Button variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{WIZARD_STEPS[currentStep].title}</span>
                <span className="text-muted-foreground">
                  Step {currentStep + 1} of {WIZARD_STEPS.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between">
              {WIZARD_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-2 ${
                      isActive ? 'text-primary' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'
                    }`}
                  >
                    <div className={`
                      h-8 w-8 rounded-full flex items-center justify-center
                      ${isActive ? 'bg-primary text-primary-foreground' : ''}
                      ${isCompleted ? 'bg-primary/20 text-primary' : ''}
                      ${!isActive && !isCompleted ? 'bg-muted' : ''}
                    `}>
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="hidden md:inline text-sm font-medium">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < WIZARD_STEPS.length - 1 ? (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave}>
                <Check className="h-4 w-4 mr-2" />
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
