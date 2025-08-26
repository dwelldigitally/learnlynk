import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { StopCircle } from "lucide-react";

interface StopTriggersConfigProps {
  settings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
}

const AVAILABLE_TRIGGERS = [
  { value: 'unsubscribe', label: 'Unsubscribe Request', description: 'Student requests to stop communications' },
  { value: 'complaint', label: 'Complaint Filed', description: 'Formal complaint about communications' },
  { value: 'bounce', label: 'Hard Bounce', description: 'Email permanently bounced' },
  { value: 'spam_report', label: 'Spam Report', description: 'Email marked as spam' },
  { value: 'do_not_call', label: 'Do Not Call Request', description: 'Request to stop phone communications' },
  { value: 'enrollment_complete', label: 'Enrollment Complete', description: 'Student successfully enrolled' },
  { value: 'program_withdrawn', label: 'Program Withdrawal', description: 'Student withdrew from program' }
];

const EXCEPTION_TYPES = [
  { value: 'urgent_deadline', label: 'Urgent Deadline', description: 'Critical deadline communications' },
  { value: 'financial_aid', label: 'Financial Aid', description: 'Important financial aid information' },
  { value: 'legal_notice', label: 'Legal Notice', description: 'Required legal communications' },
  { value: 'emergency', label: 'Emergency', description: 'Emergency notifications' }
];

const StopTriggersConfig: React.FC<StopTriggersConfigProps> = ({
  settings,
  onSettingsChange
}) => {
  const triggers = settings.triggers || ['unsubscribe', 'complaint', 'bounce'];
  const gracePeriod = settings.gracePeriod || 24;
  const exceptions = settings.exceptions || ['urgent_deadline'];
  const autoReactivate = settings.autoReactivate ?? false;
  const notifyAdmins = settings.notifyAdmins ?? true;

  const updateSettings = (updates: Partial<typeof settings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const toggleTrigger = (trigger: string) => {
    const newTriggers = triggers.includes(trigger)
      ? triggers.filter((t: string) => t !== trigger)
      : [...triggers, trigger];
    updateSettings({ triggers: newTriggers });
  };

  const toggleException = (exception: string) => {
    const newExceptions = exceptions.includes(exception)
      ? exceptions.filter((e: string) => e !== exception)
      : [...exceptions, exception];
    updateSettings({ exceptions: newExceptions });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StopCircle className="h-5 w-5" />
            Stop Triggers Configuration
          </CardTitle>
          <CardDescription>
            Define events that will halt communications with students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trigger Events */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Trigger Events</Label>
            <div className="space-y-3">
              {AVAILABLE_TRIGGERS.map((trigger) => (
                <div key={trigger.value} className="flex items-start space-x-3">
                  <Checkbox
                    checked={triggers.includes(trigger.value)}
                    onCheckedChange={() => toggleTrigger(trigger.value)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label className="text-sm font-medium">{trigger.label}</Label>
                    <p className="text-sm text-muted-foreground">
                      {trigger.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grace Period */}
          <div className="space-y-2">
            <Label htmlFor="grace-period" className="text-base font-medium">Grace Period (hours)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="grace-period"
                type="number"
                min="0"
                max="168"
                value={gracePeriod}
                onChange={(e) => updateSettings({ gracePeriod: parseInt(e.target.value) || 0 })}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                Time before stop takes effect (allows for urgent messages)
              </span>
            </div>
          </div>

          {/* Exceptions */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Communication Exceptions</Label>
            <div className="text-sm text-muted-foreground mb-3">
              These communication types can bypass stop triggers when necessary
            </div>
            <div className="space-y-3">
              {EXCEPTION_TYPES.map((exception) => (
                <div key={exception.value} className="flex items-start space-x-3">
                  <Checkbox
                    checked={exceptions.includes(exception.value)}
                    onCheckedChange={() => toggleException(exception.value)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label className="text-sm font-medium">{exception.label}</Label>
                    <p className="text-sm text-muted-foreground">
                      {exception.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Auto-Reactivate</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically reactivate communications after program milestones
                </div>
              </div>
              <Switch
                checked={autoReactivate}
                onCheckedChange={(checked) => updateSettings({ autoReactivate: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Notify Administrators</Label>
                <div className="text-sm text-muted-foreground">
                  Send alerts when stop triggers are activated
                </div>
              </div>
              <Switch
                checked={notifyAdmins}
                onCheckedChange={(checked) => updateSettings({ notifyAdmins: checked })}
              />
            </div>
          </div>

          {/* Information */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">Stop Trigger Behavior:</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Triggers immediately halt scheduled communications</li>
              <li>• Grace period allows urgent messages to be sent</li>
              <li>• Exceptions can override stop triggers when critical</li>
              <li>• All stop events are logged for compliance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StopTriggersConfig;