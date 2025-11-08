import React, { createContext, useContext, useState, useEffect } from 'react';

interface MvpModeContextType {
  isMvpMode: boolean;
  toggleMvpMode: () => void;
}

const MvpModeContext = createContext<MvpModeContextType | undefined>(undefined);

export const MvpModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMvpMode, setIsMvpMode] = useState(() => {
    const saved = localStorage.getItem('mvpMode');
    return saved ? JSON.parse(saved) : true; // Default to MVP mode
  });

  useEffect(() => {
    localStorage.setItem('mvpMode', JSON.stringify(isMvpMode));
  }, [isMvpMode]);

  const toggleMvpMode = () => {
    setIsMvpMode((prev: boolean) => !prev);
  };

  return (
    <MvpModeContext.Provider value={{ isMvpMode, toggleMvpMode }}>
      {children}
    </MvpModeContext.Provider>
  );
};

export const useMvpMode = () => {
  const context = useContext(MvpModeContext);
  if (!context) {
    throw new Error('useMvpMode must be used within MvpModeProvider');
  }
  return context;
};
