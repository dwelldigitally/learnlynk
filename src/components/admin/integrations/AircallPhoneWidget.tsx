import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff,
  Loader2,
  AlertCircle,
  User,
  LogOut
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
  
  // Use external control if provided, otherwise internal state
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [tenantHasAircall, setTenantHasAircall] = useState(false);
  const [userSession, setUserSession] = useState<{
    aircall_user_email: string | null;
    is_logged_in: boolean;
  } | null>(null);
  const [currentCall, setCurrentCall] = useState<any>(null);

  // Check if tenant has Aircall connected
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
      initializePhone();
    }
  }, [isOpen, tenantHasAircall]);

  const initializePhone = async () => {
    setIsLoading(true);
    
    try {
      // Dynamically import aircall-everywhere
      const { default: AircallPhone } = await import('aircall-everywhere');
      
      phoneRef.current = new AircallPhone({
        domToLoadPhone: '#aircall-phone-container',
        onLogin: handleLogin,
        onLogout: handleLogout,
        integrationToLoad: 'learnlynk',
        debug: false
      });

      // Listen to call events
      phoneRef.current.on('incoming_call', handleIncomingCall);
      phoneRef.current.on('outgoing_call', handleOutgoingCall);
      phoneRef.current.on('call_end_ringtone', handleCallEnd);
      phoneRef.current.on('call_ended', handleCallEnded);
      phoneRef.current.on('comment_saved', handleCommentSaved);
      
      setIsConnected(true);
    } catch (error) {
      console.error('Error initializing Aircall phone:', error);
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
      // Upsert user session
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
    
    // Could trigger a lead lookup popup here
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
    
    // Log call to database
    await logCallToDatabase(callInfo);
  };

  const handleCommentSaved = (data: any) => {
    console.log('Comment saved:', data);
    // Could update call notes in database
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

  // Public method to dial a number
  const dialNumber = (phoneNumber: string, leadId?: string) => {
    if (phoneRef.current && isConnected) {
      phoneRef.current.send('dial_number', { phone_number: phoneNumber });
      
      // Store lead ID for call logging
      if (leadId) {
        setCurrentCall(prev => ({ ...prev, leadId }));
      }
    } else {
      // Open the widget first
      setIsOpen(true);
      
      // Try to dial after widget loads
      setTimeout(() => {
        if (phoneRef.current) {
          phoneRef.current.send('dial_number', { phone_number: phoneNumber });
        }
      }, 2000);
    }
  };

  // Expose dial function globally for click-to-call
  useEffect(() => {
    (window as any).aircallDial = dialNumber;
    return () => {
      delete (window as any).aircallDial;
    };
  }, [isConnected]);

  if (!tenantHasAircall) {
    return null; // Don't show widget if tenant hasn't connected Aircall
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Only render trigger button if not externally controlled */}
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
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {!userSession?.is_logged_in && (
                <Alert className="m-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please log in with your Aircall credentials to make calls.
                    Your personal Aircall account is separate from the institution's connection.
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
                className="w-full h-[600px]"
              />
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
