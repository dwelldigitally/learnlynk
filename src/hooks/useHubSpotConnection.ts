import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useHubSpotConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionData, setConnectionData] = useState<any>(null);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      
      // Check for OAuth connection in database
      const { data, error } = await supabase
        .from('hubspot_connections')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking HubSpot connection:', error);
        setIsConnected(false);
        return;
      }

      if (data) {
        // Check if token is still valid
        const isExpired = new Date(data.expires_at) <= new Date();
        
        if (!isExpired) {
          setIsConnected(true);
          setConnectionData(data);
          return;
        }
      }

      // Fallback: Check localStorage for API key connection
      const hasApiKey = localStorage.getItem('hubspot_api_key');
      const hasOAuthConnection = localStorage.getItem('hubspot_oauth_connected');
      
      setIsConnected(!!(hasApiKey || hasOAuthConnection));
    } catch (error) {
      console.error('Error checking HubSpot connection:', error);
      setIsConnected(false);
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