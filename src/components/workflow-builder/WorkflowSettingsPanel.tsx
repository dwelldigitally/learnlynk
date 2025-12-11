import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Power, 
  Play, 
  Pause,
  Clock, 
  Users, 
  Calendar, 
  Target,
  RefreshCw,
  Filter,
  XCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface WorkflowSettings {
  isActive: boolean;
  triggerSettings: {
    triggerType: string;
    reEnrollment: boolean;
    reEnrollmentDelay: number;
    reEnrollmentDelayUnit: string;
  };
  enrollmentSettings: {
    targetAudience: string[];
    exclusionCriteria: string[];
    maxConcurrent: number;
    removeFromOtherWorkflows: boolean;
  };
  scheduleSettings: {
    runImmediately: boolean;
    businessHoursOnly: boolean;
    timezone: string;
    startDate: string;
    endDate: string;
    durationLimit: boolean;
    durationValue: number;
    durationUnit: string;
  };
  goalSettings: {
    goalType: string;
    exitOnGoal: boolean;
    exitOnUnsubscribe: boolean;
    exitOnBounce: boolean;
  };
}

interface WorkflowSettingsPanelProps {
  settings: WorkflowSettings;
  onSettingsChange: (settings: WorkflowSettings) => void;
  triggerCount: number;
  actionCount: number;
}

export function WorkflowSettingsPanel({ 
  settings, 
  onSettingsChange,
  triggerCount,
  actionCount 
}: WorkflowSettingsPanelProps) {
  const updateSettings = (path: string, value: any) => {
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onSettingsChange(newSettings);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Status Card */}
        <Card className={`border-2 ${settings.isActive ? 'border-green-500/50 bg-green-500/5' : 'border-muted'}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  settings.isActive ? 'bg-green-500/20' : 'bg-muted'
                }`}>
                  <Power className={`h-5 w-5 ${settings.isActive ? 'text-green-600' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">Workflow Status</CardTitle>
                  <CardDescription>
                    {settings.isActive 
                      ? 'This workflow is live and processing leads' 
                      : 'This workflow is paused and not processing'
                    }
                  </CardDescription>
                </div>
              </div>
              <Switch
                checked={settings.isActive}
                onCheckedChange={(checked) => updateSettings('isActive', checked)}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                {triggerCount} Trigger{triggerCount !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Play className="h-3 w-3" />
                {actionCount} Action{actionCount !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={['trigger', 'enrollment', 'schedule', 'goals']} className="space-y-4">
          {/* Trigger Settings */}
          <AccordionItem value="trigger" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Trigger Settings</div>
                  <div className="text-xs text-muted-foreground">When and how this workflow starts</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="space-y-2">
                <Label>Trigger Type</Label>
                <Select 
                  value={settings.triggerSettings.triggerType}
                  onValueChange={(value) => updateSettings('triggerSettings.triggerType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event-based (Lead created, status changed)</SelectItem>
                    <SelectItem value="scheduled">Scheduled (Run at specific times)</SelectItem>
                    <SelectItem value="manual">Manual (Triggered by user)</SelectItem>
                    <SelectItem value="webhook">Webhook (External trigger)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Re-enrollment</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow the same lead to enter this workflow multiple times
                  </p>
                </div>
                <Switch
                  checked={settings.triggerSettings.reEnrollment}
                  onCheckedChange={(checked) => updateSettings('triggerSettings.reEnrollment', checked)}
                />
              </div>

              {settings.triggerSettings.reEnrollment && (
                <div className="flex items-center gap-2 pl-4 border-l-2 border-muted">
                  <Label className="text-sm">Minimum delay:</Label>
                  <Input
                    type="number"
                    value={settings.triggerSettings.reEnrollmentDelay}
                    onChange={(e) => updateSettings('triggerSettings.reEnrollmentDelay', parseInt(e.target.value))}
                    className="w-20"
                    min={0}
                  />
                  <Select 
                    value={settings.triggerSettings.reEnrollmentDelayUnit}
                    onValueChange={(value) => updateSettings('triggerSettings.reEnrollmentDelayUnit', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">hours</SelectItem>
                      <SelectItem value="days">days</SelectItem>
                      <SelectItem value="weeks">weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Enrollment Settings */}
          <AccordionItem value="enrollment" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Enrollment Options</div>
                  <div className="text-xs text-muted-foreground">Who can enter this workflow</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All leads matching trigger</SelectItem>
                    <SelectItem value="new">New leads only</SelectItem>
                    <SelectItem value="unassigned">Unassigned leads</SelectItem>
                    <SelectItem value="custom">Custom filter...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Maximum Concurrent Enrollments</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.enrollmentSettings.maxConcurrent}
                    onChange={(e) => updateSettings('enrollmentSettings.maxConcurrent', parseInt(e.target.value))}
                    className="w-24"
                    min={0}
                  />
                  <span className="text-sm text-muted-foreground">
                    leads (0 = unlimited)
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Remove from Other Workflows</Label>
                  <p className="text-xs text-muted-foreground">
                    Unenroll leads from other active workflows when they enter this one
                  </p>
                </div>
                <Switch
                  checked={settings.enrollmentSettings.removeFromOtherWorkflows}
                  onCheckedChange={(checked) => updateSettings('enrollmentSettings.removeFromOtherWorkflows', checked)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Schedule Settings */}
          <AccordionItem value="schedule" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Schedule & Duration</div>
                  <div className="text-xs text-muted-foreground">When to run and for how long</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Run Immediately</Label>
                  <p className="text-xs text-muted-foreground">
                    Execute actions as soon as trigger fires
                  </p>
                </div>
                <Switch
                  checked={settings.scheduleSettings.runImmediately}
                  onCheckedChange={(checked) => updateSettings('scheduleSettings.runImmediately', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Business Hours Only</Label>
                  <p className="text-xs text-muted-foreground">
                    Only send communications during business hours
                  </p>
                </div>
                <Switch
                  checked={settings.scheduleSettings.businessHoursOnly}
                  onCheckedChange={(checked) => updateSettings('scheduleSettings.businessHoursOnly', checked)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date (Optional)</Label>
                  <Input
                    type="date"
                    value={settings.scheduleSettings.startDate}
                    onChange={(e) => updateSettings('scheduleSettings.startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <Input
                    type="date"
                    value={settings.scheduleSettings.endDate}
                    onChange={(e) => updateSettings('scheduleSettings.endDate', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Set Duration Limit</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically stop workflow after a period
                  </p>
                </div>
                <Switch
                  checked={settings.scheduleSettings.durationLimit}
                  onCheckedChange={(checked) => updateSettings('scheduleSettings.durationLimit', checked)}
                />
              </div>

              {settings.scheduleSettings.durationLimit && (
                <div className="flex items-center gap-2 pl-4 border-l-2 border-muted">
                  <Label className="text-sm">Run for:</Label>
                  <Input
                    type="number"
                    value={settings.scheduleSettings.durationValue}
                    onChange={(e) => updateSettings('scheduleSettings.durationValue', parseInt(e.target.value))}
                    className="w-20"
                    min={1}
                  />
                  <Select 
                    value={settings.scheduleSettings.durationUnit}
                    onValueChange={(value) => updateSettings('scheduleSettings.durationUnit', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">days</SelectItem>
                      <SelectItem value="weeks">weeks</SelectItem>
                      <SelectItem value="months">months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Goals & Exit Conditions */}
          <AccordionItem value="goals" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Goals & Exit Conditions</div>
                  <div className="text-xs text-muted-foreground">Define success and exit criteria</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="space-y-2">
                <Label>Workflow Goal</Label>
                <Select 
                  value={settings.goalSettings.goalType}
                  onValueChange={(value) => updateSettings('goalSettings.goalType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific goal</SelectItem>
                    <SelectItem value="application_submitted">Application submitted</SelectItem>
                    <SelectItem value="converted">Lead converted to student</SelectItem>
                    <SelectItem value="payment_received">Payment received</SelectItem>
                    <SelectItem value="enrolled">Student enrolled</SelectItem>
                    <SelectItem value="documents_complete">Documents complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.goalSettings.goalType !== 'none' && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exit on Goal Achieved</Label>
                    <p className="text-xs text-muted-foreground">
                      Remove lead from workflow when goal is reached
                    </p>
                  </div>
                  <Switch
                    checked={settings.goalSettings.exitOnGoal}
                    onCheckedChange={(checked) => updateSettings('goalSettings.exitOnGoal', checked)}
                  />
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <Label className="text-muted-foreground">Exit Conditions</Label>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Exit on Unsubscribe</span>
                  </div>
                  <Switch
                    checked={settings.goalSettings.exitOnUnsubscribe}
                    onCheckedChange={(checked) => updateSettings('goalSettings.exitOnUnsubscribe', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Exit on Email Bounce</span>
                  </div>
                  <Switch
                    checked={settings.goalSettings.exitOnBounce}
                    onCheckedChange={(checked) => updateSettings('goalSettings.exitOnBounce', checked)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  );
}
