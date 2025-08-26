import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Timer } from "lucide-react";

interface MessagePacingConfigProps {
  settings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
}

const MessagePacingConfig: React.FC<MessagePacingConfigProps> = ({
  settings,
  onSettingsChange
}) => {
  const maxPerHour = settings.maxPerHour || 2;
  const maxPerDay = settings.maxPerDay || 8;
  const minInterval = settings.minInterval || 30;
  const priorityBypass = settings.priorityBypass ?? true;
  const channelLimits = settings.channelLimits || {
    email: { maxPerDay: 5 },
    sms: { maxPerDay: 3 },
    phone: { maxPerDay: 2 }
  };

  const updateSettings = (updates: Partial<typeof settings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const updateChannelLimit = (channel: string, limit: number) => {
    const newChannelLimits = {
      ...channelLimits,
      [channel]: { maxPerDay: limit }
    };
    updateSettings({ channelLimits: newChannelLimits });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Message Pacing Configuration
          </CardTitle>
          <CardDescription>
            Control the frequency and timing of communications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Limits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-per-hour">Max Messages Per Hour</Label>
              <Input
                id="max-per-hour"
                type="number"
                min="0"
                max="10"
                value={maxPerHour}
                onChange={(e) => updateSettings({ maxPerHour: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-per-day">Max Messages Per Day</Label>
              <Input
                id="max-per-day"
                type="number"
                min="0"
                max="50"
                value={maxPerDay}
                onChange={(e) => updateSettings({ maxPerDay: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-interval">Min Interval (minutes)</Label>
              <Input
                id="min-interval"
                type="number"
                min="0"
                max="1440"
                value={minInterval}
                onChange={(e) => updateSettings({ minInterval: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Channel-Specific Limits */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Channel-Specific Daily Limits</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Email Messages Per Day</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={channelLimits.email?.maxPerDay || 5}
                  onChange={(e) => updateChannelLimit('email', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">SMS Messages Per Day</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={channelLimits.sms?.maxPerDay || 3}
                  onChange={(e) => updateChannelLimit('sms', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Phone Calls Per Day</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  value={channelLimits.phone?.maxPerDay || 2}
                  onChange={(e) => updateChannelLimit('phone', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Priority Bypass */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Priority Bypass</Label>
              <div className="text-sm text-muted-foreground">
                Allow high-priority messages to bypass pacing limits
              </div>
            </div>
            <Switch
              checked={priorityBypass}
              onCheckedChange={(checked) => updateSettings({ priorityBypass: checked })}
            />
          </div>

          {/* Information */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">How Pacing Works:</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Messages are queued when limits are reached</li>
              <li>• Counters reset at midnight in the student's timezone</li>
              <li>• Priority messages can bypass limits when enabled</li>
              <li>• Emergency communications always bypass pacing</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagePacingConfig;