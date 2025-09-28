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
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, Plus, Trash2, Edit3, GripVertical, 
  Phone, Video, Users, FileText, CheckSquare, 
  Keyboard, Brain, Target, Eye, Bell, Clock,
  Save, Play, Settings, Users2, BookOpen,
  ArrowDown, ArrowRight, Zap, Filter,
  MoreHorizontal, Copy, TestTube, Calendar as CalendarIcon,
  AlertTriangle, Timer,
  CheckCircle, SkipForward, Mail, Sparkles
} from 'lucide-react';
import { BuilderConfig, JourneyElement, UniversalElement } from '@/types/universalBuilder';
import { journeyElementTypes } from '@/config/elementTypes';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BuilderProvider, useBuilder } from '@/contexts/BuilderContext';

interface PracticumJourneyBuilderProps {
  onBack?: () => void;
}

function PracticumJourneyBuilderContent({ onBack }: PracticumJourneyBuilderProps) {
  const { state, dispatch } = useBuilder();
  const navigate = useNavigate();
  const location = useLocation();
  const { journeyId } = useParams();
  const { toast } = useToast();
  const { session } = useAuth();
  
  const [journeyName, setJourneyName] = useState('New Practicum Journey');
  const [journeyDescription, setJourneyDescription] = useState('');
  const [showStepLibrary, setShowStepLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('workflow');

  // Get initial config from location state or create new
  const initialConfig = location.state?.journey || undefined;

  // Initialize the builder with journey config
  useEffect(() => {
    if (initialConfig) {
      setJourneyName(initialConfig.name || 'New Practicum Journey');
      setJourneyDescription(initialConfig.description || '');
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          name: initialConfig.name || 'New Practicum Journey',
          description: initialConfig.description || '',
          type: 'journey',
          elements: initialConfig.elements || [],
          settings: initialConfig.settings || {},
        },
      });
    } else {
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
    }
  }, [initialConfig]);

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
    toast({
      title: "Success",
      description: `${elementConfig.label} added to practicum journey`,
    });
  };

  const removeStep = (stepId: string) => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: stepId,
    });
    toast({
      title: "Success",
      description: 'Step removed from practicum journey',
    });
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
    toast({
      title: "Success",
      description: 'Step duplicated',
    });
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
      toast({
        title: "Error",
        description: 'Please enter a journey name',
        variant: "destructive",
      });
      return;
    }

    if (journeySteps.length === 0) {
      toast({
        title: "Error",
        description: 'Please add at least one step to your journey',
        variant: "destructive",
      });
      return;
    }

    const config = state.config;

    try {
      const journeyData = {
        user_id: session?.user?.id,
        journey_name: config.name,
        steps: JSON.parse(JSON.stringify(config.elements || [])) as any,
        is_active: true,
        is_default: false
      };

      if (journeyId) {
        const { error } = await supabase
          .from('practicum_journeys')
          .update(journeyData)
          .eq('id', journeyId);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Practicum journey updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('practicum_journeys')
          .insert([journeyData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Practicum journey created successfully",
        });
      }
      
      handleCancel();
    } catch (error) {
      console.error('Error saving practicum journey:', error);
      toast({
        title: "Error",
        description: "Failed to save practicum journey",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/admin/practicum/journeys');
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
              <Button variant="ghost" onClick={handleCancel} className="gap-2 hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4" />
                Back to practicum journeys
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Practicum Journey Builder</h1>
                <p className="text-sm text-slate-500">Design your practicum workflow</p>
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
                            {elementType.category} - Click to add to your practicum journey
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
                    placeholder="Practicum journey name"
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
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Start building your practicum journey</h3>
                    <p className="text-slate-500 mb-6">
                      Add actions from the left sidebar to create your practicum workflow. 
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
                      Practicum Journey Start
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
                          className={`max-w-lg mx-auto transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? 'ring-2 ring-orange-500 shadow-lg' 
                              : 'hover:shadow-md hover:border-slate-300 border-slate-200'
                          }`}
                          onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: step.id })}
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
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => e.stopPropagation()}
                                    >
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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          dispatch({ type: 'SELECT_ELEMENT', payload: step.id });
                                        }}
                                        className="justify-start gap-2"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                        Edit settings
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          duplicateStep(step);
                                        }}
                                        className="justify-start gap-2"
                                      >
                                        <Copy className="h-4 w-4" />
                                        Duplicate
                                      </Button>
                                      <Separator />
                                      <Button 
                                        variant="outline" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeStep(step.id);
                                        }}
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
                          Practicum Journey Complete
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
                {/* Basic Information */}
                <div className="space-y-4">
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
                </div>

                <Separator />

                {/* Timing & Benchmarks */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-slate-600" />
                    <h4 className="font-medium text-slate-900">Timing & Benchmarks</h4>
                    <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 ml-auto">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Suggest
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm text-slate-600">Expected Duration</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="number"
                          value={selectedStep.config?.expectedDuration || '3'}
                          onChange={(e) => dispatch({
                            type: 'UPDATE_ELEMENT',
                            payload: { 
                              id: selectedStep.id, 
                              updates: { 
                                config: { ...selectedStep.config, expectedDuration: parseInt(e.target.value) || 3 } 
                              } 
                            }
                          })}
                          className="flex-1"
                          min="1"
                        />
                        <span className="text-sm text-slate-500">days</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-slate-600">Maximum Duration</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="number"
                          value={selectedStep.config?.maximumDuration || '7'}
                          onChange={(e) => dispatch({
                            type: 'UPDATE_ELEMENT',
                            payload: { 
                              id: selectedStep.id, 
                              updates: { 
                                config: { ...selectedStep.config, maximumDuration: parseInt(e.target.value) || 7 } 
                              } 
                            }
                          })}
                          className="flex-1"
                          min="1"
                        />
                        <span className="text-sm text-slate-500">days</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm text-slate-600">Step Deadline</Label>
                      <div className="mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedStep.config?.deadline ? format(new Date(selectedStep.config.deadline), "PPP") : "Set step deadline"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedStep.config?.deadline ? new Date(selectedStep.config.deadline) : undefined}
                              onSelect={(date) => dispatch({
                                type: 'UPDATE_ELEMENT',
                                payload: { 
                                  id: selectedStep.id, 
                                  updates: { 
                                    config: { ...selectedStep.config, deadline: date?.toISOString() } 
                                  } 
                                }
                              })}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-slate-600">Priority Level</Label>
                      <Select
                        value={selectedStep.config?.priority || 'medium'}
                        onValueChange={(value) => dispatch({
                          type: 'UPDATE_ELEMENT',
                          payload: { 
                            id: selectedStep.id, 
                            updates: { 
                              config: { ...selectedStep.config, priority: value } 
                            } 
                          }
                        })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="urgent">Urgent Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm text-slate-600">Stall Alert After</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="number"
                          value={selectedStep.config?.stallAlert || '5'}
                          onChange={(e) => dispatch({
                            type: 'UPDATE_ELEMENT',
                            payload: { 
                              id: selectedStep.id, 
                              updates: { 
                                config: { ...selectedStep.config, stallAlert: parseInt(e.target.value) || 5 } 
                              } 
                            }
                          })}
                          className="flex-1"
                          min="1"
                        />
                        <span className="text-sm text-slate-500">days</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-slate-600">Escalation After</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="number"
                          value={selectedStep.config?.escalationAfter || '10'}
                          onChange={(e) => dispatch({
                            type: 'UPDATE_ELEMENT',
                            payload: { 
                              id: selectedStep.id, 
                              updates: { 
                                config: { ...selectedStep.config, escalationAfter: parseInt(e.target.value) || 10 } 
                              } 
                            }
                          })}
                          className="flex-1"
                          min="1"
                        />
                        <span className="text-sm text-slate-500">days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Step Behavior */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-slate-600" />
                    <h4 className="font-medium text-slate-900">Step Behavior</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-700">Required Step</Label>
                        <p className="text-xs text-slate-500">Students cannot progress until this step is completed</p>
                      </div>
                      <Switch
                        checked={selectedStep.config?.required !== false}
                        onCheckedChange={(checked) => dispatch({
                          type: 'UPDATE_ELEMENT',
                          payload: { 
                            id: selectedStep.id, 
                            updates: { 
                              config: { ...selectedStep.config, required: checked } 
                            } 
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-700">Auto-advance</Label>
                        <p className="text-xs text-slate-500">Automatically advance when step is completed</p>
                      </div>
                      <Switch
                        checked={selectedStep.config?.autoAdvance || false}
                        onCheckedChange={(checked) => dispatch({
                          type: 'UPDATE_ELEMENT',
                          payload: { 
                            id: selectedStep.id, 
                            updates: { 
                              config: { ...selectedStep.config, autoAdvance: checked } 
                            } 
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-700">Allow Skip</Label>
                        <p className="text-xs text-slate-500">Allow administrators to skip this step</p>
                      </div>
                      <Switch
                        checked={selectedStep.config?.allowSkip || false}
                        onCheckedChange={(checked) => dispatch({
                          type: 'UPDATE_ELEMENT',
                          payload: { 
                            id: selectedStep.id, 
                            updates: { 
                              config: { ...selectedStep.config, allowSkip: checked } 
                            } 
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-slate-700">Send Reminders</Label>
                        <p className="text-xs text-slate-500">Send automated reminders for this step</p>
                      </div>
                      <Switch
                        checked={selectedStep.config?.sendReminders !== false}
                        onCheckedChange={(checked) => dispatch({
                          type: 'UPDATE_ELEMENT',
                          payload: { 
                            id: selectedStep.id, 
                            updates: { 
                              config: { ...selectedStep.config, sendReminders: checked } 
                            } 
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Step-Specific Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-slate-600" />
                    <h4 className="font-medium text-slate-900">Step-Specific Configuration</h4>
                  </div>

                  {/* Dynamic configuration based on step type */}
                  {selectedStep.type === 'document-upload' && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-slate-600">Document Type</Label>
                        <Select
                          value={selectedStep.config?.documentType || 'resume'}
                          onValueChange={(value) => dispatch({
                            type: 'UPDATE_ELEMENT',
                            payload: { 
                              id: selectedStep.id, 
                              updates: { 
                                config: { ...selectedStep.config, documentType: value } 
                              } 
                            }
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="resume">Resume/CV</SelectItem>
                            <SelectItem value="transcript">Transcript</SelectItem>
                            <SelectItem value="portfolio">Portfolio</SelectItem>
                            <SelectItem value="certification">Certification</SelectItem>
                            <SelectItem value="other">Other Documents</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedStep.type === 'verification' && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-slate-600">Verification Type</Label>
                        <Select
                          value={selectedStep.config?.verificationType || 'identity'}
                          onValueChange={(value) => dispatch({
                            type: 'UPDATE_ELEMENT',
                            payload: { 
                              id: selectedStep.id, 
                              updates: { 
                                config: { ...selectedStep.config, verificationType: value } 
                              } 
                            }
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="identity">Identity Verification</SelectItem>
                            <SelectItem value="background">Background Check</SelectItem>
                            <SelectItem value="reference">Reference Check</SelectItem>
                            <SelectItem value="credential">Credential Verification</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {(selectedStep.type.includes('interview') || selectedStep.type.includes('test')) && (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-slate-600">Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={selectedStep.config?.duration || '30'}
                          onChange={(e) => dispatch({
                            type: 'UPDATE_ELEMENT',
                            payload: { 
                              id: selectedStep.id, 
                              updates: { 
                                config: { ...selectedStep.config, duration: parseInt(e.target.value) || 30 } 
                              } 
                            }
                          })}
                          className="mt-1"
                          min="1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}

export function PracticumJourneyBuilder() {
  return (
    <BuilderProvider>
      <PracticumJourneyBuilderContent />
    </BuilderProvider>
  );
}