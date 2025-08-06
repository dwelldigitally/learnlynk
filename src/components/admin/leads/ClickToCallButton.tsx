import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, PhoneCall } from 'lucide-react';
import { AircallService, AircallSettings } from '@/services/aircallService';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AircallService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading Aircall settings:', error);
    }
  };

  const handleCall = async () => {
    if (!settings?.is_active || !settings?.click_to_call_enabled) {
      toast({
        title: "Call Feature Disabled",
        description: "Please enable Aircall integration and click-to-call feature",
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

      // Initiate the call
      const callResponse = await AircallService.initiateCall(phoneNumber, settings);
      
      // Create call record
      await AircallService.createCall({
        aircall_call_id: callResponse.id || `manual-${Date.now()}`,
        lead_id: targetLeadId,
        phone_number: phoneNumber,
        direction: 'outbound',
        status: 'initial',
        duration: 0,
        started_at: new Date().toISOString(),
        aircall_metadata: callResponse
      });

      toast({
        title: "Call Initiated",
        description: `Calling ${phoneNumber}...`,
      });
    } catch (error) {
      console.error('Call initiation error:', error);
      toast({
        title: "Call Failed",
        description: "Unable to initiate call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if Aircall is not configured or click-to-call is disabled
  if (!settings?.is_active || !settings?.click_to_call_enabled) {
    return null;
  }

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCall}
      disabled={isLoading || !phoneNumber}
      className={className}
      title={`Call ${formatPhoneNumber(phoneNumber)}`}
    >
      {isLoading ? (
        <PhoneCall className="h-4 w-4 animate-pulse" />
      ) : (
        <Phone className="h-4 w-4" />
      )}
      {showLabel && (
        <span className="ml-2">
          {isLoading ? 'Calling...' : 'Call'}
        </span>
      )}
    </Button>
  );
};