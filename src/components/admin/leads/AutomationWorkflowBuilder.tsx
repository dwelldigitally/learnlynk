import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Clock, MessageSquare, UserCheck, Tag, Bell, Calendar, ArrowRight, Play, Pause } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  steps: WorkflowStep[];
  created_at: string;
  updated_at: string;
}

export function AutomationWorkflowBuilder() {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const stepTypes = {
    trigger: {
      icon: Play,
      color: 'bg-green-500',
      options: [
        { value: 'lead_created', label: 'Lead Created' },
        { value: 'lead_updated', label: 'Lead Updated' },
        { value: 'no_response', label: 'No Response' },
        { value: 'score_change', label: 'Score Changed' },
        { value: 'status_change', label: 'Status Changed' },
        { value: 'time_based', label: 'Time-based' }
      ]
    },
    condition: {
      icon: UserCheck,
      color: 'bg-blue-500',
      options: [
        { value: 'score_greater', label: 'Score Greater Than' },
        { value: 'score_less', label: 'Score Less Than' },
        { value: 'status_equals', label: 'Status Equals' },
        { value: 'program_interest', label: 'Program Interest' },
        { value: 'source_equals', label: 'Source Equals' },
        { value: 'country_equals', label: 'Country Equals' }
      ]
    },
    action: {
      icon: MessageSquare,
      color: 'bg-purple-500',
      options: [
        { value: 'send_email', label: 'Send Email' },
        { value: 'send_sms', label: 'Send SMS' },
        { value: 'assign_advisor', label: 'Assign Advisor' },
        { value: 'add_tag', label: 'Add Tag' },
        { value: 'update_score', label: 'Update Score' },
        { value: 'create_task', label: 'Create Task' },
        { value: 'send_notification', label: 'Send Notification' }
      ]
    },
    delay: {
      icon: Clock,
      color: 'bg-orange-500',
      options: [
        { value: 'wait_minutes', label: 'Wait Minutes' },
        { value: 'wait_hours', label: 'Wait Hours' },
        { value: 'wait_days', label: 'Wait Days' },
        { value: 'wait_until_time', label: 'Wait Until Time' }
      ]
    }
  };

  const createNewWorkflow = () => {
    const newWorkflow: WorkflowRule = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: '',
      isActive: false,
      steps: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setSelectedWorkflow(newWorkflow);
    setIsEditing(true);
  };

  const addStep = (type: keyof typeof stepTypes) => {
    if (!selectedWorkflow) return;

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      config: {},
      position: { x: 0, y: selectedWorkflow.steps.length * 120 }
    };

    setSelectedWorkflow({
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, newStep]
    });
  };

  const updateStep = (stepId: string, config: Record<string, any>) => {
    if (!selectedWorkflow) return;

    setSelectedWorkflow({
      ...selectedWorkflow,
      steps: selectedWorkflow.steps.map(step =>
        step.id === stepId ? { ...step, config: { ...step.config, ...config } } : step
      )
    });
  };

  const removeStep = (stepId: string) => {
    if (!selectedWorkflow) return;

    setSelectedWorkflow({
      ...selectedWorkflow,
      steps: selectedWorkflow.steps.filter(step => step.id !== stepId)
    });
  };

  const saveWorkflow = () => {
    if (!selectedWorkflow) return;

    if (!selectedWorkflow.name.trim()) {
      toast({
        title: "Error",
        description: "Please provide a workflow name.",
        variant: "destructive",
      });
      return;
    }

    const updatedWorkflows = workflows.some(w => w.id === selectedWorkflow.id)
      ? workflows.map(w => w.id === selectedWorkflow.id ? selectedWorkflow : w)
      : [...workflows, selectedWorkflow];

    setWorkflows(updatedWorkflows);
    setIsEditing(false);
    
    toast({
      title: "Workflow Saved",
      description: `${selectedWorkflow.name} has been saved successfully.`,
    });
  };

  const toggleWorkflowActive = (workflowId: string) => {
    setWorkflows(workflows.map(w =>
      w.id === workflowId ? { ...w, isActive: !w.isActive } : w
    ));
  };

  const renderStepConfig = (step: WorkflowStep) => {
    const stepType = stepTypes[step.type];
    const StepIcon = stepType.icon;

    return (
      <Card key={step.id} className="relative">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className={`p-1 rounded ${stepType.color} text-white`}>
              <StepIcon className="h-4 w-4" />
            </div>
            {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeStep(step.id)}
              className="ml-auto h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor={`${step.id}-type`}>Type</Label>
            <Select
              value={step.config.subtype || ''}
              onValueChange={(value) => updateStep(step.id, { subtype: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {stepType.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic configuration based on step type */}
          {step.type === 'trigger' && step.config.subtype === 'time_based' && (
            <div>
              <Label htmlFor={`${step.id}-interval`}>Interval (hours)</Label>
              <Input
                type="number"
                value={step.config.interval || ''}
                onChange={(e) => updateStep(step.id, { interval: parseInt(e.target.value) })}
                placeholder="24"
              />
            </div>
          )}

          {step.type === 'condition' && (
            <>
              {step.config.subtype?.includes('score') && (
                <div>
                  <Label htmlFor={`${step.id}-value`}>Score Value</Label>
                  <Input
                    type="number"
                    value={step.config.value || ''}
                    onChange={(e) => updateStep(step.id, { value: parseInt(e.target.value) })}
                    placeholder="70"
                  />
                </div>
              )}
              {step.config.subtype?.includes('equals') && (
                <div>
                  <Label htmlFor={`${step.id}-value`}>Value</Label>
                  <Input
                    value={step.config.value || ''}
                    onChange={(e) => updateStep(step.id, { value: e.target.value })}
                    placeholder="Enter value"
                  />
                </div>
              )}
            </>
          )}

          {step.type === 'action' && (
            <>
              {step.config.subtype === 'send_email' && (
                <div>
                  <Label htmlFor={`${step.id}-template`}>Email Template</Label>
                  <Select
                    value={step.config.template || ''}
                    onValueChange={(value) => updateStep(step.id, { template: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="follow-up">Follow-up Email</SelectItem>
                      <SelectItem value="reminder">Reminder Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {step.config.subtype === 'add_tag' && (
                <div>
                  <Label htmlFor={`${step.id}-tags`}>Tags (comma-separated)</Label>
                  <Input
                    value={step.config.tags || ''}
                    onChange={(e) => updateStep(step.id, { tags: e.target.value })}
                    placeholder="high-priority, urgent"
                  />
                </div>
              )}
              {step.config.subtype === 'assign_advisor' && (
                <div>
                  <Label htmlFor={`${step.id}-method`}>Assignment Method</Label>
                  <Select
                    value={step.config.method || ''}
                    onValueChange={(value) => updateStep(step.id, { method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round_robin">Round Robin</SelectItem>
                      <SelectItem value="workload_based">Workload Based</SelectItem>
                      <SelectItem value="expertise_match">Expertise Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {step.type === 'delay' && (
            <div>
              <Label htmlFor={`${step.id}-duration`}>Duration</Label>
              <Input
                type="number"
                value={step.config.duration || ''}
                onChange={(e) => updateStep(step.id, { duration: parseInt(e.target.value) })}
                placeholder="Enter duration"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Automation Workflows</h2>
          <p className="text-muted-foreground">Create automated sequences to handle leads efficiently</p>
        </div>
        <Button onClick={createNewWorkflow}>
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Workflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workflows.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No workflows created yet
              </p>
            ) : (
              workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedWorkflow?.id === workflow.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setSelectedWorkflow(workflow);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{workflow.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        checked={workflow.isActive}
                        onCheckedChange={() => toggleWorkflowActive(workflow.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{workflow.description || 'No description'}</p>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <span>{workflow.steps.length} steps</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Workflow Builder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              {selectedWorkflow ? (isEditing ? 'Edit Workflow' : 'Workflow Details') : 'Select a Workflow'}
              {selectedWorkflow && !isEditing && (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedWorkflow ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Select a workflow to view details or create a new one</p>
              </div>
            ) : isEditing ? (
              <div className="space-y-6">
                {/* Workflow Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Workflow Name</Label>
                    <Input
                      id="name"
                      value={selectedWorkflow.name}
                      onChange={(e) => setSelectedWorkflow({ ...selectedWorkflow, name: e.target.value })}
                      placeholder="Enter workflow name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="active">Active</Label>
                    <div className="pt-2">
                      <Switch
                        id="active"
                        checked={selectedWorkflow.isActive}
                        onCheckedChange={(checked) => setSelectedWorkflow({ ...selectedWorkflow, isActive: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={selectedWorkflow.description}
                    onChange={(e) => setSelectedWorkflow({ ...selectedWorkflow, description: e.target.value })}
                    placeholder="Describe what this workflow does"
                  />
                </div>

                <Separator />

                {/* Step Builder */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Workflow Steps</h3>
                    <div className="flex gap-2">
                      {Object.entries(stepTypes).map(([type, config]) => {
                        const Icon = config.icon;
                        return (
                          <Button
                            key={type}
                            size="sm"
                            variant="outline"
                            onClick={() => addStep(type as keyof typeof stepTypes)}
                          >
                            <Icon className="h-3 w-3 mr-1" />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedWorkflow.steps.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                        <p className="text-muted-foreground">Add steps to build your workflow</p>
                      </div>
                    ) : (
                      selectedWorkflow.steps.map((step, index) => (
                        <div key={step.id} className="relative">
                          {renderStepConfig(step)}
                          {index < selectedWorkflow.steps.length - 1 && (
                            <div className="flex justify-center py-2">
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveWorkflow}>
                    Save Workflow
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{selectedWorkflow.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedWorkflow.description || 'No description'}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant={selectedWorkflow.isActive ? 'default' : 'secondary'}>
                    {selectedWorkflow.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedWorkflow.steps.length} step{selectedWorkflow.steps.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedWorkflow.steps.map((step, index) => {
                    const stepType = stepTypes[step.type];
                    const StepIcon = stepType.icon;
                    return (
                      <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className={`p-2 rounded ${stepType.color} text-white`}>
                          <StepIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{step.type.charAt(0).toUpperCase() + step.type.slice(1)}</p>
                          <p className="text-xs text-muted-foreground">
                            {step.config.subtype && stepType.options.find(opt => opt.value === step.config.subtype)?.label}
                          </p>
                        </div>
                        {index < selectedWorkflow.steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}