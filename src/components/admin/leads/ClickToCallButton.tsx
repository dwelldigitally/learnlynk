import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Phone, PhoneCall, AlertCircle, Copy } from 'lucide-react';
import { AircallService, AircallSettings } from '@/services/aircallService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ClickToCallButtonProps {
  phoneNumber: string;
  leadId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ClickToCallButton: React.FC<ClickToCallButtonProps> = ({
  phoneNumber,
  leadId,
  variant = 'outline',
  size = 'sm',
  showLabel = false,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AircallSettings | null>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('Loading Aircall settings...');
      const data = await AircallService.getSettings();
      console.log('Aircall settings loaded:', data);
      setSettings(data);
      setSettingsError(null);
    } catch (error) {
      console.error('Error loading Aircall settings:', error);
      setSettingsError(error instanceof Error ? error.message : 'Failed to load settings');
    } finally {
      setSettingsLoaded(true);
    }
  };

  const handleCall = async () => {
    console.log('Call button clicked:', { phoneNumber, settings, settingsLoaded });
    
    if (!settings?.is_active || !settings?.click_to_call_enabled) {
      toast({
        title: "Call Feature Disabled",
        description: "Please enable Aircall integration and click-to-call feature in settings",
        variant: "destructive"
      });
      return;
    }

    if (!phoneNumber) {
      toast({
        title: "No Phone Number",
        description: "No phone number available for this contact",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Initiating call to:', phoneNumber);
      
      // Find or create lead if leadId is not provided
      let targetLeadId = leadId;
      if (!targetLeadId) {
        const existingLead = await AircallService.findLeadByPhone(phoneNumber);
        if (existingLead) {
          targetLeadId = existingLead.id;
        } else if (settings.auto_create_leads) {
          const newLead = await AircallService.createLeadFromCall({
            phone_number: phoneNumber
          });
          targetLeadId = newLead.id;
        }
      }

      // For demo purposes, simulate call initiation if no API credentials
      // Use the edge function which handles lead creation and call logging
      const response = await supabase.functions.invoke('aircall-api', {
        body: {
          phoneNumber,
          leadId: targetLeadId
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to initiate call');
      }

      console.log('Call initiated successfully:', response.data);

      // Show success message
      if (response.data?.demo_mode) {
        toast({
          title: "Demo Call Initiated",
          description: `Demo call to ${formatPhoneNumber(phoneNumber)} has been logged.`,
        });
      } else {
        toast({
          title: "Call Initiated",
          description: `Call to ${formatPhoneNumber(phoneNumber)} initiated successfully.`,
        });
      }
    } catch (error) {
      console.error('Call initiation error:', error);
      toast({
        title: "Call Failed",
        description: error instanceof Error ? error.message : "Unable to initiate call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPhone = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      toast({
        title: "Phone Number Copied",
        description: `${formatPhoneNumber(phoneNumber)} copied to clipboard`,
      });
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getButtonState = () => {
    if (!settingsLoaded) {
      return { disabled: true, tooltip: "Loading Aircall settings..." };
    }
    
    if (settingsError) {
      return { disabled: true, tooltip: `Settings error: ${settingsError}` };
    }
    
    if (!settings) {
      return { disabled: true, tooltip: "Aircall not configured - Go to settings to connect" };
    }
    
    if (!settings.is_active) {
      return { disabled: true, tooltip: "Aircall integration is disabled" };
    }
    
    if (!settings.click_to_call_enabled) {
      return { disabled: true, tooltip: "Click-to-call feature is disabled" };
    }
    
    if (!phoneNumber) {
      return { disabled: true, tooltip: "No phone number available" };
    }
    
    if (isLoading) {
      return { disabled: true, tooltip: "Initiating call..." };
    }
    
    return { disabled: false, tooltip: `Call ${formatPhoneNumber(phoneNumber)}` };
  };

  const buttonState = getButtonState();
  const isAircallConfigured = settings?.is_active && settings?.click_to_call_enabled;
  
  console.log('ClickToCallButton render:', { 
    phoneNumber, 
    settings, 
    settingsLoaded, 
    settingsError, 
    buttonState, 
    isAircallConfigured 
  });

  return (
    <TooltipProvider>
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={(e) => {
                console.log('Button click event fired!', e);
                handleCall();
              }}
              disabled={buttonState.disabled}
              className={className}
            >
              {isLoading ? (
                <PhoneCall className="h-4 w-4 animate-pulse" />
              ) : !isAircallConfigured ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
              {showLabel && (
                <span className="ml-2">
                  {isLoading ? 'Calling...' : 'Call'}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{buttonState.tooltip}</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Copy phone fallback when call isn't available */}
        {phoneNumber && !isAircallConfigured && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={size}
                onClick={handleCopyPhone}
                className="px-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy phone number</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};