import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, Smartphone, Bell } from 'lucide-react';

interface NotificationChannelToggleProps {
  channel: 'email' | 'sms' | 'in_app';
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  verifiedEmail?: string;
  verifiedPhone?: string;
}

const channelConfig = {
  email: {
    icon: Mail,
    title: 'Email Notifications',
    description: 'Receive notifications via email'
  },
  sms: {
    icon: Smartphone,
    title: 'SMS Notifications',
    description: 'Receive notifications via text message'
  },
  in_app: {
    icon: Bell,
    title: 'In-App Notifications',
    description: 'Receive notifications within the platform'
  }
};

export function NotificationChannelToggle({ 
  channel, 
  enabled, 
  onToggle,
  verifiedEmail,
  verifiedPhone
}: NotificationChannelToggleProps) {
  const config = channelConfig[channel];
  const Icon = config.icon;
  
  const showVerification = channel === 'email' || channel === 'sms';
  const isVerified = channel === 'email' ? !!verifiedEmail : !!verifiedPhone;
  const contactInfo = channel === 'email' ? verifiedEmail : verifiedPhone;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
          />
        </div>
      </CardHeader>
      {showVerification && (
        <CardContent>
          <div className="space-y-2">
            {contactInfo && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{contactInfo}</span>
                {isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
            )}
            {!isVerified && (
              <p className="text-sm text-muted-foreground">
                {channel === 'email' ? 'Email' : 'Phone number'} verification required
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
