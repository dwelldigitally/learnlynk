
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

interface HubSpotInstallProps {
  onComplete: () => void;
}

const HubSpotInstallScreen: React.FC<HubSpotInstallProps> = ({ onComplete }) => {
  const hubspotAuthUrl = "https://app-na3.hubspot.com/oauth/authorize?client_id=7d3b2479-84ec-4be0-ad81-0e669e75ba86&redirect_uri=https://lead-prediction-api.onrender.com/oauth-callback&scope=crm.objects.users.read%20crm.objects.contacts.write%20crm.schemas.contacts.write%20automation%20oauth%20crm.schemas.contacts.read%20crm.objects.contacts.read";
  
  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Install Learnlynk in HubSpot
        </h1>
        <p className="text-saas-gray-medium">
          Follow these steps to connect your HubSpot account with Learnlynk
        </p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-saas-blue w-8 h-8 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 mr-4">
              1
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Sign in to HubSpot</h3>
              <p className="text-saas-gray-medium mb-3">
                Make sure you're signed in to your HubSpot account with admin privileges
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-saas-blue w-8 h-8 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 mr-4">
              2
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Install the Learnlynk app</h3>
              <p className="text-saas-gray-medium mb-4">
                Click the button below to open HubSpot and authorize the Learnlynk app
              </p>
              
              <a 
                href={hubspotAuthUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-hubspot-orange hover:bg-orange-600 text-white px-6 py-3 rounded-md transition-colors shadow-md"
              >
                Install in HubSpot <ExternalLink size={16} />
              </a>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-saas-blue w-8 h-8 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 mr-4">
              3
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Authorize the app</h3>
              <p className="text-saas-gray-medium">
                Review and accept the permissions requested by Learnlynk to complete the installation
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
        <p className="text-sm font-medium mb-1 text-green-800">Already installed?</p>
        <p className="text-sm text-green-700">
          Once you've completed the installation in HubSpot, click the button below to proceed.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={onComplete}
          className="bg-saas-blue hover:bg-blue-600 flex items-center text-white px-6 py-2 shadow-md text-lg"
          size="lg"
        >
          I've installed the app <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default HubSpotInstallScreen;
