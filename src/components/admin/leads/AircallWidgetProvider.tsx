import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { AircallWidget, AircallWidgetRef } from './AircallWidget';
import { AircallWidgetProvider } from '@/hooks/useAircallWidget';
import { AircallService } from '@/services/aircallService';

interface AircallWidgetWrapperProps {
  children: ReactNode;
}

export const AircallWidgetWrapper: React.FC<AircallWidgetWrapperProps> = ({ children }) => {
  const widgetRef = useRef<AircallWidgetRef>(null);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [shouldRenderWidget, setShouldRenderWidget] = useState(false);

  useEffect(() => {
    checkAircallSettings();
  }, []);

  const checkAircallSettings = async () => {
    try {
      const settings = await AircallService.getSettings();
      if (settings?.is_active && settings.api_id) {
        setShouldRenderWidget(true);
      }
    } catch (error) {
      console.error('Error checking Aircall settings:', error);
    }
  };

  const makeCall = (phoneNumber: string) => {
    if (widgetRef.current && isWidgetReady) {
      widgetRef.current.makeCall(phoneNumber);
    } else {
      console.warn('Aircall widget not ready or not configured');
    }
  };

  const contextValue = {
    makeCall,
    isWidgetReady
  };

  return (
    <AircallWidgetProvider value={contextValue}>
      {children}
      {shouldRenderWidget && (
        <AircallWidget
          ref={widgetRef}
          onWidgetReady={() => setIsWidgetReady(true)}
        />
      )}
    </AircallWidgetProvider>
  );
};