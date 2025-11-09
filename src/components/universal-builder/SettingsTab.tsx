import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { BuilderType } from '@/types/universalBuilder';

interface SettingsTabProps {
  config: any;
  onConfigChange: (config: any) => void;
}

export function SettingsTab({ config, onConfigChange }: SettingsTabProps) {
  const updateSettings = (updates: any) => {
    onConfigChange({
      ...config,
      settings: {
        ...config.settings,
        ...updates
      }
    });
  };

  return (
    <div className="h-full w-full overflow-auto">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="config-name">Name</Label>
              <Input
                id="config-name"
                value={config.name}
                onChange={(e) => onConfigChange({ ...config, name: e.target.value })}
                placeholder="Enter configuration name"
              />
            </div>
            
            <div>
              <Label htmlFor="config-description">Description</Label>
              <Textarea
                id="config-description"
                value={config.description}
                onChange={(e) => onConfigChange({ ...config, description: e.target.value })}
                placeholder="Enter configuration description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="config-type">Type</Label>
              <Select
                value={config.type}
                onValueChange={(value: BuilderType) => onConfigChange({ ...config, type: value })}
              >
                <SelectTrigger id="config-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="form">Form</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="journey">Journey</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Campaign-specific settings */}
        {config.type === 'campaign' && (
          <Card>
            <CardHeader>
              <CardTitle>Campaign Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={config.settings?.frequency || 'one-time'}
                  onValueChange={(value) => updateSettings({ frequency: value })}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="start-datetime">Start Date & Time</Label>
                <Input
                  id="start-datetime"
                  type="datetime-local"
                  value={config.settings?.startDateTime || ''}
                  onChange={(e) => updateSettings({ startDateTime: e.target.value })}
                />
              </div>

              {config.settings?.frequency === 'one-time' && (
                <div>
                  <Label htmlFor="end-datetime">End Date & Time (Optional)</Label>
                  <Input
                    id="end-datetime"
                    type="datetime-local"
                    value={config.settings?.endDateTime || ''}
                    onChange={(e) => updateSettings({ endDateTime: e.target.value })}
                  />
                </div>
              )}

              {config.settings?.frequency === 'ongoing' && (
                <>
                  <div>
                    <Label htmlFor="recurrence">Recurrence Pattern</Label>
                    <Select
                      value={config.settings?.recurrence || 'daily'}
                      onValueChange={(value) => updateSettings({ recurrence: value })}
                    >
                      <SelectTrigger id="recurrence">
                        <SelectValue placeholder="Select recurrence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Set End Date</Label>
                      <p className="text-sm text-muted-foreground">
                        Configure when the recurring campaign should stop
                      </p>
                    </div>
                    <Switch
                      checked={config.settings?.hasEndDate || false}
                      onCheckedChange={(checked) => updateSettings({ hasEndDate: checked })}
                    />
                  </div>

                  {config.settings?.hasEndDate && (
                    <div>
                      <Label htmlFor="recurring-end-datetime">End Date & Time</Label>
                      <Input
                        id="recurring-end-datetime"
                        type="datetime-local"
                        value={config.settings?.endDateTime || ''}
                        onChange={(e) => updateSettings({ endDateTime: e.target.value })}
                      />
                    </div>
                  )}
                </>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-activate Campaign</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically activate campaign at scheduled time
                  </p>
                </div>
                <Switch
                  checked={config.settings?.autoActivate || false}
                  onCheckedChange={(checked) => updateSettings({ autoActivate: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send Test Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Send a test email before campaign starts
                  </p>
                </div>
                <Switch
                  checked={config.settings?.sendTest || false}
                  onCheckedChange={(checked) => updateSettings({ sendTest: checked })}
                />
              </div>

              {config.settings?.sendTest && (
                <div>
                  <Label htmlFor="test-email">Test Email Address</Label>
                  <Input
                    id="test-email"
                    type="email"
                    value={config.settings?.testEmail || ''}
                    onChange={(e) => updateSettings({ testEmail: e.target.value })}
                    placeholder="test@example.com"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
