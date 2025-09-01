import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, X, Clock, AlertTriangle, CheckCircle, 
  Calendar, Timer, Target, Bell, Users, 
  FileText, Video, Phone, Zap, Settings,
  Sparkles, Loader2
} from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { journeyElementTypes } from '@/config/elementTypes';
import { PropertySchema } from '@/types/universalBuilder';
import { toast } from 'sonner';

export function StepConfigurationPanel() {
  const { state, dispatch } = useBuilder();
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);
  
  if (!state.selectedElementId) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto">
              <FileText className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium">Select a Journey Step</div>
            <p className="text-xs text-muted-foreground max-w-xs">
              Choose a step from your journey to configure its properties, deadlines, and behavior
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedElement = state.config.elements.find(el => el.id === state.selectedElementId);
  if (!selectedElement) return null;

  const elementTypeConfig = journeyElementTypes.find(type => type.type === selectedElement.type);

  const handlePropertyChange = (key: string, value: any) => {
    const updates: any = {};
    
    if (key.includes('.')) {
      // Handle nested properties like 'timing.expectedDuration'
      const [parentKey, childKey] = key.split('.');
      updates[parentKey] = {
        ...selectedElement.config[parentKey],
        [childKey]: value,
      };
    } else if (key === 'title' || key === 'description') {
      // Handle base properties
      updates[key] = value;
    } else {
      // Handle config properties
      updates.config = {
        ...selectedElement.config,
        [key]: value,
      };
    }

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: { id: selectedElement.id, updates },
    });
  };

  const handleBenchmarkChange = (key: string, value: any) => {
    const benchmarks = selectedElement.config.benchmarks || {};
    handlePropertyChange('benchmarks', {
      ...benchmarks,
      [key]: value,
    });
  };

  const handleAddOption = () => {
    const currentOptions = selectedElement.config.options || [];
    const newOption = { label: 'New Option', value: `option_${currentOptions.length + 1}` };
    handlePropertyChange('options', [...currentOptions, newOption]);
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = selectedElement.config.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    handlePropertyChange('options', newOptions);
  };

  const handleUpdateOption = (index: number, field: 'label' | 'value', value: string) => {
    const currentOptions = selectedElement.config.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    handlePropertyChange('options', newOptions);
  };

  const handleAISuggestions = async () => {
    if (!selectedElement) return;

    setIsLoadingAI(true);
    try {
      const response = await fetch('/functions/v1/ai-benchmark-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'step',
          stepConfig: {
            step: {
              id: selectedElement.id,
              type: selectedElement.type,
              title: selectedElement.title,
              description: selectedElement.description,
              config: selectedElement.config,
            },
            journeyContext: {
              totalSteps: state.config.elements.length,
              targetPrograms: state.config.settings?.targetPrograms,
              studentType: state.config.settings?.studentType,
              academicLevel: state.config.settings?.academicLevel,
            },
          },
        }),
      });

      const data = await response.json();
      
      if (data.success && data.suggestions) {
        const suggestions = data.suggestions;
        
        // Apply AI suggestions to step configuration
        const updates: any = { config: { ...selectedElement.config } };

        if (suggestions.benchmarks) {
          updates.config.benchmarks = {
            ...selectedElement.config.benchmarks,
            ...suggestions.benchmarks,
          };
        }

        if (suggestions.behavior) {
          Object.keys(suggestions.behavior).forEach(key => {
            updates.config[key] = suggestions.behavior[key];
          });
        }

        dispatch({
          type: 'UPDATE_ELEMENT',
          payload: { id: selectedElement.id, updates },
        });

        toast.success('AI suggestions applied successfully!');
        
        // Show recommendations if available
        if (suggestions.recommendations && suggestions.recommendations.length > 0) {
          setTimeout(() => {
            toast.info(`AI Recommendations: ${suggestions.recommendations.join('. ')}`);
          }, 1000);
        }
      } else {
        throw new Error(data.error || 'Failed to get AI suggestions');
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Failed to get AI suggestions. Please try again.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const getValue = (key: string) => {
    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.');
      return selectedElement.config[parentKey]?.[childKey];
    }
    if (key === 'title' || key === 'description') {
      return selectedElement[key];
    }
    return selectedElement.config[key];
  };

  const renderPropertyField = (schema: PropertySchema) => {
    const value = getValue(schema.key);

    switch (schema.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handlePropertyChange(schema.key, e.target.value)}
            placeholder={schema.placeholder}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handlePropertyChange(schema.key, e.target.value)}
            placeholder={schema.placeholder}
            rows={3}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handlePropertyChange(schema.key, parseInt(e.target.value) || 0)}
            placeholder={schema.placeholder}
          />
        );

      case 'checkbox':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) => handlePropertyChange(schema.key, checked)}
          />
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => handlePropertyChange(schema.key, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {schema.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'array':
        if (schema.key === 'options') {
          return (
            <div className="space-y-2">
              {(value || []).map((option: any, index: number) => (
                <div key={index} className="flex gap-2 p-3 border border-border rounded-lg bg-muted/30">
                  <Input
                    placeholder="Label"
                    value={option.label}
                    onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={option.value}
                    onChange={(e) => handleUpdateOption(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveOption(index)}
                    className="h-10 w-10 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          );
        }
        return <div>Array type not implemented</div>;

      default:
        return <div>Unknown field type: {schema.type}</div>;
    }
  };

  const getStepIcon = () => {
    const iconMap = {
      'phone-interview': Phone,
      'video-interview': Video,
      'in-person-interview': Users,
      'document-upload': FileText,
      'verification': CheckCircle,
      'typing-test': Timer,
      'aptitude-test': Target,
      'skills-assessment': Target,
      'application-review': FileText,
      'committee-review': Users,
    };
    
    const IconComponent = iconMap[selectedElement.type as keyof typeof iconMap] || FileText;
    return IconComponent;
  };

  const getElementStatusInfo = () => {
    const { config } = selectedElement;
    const warnings = [];
    const info = [];

    // Check for common configuration issues
    if (!config.required && ['document-upload', 'verification'].includes(selectedElement.type)) {
      warnings.push('Consider making this step required for compliance');
    }

    if (config.duration && config.duration > 120) {
      warnings.push('Long duration may impact applicant experience');
    }

    if (config.schedulingRequired && !config.duration) {
      warnings.push('Set duration for scheduling accuracy');
    }

    if (!config.benchmarks?.expectedDuration) {
      warnings.push('Set expected duration for better tracking');
    }

    // Positive indicators
    if (config.autoAdvance) {
      info.push('Step will auto-advance when completed');
    }

    if (config.required) {
      info.push('Required step - blocks progress until completed');
    }

    if (config.benchmarks?.deadline) {
      info.push('Deadline benchmark configured');
    }

    return { warnings, info };
  };

  const { warnings, info } = getElementStatusInfo();
  const StepIcon = getStepIcon();
  const benchmarks = selectedElement.config.benchmarks || {};

  return (
    <ScrollArea className="h-full max-w-full">
      <div className="p-4 sm:p-6 space-y-6 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <StepIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Step Configuration</h2>
              <Badge variant="outline" className="text-xs">
                {selectedElement.type.replace('-', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Configure properties and benchmarks for this step</p>
          </div>
        </div>

        {/* Status Indicators */}
        {(warnings.length > 0 || info.length > 0) && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-800">{warning}</span>
                  </div>
                ))}
                {info.map((infoItem, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">{infoItem}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Step Title</Label>
              <Input
                value={selectedElement.title}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
                placeholder="Enter step title"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={selectedElement.description || ''}
                onChange={(e) => handlePropertyChange('description', e.target.value)}
                placeholder="Describe what happens in this step"
                rows={3}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Timing & Benchmarks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timing & Benchmarks
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAISuggestions}
                disabled={isLoadingAI}
                className="gap-2"
              >
                {isLoadingAI ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isLoadingAI ? 'Generating...' : 'AI Suggest'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Expected Duration</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    value={benchmarks.expectedDuration || ''}
                    onChange={(e) => handleBenchmarkChange('expectedDuration', parseInt(e.target.value) || undefined)}
                    placeholder="3"
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground self-center whitespace-nowrap">days</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Maximum Duration</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    value={benchmarks.maxDuration || ''}
                    onChange={(e) => handleBenchmarkChange('maxDuration', parseInt(e.target.value) || undefined)}
                    placeholder="7"
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground self-center whitespace-nowrap">days</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Step Deadline</Label>
                <DatePicker
                  date={benchmarks.deadline ? new Date(benchmarks.deadline) : undefined}
                  onDateChange={(date) => handleBenchmarkChange('deadline', date?.toISOString())}
                  placeholder="Set step deadline"
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Priority Level</Label>
                <Select
                  value={benchmarks.priority || 'medium'}
                  onValueChange={(value) => handleBenchmarkChange('priority', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Stall Alert After</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    value={benchmarks.stallAlert || ''}
                    onChange={(e) => handleBenchmarkChange('stallAlert', parseInt(e.target.value) || undefined)}
                    placeholder="5"
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground self-center whitespace-nowrap">days</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Escalation After</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="number"
                    value={benchmarks.escalationAlert || ''}
                    onChange={(e) => handleBenchmarkChange('escalationAlert', parseInt(e.target.value) || undefined)}
                    placeholder="10"
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground self-center whitespace-nowrap">days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Step Behavior
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Required Step</Label>
                  <p className="text-xs text-muted-foreground">Students cannot progress until this step is completed</p>
                </div>
                <Switch
                  checked={selectedElement.config.required !== false}
                  onCheckedChange={(checked) => handlePropertyChange('required', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-advance</Label>
                  <p className="text-xs text-muted-foreground">Automatically advance when step is completed</p>
                </div>
                <Switch
                  checked={selectedElement.config.autoAdvance || false}
                  onCheckedChange={(checked) => handlePropertyChange('autoAdvance', checked)}
                />
              </div>
              
              {selectedElement.type.includes('interview') && (
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Requires Scheduling</Label>
                    <p className="text-xs text-muted-foreground">This step needs to be scheduled before completion</p>
                  </div>
                  <Switch
                    checked={selectedElement.config.schedulingRequired || false}
                    onCheckedChange={(checked) => handlePropertyChange('schedulingRequired', checked)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Allow Skip</Label>
                  <p className="text-xs text-muted-foreground">Allow administrators to skip this step</p>
                </div>
                <Switch
                  checked={selectedElement.config.allowSkip || false}
                  onCheckedChange={(checked) => handlePropertyChange('allowSkip', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Send Reminders</Label>
                  <p className="text-xs text-muted-foreground">Send automated reminders for this step</p>
                </div>
                <Switch
                  checked={selectedElement.config.sendReminders !== false}
                  onCheckedChange={(checked) => handlePropertyChange('sendReminders', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Element-specific Configuration */}
        {elementTypeConfig?.configSchema && elementTypeConfig.configSchema.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Step-Specific Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {elementTypeConfig.configSchema.map((schema) => (
                <div key={schema.key} className="space-y-2">
                  <Label className="text-sm font-medium">
                    {schema.label}
                    {schema.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {renderPropertyField(schema)}
                  {schema.helpText && (
                    <p className="text-xs text-muted-foreground">{schema.helpText}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Escalation & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Escalation & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Escalation Rule</Label>
              <Select
                value={selectedElement.config.escalationRule || 'none'}
                onValueChange={(value) => handlePropertyChange('escalationRule', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No escalation</SelectItem>
                  <SelectItem value="supervisor">Escalate to supervisor</SelectItem>
                  <SelectItem value="manager">Escalate to manager</SelectItem>
                  <SelectItem value="director">Escalate to director</SelectItem>
                  <SelectItem value="automated">Automated reminder only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Notification Recipients</Label>
              <Textarea
                value={selectedElement.config.notificationRecipients || ''}
                onChange={(e) => handlePropertyChange('notificationRecipients', e.target.value)}
                placeholder="Enter email addresses separated by commas"
                rows={2}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Additional recipients for step notifications
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Custom Message</Label>
              <Textarea
                value={selectedElement.config.customMessage || ''}
                onChange={(e) => handlePropertyChange('customMessage', e.target.value)}
                placeholder="Custom message for this step..."
                rows={3}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}