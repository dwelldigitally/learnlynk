import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BenchmarkSettings {
  responseTime: {
    initial: number;
    followUp: number;
    slaTarget: number;
  };
  conversion: {
    leadToDemo: number;
    demoToEnrollment: number;
    overallTarget: number;
  };
  activity: {
    dailyContacts: number;
    weeklyFollowUps: number;
    monthlyReviews: number;
  };
  quality: {
    minCallDuration: number;
    requiredTouchpoints: number;
    satisfactionTarget: number;
  };
}

export interface AlertSettings {
  slaViolations: boolean;
  lowConversion: boolean;
  missedTargets: boolean;
  qualityIssues: boolean;
}

const defaultSettings: BenchmarkSettings = {
  responseTime: {
    initial: 2,
    followUp: 24,
    slaTarget: 24,
  },
  conversion: {
    leadToDemo: 25,
    demoToEnrollment: 35,
    overallTarget: 12,
  },
  activity: {
    dailyContacts: 15,
    weeklyFollowUps: 25,
    monthlyReviews: 5,
  },
  quality: {
    minCallDuration: 15,
    requiredTouchpoints: 5,
    satisfactionTarget: 85,
  },
};

const defaultAlertSettings: AlertSettings = {
  slaViolations: true,
  lowConversion: true,
  missedTargets: true,
  qualityIssues: false,
};

export function useBenchmarkSettings() {
  const [settings, setSettings] = useState<BenchmarkSettings>(defaultSettings);
  const [alertSettings, setAlertSettings] = useState<AlertSettings>(defaultAlertSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fallback to localStorage for unauthenticated users
        const stored = localStorage.getItem('benchmark_settings');
        const storedAlerts = localStorage.getItem('benchmark_alerts');
        if (stored) setSettings(JSON.parse(stored));
        if (storedAlerts) setAlertSettings(JSON.parse(storedAlerts));
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('configuration_metadata')
        .select('value')
        .eq('category', 'lead-management')
        .eq('key', 'lead_benchmarks')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading benchmark settings:', error);
        setIsLoading(false);
        return;
      }

      if (data?.value) {
        const parsed = JSON.parse(data.value as string);
        setSettings(parsed.settings || defaultSettings);
        setAlertSettings(parsed.alertSettings || defaultAlertSettings);
      }
    } catch (error) {
      console.error('Error loading benchmark settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: BenchmarkSettings, newAlertSettings: AlertSettings) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Fallback to localStorage
        localStorage.setItem('benchmark_settings', JSON.stringify(newSettings));
        localStorage.setItem('benchmark_alerts', JSON.stringify(newAlertSettings));
        setSettings(newSettings);
        setAlertSettings(newAlertSettings);
        toast({
          title: "Settings saved",
          description: "Benchmark settings saved locally",
        });
        return;
      }

      const settingsData = {
        settings: newSettings,
        alertSettings: newAlertSettings,
      };

      const { error } = await supabase
        .from('configuration_metadata')
        .upsert({
          user_id: user.id,
          category: 'lead-management',
          key: 'lead_benchmarks',
          data_type: 'json',
          value: JSON.stringify(settingsData),
        });

      if (error) {
        throw error;
      }

      setSettings(newSettings);
      setAlertSettings(newAlertSettings);
      
      toast({
        title: "Settings saved",
        description: "Benchmark settings updated successfully",
      });
    } catch (error) {
      console.error('Error saving benchmark settings:', error);
      toast({
        title: "Error",
        description: "Failed to save benchmark settings",
        variant: "destructive",
      });
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setAlertSettings(defaultAlertSettings);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    alertSettings,
    isLoading,
    saveSettings,
    resetSettings,
    refreshSettings: loadSettings,
  };
}