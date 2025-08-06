import { createContext, useContext, ReactNode } from 'react';

interface AircallWidgetContextType {
  makeCall: (phoneNumber: string) => void;
  isWidgetReady: boolean;
}

const AircallWidgetContext = createContext<AircallWidgetContextType | null>(null);

export const useAircallWidget = () => {
  const context = useContext(AircallWidgetContext);
  if (!context) {
    // Return fallback functions when widget is not available
    return {
      makeCall: () => console.warn('Aircall widget not initialized'),
      isWidgetReady: false
    };
  }
  return context;
};

export const AircallWidgetProvider = AircallWidgetContext.Provider;