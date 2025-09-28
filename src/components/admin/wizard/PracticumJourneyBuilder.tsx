import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  Plus, 
  Edit, 
  GripVertical, 
  FileText, 
  Clock, 
  CheckSquare, 
  BookOpen, 
  Award,
  Trash2,
  Settings,
  ArrowLeft
} from 'lucide-react';
import type { PracticumJourneyStep } from '@/types/practicum';

const stepTypes = [
  { value: 'agreement', label: 'Agreement Signing', icon: FileText },
  { value: 'attendance', label: 'Attendance Logging', icon: Clock },
  { value: 'competency', label: 'Competency Assessment', icon: CheckSquare },
  { value: 'journal', label: 'Journal Entry', icon: BookOpen },
  { value: 'evaluation', label: 'Evaluation', icon: Award },
  { value: 'document_upload', label: 'Document Upload', icon: FileText }
];

const approverTypes = [
  { value: 'preceptor', label: 'Preceptor' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'admin', label: 'Admin' },
  { value: 'coordinator', label: 'Program Coordinator' }
];

interface PracticumJourneyBuilderProps {
  onBack: () => void;
  onSave: (journey: { name: string; steps: PracticumJourneyStep[] }) => void;
  initialJourney?: { name: string; steps: PracticumJourneyStep[] };
}

export function PracticumJourneyBuilder({ onBack, onSave, initialJourney }: PracticumJourneyBuilderProps) {
  const [journeyName, setJourneyName] = useState(initialJourney?.name || '');
  const [journeySteps, setJourneySteps] = useState<PracticumJourneyStep[]>(initialJourney?.steps || []);
  const [currentStep, setCurrentStep] = useState<Partial<PracticumJourneyStep>>({
    name: '',
    description: '',
    type: 'agreement',
    required: true,
    approvers: [],
    configuration: {}
  });
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);

  const addStep = () => {
    const newStep: PracticumJourneyStep = {
      id: `step-${Date.now()}`,
      name: currentStep.name || '',
      description: currentStep.description || '',
      type: currentStep.type || 'agreement',
      required: currentStep.required || true,
      approvers: currentStep.approvers || [],
      order_index: journeySteps.length,
      configuration: currentStep.configuration || {}
    };

    setJourneySteps([...journeySteps, newStep]);

    setCurrentStep({
      name: '',
      description: '',
      type: 'agreement',
      required: true,
      approvers: [],
      configuration: {}
    });
    setIsStepDialogOpen(false);
  };

  const removeStep = (stepId: string) => {
    setJourneySteps(journeySteps.filter(step => step.id !== stepId));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(journeySteps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for all steps
    const updatedSteps = items.map((step, index) => ({
      ...step,
      order_index: index
    }));

    setJourneySteps(updatedSteps);
  };

  const handleSave = () => {
    if (!journeyName.trim()) {
      return;
    }
    onSave({
      name: journeyName,
      steps: journeySteps
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Program
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Practicum Journey Builder</h1>
              <p className="text-muted-foreground">Configure practicum workflow steps and requirements</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={!journeyName.trim() || journeySteps.length === 0}>
            Save Journey
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Journey Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Journey Details</CardTitle>
            <CardDescription>Define the basic information for this practicum journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="journey_name">Journey Name</Label>
              <Input
                id="journey_name"
                value={journeyName}
                onChange={(e) => setJourneyName(e.target.value)}
                placeholder="e.g., Nursing Practicum Journey"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Journey Steps */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Journey Steps</CardTitle>
                <CardDescription>Define the workflow steps students must complete</CardDescription>
              </div>
              <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Step
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Journey Step</DialogTitle>
                    <DialogDescription>
                      Define a step in the practicum workflow
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="step_name">Step Name</Label>
                        <Input
                          id="step_name"
                          value={currentStep.name}
                          onChange={(e) => setCurrentStep({ ...currentStep, name: e.target.value })}
                          placeholder="Pre-Practicum Agreement"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="step_type">Step Type</Label>
                        <Select
                          value={currentStep.type}
                          onValueChange={(value) => setCurrentStep({ ...currentStep, type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stepTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="step_description">Description</Label>
                      <Textarea
                        id="step_description"
                        value={currentStep.description}
                        onChange={(e) => setCurrentStep({ ...currentStep, description: e.target.value })}
                        placeholder="Student must sign the practicum agreement before starting"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Who can approve this step?</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {approverTypes.map((approver) => (
                          <div key={approver.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`approver-${approver.value}`}
                              checked={currentStep.approvers?.includes(approver.value)}
                              onCheckedChange={(checked) => {
                                const approvers = currentStep.approvers || [];
                                if (checked) {
                                  setCurrentStep({ 
                                    ...currentStep, 
                                    approvers: [...approvers, approver.value] 
                                  });
                                } else {
                                  setCurrentStep({ 
                                    ...currentStep, 
                                    approvers: approvers.filter(a => a !== approver.value) 
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={`approver-${approver.value}`}>{approver.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="step_required"
                        checked={currentStep.required}
                        onCheckedChange={(checked) => setCurrentStep({ ...currentStep, required: checked as boolean })}
                      />
                      <Label htmlFor="step_required">Required step</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsStepDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={addStep}>
                      Add Step
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="journey-steps">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {journeySteps.map((step, index) => {
                      const stepType = stepTypes.find(t => t.value === step.type);
                      const StepIcon = stepType?.icon || FileText;
                      
                      return (
                        <Draggable key={step.id} draggableId={step.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-3 p-3 border rounded-lg bg-background"
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="flex items-center gap-2 flex-1">
                                <StepIcon className="h-4 w-4 text-muted-foreground" />
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{step.name}</span>
                                    {step.required && (
                                      <Badge variant="secondary" className="text-xs">Required</Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{step.description}</p>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-muted-foreground">Approvers:</span>
                                    {step.approvers.map(approver => (
                                      <Badge key={approver} variant="outline" className="text-xs">
                                        {approverTypes.find(a => a.value === approver)?.label}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStep(step.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {journeySteps.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No steps added yet</p>
                <p className="text-xs text-muted-foreground">Click "Add Step" to create your practicum workflow</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}