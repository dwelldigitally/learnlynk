import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock, 
  Trash2, 
  Edit, 
  ArrowDown,
  Play,
  Settings,
  Target,
  Zap
} from 'lucide-react';
import { CampaignService } from '@/services/campaignService';
import { useToast } from '@/hooks/use-toast';

export interface WorkflowStep {
  id: string;
  type: 'email' | 'sms' | 'call' | 'wait' | 'condition';
  title: string;
  content?: string;
  subject?: string;
  delay?: {
    value: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks';
  };
  conditions?: {
    field: string;
    operator: string;
    value: string;
  }[];
  order: number;
}

interface WorkflowCampaignBuilderProps {
  onCampaignCreated?: (campaign: any) => void;
}

const stepTypes = [
  { value: 'email', label: 'Email', icon: Mail, color: 'bg-blue-500' },
  { value: 'sms', label: 'SMS', icon: MessageSquare, color: 'bg-green-500' },
  { value: 'call', label: 'Phone Call', icon: Phone, color: 'bg-purple-500' },
  { value: 'wait', label: 'Wait/Delay', icon: Clock, color: 'bg-orange-500' },
  { value: 'condition', label: 'Condition', icon: Zap, color: 'bg-red-500' }
];

export function WorkflowCampaignBuilder({ onCampaignCreated }: WorkflowCampaignBuilderProps) {
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [showStepDialog, setShowStepDialog] = useState(false);
  const { toast } = useToast();

  const addStep = (type: WorkflowStep['type']) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      title: `${stepTypes.find(t => t.value === type)?.label} Step`,
      order: steps.length,
    };

    if (type === 'wait') {
      newStep.delay = { value: 1, unit: 'days' };
    }

    setSteps([...steps, newStep]);
  };

  const updateStep = (updatedStep: WorkflowStep) => {
    setSteps(steps.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    ));
    setEditingStep(null);
    setShowStepDialog(false);
  };

  const deleteStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId).map((step, index) => ({
      ...step,
      order: index
    })));
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (
      (direction === 'up' && stepIndex === 0) ||
      (direction === 'down' && stepIndex === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const newIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    [newSteps[stepIndex], newSteps[newIndex]] = [newSteps[newIndex], newSteps[stepIndex]];
    
    // Update order numbers
    newSteps.forEach((step, index) => {
      step.order = index;
    });

    setSteps(newSteps);
  };

  const saveCampaign = async () => {
    if (!campaignName.trim()) {
      toast({
        title: "Error",
        description: "Campaign name is required",
        variant: "destructive",
      });
      return;
    }

    if (steps.length === 0) {
      toast({
        title: "Error", 
        description: "Add at least one step to the campaign",
        variant: "destructive",
      });
      return;
    }

    try {
      const campaign = await CampaignService.createCampaign({
        name: campaignName,
        description: campaignDescription,
        campaign_type: 'workflow',
        status: 'draft',
        workflow_config: {
          steps: steps.length,
          totalDuration: calculateTotalDuration(),
          channels: getUsedChannels()
        },
        campaign_data: {
          workflowSteps: steps.map(step => ({
            id: step.id,
            type: step.type,
            title: step.title,
            content: step.content || null,
            subject: step.subject || null,
            delay: step.delay || null,
            conditions: step.conditions || null,
            order: step.order
          }))
        },
        target_audience: {
          type: 'general',
          criteria: {}
        }
      });

      // Create campaign steps in database
      for (const step of steps) {
        await CampaignService.createCampaignStep({
          campaign_id: campaign.id,
          step_type: step.type,
          order_index: step.order,
          step_config: {
            title: step.title,
            content: step.content,
            subject: step.subject,
            delay: step.delay,
            conditions: step.conditions
          }
        });
      }

      toast({
        title: "Success",
        description: "Campaign workflow created successfully",
      });

      onCampaignCreated?.(campaign);
      
      // Reset form
      setCampaignName('');
      setCampaignDescription('');
      setSteps([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    }
  };

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    steps.forEach(step => {
      if (step.type === 'wait' && step.delay) {
        const { value, unit } = step.delay;
        switch (unit) {
          case 'minutes': totalMinutes += value; break;
          case 'hours': totalMinutes += value * 60; break;
          case 'days': totalMinutes += value * 60 * 24; break;
          case 'weeks': totalMinutes += value * 60 * 24 * 7; break;
        }
      }
    });
    
    if (totalMinutes < 60) return `${totalMinutes}m`;
    if (totalMinutes < 1440) return `${Math.round(totalMinutes / 60)}h`;
    return `${Math.round(totalMinutes / 1440)}d`;
  };

  const getUsedChannels = () => {
    const channels = new Set(steps.map(step => step.type).filter(type => type !== 'wait' && type !== 'condition'));
    return Array.from(channels);
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find(t => t.value === type);
    return stepType ? stepType.icon : Mail;
  };

  const getStepColor = (type: string) => {
    const stepType = stepTypes.find(t => t.value === type);
    return stepType ? stepType.color : 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Workflow Campaign Builder</h2>
        <p className="text-muted-foreground">Create step-by-step marketing campaigns with precise timing and conditions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Setup */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  placeholder="Describe the campaign purpose"
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <Label>Add Step</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {stepTypes.map((stepType) => {
                    const Icon = stepType.icon;
                    return (
                      <Button
                        key={stepType.value}
                        variant="outline"
                        size="sm"
                        onClick={() => addStep(stepType.value as WorkflowStep['type'])}
                        className="justify-start"
                      >
                        <div className={`w-2 h-2 rounded-full ${stepType.color} mr-2`} />
                        <Icon className="h-3 w-3 mr-1" />
                        {stepType.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Steps:</span>
                  <Badge variant="secondary">{steps.length}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <Badge variant="secondary">{calculateTotalDuration()}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Channels:</span>
                  <div className="flex gap-1">
                    {getUsedChannels().map(channel => (
                      <Badge key={channel} variant="outline" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={saveCampaign}
                className="w-full"
                disabled={!campaignName.trim() || steps.length === 0}
              >
                Save Campaign
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {steps.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No steps added yet</p>
                  <p className="text-sm">Add your first step to start building the workflow</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Start Trigger */}
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-xs font-medium">
                      <Play className="h-4 w-4" />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">Campaign Start</div>
                      <div className="text-sm text-muted-foreground">Triggered when lead enters campaign</div>
                    </div>
                  </div>

                  {steps.map((step, index) => {
                    const Icon = getStepIcon(step.type);
                    return (
                      <React.Fragment key={step.id}>
                        {/* Connection Arrow */}
                        <div className="flex justify-center">
                          <ArrowDown className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {/* Step Card */}
                        <Card className="relative">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`flex items-center justify-center w-8 h-8 ${getStepColor(step.type)} text-white rounded-full text-xs font-medium`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="font-medium">{step.title}</div>
                                  {step.type === 'wait' && step.delay && (
                                    <div className="text-sm text-muted-foreground">
                                      Wait {step.delay.value} {step.delay.unit}
                                    </div>
                                  )}
                                  {step.content && (
                                    <div className="text-sm text-muted-foreground mt-1 max-w-md truncate">
                                      {step.content}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingStep(step);
                                    setShowStepDialog(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteStep(step.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Step Editor Dialog */}
      <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingStep ? 'Edit Step' : 'Add Step'}
            </DialogTitle>
          </DialogHeader>
          {editingStep && (
            <StepEditor
              step={editingStep}
              onSave={updateStep}
              onCancel={() => {
                setEditingStep(null);
                setShowStepDialog(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface StepEditorProps {
  step: WorkflowStep;
  onSave: (step: WorkflowStep) => void;
  onCancel: () => void;
}

function StepEditor({ step, onSave, onCancel }: StepEditorProps) {
  const [editedStep, setEditedStep] = useState<WorkflowStep>({ ...step });

  const handleSave = () => {
    onSave(editedStep);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="step-title">Step Title</Label>
        <Input
          id="step-title"
          value={editedStep.title}
          onChange={(e) => setEditedStep({ ...editedStep, title: e.target.value })}
        />
      </div>

      {(editedStep.type === 'email' || editedStep.type === 'sms') && (
        <>
          {editedStep.type === 'email' && (
            <div>
              <Label htmlFor="step-subject">Subject Line</Label>
              <Input
                id="step-subject"
                value={editedStep.subject || ''}
                onChange={(e) => setEditedStep({ ...editedStep, subject: e.target.value })}
                placeholder="Enter email subject"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="step-content">Content</Label>
            <Textarea
              id="step-content"
              value={editedStep.content || ''}
              onChange={(e) => setEditedStep({ ...editedStep, content: e.target.value })}
              placeholder={`Enter ${editedStep.type} content`}
              rows={4}
            />
          </div>
        </>
      )}

      {editedStep.type === 'wait' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="delay-value">Wait Duration</Label>
            <Input
              id="delay-value"
              type="number"
              value={editedStep.delay?.value || 1}
              onChange={(e) => setEditedStep({ 
                ...editedStep, 
                delay: { 
                  ...editedStep.delay!, 
                  value: parseInt(e.target.value) || 1 
                }
              })}
              min={1}
            />
          </div>
          <div>
            <Label htmlFor="delay-unit">Time Unit</Label>
            <Select
              value={editedStep.delay?.unit || 'days'}
              onValueChange={(value) => setEditedStep({ 
                ...editedStep, 
                delay: { 
                  ...editedStep.delay!, 
                  unit: value as any 
                }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Step
        </Button>
      </div>
    </div>
  );
}