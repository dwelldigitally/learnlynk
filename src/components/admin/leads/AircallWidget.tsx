import React, { useEffect, useRef, useState } from 'react';
import AircallEverywhere from 'aircall-everywhere';
import { AircallService, AircallSettings } from '@/services/aircallService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AircallWidgetProps {
  onWidgetReady?: () => void;
  onCallStarted?: (callData: any) => void;
  onCallEnded?: (callData: any) => void;
}

export const AircallWidget = React.forwardRef<any, AircallWidgetProps>(({
  onWidgetReady,
  onCallStarted,
  onCallEnded
}, ref) => {
  const widgetRef = useRef<any>(null);
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
      console.log('Initializing Aircall Widget...');
      
      const aircallEverywhere = new AircallEverywhere({
        integrationName: 'CRM Integration',
        size: 'auto',
        position: 'right',
        auth: {
          apiKey: settings.api_id,
          // In production, you'd use OAuth flow here
          // For now, we'll use the API key approach
        },
      });

      // Widget lifecycle events
      aircallEverywhere.on('ready', () => {
        console.log('Aircall Widget ready');
        setIsInitialized(true);
        onWidgetReady?.();
        
        toast({
          title: "Aircall Widget Ready",
          description: "You can now make and receive calls using the floating widget"
        });
      });

      aircallEverywhere.on('call_start_initiated', async (data: any) => {
        console.log('Call initiated:', data);
        onCallStarted?.(data);
        
        // Log call start in database
        if (settings.auto_log_calls) {
          await logCallActivity('call_initiated', data);
        }
      });

      aircallEverywhere.on('call_ended', async (data: any) => {
        console.log('Call ended:', data);
        onCallEnded?.(data);
        
        // Log call end and update database
        if (settings.auto_log_calls) {
          await logCallActivity('call_ended', data);
          await syncCallRecord(data);
        }
      });

      aircallEverywhere.on('incoming_call', async (data: any) => {
        console.log('Incoming call:', data);
        
        // Auto-create lead if enabled and number is unknown
        if (settings.auto_create_leads && data.phoneNumber) {
          await handleIncomingCall(data);
        }
      });

      aircallEverywhere.on('error', (error: any) => {
        console.error('Aircall Widget error:', error);
        toast({
          title: "Widget Error",
          description: error.message || "An error occurred with the Aircall widget",
          variant: "destructive"
        });
      });

      // Start the widget
      await aircallEverywhere.start();
      widgetRef.current = aircallEverywhere;

    } catch (error) {
      console.error('Failed to initialize Aircall widget:', error);
      toast({
        title: "Widget Initialization Failed",
        description: "Failed to start Aircall widget. Please check your settings.",
        variant: "destructive"
      });
    }
  };

  const logCallActivity = async (activityType: string, callData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('aircall_call_activities').insert({
        call_id: callData.aircallCallId || callData.id,
        activity_type: activityType,
        performed_by: user.id,
        activity_data: callData,
        performed_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging call activity:', error);
    }
  };

  const syncCallRecord = async (callData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Find existing call record or create new one
      const { data: existingCall } = await supabase
        .from('aircall_calls')
        .select('*')
        .eq('aircall_call_id', callData.aircallCallId || callData.id)
        .single();

      const callRecord = {
        user_id: user.id,
        aircall_call_id: callData.aircallCallId || callData.id,
        phone_number: callData.phoneNumber || callData.to || callData.from,
        direction: callData.direction || (callData.phoneNumber ? 'outbound' : 'inbound'),
        status: callData.status || 'completed',
        duration: callData.duration || 0,
        started_at: callData.startedAt || new Date().toISOString(),
        ended_at: callData.endedAt || new Date().toISOString(),
        caller_name: callData.callerName || callData.contactName,
        agent_name: callData.agentName || callData.userName,
        aircall_metadata: callData,
        updated_at: new Date().toISOString()
      };

      if (existingCall) {
        // Update existing record
        await supabase
          .from('aircall_calls')
          .update(callRecord)
          .eq('id', existingCall.id);
      } else {
        // Create new record
        await supabase
          .from('aircall_calls')
          .insert(callRecord);
      }
    } catch (error) {
      console.error('Error syncing call record:', error);
    }
  };

  const handleIncomingCall = async (callData: any) => {
    try {
      const phoneNumber = callData.phoneNumber || callData.from;
      if (!phoneNumber) return;

      // Check if lead already exists
      const existingLead = await AircallService.findLeadByPhone(phoneNumber);
      
      if (!existingLead) {
        // Create new lead
        await AircallService.createLeadFromCall({
          phone_number: phoneNumber,
          caller_name: callData.callerName || callData.contactName
        });
        
        toast({
          title: "New Lead Created",
          description: `Created lead for incoming call from ${phoneNumber}`
        });
      }
    } catch (error) {
      console.error('Error handling incoming call:', error);
    }
  };

  const makeCall = (phoneNumber: string) => {
    if (widgetRef.current && isInitialized) {
      widgetRef.current.makeCall(phoneNumber);
    } else {
      toast({
        title: "Widget Not Ready",
        description: "Please wait for the Aircall widget to initialize",
        variant: "destructive"
      });
    }
  };

  // Expose methods for external use
  React.useImperativeHandle(ref, () => ({
    makeCall,
    isReady: isInitialized
  }));

  // Widget renders itself as a floating iframe, no UI needed here
  return null;
});

// Export a ref type for components that need to control the widget
export type AircallWidgetRef = {
  makeCall: (phoneNumber: string) => void;
  isReady: boolean;
};