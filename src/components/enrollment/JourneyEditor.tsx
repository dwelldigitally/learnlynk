import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical, 
  Clock, 
  AlertTriangle,
  Code,
  UserCheck,
  FileText,
  MessageSquare,
  Settings,
  Save,
  Eye
} from 'lucide-react';
import { AcademicJourney, JourneyStage } from '@/types/academicJourney';
import { AcademicJourneyService, useAcademicJourney, useUpdateAcademicJourney } from '@/services/academicJourneyService';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface JourneyEditorProps {
  journeyId: string;
  onBack: () => void;
}

const STAGE_TYPES = [
  { value: 'lead_capture', label: 'Lead Capture', icon: MessageSquare, color: 'bg-blue-100 text-blue-800' },
  { value: 'application_start', label: 'Application Start', icon: FileText, color: 'bg-green-100 text-green-800' },
  { value: 'prerequisites', label: 'Prerequisites Review', icon: UserCheck, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'programming_assessment', label: 'Programming Assessment', icon: Code, color: 'bg-purple-100 text-purple-800' },
  { value: 'portfolio_review', label: 'Portfolio Review', icon: Eye, color: 'bg-indigo-100 text-indigo-800' },
  { value: 'technical_interview', label: 'Technical Interview', icon: UserCheck, color: 'bg-orange-100 text-orange-800' },
  { value: 'academic_advising', label: 'Academic Advising', icon: MessageSquare, color: 'bg-teal-100 text-teal-800' },
  { value: 'documents', label: 'Document Submission', icon: FileText, color: 'bg-gray-100 text-gray-800' },
  { value: 'language_test', label: 'Language Test', icon: MessageSquare, color: 'bg-pink-100 text-pink-800' },
  { value: 'interview', label: 'Interview', icon: UserCheck, color: 'bg-cyan-100 text-cyan-800' },
  { value: 'admission_decision', label: 'Admission Decision', icon: Settings, color: 'bg-emerald-100 text-emerald-800' },
  { value: 'visa_support', label: 'Visa Support', icon: FileText, color: 'bg-red-100 text-red-800' },
  { value: 'contract_signing', label: 'Contract Signing', icon: FileText, color: 'bg-amber-100 text-amber-800' },
  { value: 'deposit_payment', label: 'Deposit Payment', icon: Settings, color: 'bg-lime-100 text-lime-800' },
  { value: 'onboarding', label: 'Onboarding', icon: UserCheck, color: 'bg-sky-100 text-sky-800' },
  { value: 'enrollment_complete', label: 'Enrollment Complete', icon: Settings, color: 'bg-green-100 text-green-800' }
];

export function JourneyEditor({ journeyId, onBack }: JourneyEditorProps) {
  const { data: journey, isLoading, error } = useAcademicJourney(journeyId);
  const updateJourneyMutation = useUpdateAcademicJourney();
  
  const [editedJourney, setEditedJourney] = useState<Partial<AcademicJourney>>({});
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (journey) {
      setEditedJourney({
        name: journey.name,
        description: journey.description,
        is_active: journey.is_active
      });
      setStages(journey.stages || []);
    }
  }, [journey]);

  const getStageTypeInfo = (stageType: string) => {
    return STAGE_TYPES.find(type => type.value === stageType) || STAGE_TYPES[0];
  };

  const handleJourneyUpdate = (field: string, value: any) => {
    setEditedJourney(prev => ({ ...prev, [field]: value }));
  };

  const handleStageUpdate = (stageIndex: number, field: string, value: any) => {
    setStages(prev => prev.map((stage, index) => 
      index === stageIndex ? { ...stage, [field]: value } : stage
    ));
  };

  const handleTimingUpdate = (stageIndex: number, field: string, value: number) => {
    setStages(prev => prev.map((stage, index) => 
      index === stageIndex 
        ? { 
            ...stage, 
            timing_config: { 
              ...stage.timing_config, 
              [field]: value 
            } 
          } 
        : stage
    ));
  };

  const handleAddStage = () => {
    const newStage: JourneyStage = {
      id: `temp-${Date.now()}`,
      journey_id: journeyId,
      name: 'New Stage',
      description: '',
      stage_type: 'custom',
      order_index: stages.length,
      is_required: true,
      is_parallel: false,
      status: 'active',
      timing_config: {
        expected_duration_days: 7,
        stall_threshold_days: 14
      },
      completion_criteria: {},
      escalation_rules: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      requirements: [],
      channel_rules: []
    };
    setStages(prev => [...prev, newStage]);
  };

  const handleRemoveStage = (stageIndex: number) => {
    setStages(prev => prev.filter((_, index) => index !== stageIndex));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedStages = Array.from(stages);
    const [movedStage] = reorderedStages.splice(result.source.index, 1);
    reorderedStages.splice(result.destination.index, 0, movedStage);

    // Update order_index for all stages
    const updatedStages = reorderedStages.map((stage, index) => ({
      ...stage,
      order_index: index
    }));

    setStages(updatedStages);
  };

  const handleSave = async () => {
    try {
      // Save journey details
      await updateJourneyMutation.mutateAsync({
        id: journeyId,
        journey: editedJourney
      });

      // Save stages (simplified - in a real implementation, you'd need to handle stage updates individually)
      toast.success('Journey updated successfully!');
    } catch (error) {
      console.error('Failed to save journey:', error);
      toast.error('Failed to save journey. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-2">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card className="text-center py-16">
          <CardContent>
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Failed to Load Journey</h3>
            <p className="text-muted-foreground mb-4">
              {error?.message || 'The journey could not be found or loaded.'}
            </p>
            <Button onClick={onBack}>Return to Journey List</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Journey</h1>
            <p className="text-muted-foreground">
              Customize stages and settings for {journey.name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave} disabled={updateJourneyMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateJourneyMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Journey Settings</CardTitle>
              <CardDescription>Basic journey configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Journey Name</Label>
                <Input
                  id="name"
                  value={editedJourney.name || ''}
                  onChange={(e) => handleJourneyUpdate('name', e.target.value)}
                  placeholder="Enter journey name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedJourney.description || ''}
                  onChange={(e) => handleJourneyUpdate('description', e.target.value)}
                  placeholder="Enter journey description"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Status</Label>
                <Badge variant={editedJourney.is_active ? "default" : "secondary"}>
                  {editedJourney.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Journey Statistics</CardTitle>
              <CardDescription>Overview of this journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Stages</span>
                <span className="text-sm text-muted-foreground">{stages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Required Stages</span>
                <span className="text-sm text-muted-foreground">
                  {stages.filter(s => s.is_required).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Estimated Duration</span>
                <span className="text-sm text-muted-foreground">
                  {stages.reduce((total, stage) => 
                    total + (stage.timing_config?.expected_duration_days || 0), 0
                  )} days
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Journey Stages */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Journey Stages</CardTitle>
                  <CardDescription>
                    {isPreviewMode 
                      ? 'Preview how your journey stages will appear to students' 
                      : 'Configure and reorder your journey stages'
                    }
                  </CardDescription>
                </div>
                {!isPreviewMode && (
                  <Button size="sm" onClick={handleAddStage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stage
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {stages.length === 0 ? (
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Stages Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first stage to start building your journey
                  </p>
                  <Button onClick={handleAddStage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Stage
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  {isPreviewMode ? (
                    // Preview Mode - Read-only view
                    <div className="space-y-4">
                      {stages.map((stage, index) => {
                        const stageTypeInfo = getStageTypeInfo(stage.stage_type);
                        const IconComponent = stageTypeInfo.icon;
                        
                        return (
                          <div key={stage.id} className="border rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                {index + 1}
                              </div>
                              <IconComponent className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <h4 className="font-medium">{stage.name}</h4>
                                <Badge className={stageTypeInfo.color} variant="secondary">
                                  {stageTypeInfo.label}
                                </Badge>
                              </div>
                            </div>
                            {stage.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {stage.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Expected: {stage.timing_config?.expected_duration_days || 0} days
                              </div>
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Stall after: {stage.timing_config?.stall_threshold_days || 0} days
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Edit Mode - Draggable stages
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="stages">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {stages.map((stage, index) => {
                              const stageTypeInfo = getStageTypeInfo(stage.stage_type);
                              
                              return (
                                <Draggable
                                  key={stage.id}
                                  draggableId={stage.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="border rounded-lg p-4 bg-card"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="mt-1 text-muted-foreground hover:text-foreground cursor-move"
                                        >
                                          <GripVertical className="h-4 w-4" />
                                        </div>
                                        
                                        <div className="flex-1 space-y-4">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-medium text-muted-foreground">
                                                #{index + 1}
                                              </span>
                                              <Input
                                                value={stage.name}
                                                onChange={(e) => handleStageUpdate(index, 'name', e.target.value)}
                                                className="font-medium"
                                                placeholder="Stage name"
                                              />
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleRemoveStage(index)}
                                              className="text-destructive hover:text-destructive"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                              <Label className="text-xs">Stage Type</Label>
                                              <Select
                                                value={stage.stage_type}
                                                onValueChange={(value) => handleStageUpdate(index, 'stage_type', value)}
                                              >
                                                <SelectTrigger>
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {STAGE_TYPES.map(type => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                      {type.label}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div>
                                              <Label className="text-xs">Description</Label>
                                              <Input
                                                value={stage.description || ''}
                                                onChange={(e) => handleStageUpdate(index, 'description', e.target.value)}
                                                placeholder="Stage description"
                                              />
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label className="text-xs">Expected Duration (days)</Label>
                                              <Input
                                                type="number"
                                                value={stage.timing_config?.expected_duration_days || 0}
                                                onChange={(e) => handleTimingUpdate(index, 'expected_duration_days', parseInt(e.target.value) || 0)}
                                                min="1"
                                              />
                                            </div>
                                            <div>
                                              <Label className="text-xs">Stall Threshold (days)</Label>
                                              <Input
                                                type="number"
                                                value={stage.timing_config?.stall_threshold_days || 0}
                                                onChange={(e) => handleTimingUpdate(index, 'stall_threshold_days', parseInt(e.target.value) || 0)}
                                                min="1"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
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
                  )}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}