import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NotificationType {
  id: string;
  type_key: string;
  display_name: string;
  description: string;
  category: string;
  default_enabled: boolean;
  available_channels: string[];
  is_system: boolean;
  icon: string;
  priority_default: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  notification_type: string;
  channel: string;
  enabled: boolean;
  priority_filter: string;
  frequency: string;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  digest_time: string | null;
  include_details: boolean;
}

export interface BulkUpdateParams {
  channel?: string;
  notificationType?: string;
  enabled: boolean;
}

export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotificationTypes = async () => {
    const { data, error } = await supabase
      .from('notification_types' as any)
      .select('*')
      .order('category', { ascending: true })
      .order('display_name', { ascending: true });

    if (error) {
      console.error('Error fetching notification types:', error);
      toast({
        title: "Error",
        description: "Failed to load notification types",
        variant: "destructive"
      });
      return [];
    }

    return (data || []) as unknown as NotificationType[];
  };

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch notification types
      const types = await fetchNotificationTypes();
      setNotificationTypes(types);

      // Fetch user preferences
      const { data: prefs, error } = await supabase
        .from('user_notification_preferences' as any)
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // If no preferences exist, create defaults based on notification types
      if (!prefs || prefs.length === 0) {
        const defaultPrefs = types.flatMap(type => 
          type.available_channels.map(channel => ({
            user_id: user.id,
            notification_type: type.type_key,
            channel,
            enabled: type.default_enabled,
            priority_filter: 'all',
            frequency: 'immediate',
            quiet_hours_enabled: false,
            quiet_hours_start: null,
            quiet_hours_end: null,
            digest_time: null,
            include_details: true
          }))
        );

        const { data: newPrefs, error: insertError } = await supabase
          .from('user_notification_preferences' as any)
          .insert(defaultPrefs)
          .select();

        if (insertError) throw insertError;
        setPreferences((newPrefs || []) as unknown as NotificationPreference[]);
      } else {
        setPreferences(prefs as unknown as NotificationPreference[]);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (
    notificationType: string,
    channel: string,
    updates: Partial<NotificationPreference>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_notification_preferences' as any)
        .update(updates)
        .eq('user_id', user.id)
        .eq('notification_type', notificationType)
        .eq('channel', channel);

      if (error) throw error;

      // Update local state
      setPreferences(prev => prev.map(pref => 
        pref.notification_type === notificationType && pref.channel === channel
          ? { ...pref, ...updates }
          : pref
      ));

      toast({
        title: "Success",
        description: "Notification preference updated",
      });
    } catch (error) {
      console.error('Error updating preference:', error);
      toast({
        title: "Error",
        description: "Failed to update preference",
        variant: "destructive"
      });
    }
  };

  const bulkUpdate = async (params: BulkUpdateParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('user_notification_preferences' as any)
        .update({ enabled: params.enabled })
        .eq('user_id', user.id);

      if (params.channel) {
        query = query.eq('channel', params.channel);
      }

      if (params.notificationType) {
        query = query.eq('notification_type', params.notificationType);
      }

      const { error } = await query;

      if (error) throw error;

      // Update local state
      setPreferences(prev => prev.map(pref => {
        const matches = 
          (!params.channel || pref.channel === params.channel) &&
          (!params.notificationType || pref.notification_type === params.notificationType);
        
        return matches ? { ...pref, enabled: params.enabled } : pref;
      }));

      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
    } catch (error) {
      console.error('Error bulk updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive"
      });
    }
  };

  const resetToDefaults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Delete all existing preferences
      const { error: deleteError } = await supabase
        .from('user_notification_preferences' as any)
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Recreate defaults
      await fetchPreferences();

      toast({
        title: "Success",
        description: "Preferences reset to defaults",
      });
    } catch (error) {
      console.error('Error resetting preferences:', error);
      toast({
        title: "Error",
        description: "Failed to reset preferences",
        variant: "destructive"
      });
    }
  };

  const getPreference = (notificationType: string, channel: string) => {
    return preferences.find(
      p => p.notification_type === notificationType && p.channel === channel
    );
  };

  const getChannelPreferences = (channel: string) => {
    return preferences.filter(p => p.channel === channel);
  };

  const isChannelEnabled = (channel: string) => {
    const channelPrefs = getChannelPreferences(channel);
    return channelPrefs.some(p => p.enabled);
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return {
    preferences,
    notificationTypes,
    loading,
    updatePreference,
    bulkUpdate,
    resetToDefaults,
    getPreference,
    getChannelPreferences,
    isChannelEnabled,
    refetch: fetchPreferences
  };
}
