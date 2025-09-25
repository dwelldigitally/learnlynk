import { useState } from "react";
import type { WelcomeFlowState, PortalData } from "@/types/studentPortal";

/**
 * Custom hook to manage the welcome onboarding flow
 * Handles welcome state and completion logic with localStorage tracking
 */
export const useWelcomeFlow = (portalData: PortalData | null): WelcomeFlowState => {
  const [showWelcome, setShowWelcome] = useState(false);

  /**
   * Handles completion of the welcome onboarding
   * Marks the welcome as seen in localStorage to prevent showing again
   */
  const handleWelcomeComplete = () => {
    if (portalData?.access_token) {
      localStorage.setItem(`welcome_seen_${portalData.access_token}`, 'true');
    }
    setShowWelcome(false);
  };

  return {
    showWelcome,
    setShowWelcome,
    handleWelcomeComplete,
  };
};