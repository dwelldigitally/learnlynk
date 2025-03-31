
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import hubspotService from "@/services/hubspotService";

const ConnectCRMScreen = () => {
  const [apiKey, setApiKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const { toast: uiToast } = useToast();

  const checkExistingConnection = async () => {
    const storedKey = hubspotService.getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      const isValid = await hubspotService.testConnection();
      setIsConnected(isValid);
    }
  };

  useEffect(() => {
    checkExistingConnection();
  }, []);

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Simulate API connection
      const isValid = await hubspotService.validateApiKey(apiKey);
      
      if (isValid) {
        hubspotService.storeApiKey(apiKey);
        setIsConnected(true);
        uiToast({
          title: "Successfully connected to HubSpot",
          description: "Your HubSpot account is now connected.",
        });
      } else {
        setError("Invalid API key. Please check and try again.");
      }
    } catch (err) {
      setError("Failed to connect to HubSpot. Please try again.");
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisconnect = () => {
    hubspotService.clearApiKey();
    setIsConnected(false);
    setApiKey("");
    toast.success("Disconnected from HubSpot");
  };

  return (
    <div className="slide-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Connect to HubSpot CRM
        </h1>
        <p className="text-saas-gray-medium max-w-md mx-auto">
          Let's connect to your HubSpot account to import your data
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {isConnected ? (
          <div className="bg-green-50 border border-green-100 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-4">
                <Check className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Connected to HubSpot</h3>
                <p className="text-sm text-green-700">Your HubSpot account has been successfully connected</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="bg-saas-gray-light rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">HubSpot API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your HubSpot API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
                {error && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {error}
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full"
                onClick={handleConnect}
                disabled={isVerifying}
              >
                {isVerifying ? 'Connecting...' : 'Connect to HubSpot'}
              </Button>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-4">
            Don't have your API key?
          </div>
          <Button variant="link" className="text-saas-blue" onClick={() => window.open('https://app.hubspot.com/api-key', '_blank')}>
            Get API key from HubSpot &rarr;
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-blue-800 font-medium mb-2">What happens next?</h3>
          <p className="text-sm text-blue-700 mb-4">
            After connecting to HubSpot, we'll help you:
          </p>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-2">
            <li>Import your leads, deals, and contacts</li>
            <li>Map your team members and their expertise</li>
            <li>Configure AI weighting for lead assignments</li>
            <li>Set up performance tracking and reporting</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ConnectCRMScreen;
