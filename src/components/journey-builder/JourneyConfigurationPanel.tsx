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
  Settings, Clock, Target, AlertTriangle, CheckCircle2, 
  Calendar, Users, BookOpen, MapPin, Bell, Timer, 
  Sparkles, Loader2
} from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { toast } from 'sonner';

interface JourneyConfigurationPanelProps {
  onClose?: () => void;
}

export function JourneyConfigurationPanel({ onClose }: JourneyConfigurationPanelProps) {
  const { state, dispatch } = useBuilder();
  const { config } = state;
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);

  const handleConfigChange = (key: string, value: any) => {
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: {
        ...config,
        settings: {
          ...config.settings,
          [key]: value,
        },
      },
    });
  };

  const handleBenchmarkChange = (benchmarkType: string, key: string, value: any) => {
    const currentBenchmarks = config.settings?.benchmarks || {};
    
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: {
        ...config,
        settings: {
          ...config.settings,
          benchmarks: {
            ...currentBenchmarks,
            [benchmarkType]: {
              ...currentBenchmarks[benchmarkType],
              [key]: value,
            },
          },
        },
      },
    });
  };

  const handleAISuggestions = async () => {
    setIsLoadingAI(true);
    try {
      const response = await fetch('/functions/v1/ai-benchmark-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'journey',
          journeyConfig: {
            name: config.name,
            description: config.description,
            targetPrograms: settings.targetPrograms,
            studentType: settings.studentType,
            academicLevel: settings.academicLevel,
            applicationSeason: settings.applicationSeason,
            steps: config.elements.map(el => ({
              id: el.id,
              type: el.type,
              title: el.title,
              description: el.description,
              config: el.config,
            })),
          },
        }),
      });

      const data = await response.json();
      
      if (data.success && data.suggestions) {
        const suggestions = data.suggestions;
        
        // Apply AI suggestions to journey benchmarks
        if (suggestions.overall) {
          const newBenchmarks = {
            ...benchmarks,
            overall: {
              ...benchmarks.overall,
              ...suggestions.overall,
              applicationDeadline: suggestions.overall.applicationDeadline || benchmarks.overall?.applicationDeadline,
              decisionDeadline: suggestions.overall.decisionDeadline || benchmarks.overall?.decisionDeadline,
            },
          };

          if (suggestions.steps) {
            newBenchmarks.steps = {
              ...benchmarks.steps,
              ...suggestions.steps,
            };
          }

          dispatch({
            type: 'UPDATE_CONFIG',
            payload: {
              ...config,
              settings: {
                ...config.settings,
                benchmarks: newBenchmarks,
              },
            },
          });

          toast.success('AI benchmarks applied successfully!');
          
          // Show recommendations if available
          if (suggestions.recommendations && suggestions.recommendations.length > 0) {
            setTimeout(() => {
              toast.info(`AI Recommendations: ${suggestions.recommendations.join('. ')}`);
            }, 1000);
          }
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

  const settings = config.settings || {};
  const benchmarks = settings.benchmarks || {};

  return (
    <ScrollArea className="h-full max-w-full">
      <div className="p-4 sm:p-6 space-y-6 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Journey Configuration</h2>
              <p className="text-sm text-muted-foreground">Configure journey-wide settings and benchmarks</p>
            </div>
          </div>
        </div>

        {/* Journey Targeting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Journey Targeting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Target Programs</Label>
                <Select
                  value={settings.targetPrograms || ''}
                  onValueChange={(value) => handleConfigChange('targetPrograms', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select programs..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate Programs</SelectItem>
                    <SelectItem value="graduate">Graduate Programs</SelectItem>
                    <SelectItem value="doctoral">Doctoral Programs</SelectItem>
                    <SelectItem value="certificate">Certificate Programs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Student Type</Label>
                <Select
                  value={settings.studentType || ''}
                  onValueChange={(value) => handleConfigChange('studentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="domestic">Domestic Students</SelectItem>
                    <SelectItem value="international">International Students</SelectItem>
                    <SelectItem value="transfer">Transfer Students</SelectItem>
                    <SelectItem value="returning">Returning Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Academic Level</Label>
                <Select
                  value={settings.academicLevel || ''}
                  onValueChange={(value) => handleConfigChange('academicLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="freshman">Freshman</SelectItem>
                    <SelectItem value="sophomore">Sophomore</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Application Season</Label>
                <Select
                  value={settings.applicationSeason || ''}
                  onValueChange={(value) => handleConfigChange('applicationSeason', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select season..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall">Fall Intake</SelectItem>
                    <SelectItem value="spring">Spring Intake</SelectItem>
                    <SelectItem value="summer">Summer Intake</SelectItem>
                    <SelectItem value="rolling">Rolling Admissions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Active Journey</Label>
                <p className="text-xs text-muted-foreground">Enable this journey for new applications</p>
              </div>
              <Switch
                checked={settings.isActive !== false}
                onCheckedChange={(checked) => handleConfigChange('isActive', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Journey Timeline & Benchmarks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Journey Benchmarks
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAISuggestions}
                disabled={isLoadingAI || config.elements.length === 0}
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
          <CardContent className="space-y-6">
            {/* Overall Journey Benchmarks */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Overall Journey Metrics
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Total Duration Target</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      value={benchmarks.overall?.targetDays || ''}
                      onChange={(e) => handleBenchmarkChange('overall', 'targetDays', parseInt(e.target.value) || undefined)}
                      placeholder="30"
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
                      value={benchmarks.overall?.maxDays || ''}
                      onChange={(e) => handleBenchmarkChange('overall', 'maxDays', parseInt(e.target.value) || undefined)}
                      placeholder="45"
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground self-center whitespace-nowrap">days</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Target Completion Rate</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={benchmarks.overall?.completionRate || ''}
                      onChange={(e) => handleBenchmarkChange('overall', 'completionRate', parseInt(e.target.value) || undefined)}
                      placeholder="85"
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground self-center">%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Application Deadline</Label>
                  <DatePicker
                    date={benchmarks.overall?.applicationDeadline ? new Date(benchmarks.overall.applicationDeadline) : undefined}
                    onDateChange={(date) => handleBenchmarkChange('overall', 'applicationDeadline', date?.toISOString())}
                    placeholder="Set application deadline"
                    className="w-full mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Decision Deadline</Label>
                  <DatePicker
                    date={benchmarks.overall?.decisionDeadline ? new Date(benchmarks.overall.decisionDeadline) : undefined}
                    onDateChange={(date) => handleBenchmarkChange('overall', 'decisionDeadline', date?.toISOString())}
                    placeholder="Set decision deadline"
                    className="w-full mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Step-Level Benchmarks */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Default Step Benchmarks
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Default Step Duration</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      value={benchmarks.steps?.defaultDuration || ''}
                      onChange={(e) => handleBenchmarkChange('steps', 'defaultDuration', parseInt(e.target.value) || undefined)}
                      placeholder="3"
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground self-center whitespace-nowrap">days</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Stall Threshold</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      value={benchmarks.steps?.stallThreshold || ''}
                      onChange={(e) => handleBenchmarkChange('steps', 'stallThreshold', parseInt(e.target.value) || undefined)}
                      placeholder="7"
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground self-center whitespace-nowrap">days</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Auto-Escalation Threshold</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      value={benchmarks.steps?.escalationThreshold || ''}
                      onChange={(e) => handleBenchmarkChange('steps', 'escalationThreshold', parseInt(e.target.value) || undefined)}
                      placeholder="14"
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground self-center whitespace-nowrap">days</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Step Completion Target</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={benchmarks.steps?.completionTarget || ''}
                      onChange={(e) => handleBenchmarkChange('steps', 'completionTarget', parseInt(e.target.value) || undefined)}
                      placeholder="90"
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground self-center">%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Automation & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-Progress Enabled</Label>
                  <p className="text-xs text-muted-foreground">Automatically advance students when step requirements are met</p>
                </div>
                <Switch
                  checked={settings.autoProgress !== false}
                  onCheckedChange={(checked) => handleConfigChange('autoProgress', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Reminder Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send automated reminders for pending steps</p>
                </div>
                <Switch
                  checked={settings.reminderNotifications !== false}
                  onCheckedChange={(checked) => handleConfigChange('reminderNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Escalation Alerts</Label>
                  <p className="text-xs text-muted-foreground">Alert administrators when steps exceed thresholds</p>
                </div>
                <Switch
                  checked={settings.escalationAlerts !== false}
                  onCheckedChange={(checked) => handleConfigChange('escalationAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Progress Updates</Label>
                  <p className="text-xs text-muted-foreground">Notify students of their progress</p>
                </div>
                <Switch
                  checked={settings.progressUpdates !== false}
                  onCheckedChange={(checked) => handleConfigChange('progressUpdates', checked)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Reminder Frequency</Label>
                <Select
                  value={settings.reminderFrequency || 'daily'}
                  onValueChange={(value) => handleConfigChange('reminderFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="every-3-days">Every 3 Days</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Escalation Level</Label>
                <Select
                  value={settings.escalationLevel || 'manager'}
                  onValueChange={(value) => handleConfigChange('escalationLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                    <SelectItem value="custom">Custom Role</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Priority Level</Label>
                <Select
                  value={settings.priority || 'medium'}
                  onValueChange={(value) => handleConfigChange('priority', value)}
                >
                  <SelectTrigger>
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

              <div>
                <Label className="text-sm font-medium">Parallel Processing</Label>
                <Select
                  value={settings.parallelProcessing || 'sequential'}
                  onValueChange={(value) => handleConfigChange('parallelProcessing', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential Only</SelectItem>
                    <SelectItem value="limited">Limited Parallel</SelectItem>
                    <SelectItem value="full">Full Parallel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Journey Tags</Label>
              <Input
                value={settings.tags?.join(', ') || ''}
                onChange={(e) => handleConfigChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                placeholder="Enter tags separated by commas"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use tags to categorize and filter journeys
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Custom Instructions</Label>
              <Textarea
                value={settings.customInstructions || ''}
                onChange={(e) => handleConfigChange('customInstructions', e.target.value)}
                placeholder="Add any special instructions or notes for this journey..."
                rows={3}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Configuration Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-medium">{config.elements?.length || 0}</div>
                <div className="text-muted-foreground text-xs">Total Steps</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-medium">{benchmarks.overall?.targetDays || 'Not set'}</div>
                <div className="text-muted-foreground text-xs">Target Days</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-medium">{settings.studentType || 'All'}</div>
                <div className="text-muted-foreground text-xs">Student Type</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="font-medium">{settings.isActive !== false ? 'Active' : 'Inactive'}</div>
                <div className="text-muted-foreground text-xs">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}