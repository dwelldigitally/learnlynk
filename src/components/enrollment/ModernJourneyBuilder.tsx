import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, Plus, Trash2, Edit3, GripVertical, 
  Phone, Video, Users, FileText, CheckSquare, 
  Keyboard, Brain, Target, Eye, Bell, Clock,
  Save, Play, Settings, Users2, BookOpen
} from 'lucide-react';
import { BuilderConfig, JourneyElement } from '@/types/universalBuilder';
import { journeyElementTypes } from '@/config/elementTypes';
import { AcademicJourneyService } from '@/services/academicJourneyService';
import { toast } from 'sonner';
import { BuilderProvider, useBuilder } from '@/contexts/BuilderContext';
import { JourneyConfigurationPanel } from '@/components/journey-builder/JourneyConfigurationPanel';
import { StepConfigurationPanel } from '@/components/journey-builder/StepConfigurationPanel';

interface ModernJourneyBuilderProps {
  onBack: () => void;
}

function JourneyBuilderContent({ onBack }: ModernJourneyBuilderProps) {
  const { state, dispatch } = useBuilder();
  const [journeyName, setJourneyName] = useState('New Academic Journey');
  const [journeyDescription, setJourneyDescription] = useState('');
  const [showStepLibrary, setShowStepLibrary] = useState(false);

  // Initialize the builder with journey config
  useEffect(() => {
    dispatch({
      type: 'SET_CONFIG',
      payload: {
        name: journeyName,
        description: journeyDescription,
        type: 'journey',
        elements: [],
        settings: {},
      },
    });
  }, []);

  // Update config when name/description changes
  useEffect(() => {
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: {
        ...state.config,
        name: journeyName,
        description: journeyDescription,
      },
    });
  }, [journeyName, journeyDescription]);

  const journeySteps = state.config.elements;
  const selectedStep = state.selectedElementId ? journeySteps.find(el => el.id === state.selectedElementId) : null;

  const getStepIcon = (type: string) => {
    const iconMap = {
      'phone-interview': Phone,
      'video-interview': Video,
      'in-person-interview': Users,
      'document-upload': FileText,
      'verification': CheckSquare,
      'typing-test': Keyboard,
      'aptitude-test': Brain,
      'skills-assessment': Target,
      'application-review': Eye,
      'committee-review': Users2,
      'notification': Bell,
      'reminder': Clock,
    };
    
    const IconComponent = iconMap[type as keyof typeof iconMap] || FileText;
    return IconComponent;
  };

  const getStepColor = (type: string) => {
    const colorMap = {
      'phone-interview': 'bg-blue-500',
      'video-interview': 'bg-blue-600',
      'in-person-interview': 'bg-indigo-500',
      'document-upload': 'bg-green-500',
      'verification': 'bg-emerald-500',
      'typing-test': 'bg-purple-500',
      'aptitude-test': 'bg-violet-500',
      'skills-assessment': 'bg-pink-500',
      'application-review': 'bg-orange-500',
      'committee-review': 'bg-red-500',
      'notification': 'bg-yellow-500',
      'reminder': 'bg-amber-500',
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-500';
  };

  const getCategorySteps = () => {
    return journeyElementTypes.reduce((acc, element) => {
      if (!acc[element.category]) {
        acc[element.category] = [];
      }
      acc[element.category].push(element);
      return acc;
    }, {} as Record<string, typeof journeyElementTypes>);
  };

  const addStep = (elementType: string) => {
    const elementConfig = journeyElementTypes.find(e => e.type === elementType);
    if (!elementConfig) return;

    const newStep: JourneyElement = {
      id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: elementType,
      title: elementConfig.label,
      description: '',
      position: journeySteps.length,
      config: { ...elementConfig.defaultConfig },
      elementType: 'journey',
    } as JourneyElement;

    dispatch({
      type: 'ADD_ELEMENT',
      payload: newStep,
    });
    setShowStepLibrary(false);
    toast.success(`${elementConfig.label} added to journey`);
  };

  const removeStep = (stepId: string) => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: stepId,
    });
    toast.success('Step removed from journey');
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const currentIndex = journeySteps.findIndex(step => step.id === stepId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= journeySteps.length) return;

    dispatch({
      type: 'REORDER_ELEMENTS',
      payload: { oldIndex: currentIndex, newIndex },
    });
  };

  const handleSave = async () => {
    if (!journeyName.trim()) {
      toast.error('Please enter a journey name');
      return;
    }

    if (journeySteps.length === 0) {
      toast.error('Please add at least one step to your journey');
      return;
    }

    const config = state.config;

    try {
      // Create the academic journey in the database
      const journey = await AcademicJourneyService.createAcademicJourney({
        name: config.name,
        description: config.description,
        is_active: true,
        version: 1,
        metadata: { builder_config: config }
      });

      // Create journey stages for each step
      for (let i = 0; i < config.elements.length; i++) {
        const step = config.elements[i];
        await AcademicJourneyService.createJourneyStage({
          journey_id: journey.id,
          name: step.title || `Step ${i + 1}`,
          description: step.config?.description || '',
          stage_type: step.config?.stage_type || 'custom',
          order_index: i,
          is_required: step.config?.is_required !== false,
          is_parallel: false,
          status: 'active',
          timing_config: {
            stall_threshold_days: step.config?.stall_threshold_days || 7,
            expected_duration_days: step.config?.expected_duration_days || 3
          },
          completion_criteria: step.config?.completion_criteria || {},
          escalation_rules: step.config?.escalation_rules || {}
        });
      }

      toast.success('Journey created successfully!');
      onBack();
    } catch (error) {
      console.error('Error saving journey:', error);
      toast.error('Failed to save journey. Please try again.');
    }
  };

  const categorySteps = getCategorySteps();

  return (
    <div className="min-h-screen bg-gradient-hero overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-border/50">
        <div className="w-full max-w-none px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <Button variant="ghost" onClick={onBack} className="gap-2 flex-shrink-0">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Manager</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Journey Builder</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Create step-by-step academic enrollment workflows</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={() => setShowStepLibrary(true)} 
                className="gap-2 flex-1 sm:flex-initial"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Step</span>
                <span className="sm:hidden">Add</span>
              </Button>
              <Button 
                onClick={handleSave} 
                className="gap-2 bg-gradient-primary flex-1 sm:flex-initial"
                size="sm"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Journey</span>
                <span className="sm:hidden">Save</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-none px-4 sm:px-6 py-6 sm:py-8 overflow-x-hidden space-y-6">
        {/* Journey Configuration - Now on top */}
        <div className="glass-card p-4 sm:p-6 rounded-xl max-w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold truncate">Journey Details</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: 'journey-config' })}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="journeyName" className="text-sm font-medium">Journey Name</Label>
              <Input
                id="journeyName"
                value={journeyName}
                onChange={(e) => setJourneyName(e.target.value)}
                placeholder="Enter journey name..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="journeyDescription" className="text-sm font-medium">Description</Label>
              <Textarea
                id="journeyDescription"
                value={journeyDescription}
                onChange={(e) => setJourneyDescription(e.target.value)}
                placeholder="Describe this academic journey..."
                rows={3}
                className="mt-1"
              />
            </div>
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Journey Summary</span>
                <Badge variant="outline">{journeySteps.length} steps</Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3 w-3" />
                  <span>Total Steps: {journeySteps.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Est. Duration: {Math.max(journeySteps.length * 2, 1)} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 max-w-none">
          {/* Journey Steps */}
          <div className="xl:col-span-2 order-1">
            <div className="glass-card p-4 sm:p-6 rounded-xl max-w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-lg font-semibold">Journey Steps</h3>
                <Button 
                  onClick={() => setShowStepLibrary(true)}
                  className="gap-2 bg-gradient-primary w-full sm:w-auto"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Step
                </Button>
              </div>

              {journeySteps.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Start Building Your Journey</h4>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
                    Add steps to create a structured enrollment process. Students will progress through each step sequentially.
                  </p>
                  <Button 
                    onClick={() => setShowStepLibrary(true)}
                    className="gap-2 bg-gradient-primary"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Step
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {journeySteps.map((step, index) => {
                    const StepIcon = getStepIcon(step.type);
                    const stepColor = getStepColor(step.type);
                    
                    return (
                      <div key={step.id} className="relative">
                        {/* Connection line */}
                        {index < journeySteps.length - 1 && (
                          <div className="absolute left-6 top-16 sm:top-20 w-0.5 h-6 sm:h-8 bg-border z-0" />
                        )}
                        
                        <div className="relative bg-card border border-border/50 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow max-w-full">
                          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                            {/* Step number and icon */}
                            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stepColor} rounded-xl flex items-center justify-center relative z-10`}>
                                <StepIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                Step {index + 1}
                              </span>
                            </div>

                            {/* Step details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground truncate">{step.title}</h4>
                                <Badge variant="outline" className="text-xs whitespace-nowrap">
                                  {step.config?.required !== false ? 'Required' : 'Optional'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {step.description || 'No description provided'}
                              </p>
                              {step.config?.duration && (
                                <div className="flex items-center gap-1 mt-2">
                                  <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs text-muted-foreground">
                                    {step.config.duration} minutes
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-center gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: step.id })}
                                className="h-8 w-8 p-0"
                                title="Configure step"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStep(step.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="flex items-center gap-0.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveStep(step.id, 'up')}
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0"
                                >
                                  <GripVertical className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveStep(step.id, 'down')}
                                  disabled={index === journeySteps.length - 1}
                                  className="h-6 w-6 p-0"
                                >
                                  <GripVertical className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="xl:col-span-1 order-2">
            {state.selectedElementId === 'journey-config' ? (
              <JourneyConfigurationPanel />
            ) : state.selectedElementId ? (
              <StepConfigurationPanel />
            ) : (
              <div className="glass-card p-4 sm:p-6 rounded-xl h-fit max-w-full">
                <div className="text-center">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Settings className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium mb-2">Configuration Panel</h4>
                  <p className="text-sm text-muted-foreground">
                    Select a step or click the settings icon to configure journey properties
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Library Dialog */}
      <Dialog open={showStepLibrary} onOpenChange={setShowStepLibrary}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">Choose Journey Steps</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6 p-1">
              {Object.entries(categorySteps).map(([category, steps]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {steps.map((step) => {
                      const StepIcon = getStepIcon(step.type);
                      const stepColor = getStepColor(step.type);
                      
                      return (
                        <Card
                          key={step.type} 
                          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50"
                          onClick={() => addStep(step.type)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 ${stepColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <StepIcon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-foreground mb-1">{step.label}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {getStepDescription(step.type)}
                                </p>
                              </div>
                              <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ModernJourneyBuilder(props: ModernJourneyBuilderProps) {
  return (
    <BuilderProvider>
      <JourneyBuilderContent {...props} />
    </BuilderProvider>
  );
}

function getStepDescription(type: string): string {
  const descriptions = {
    'phone-interview': 'Schedule and conduct phone interviews with applicants',
    'video-interview': 'Set up video interviews using Zoom, Teams, or Google Meet',
    'in-person-interview': 'Arrange face-to-face interviews at your campus',
    'document-upload': 'Require specific documents like transcripts or resumes',
    'verification': 'Verify identity, academic records, or background checks',
    'typing-test': 'Assess typing speed and accuracy with WPM requirements',
    'aptitude-test': 'Test general, numerical, verbal, or logical reasoning',
    'skills-assessment': 'Evaluate specific technical or practical skills',
    'application-review': 'Single or multiple reviewer evaluation process',
    'committee-review': 'Multi-member committee decision process',
    'notification': 'Send automated notifications via email, SMS, or push',
    'reminder': 'Schedule reminder messages for pending tasks',
  };
  return descriptions[type as keyof typeof descriptions] || 'Configure this journey step';
}