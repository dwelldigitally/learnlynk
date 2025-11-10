import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  id?: string;
  user_id?: string;
  email_signature?: string;
  outlook_connected?: boolean;
  outlook_email?: string;
  created_at?: string;
  updated_at?: string;
}

export function useUserSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
      } else {
        // Create default settings
        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating settings:', insertError);
        } else {
          setSettings(newSettings);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          ...settings,
          ...updates,
          user_id: user.id,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      await fetchSettings();

      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });

      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        variant: 'destructive',
      });
      return false;
    }
  };

  const connectOutlook = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Call edge function to get auth URL
      const { data, error } = await supabase.functions.invoke('outlook-auth', {
        body: { action: 'get-auth-url' },
      });

      if (error) throw error;

      // Open OAuth window
      const width = 600;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const authWindow = window.open(
        data.authUrl,
        'Outlook Authentication',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for OAuth callback
      const messageHandler = async (event: MessageEvent) => {
        if (event.data.type === 'outlook-auth-code') {
          authWindow?.close();
          
          // Exchange code for tokens
          const { error: exchangeError } = await supabase.functions.invoke('outlook-auth', {
            body: { action: 'exchange-code', code: event.data.code },
          });

          if (exchangeError) throw exchangeError;

          await fetchSettings();
          
          toast({
            title: 'Success',
            description: 'Outlook connected successfully',
          });

          window.removeEventListener('message', messageHandler);
        }
      };

      window.addEventListener('message', messageHandler);

      return true;
    } catch (error) {
      console.error('Error connecting Outlook:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect Outlook',
        variant: 'destructive',
      });
      return false;
    }
  };

  const disconnectOutlook = async () => {
    try {
      const { error } = await supabase.functions.invoke('outlook-auth', {
        body: { action: 'disconnect' },
      });

      if (error) throw error;

      await fetchSettings();

      toast({
        title: 'Success',
        description: 'Outlook disconnected successfully',
      });

      return true;
    } catch (error) {
      console.error('Error disconnecting Outlook:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect Outlook',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    connectOutlook,
    disconnectOutlook,
    refetch: fetchSettings,
  };
}
