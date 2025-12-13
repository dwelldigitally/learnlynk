import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone, 
  PhoneCall, 
  Loader2,
  AlertCircle,
  User,
  ExternalLink
} from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    AircallPhone: any;
  }
}

interface AircallPhoneWidgetProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCallStart?: (callInfo: any) => void;
  onCallEnd?: (callInfo: any) => void;
}

export const AircallPhoneWidget: React.FC<AircallPhoneWidgetProps> = ({
  isOpen: externalIsOpen,
  onOpenChange,
  onCallStart,
  onCallEnd
}) => {
  const { tenantId } = useTenant();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const phoneRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [phoneLoadFailed, setPhoneLoadFailed] = useState(false);
  const [tenantHasAircall, setTenantHasAircall] = useState(false);
  const [userSession, setUserSession] = useState<{
    aircall_user_email: string | null;
    is_logged_in: boolean;
  } | null>(null);
  const [currentCall, setCurrentCall] = useState<any>(null);

  useEffect(() => {
    if (tenantId) {
      checkTenantConnection();
      checkUserSession();
    }
  }, [tenantId]);

  const checkTenantConnection = async () => {
    if (!tenantId) return;
    
    try {
      const { data, error } = await supabase
        .from('tenant_aircall_connections')
        .select('is_active, connection_status')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking Aircall connection:', error);
        return;
      }

      setTenantHasAircall(data?.is_active && data?.connection_status === 'connected');
    } catch (error) {
      console.error('Error checking tenant Aircall connection:', error);
    }
  };

  const checkUserSession = async () => {
    if (!tenantId || !user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_aircall_sessions')
        .select('aircall_user_email, is_logged_in')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user session:', error);
        return;
      }

      if (data) {
        setUserSession(data);
      }
    } catch (error) {
      console.error('Error checking user Aircall session:', error);
    }
  };

  // Initialize Aircall Phone when sheet opens
  useEffect(() => {
    if (isOpen && tenantHasAircall && containerRef.current && !phoneRef.current) {
      // Small delay to ensure container is rendered
      const timer = setTimeout(() => {
        initializePhone();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, tenantHasAircall]);

  const initializePhone = async () => {
    setIsLoading(true);
    setPhoneLoadFailed(false);
    
    try {
      const { default: AircallPhone } = await import('aircall-everywhere');
      
      phoneRef.current = new AircallPhone({
        domToLoadPhone: '#aircall-phone-container',
        onLogin: handleLogin,
        onLogout: handleLogout,
        debug: true // Enable debug for troubleshooting
      });

      phoneRef.current.on('incoming_call', handleIncomingCall);
      phoneRef.current.on('outgoing_call', handleOutgoingCall);
      phoneRef.current.on('call_end_ringtone', handleCallEnd);
      phoneRef.current.on('call_ended', handleCallEnded);
      phoneRef.current.on('comment_saved', handleCommentSaved);
      
      // Check if iframe loaded after a delay
      setTimeout(() => {
        const iframe = containerRef.current?.querySelector('iframe');
        if (!iframe) {
          console.warn('Aircall iframe did not load');
          setPhoneLoadFailed(true);
        }
        setIsConnected(true);
      }, 3000);
      
    } catch (error) {
      console.error('Error initializing Aircall phone:', error);
      setPhoneLoadFailed(true);
      toast({
        title: "Error loading phone",
        description: "Could not initialize Aircall phone widget",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (settings: any) => {
    console.log('Aircall user logged in:', settings);
    
    if (!tenantId || !user?.id) return;

    try {
      const { error } = await supabase
        .from('user_aircall_sessions')
        .upsert({
          user_id: user.id,
          tenant_id: tenantId,
          aircall_user_id: settings.user?.id?.toString(),
          aircall_user_email: settings.user?.email,
          aircall_user_name: settings.user?.name,
          is_logged_in: true,
          last_login_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,tenant_id'
        });

      if (error) throw error;

      setUserSession({
        aircall_user_email: settings.user?.email,
        is_logged_in: true
      });

      toast({
        title: "Logged in to Aircall",
        description: `Welcome, ${settings.user?.name || settings.user?.email}`,
      });
    } catch (error) {
      console.error('Error saving user session:', error);
    }
  };

  const handleLogout = async () => {
    console.log('Aircall user logged out');
    
    if (!tenantId || !user?.id) return;

    try {
      const { error } = await supabase
        .from('user_aircall_sessions')
        .update({
          is_logged_in: false,
          last_logout_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId);

      if (error) throw error;

      setUserSession({
        aircall_user_email: userSession?.aircall_user_email || null,
        is_logged_in: false
      });
    } catch (error) {
      console.error('Error updating user session:', error);
    }
  };

  const handleIncomingCall = (callInfo: any) => {
    console.log('Incoming call:', callInfo);
    setCurrentCall({ ...callInfo, direction: 'inbound' });
    onCallStart?.(callInfo);
    matchCallToLead(callInfo.from);
  };

  const handleOutgoingCall = (callInfo: any) => {
    console.log('Outgoing call:', callInfo);
    setCurrentCall({ ...callInfo, direction: 'outbound' });
    onCallStart?.(callInfo);
  };

  const handleCallEnd = (callInfo: any) => {
    console.log('Call ending:', callInfo);
  };

  const handleCallEnded = async (callInfo: any) => {
    console.log('Call ended:', callInfo);
    setCurrentCall(null);
    onCallEnd?.(callInfo);
    await logCallToDatabase(callInfo);
  };

  const handleCommentSaved = (data: any) => {
    console.log('Comment saved:', data);
  };

  const matchCallToLead = async (phoneNumber: string) => {
    if (!tenantId || !phoneNumber) return;
    
    try {
      const { data: lead } = await supabase
        .from('leads')
        .select('id, first_name, last_name, email')
        .eq('tenant_id', tenantId)
        .or(`phone.eq.${phoneNumber},phone.ilike.%${phoneNumber.slice(-10)}%`)
        .limit(1)
        .maybeSingle();

      if (lead) {
        toast({
          title: "Incoming call",
          description: `${lead.first_name} ${lead.last_name} (${lead.email})`,
        });
      }
    } catch (error) {
      console.error('Error matching call to lead:', error);
    }
  };

  const logCallToDatabase = async (callInfo: any) => {
    if (!tenantId || !user?.id) return;
    
    try {
      const { error } = await supabase
        .from('aircall_calls')
        .insert({
          tenant_id: tenantId,
          user_id: user.id,
          aircall_call_id: callInfo.call_id?.toString() || `call_${Date.now()}`,
          phone_number: callInfo.from || callInfo.to,
          direction: currentCall?.direction || 'outbound',
          status: 'completed',
          duration: callInfo.duration || 0,
          started_at: new Date().toISOString(),
          ended_at: new Date().toISOString(),
          aircall_metadata: callInfo
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging call:', error);
    }
  };

  const dialNumber = (phoneNumber: string, leadId?: string) => {
    if (phoneRef.current && isConnected) {
      phoneRef.current.send('dial_number', { phone_number: phoneNumber });
      
      if (leadId) {
        setCurrentCall(prev => ({ ...prev, leadId }));
      }
    } else {
      setIsOpen(true);
      setTimeout(() => {
        if (phoneRef.current) {
          phoneRef.current.send('dial_number', { phone_number: phoneNumber });
        }
      }, 2000);
    }
  };

  useEffect(() => {
    (window as any).aircallDial = dialNumber;
    return () => {
      delete (window as any).aircallDial;
    };
  }, [isConnected]);

  const openAircallDirect = () => {
    window.open('https://phone.aircall.io/', '_blank');
  };

  if (!tenantHasAircall) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {externalIsOpen === undefined && (
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="relative"
            title="Open Aircall Phone"
          >
            <Phone className="h-4 w-4" />
            {currentCall && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            )}
          </Button>
        </SheetTrigger>
      )}
      
      <SheetContent side="right" className="w-[380px] sm:w-[400px] p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Aircall Phone
            </SheetTitle>
            {userSession?.is_logged_in && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {userSession.aircall_user_email}
              </Badge>
            )}
          </div>
        </SheetHeader>
        
        <div className="h-[calc(100vh-80px)] overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading Aircall phone...</p>
            </div>
          ) : (
            <>
              {!userSession?.is_logged_in && (
                <Alert className="m-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Log in with your personal Aircall account below to make calls.
                  </AlertDescription>
                </Alert>
              )}
              
              {currentCall && (
                <Card className="m-4">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <PhoneCall className="h-5 w-5 text-green-600 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {currentCall.direction === 'inbound' ? 'Incoming call' : 'Outgoing call'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {currentCall.from || currentCall.to}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Aircall Phone iframe container */}
              <div 
                id="aircall-phone-container" 
                ref={containerRef}
                className="w-full h-[500px] flex items-center justify-center"
              />
              
              {/* Fallback UI if iframe doesn't load */}
              {phoneLoadFailed && (
                <div className="p-4 space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      The Aircall phone widget couldn't load. You can still make calls by opening Aircall directly.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    onClick={openAircallDirect} 
                    className="w-full"
                    variant="default"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Aircall in New Tab
                  </Button>
                  
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">To make calls:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Click the button above to open Aircall</li>
                      <li>Log in with your Aircall credentials</li>
                      <li>Use Aircall's web phone to make calls</li>
                    </ol>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
// Export dial function for use in other components
export const dialWithAircall = (phoneNumber: string, leadId?: string) => {
  if ((window as any).aircallDial) {
    (window as any).aircallDial(phoneNumber, leadId);
  } else {
    // Fallback to opening phone app
    window.location.href = `tel:${phoneNumber}`;
  }
};
