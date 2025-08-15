import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useHubSpotConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionData, setConnectionData] = useState<any>(null);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Checking HubSpot connection status...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ User authentication error:', userError);
        setIsConnected(false);
        setConnectionData(null);
        return;
      }

      console.log('✅ User authenticated, checking database connection...');
      
      // Check for OAuth connection in database
      const { data, error } = await supabase
        .from('hubspot_connections')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error checking HubSpot connection:', error);
        setIsConnected(false);
        setConnectionData(null);
        return;
      }

      console.log('📊 Database connection check result:', {
        hasConnection: !!data,
        isExpired: data ? new Date(data.expires_at) <= new Date() : false,
        expiresAt: data?.expires_at,
        hubId: data?.hub_id
      });

      if (data) {
        // Check if token is still valid
        const isExpired = new Date(data.expires_at) <= new Date();
        
        if (!isExpired) {
          console.log('✅ Valid OAuth connection found');
          setIsConnected(true);
          setConnectionData(data);
          return;
        } else {
          console.log('⚠️ OAuth connection expired');
        }
      }

      // Fallback: Check localStorage for API key connection
      const hasApiKey = localStorage.getItem('hubspot_api_key');
      const hasOAuthConnection = localStorage.getItem('hubspot_oauth_connected');
      
      console.log('📋 Fallback check:', {
        hasApiKey: !!hasApiKey,
        hasOAuthConnection: !!hasOAuthConnection
      });
      
      const connected = !!(hasApiKey || hasOAuthConnection);
      setIsConnected(connected);
      
      if (!connected) {
        setConnectionData(null);
      }
      
    } catch (error) {
      console.error('❌ Error checking HubSpot connection:', error);
      setIsConnected(false);
      setConnectionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    isLoading,
    connectionData,
    refreshConnection: checkConnection
  };
};