import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Plus, Trash2, Edit3, GripVertical, 
  Phone, Video, Users, FileText, CheckSquare, 
  Keyboard, Brain, Target, Eye, Bell, Clock,
  Save, Play, Settings, Users2, BookOpen,
  ArrowDown, ArrowRight, Zap, Filter,
  MoreHorizontal, Copy, TestTube, Calendar
} from 'lucide-react';
import { BuilderConfig, JourneyElement, UniversalElement } from '@/types/universalBuilder';
import { journeyElementTypes } from '@/config/elementTypes';
import { AcademicJourneyService } from '@/services/academicJourneyService';
import { toast } from 'sonner';
import { BuilderProvider, useBuilder } from '@/contexts/BuilderContext';

interface HubSpotJourneyBuilderProps {
  onBack: () => void;
}

function JourneyBuilderContent({ onBack }: HubSpotJourneyBuilderProps) {
  const { state, dispatch } = useBuilder();
  const [journeyName, setJourneyName] = useState('New Academic Journey');
  const [journeyDescription, setJourneyDescription] = useState('');
  const [showStepLibrary, setShowStepLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('workflow');

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
      'phone-interview': 'from-blue-500 to-blue-600',
      'video-interview': 'from-blue-600 to-blue-700',
      'in-person-interview': 'from-indigo-500 to-indigo-600',
      'document-upload': 'from-green-500 to-green-600',
      'verification': 'from-emerald-500 to-emerald-600',
      'typing-test': 'from-purple-500 to-purple-600',
      'aptitude-test': 'from-violet-500 to-violet-600',
      'skills-assessment': 'from-pink-500 to-pink-600',
      'application-review': 'from-orange-500 to-orange-600',
      'committee-review': 'from-red-500 to-red-600',
      'notification': 'from-yellow-500 to-yellow-600',
      'reminder': 'from-amber-500 to-amber-600',
    };
    return colorMap[type as keyof typeof colorMap] || 'from-gray-500 to-gray-600';
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

  const filteredSteps = () => {
    if (selectedCategory === 'all') return journeyElementTypes;
    return journeyElementTypes.filter(step => step.category === selectedCategory);
  };

  const addStep = (elementType: string) => {
    const elementConfig = journeyElementTypes.find(e => e.type === elementType);
    if (!elementConfig) return;

    const newStep: UniversalElement = {
      id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: elementType as any,
      title: elementConfig.label,
      description: '',
      position: journeySteps.length,
      config: { ...elementConfig.defaultConfig },
      elementType: 'journey',
    };

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

  const duplicateStep = (step: UniversalElement) => {
    const duplicatedStep: UniversalElement = {
      ...step,
      id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${step.title} (Copy)`,
      position: journeySteps.length,
    };

    dispatch({
      type: 'ADD_ELEMENT',
      payload: duplicatedStep,
    });
    toast.success('Step duplicated');
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
  const categories = ['all', ...Object.keys(categorySteps)];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* HubSpot-style Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="gap-2 hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4" />
                Back to journeys
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Journey Builder</h1>
                <p className="text-sm text-slate-500">Design your enrollment workflow</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <TestTube className="h-4 w-4" />
                Test
              </Button>
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Step Library */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-slate-900">Add actions</h3>
              <Badge variant="secondary" className="text-xs">
                {filteredSteps().length} available
              </Badge>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {Object.keys(categorySteps).map(category => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredSteps().map((elementType) => {
                const StepIcon = getStepIcon(elementType.type);
                const stepGradient = getStepColor(elementType.type);
                
                return (
                  <Card 
                    key={elementType.type}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border-slate-200 hover:border-slate-300"
                    onClick={() => addStep(elementType.type)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stepGradient} flex items-center justify-center flex-shrink-0`}>
                          <StepIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-slate-900 mb-1">{elementType.label}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {elementType.category} - Click to add to your journey
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Header */}
          <div className="bg-white border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <Input
                    value={journeyName}
                    onChange={(e) => setJourneyName(e.target.value)}
                    className="text-lg font-medium border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                    placeholder="Journey name"
                  />
                  <Input
                    value={journeyDescription}
                    onChange={(e) => setJourneyDescription(e.target.value)}
                    className="text-sm text-slate-500 border-none p-0 h-auto focus-visible:ring-0 bg-transparent mt-1"
                    placeholder="Add a description..."
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Zap className="h-3 w-3" />
                  {journeySteps.length} steps
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  ~{Math.max(journeySteps.length * 2, 1)} days
                </Badge>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="p-8">
              {journeySteps.length === 0 ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Zap className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Start building your journey</h3>
                    <p className="text-slate-500 mb-6">
                      Add actions from the left sidebar to create your enrollment workflow. 
                      Students will progress through each step automatically.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Choose an action to get started</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Start Node */}
                  <div className="flex items-center justify-center">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Journey Start
                    </div>
                  </div>

                  {/* Steps */}
                  {journeySteps.map((step, index) => {
                    const StepIcon = getStepIcon(step.type);
                    const stepGradient = getStepColor(step.type);
                    const isSelected = state.selectedElementId === step.id;
                    
                    return (
                      <div key={step.id} className="relative">
                        {/* Connection Arrow */}
                        {index === 0 && (
                          <div className="flex justify-center mb-4">
                            <ArrowDown className="h-6 w-6 text-slate-400" />
                          </div>
                        )}

                        {/* Step Card */}
                        <Card 
                          className={`max-w-lg mx-auto transition-all duration-200 ${
                            isSelected 
                              ? 'ring-2 ring-orange-500 shadow-lg' 
                              : 'hover:shadow-md border-slate-200'
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stepGradient} flex items-center justify-center flex-shrink-0`}>
                                <StepIcon className="h-6 w-6 text-white" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium text-slate-900">{step.title}</h4>
                                  <Badge variant={step.config?.required !== false ? "default" : "secondary"} className="text-xs">
                                    {step.config?.required !== false ? 'Required' : 'Optional'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-500 mb-3">
                                  {step.description || 'No description provided'}
                                </p>
                                
                                {/* Step Meta */}
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                  <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                                    Step {index + 1}
                                  </div>
                                  {step.config?.duration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {step.config.duration} min
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Actions Menu */}
                              <div className="flex items-center">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Step Actions</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-2">
                                      <Button 
                                        variant="outline" 
                                        onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: step.id })}
                                        className="justify-start gap-2"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                        Edit settings
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        onClick={() => duplicateStep(step)}
                                        className="justify-start gap-2"
                                      >
                                        <Copy className="h-4 w-4" />
                                        Duplicate
                                      </Button>
                                      <Separator />
                                      <Button 
                                        variant="outline" 
                                        onClick={() => removeStep(step.id)}
                                        className="justify-start gap-2 text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Connection Arrow */}
                        {index < journeySteps.length - 1 && (
                          <div className="flex justify-center my-4">
                            <ArrowDown className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* End Node */}
                  {journeySteps.length > 0 && (
                    <>
                      <div className="flex justify-center my-4">
                        <ArrowDown className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                          Journey Complete
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Step Configuration */}
        {selectedStep && (
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900">Step settings</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: null })}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                <div>
                  <Label htmlFor="stepTitle" className="text-sm font-medium text-slate-700">Step name</Label>
                  <Input
                    id="stepTitle"
                    value={selectedStep.title}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_ELEMENT',
                      payload: { 
                        id: selectedStep.id, 
                        updates: { title: e.target.value } 
                      }
                    })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="stepDescription" className="text-sm font-medium text-slate-700">Description</Label>
                  <Textarea
                    id="stepDescription"
                    value={selectedStep.description || ''}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_ELEMENT',
                      payload: { 
                        id: selectedStep.id, 
                        updates: { description: e.target.value } 
                      }
                    })}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Required step</Label>
                  <div className="mt-2">
                    <Select
                      value={selectedStep.config?.required !== false ? 'true' : 'false'}
                      onValueChange={(value) => dispatch({
                        type: 'UPDATE_ELEMENT',
                        payload: { 
                          id: selectedStep.id, 
                          updates: { 
                            config: { ...selectedStep.config, required: value === 'true' } 
                          } 
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Required</SelectItem>
                        <SelectItem value="false">Optional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedStep.config?.duration !== undefined && (
                  <div>
                    <Label htmlFor="stepDuration" className="text-sm font-medium text-slate-700">Duration (minutes)</Label>
                    <Input
                      id="stepDuration"
                      type="number"
                      value={selectedStep.config.duration || ''}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_ELEMENT',
                        payload: { 
                          id: selectedStep.id, 
                          updates: { 
                            config: { ...selectedStep.config, duration: parseInt(e.target.value) || 0 } 
                          } 
                        }
                      })}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}

export function HubSpotJourneyBuilder({ onBack }: HubSpotJourneyBuilderProps) {
  // Force refresh marker: v2.0-hubspot-style
  return (
    <BuilderProvider>
      <JourneyBuilderContent onBack={onBack} />
    </BuilderProvider>
  );
}