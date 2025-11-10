import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const OutlookCallback = () => {
  useEffect(() => {
    // Get authorization code from URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      console.error('OAuth error:', error);
      window.close();
      return;
    }

    if (code && window.opener) {
      // Send the code back to the parent window
      window.opener.postMessage(
        {
          type: 'outlook-auth-code',
          code: code,
        },
        window.location.origin
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <div>
          <h2 className="text-xl font-semibold">Connecting Outlook...</h2>
          <p className="text-muted-foreground mt-2">
            Please wait while we complete the connection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OutlookCallback;
