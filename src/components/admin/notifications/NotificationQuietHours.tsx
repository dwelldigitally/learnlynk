import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Moon } from 'lucide-react';

interface NotificationQuietHoursProps {
  enabled: boolean;
  startTime: string | null;
  endTime: string | null;
  onUpdate: (updates: { 
    quiet_hours_enabled?: boolean;
    quiet_hours_start?: string | null;
    quiet_hours_end?: string | null;
  }) => void;
}

export function NotificationQuietHours({ 
  enabled, 
  startTime, 
  endTime, 
  onUpdate 
}: NotificationQuietHoursProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Moon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Quiet Hours</CardTitle>
            <CardDescription>
              Pause notifications during specific hours
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="quiet-hours-toggle">Enable Quiet Hours</Label>
            <p className="text-sm text-muted-foreground">
              Notifications will be held during these hours
            </p>
          </div>
          <Switch
            id="quiet-hours-toggle"
            checked={enabled}
            onCheckedChange={(quiet_hours_enabled) => onUpdate({ quiet_hours_enabled })}
          />
        </div>

        {enabled && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime || '22:00'}
                onChange={(e) => onUpdate({ quiet_hours_start: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime || '08:00'}
                onChange={(e) => onUpdate({ quiet_hours_end: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>
        )}

        {enabled && startTime && endTime && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              Notifications will be paused from <span className="font-medium text-foreground">{startTime}</span> to{' '}
              <span className="font-medium text-foreground">{endTime}</span> in your local timezone.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
