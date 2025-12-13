import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AircallConnection {
  id: string;
  tenant_id: string;
  api_id: string;
  is_active: boolean;
  connection_status: string;
  auto_log_calls: boolean;
  auto_create_leads: boolean;
  call_recording_enabled: boolean;
  transcription_enabled: boolean;
}

interface UserAircallSession {
  id: string;
  aircall_user_id: string | null;
  aircall_user_email: string | null;
  aircall_user_name: string | null;
  is_logged_in: boolean;
}

export const useAircall = () => {
  const { tenantId } = useTenant();
  const { user } = useAuth();
  
  const [connection, setConnection] = useState<AircallConnection | null>(null);
  const [userSession, setUserSession] = useState<UserAircallSession | null>(null);
  const [loading, setLoading] = useState(true);

  const isConnected = connection?.is_active && connection?.connection_status === 'connected';
  const isUserLoggedIn = userSession?.is_logged_in ?? false;

  useEffect(() => {
    if (tenantId && user?.id) {
      fetchData();
    }
  }, [tenantId, user?.id]);

  const fetchData = async () => {
    if (!tenantId || !user?.id) return;
    
    setLoading(true);
    try {
      // Fetch tenant connection
      const { data: connData } = await supabase
        .from('tenant_aircall_connections')
        .select('*')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (connData) {
        setConnection(connData as AircallConnection);
      }

      // Fetch user session
      const { data: sessionData } = await supabase
        .from('user_aircall_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (sessionData) {
        setUserSession(sessionData as UserAircallSession);
      }
    } catch (error) {
      console.error('Error fetching Aircall data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dial = useCallback((phoneNumber: string, leadId?: string) => {
    if ((window as any).aircallDial) {
      (window as any).aircallDial(phoneNumber, leadId);
    } else {
      // Fallback to tel: link
      window.location.href = `tel:${phoneNumber}`;
    }
  }, []);

  const logCall = useCallback(async (callData: {
    phone_number: string;
    direction: 'inbound' | 'outbound';
    duration?: number;
    lead_id?: string;
    notes?: string;
    outcome?: string;
  }) => {
    if (!tenantId || !user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('aircall_calls')
        .insert({
          tenant_id: tenantId,
          user_id: user.id,
          aircall_call_id: `manual_${Date.now()}`,
          phone_number: callData.phone_number,
          direction: callData.direction,
          status: 'completed',
          duration: callData.duration || 0,
          lead_id: callData.lead_id,
          notes: callData.notes,
          outcome: callData.outcome,
          started_at: new Date().toISOString(),
          ended_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging call:', error);
      return null;
    }
  }, [tenantId, user?.id]);

  const refetch = useCallback(() => {
    fetchData();
  }, [tenantId, user?.id]);

  return {
    connection,
    userSession,
    loading,
    isConnected,
    isUserLoggedIn,
    dial,
    logCall,
    refetch
  };
};
