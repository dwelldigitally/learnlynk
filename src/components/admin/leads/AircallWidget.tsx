import React, { useEffect, useState } from 'react';
import { AircallService, AircallSettings } from '@/services/aircallService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AircallWidgetProps {
  onWidgetReady?: () => void;
}

export const AircallWidget = React.forwardRef<any, AircallWidgetProps>(({
  onWidgetReady
}, ref) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [settings, setSettings] = useState<AircallSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings?.is_active && settings.api_id && !isInitialized) {
      initializeWidget();
    }
  }, [settings, isInitialized]);

  const loadSettings = async () => {
    try {
      const data = await AircallService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading Aircall settings:', error);
    }
  };

  const initializeWidget = async () => {
    if (!settings?.api_id || isInitialized) return;

    try {
      console.log('Aircall integration ready (using API fallback)');
      setIsInitialized(true);
      onWidgetReady?.();
      
      toast({
        title: "Aircall Integration Active",
        description: "Click-to-call is now available throughout the interface"
      });
    } catch (error) {
      console.error('Failed to initialize Aircall integration:', error);
      toast({
        title: "Integration Error",
        description: "Failed to initialize Aircall integration",
        variant: "destructive"
      });
    }
  };

  const makeCall = async (phoneNumber: string) => {
    if (!settings?.is_active) {
      toast({
        title: "Integration Not Active",
        description: "Please connect Aircall first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Use the existing edge function for call initiation
      const response = await supabase.functions.invoke('aircall-api', {
        body: { phoneNumber }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to initiate call');
      }

      toast({
        title: "Call Initiated",
        description: `Calling ${phoneNumber}...`
      });
    } catch (error) {
      console.error('Call initiation error:', error);
      toast({
        title: "Call Failed",
        description: "Unable to initiate call. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Expose methods for external use
  React.useImperativeHandle(ref, () => ({
    makeCall,
    isReady: isInitialized
  }));

  // No UI needed - this manages the integration in the background
  return null;
});

// Export a ref type for components that need to control the widget
export type AircallWidgetRef = {
  makeCall: (phoneNumber: string) => void;
  isReady: boolean;
};