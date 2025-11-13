import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import * as Icons from 'lucide-react';
import type { NotificationType, NotificationPreference } from '@/hooks/useNotificationPreferences';

interface NotificationTypeCardProps {
  notificationType: NotificationType;
  preferences: NotificationPreference[];
  onUpdatePreference: (channel: string, updates: Partial<NotificationPreference>) => void;
}

export function NotificationTypeCard({ 
  notificationType, 
  preferences,
  onUpdatePreference 
}: NotificationTypeCardProps) {
  const IconComponent = (Icons as any)[notificationType.icon] || Icons.Bell;

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground">{notificationType.display_name}</h3>
              {notificationType.is_system && (
                <Badge variant="secondary" className="text-xs">System</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{notificationType.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {notificationType.available_channels.map(channel => {
              const pref = preferences.find(p => 
                p.notification_type === notificationType.type_key && p.channel === channel
              );

              if (!pref) return null;

              return (
                <div key={channel} className="space-y-3 p-4 rounded-lg border border-border bg-muted/50">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${notificationType.type_key}-${channel}`} className="text-sm font-medium capitalize">
                      {channel === 'in_app' ? 'In-App' : channel}
                    </Label>
                    <Switch
                      id={`${notificationType.type_key}-${channel}`}
                      checked={pref.enabled}
                      onCheckedChange={(enabled) => onUpdatePreference(channel, { enabled })}
                      disabled={notificationType.is_system}
                    />
                  </div>

                  {pref.enabled && (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Frequency</Label>
                        <Select 
                          value={pref.frequency}
                          onValueChange={(frequency) => onUpdatePreference(channel, { frequency })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="hourly">Hourly Digest</SelectItem>
                            <SelectItem value="daily_digest">Daily Digest</SelectItem>
                            <SelectItem value="weekly_digest">Weekly Digest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Priority</Label>
                        <Select 
                          value={pref.priority_filter}
                          onValueChange={(priority_filter) => onUpdatePreference(channel, { priority_filter })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="medium_high">Medium & High</SelectItem>
                            <SelectItem value="high_only">High Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
