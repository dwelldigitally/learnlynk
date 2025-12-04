import React, { useState, useEffect } from 'react';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { NotificationTypeCard } from '@/components/admin/notifications/NotificationTypeCard';
import { NotificationChannelToggle } from '@/components/admin/notifications/NotificationChannelToggle';
import { NotificationQuietHours } from '@/components/admin/notifications/NotificationQuietHours';
import { Loader2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

export default function NotificationPreferencesPage() {
  const isMobile = useIsMobile();
  const {
    preferences,
    notificationTypes,
    loading,
    updatePreference,
    bulkUpdate,
    resetToDefaults,
    isChannelEnabled
  } = useNotificationPreferences();
  
  const { toast } = useToast();
  const [resetting, setResetting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  // Fetch user profile for email and phone
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First try to get from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, phone')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserEmail(profile.email || user.email || null);
        setUserPhone(profile.phone || null);
      } else {
        // Fallback to auth user email
        setUserEmail(user.email || null);
      }
    };

    fetchUserProfile();
  }, []);

  const handleResetToDefaults = async () => {
    setResetting(true);
    await resetToDefaults();
    setResetting(false);
  };

  const groupedTypes = notificationTypes.reduce((acc, type) => {
    if (!acc[type.category]) {
      acc[type.category] = [];
    }
    acc[type.category].push(type);
    return acc;
  }, {} as Record<string, typeof notificationTypes>);

  const getCategoryTitle = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleChannelToggle = async (channel: string, enabled: boolean) => {
    await bulkUpdate({ channel, enabled });
  };

  const handleQuietHoursUpdate = async (channel: string, updates: any) => {
    const channelPrefs = preferences.filter(p => p.channel === channel);
    for (const pref of channelPrefs) {
      await updatePreference(pref.notification_type, channel, updates);
    }
  };

  const emailPref = preferences.find(p => p.channel === 'email');
  const quietHoursEnabled = emailPref?.quiet_hours_enabled || false;
  const quietHoursStart = emailPref?.quiet_hours_start || null;
  const quietHoursEnd = emailPref?.quiet_hours_end || null;

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6 p-4 sm:p-6 md:p-9">
        <div className={`flex items-start gap-4 ${isMobile ? 'flex-col' : 'items-center justify-between'}`}>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Notification Preferences</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Control how and when you receive notifications
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleResetToDefaults}
            disabled={resetting}
            className={isMobile ? 'w-full' : ''}
          >
            {resetting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-2" />
            )}
            Reset to Defaults
          </Button>
        </div>

        <Tabs defaultValue="channels" className="space-y-6">
          <TabsList className={isMobile ? "flex flex-col h-auto w-full gap-1" : ""}>
            <TabsTrigger value="channels" className={isMobile ? "w-full justify-start" : ""}>Channels</TabsTrigger>
            <TabsTrigger value="types" className={isMobile ? "w-full justify-start" : ""}>Notification Types</TabsTrigger>
            <TabsTrigger value="quiet-hours" className={isMobile ? "w-full justify-start" : ""}>Quiet Hours</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>
                  Enable or disable entire notification channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NotificationChannelToggle
                  channel="email"
                  enabled={isChannelEnabled('email')}
                  onToggle={(enabled) => handleChannelToggle('email', enabled)}
                  verifiedEmail={userEmail || undefined}
                />
                <NotificationChannelToggle
                  channel="sms"
                  enabled={isChannelEnabled('sms')}
                  onToggle={(enabled) => handleChannelToggle('sms', enabled)}
                  verifiedPhone={userPhone || undefined}
                />
                <NotificationChannelToggle
                  channel="in_app"
                  enabled={isChannelEnabled('in_app')}
                  onToggle={(enabled) => handleChannelToggle('in_app', enabled)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            {Object.entries(groupedTypes).map(([category, types]) => (
              <div key={category} className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{getCategoryTitle(category)}</h2>
                  <p className="text-sm text-muted-foreground">
                    Configure {category} notification preferences
                  </p>
                </div>
                <div className="space-y-3">
                  {types.map(type => (
                    <NotificationTypeCard
                      key={type.id}
                      notificationType={type}
                      preferences={preferences.filter(p => p.notification_type === type.type_key)}
                      onUpdatePreference={(channel, updates) => 
                        updatePreference(type.type_key, channel, updates)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="quiet-hours" className="space-y-4">
            <NotificationQuietHours
              enabled={quietHoursEnabled}
              startTime={quietHoursStart}
              endTime={quietHoursEnd}
              onUpdate={(updates) => handleQuietHoursUpdate('email', updates)}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>About Quiet Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  During quiet hours, email and SMS notifications will be held and delivered after the quiet period ends.
                </p>
                <p>
                  In-app notifications will still appear but won't trigger sound or push notifications.
                </p>
                <p>
                  Critical system alerts may override quiet hours settings.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModernAdminLayout>
  );
}
