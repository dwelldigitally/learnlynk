import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { TokenValidationState, PortalData } from "@/types/studentPortal";

/**
 * Custom hook to handle access token validation and portal data management
 * Manages the entire token validation lifecycle including URL params and storage
 */
export const useTokenValidation = (): TokenValidationState & {
  validateAccessToken: (token: string) => Promise<void>;
} => {
  const [searchParams] = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check for access token from webform redirect or URL params
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setAccessToken(token);
      validateAccessToken(token);
    }
  }, [searchParams]);

  /**
   * Validates the access token against the database
   * Shows welcome onboarding for first-time visitors
   */
  const validateAccessToken = async (token: string) => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase
        .from('student_portal_access')
        .select('*')
        .eq('access_token', token)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error || !data) {
        toast({
          title: "Invalid Access",
          description: "Your access token is invalid or has expired.",
          variant: "destructive"
        });
        return;
      }
      
      setPortalData(data);
      
      // Check if this is first time visiting
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${data.access_token}`);
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
      
      toast({
        title: "Welcome!",
        description: `Welcome ${data.student_name}! Your application has been received.`
      });
    } catch (error) {
      console.error('Error validating token:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return {
    accessToken,
    portalData,
    isValidating,
    showWelcome,
    validateAccessToken,
  };
};