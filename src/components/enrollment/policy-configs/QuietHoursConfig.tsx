import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X, Moon } from "lucide-react";

interface QuietHoursConfigProps {
  settings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
}

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'UTC', label: 'UTC' }
];

const CHANNELS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'phone', label: 'Phone' },
  { value: 'chat', label: 'Chat' }
];

const QuietHoursConfig: React.FC<QuietHoursConfigProps> = ({
  settings,
  onSettingsChange
}) => {
  const timeRanges = settings.timeRanges || [{ start: '22:00', end: '08:00' }];
  const timezone = settings.timezone || 'America/New_York';
  const emergencyOverride = settings.emergencyOverride ?? true;
  const channels = settings.channels || ['email', 'sms', 'phone'];

  const updateSettings = (updates: Partial<typeof settings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const addTimeRange = () => {
    const newTimeRanges = [...timeRanges, { start: '18:00', end: '09:00' }];
    updateSettings({ timeRanges: newTimeRanges });
  };

  const updateTimeRange = (index: number, field: 'start' | 'end', value: string) => {
    const newTimeRanges = timeRanges.map((range: any, i: number) =>
      i === index ? { ...range, [field]: value } : range
    );
    updateSettings({ timeRanges: newTimeRanges });
  };

  const removeTimeRange = (index: number) => {
    if (timeRanges.length > 1) {
      const newTimeRanges = timeRanges.filter((_: any, i: number) => i !== index);
      updateSettings({ timeRanges: newTimeRanges });
    }
  };

  const toggleChannel = (channel: string) => {
    const newChannels = channels.includes(channel)
      ? channels.filter((c: string) => c !== channel)
      : [...channels, channel];
    updateSettings({ channels: newChannels });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Quiet Hours Configuration
          </CardTitle>
          <CardDescription>
            Set up time periods when communications should be restricted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Ranges */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Quiet Time Periods</Label>
            {timeRanges.map((range: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <div className="space-y-2">
                    <Label className="text-sm">Start Time</Label>
                    <Input
                      type="time"
                      value={range.start}
                      onChange={(e) => updateTimeRange(index, 'start', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">End Time</Label>
                    <Input
                      type="time"
                      value={range.end}
                      onChange={(e) => updateTimeRange(index, 'end', e.target.value)}
                    />
                  </div>
                </div>
                {timeRanges.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTimeRange(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addTimeRange}
              className="w-full flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Time Range
            </Button>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Timezone</Label>
            <Select value={timezone} onValueChange={(value) => updateSettings({ timezone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Affected Channels */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Affected Communication Channels</Label>
            <div className="grid grid-cols-2 gap-3">
              {CHANNELS.map((channel) => (
                <div key={channel.value} className="flex items-center space-x-2">
                  <Switch
                    checked={channels.includes(channel.value)}
                    onCheckedChange={() => toggleChannel(channel.value)}
                  />
                  <Label className="text-sm">{channel.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Override */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Emergency Override</Label>
              <div className="text-sm text-muted-foreground">
                Allow high-priority communications during quiet hours
              </div>
            </div>
            <Switch
              checked={emergencyOverride}
              onCheckedChange={(checked) => updateSettings({ emergencyOverride: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuietHoursConfig;