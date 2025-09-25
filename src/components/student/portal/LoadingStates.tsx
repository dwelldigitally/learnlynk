import React from "react";

interface LoadingStateProps {
  isConnected?: boolean;
  message?: string;
}

/**
 * Reusable loading component for the student portal
 * Shows spinner with optional real-time connection status
 */
export const PortalLoadingState: React.FC<LoadingStateProps> = ({ 
  isConnected, 
  message = "Loading your portal..." 
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{message}</p>
        {isConnected && (
          <p className="mt-2 text-sm text-emerald-600">🔄 Real-time updates connected</p>
        )}
      </div>
    </div>
  );
};

/**
 * Error state component for invalid access or expired sessions
 */
export const AccessDeniedState: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">Your session has expired or is invalid.</p>
      </div>
    </div>
  );
};