
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import hubspotService from "@/services/hubspotService";

const ConnectCRMScreen: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  useEffect(() => {
    // Check if we already have a stored API key
    const storedKey = hubspotService.getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      // Verify the stored key still works
      hubspotService.testConnection().then(valid => {
        setIsConnected(valid);
      });
    }
  }, []);

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      setConnectionError("Please enter a valid API key");
      return;
    }

    setIsConnecting(true);
    setConnectionError("");

    try {
      const success = await hubspotService.setApiKey(apiKey);
      setIsConnected(success);
      
      if (success) {
        toast.success("Successfully connected to HubSpot!");
      } else {
        setConnectionError("Could not connect to HubSpot. Please check your API key.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionError("Failed to connect to HubSpot. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Connect Your HubSpot CRM
        </h1>
        <p className="text-saas-gray-medium">
          Integrate your HubSpot account to import leads and analyze conversion factors
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 rounded-full w-10 h-10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.3 6.3C15.8 6.3 12.7 8.2 11.2 11.1C10.7 10.2 10 9.4 9.2 8.7C8.1 7.9 6.7 7.5 5.3 7.5C5.1 7.5 4.9 7.5 4.7 7.5C4.7 10.1 4.7 15.3 4.7 17.5C9.6 17.5 14.5 19 19.3 17.6C21.5 16.9 22.7 14.8 22.7 12.6C22.7 9.4 20.3 6.3 19.3 6.3Z" fill="#FF7A59"/>
                <path d="M0 13.3V16.7C2.3 16.7 2.3 16.7 2.3 13.3C2.3 10 2.3 10 0 10V13.3Z" fill="#FF7A59"/>
                <path d="M22.7 3.3V0C20.4 0 20.4 0 20.4 3.3C20.4 6.7 20.4 6.7 22.7 6.7V3.3Z" fill="#FF7A59"/>
                <path d="M11.3 3.3V0C9.1 0 9.1 0 9.1 3.3C9.1 6.7 9.1 6.7 11.3 6.7V3.3Z" fill="#FF7A59"/>
                <path d="M11.3 23.3V20C9.1 20 9.1 20 9.1 23.3C9.1 26.7 9.1 26.7 11.3 26.7V23.3Z" fill="#FF7A59"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg">HubSpot</h3>
              <p className="text-sm text-saas-gray-medium">Connect your HubSpot CRM</p>
            </div>
            {isConnected && (
              <div className="ml-auto">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <p className="text-sm mb-4">
              Enter your HubSpot private app access token:
            </p>
            <div className="mb-2">
              <Input
                type="password"
                placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
                disabled={isConnected || isConnecting}
              />
              {connectionError && (
                <p className="text-red-500 text-sm mt-1">{connectionError}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting || isConnected}
                className={isConnected ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : isConnected ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Connected
                  </>
                ) : (
                  "Connect HubSpot"
                )}
              </Button>
              
              {isConnected && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsConnected(false);
                    setApiKey("");
                    localStorage.removeItem('hubspot_api_key');
                  }}
                >
                  Disconnect
                </Button>
              )}
            </div>
          </div>
          
          {isConnected && (
            <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="font-medium flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                Successfully connected to HubSpot
              </h4>
              <p className="text-sm mt-2">
                We'll import your contacts, companies, deals, and activities to optimize lead assignment.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-medium mb-2">How to get your HubSpot API key:</h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-saas-gray-medium">
          <li>Go to your HubSpot account settings</li>
          <li>Navigate to Integrations > Private Apps</li>
          <li>Click "Create private app"</li>
          <li>Name your app (e.g., "Learnlynk Integration")</li>
          <li>Set scopes for contacts, companies, deals, and custom objects</li>
          <li>Create the app and copy the access token</li>
        </ol>
      </div>
      
      <div className="mt-6 text-sm text-saas-gray-medium">
        <p>Don't have a HubSpot account yet? <a href="https://app.hubspot.com/signup-hubspot/crm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sign up for free</a></p>
      </div>
    </div>
  );
};

export default ConnectCRMScreen;
