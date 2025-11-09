import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BuilderType } from '@/types/universalBuilder';
import { Settings2, FileText, Calendar, Clock, Repeat, Mail, Zap } from 'lucide-react';

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
    <div className="h-full w-full bg-muted/30">
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Campaign Settings</h2>
              <p className="text-muted-foreground">Configure your campaign details and schedule</p>
            </div>
          </div>
        </div>

        {/* General Information */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              General Information
            </CardTitle>
            <CardDescription>Basic details about your campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="config-name" className="text-sm font-medium">Campaign Name *</Label>
              <Input
                id="config-name"
                value={config.name}
                onChange={(e) => onConfigChange({ ...config, name: e.target.value })}
                placeholder="e.g., Welcome & Onboarding Campaign"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="config-description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="config-description"
                value={config.description}
                onChange={(e) => onConfigChange({ ...config, description: e.target.value })}
                placeholder="Describe the purpose and goals of this campaign..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="config-type" className="text-sm font-medium">Campaign Type</Label>
              <Select
                value={config.type}
                onValueChange={(value: BuilderType) => onConfigChange({ ...config, type: value })}
              >
                <SelectTrigger id="config-type" className="h-11">
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

        {/* Campaign Schedule - Only for campaigns */}
        {config.type === 'campaign' && (
          <>
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule & Timing
                </CardTitle>
                <CardDescription>Set when and how often your campaign runs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Frequency */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Campaign Frequency</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateSettings({ frequency: 'one-time' })}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        (config.settings?.frequency || 'one-time') === 'one-time'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Clock className="h-5 w-5 mb-2" />
                      <p className="font-medium">One-time</p>
                      <p className="text-xs text-muted-foreground">Run campaign once</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSettings({ frequency: 'ongoing' })}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        config.settings?.frequency === 'ongoing'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Repeat className="h-5 w-5 mb-2" />
                      <p className="font-medium">Ongoing</p>
                      <p className="text-xs text-muted-foreground">Recurring campaign</p>
                    </button>
                  </div>
                </div>

                <Separator />

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="start-datetime" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Start Date & Time
                  </Label>
                  <Input
                    id="start-datetime"
                    type="datetime-local"
                    value={config.settings?.startDateTime || ''}
                    onChange={(e) => updateSettings({ startDateTime: e.target.value })}
                    className="h-11"
                  />
                </div>

                {/* One-time: End Date */}
                {config.settings?.frequency === 'one-time' && (
                  <div className="space-y-2">
                    <Label htmlFor="end-datetime" className="text-sm font-medium text-muted-foreground">
                      End Date & Time (Optional)
                    </Label>
                    <Input
                      id="end-datetime"
                      type="datetime-local"
                      value={config.settings?.endDateTime || ''}
                      onChange={(e) => updateSettings({ endDateTime: e.target.value })}
                      className="h-11"
                    />
                  </div>
                )}

                {/* Ongoing: Recurrence */}
                {config.settings?.frequency === 'ongoing' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="recurrence" className="text-sm font-medium flex items-center gap-2">
                        <Repeat className="h-4 w-4" />
                        Recurrence Pattern
                      </Label>
                      <Select
                        value={config.settings?.recurrence || 'daily'}
                        onValueChange={(value) => updateSettings({ recurrence: value })}
                      >
                        <SelectTrigger id="recurrence" className="h-11">
                          <SelectValue placeholder="Select recurrence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Set End Date</p>
                          <p className="text-xs text-muted-foreground">
                            Stop the campaign on a specific date
                          </p>
                        </div>
                        <Switch
                          checked={config.settings?.hasEndDate || false}
                          onCheckedChange={(checked) => updateSettings({ hasEndDate: checked })}
                        />
                      </div>

                      {config.settings?.hasEndDate && (
                        <div className="mt-4 space-y-2">
                          <Label htmlFor="recurring-end-datetime" className="text-sm">End Date & Time</Label>
                          <Input
                            id="recurring-end-datetime"
                            type="datetime-local"
                            value={config.settings?.endDateTime || ''}
                            onChange={(e) => updateSettings({ endDateTime: e.target.value })}
                            className="h-11"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Advanced Options
                </CardTitle>
                <CardDescription>Additional campaign settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <p className="font-medium">Auto-activate Campaign</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatically start the campaign at the scheduled time
                    </p>
                  </div>
                  <Switch
                    checked={config.settings?.autoActivate || false}
                    onCheckedChange={(checked) => updateSettings({ autoActivate: checked })}
                  />
                </div>

                <div className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <p className="font-medium">Send Test Email</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Send a preview email before the campaign starts
                      </p>
                    </div>
                    <Switch
                      checked={config.settings?.sendTest || false}
                      onCheckedChange={(checked) => updateSettings({ sendTest: checked })}
                    />
                  </div>

                  {config.settings?.sendTest && (
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="test-email" className="text-sm">Test Email Address</Label>
                      <Input
                        id="test-email"
                        type="email"
                        value={config.settings?.testEmail || ''}
                        onChange={(e) => updateSettings({ testEmail: e.target.value })}
                        placeholder="test@example.com"
                        className="h-11"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
