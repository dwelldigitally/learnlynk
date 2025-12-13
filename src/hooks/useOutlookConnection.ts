import { useState, useEffect, useCallback } from 'react';
import { OutlookService, OutlookConnectionStatus } from '@/services/outlookService';
import { useToast } from '@/hooks/use-toast';

export function useOutlookConnection() {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<OutlookConnectionStatus>({ connected: false });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const checkConnection = useCallback(async () => {
    try {
      setLoading(true);
      const status = await OutlookService.checkConnection();
      setConnectionStatus(status);
    } catch (error) {
      console.error('Error checking Outlook connection:', error);
      setConnectionStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      const authUrl = await OutlookService.getAuthUrl();
      
      // Open OAuth popup
      const width = 600;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      const authWindow = window.open(
        authUrl,
        'Outlook Authentication',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for OAuth callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.data.type === 'outlook-auth-code') {
          authWindow?.close();
          
          try {
            const result = await OutlookService.exchangeCode(event.data.code);
            
            setConnectionStatus({
              connected: true,
              email: result.email,
            });

            toast({
              title: 'Outlook Connected',
              description: `Connected as ${result.email}`,
            });

            // Create real-time subscriptions
            try {
              await OutlookService.createEmailSubscription();
              await OutlookService.createCalendarSubscription();
            } catch (subError) {
              console.warn('Could not create subscriptions:', subError);
            }

          } catch (error) {
            console.error('Error exchanging code:', error);
            toast({
              title: 'Connection Failed',
              description: 'Failed to connect Outlook account',
              variant: 'destructive',
            });
          }
          
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      // Clean up listener if window is closed
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          setConnecting(false);
          window.removeEventListener('message', handleMessage);
        }
      }, 500);

    } catch (error) {
      console.error('Error connecting Outlook:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to start Outlook connection',
        variant: 'destructive',
      });
      setConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    try {
      await OutlookService.disconnect();
      setConnectionStatus({ connected: false });
      toast({
        title: 'Outlook Disconnected',
        description: 'Your Outlook account has been disconnected',
      });
    } catch (error) {
      console.error('Error disconnecting Outlook:', error);
      toast({
        title: 'Disconnect Failed',
        description: 'Failed to disconnect Outlook account',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return {
    connectionStatus,
    loading,
    connecting,
    connect,
    disconnect,
    refresh: checkConnection,
  };
}
