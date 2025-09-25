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
  Search, 
  Edit, 
  GripVertical, 
  FileText, 
  Clock, 
  CheckSquare, 
  BookOpen, 
  Award,
  Trash2,
  Settings
} from 'lucide-react';
import { usePracticumJourneys, usePracticumJourneyMutations } from '@/hooks/usePracticum';
import { useAuth } from '@/contexts/AuthContext';
import type { PracticumJourneyInsert } from '@/types/practicum';
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

export function JourneyConfiguration() {
  const { session } = useAuth();
  const { data: journeys, isLoading } = usePracticumJourneys(session?.user?.id || '');
  const { createJourney } = usePracticumJourneyMutations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PracticumJourneyInsert>>({
    journey_name: '',
    steps: [],
    is_default: false,
    is_active: true
  });
  const [currentStep, setCurrentStep] = useState<Partial<PracticumJourneyStep>>({
    name: '',
    description: '',
    type: 'agreement',
    required: true,
    approvers: [],
    configuration: {}
  });
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);

  const filteredJourneys = journeys?.filter(journey =>
    journey.journey_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const journeyData = {
      ...formData,
      user_id: session?.user?.id || '',
      steps: JSON.stringify(formData.steps || [])
    } as PracticumJourneyInsert;

    try {
      await createJourney.mutateAsync(journeyData);
      setIsDialogOpen(false);
      setFormData({
        journey_name: '',
        steps: [],
        is_default: false,
        is_active: true
      });
    } catch (error) {
      console.error('Error saving journey:', error);
    }
  };

  const addStep = () => {
    const newStep: PracticumJourneyStep = {
      id: `step-${Date.now()}`,
      name: currentStep.name || '',
      description: currentStep.description || '',
      type: currentStep.type || 'agreement',
      required: currentStep.required || true,
      approvers: currentStep.approvers || [],
      order_index: (formData.steps as PracticumJourneyStep[])?.length || 0,
      configuration: currentStep.configuration || {}
    };

    setFormData({
      ...formData,
      steps: [...((formData.steps as PracticumJourneyStep[]) || []), newStep]
    });

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
    setFormData({
      ...formData,
      steps: (formData.steps as PracticumJourneyStep[])?.filter(step => step.id !== stepId) || []
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !formData.steps) return;

    const items = Array.from(formData.steps as PracticumJourneyStep[]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for all steps
    const updatedSteps = items.map((step, index) => ({
      ...step,
      order_index: index
    }));

    setFormData({
      ...formData,
      steps: updatedSteps
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Journey Configuration</h1>
          <p className="text-muted-foreground">Configure practicum workflow steps and requirements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingJourney(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Journey
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJourney ? 'Edit Journey' : 'Create New Journey'}</DialogTitle>
              <DialogDescription>
                Define the workflow steps students must complete during their practicum
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="journey_name">Journey Name</Label>
                  <Input
                    id="journey_name"
                    value={formData.journey_name}
                    onChange={(e) => setFormData({ ...formData, journey_name: e.target.value })}
                    placeholder="Nursing Practicum Journey"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="is_default"
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked as boolean })}
                  />
                  <Label htmlFor="is_default">Set as default journey</Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Journey Steps</h3>
                  <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
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

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="journey-steps">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {(formData.steps as PracticumJourneyStep[])?.map((step, index) => {
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

                {(formData.steps as PracticumJourneyStep[])?.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No steps added yet</p>
                    <p className="text-xs text-muted-foreground">Click "Add Step" to create your practicum workflow</p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createJourney.isPending}>
                  {editingJourney ? 'Update Journey' : 'Create Journey'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search journeys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Journeys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJourneys.map((journey) => {
          const steps = Array.isArray(journey.steps) 
            ? journey.steps 
            : JSON.parse(journey.steps as string || '[]');
          
          return (
            <Card key={journey.id} className="hover-scale">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{journey.journey_name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Settings className="h-3 w-3" />
                      {steps.length} steps configured
                      {journey.is_default && (
                        <Badge variant="default" className="text-xs">Default</Badge>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={journey.is_active ? "default" : "secondary"}>
                    {journey.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {steps.slice(0, 3).map((step: any, index: number) => {
                    const stepType = stepTypes.find(t => t.value === step.type);
                    const StepIcon = stepType?.icon || FileText;
                    
                    return (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <StepIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{step.name}</span>
                        {step.required && (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
                        )}
                      </div>
                    );
                  })}
                  
                  {steps.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{steps.length - 3} more steps
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredJourneys.length === 0 && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No journeys found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by creating your first practicum journey'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Journey
            </Button>
          )}
        </div>
      )}
    </div>
  );
}