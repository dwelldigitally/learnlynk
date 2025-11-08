import React, { createContext, useContext, useState, useEffect } from 'react';

interface MvpModeContextType {
  isMvpMode: boolean;
  toggleMvpMode: () => void;
}

const MvpModeContext = createContext<MvpModeContextType | undefined>(undefined);

export const MvpModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMvpMode, setIsMvpMode] = useState(() => {
    const stored = localStorage.getItem('mvp_mode');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('mvp_mode', String(isMvpMode));
  }, [isMvpMode]);

  const toggleMvpMode = () => {
    setIsMvpMode(prev => !prev);
  };

  return (
    <MvpModeContext.Provider value={{ isMvpMode, toggleMvpMode }}>
      {children}
    </MvpModeContext.Provider>
  );
};

export const useMvpMode = () => {
  const context = useContext(MvpModeContext);
  if (context === undefined) {
    throw new Error('useMvpMode must be used within a MvpModeProvider');
  }
  return context;
};
