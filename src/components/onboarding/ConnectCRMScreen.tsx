
import React from "react";
import { Button } from "@/components/ui/button";

const ConnectCRMScreen: React.FC = () => {
  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Connect Your CRM
        </h1>
        <p className="text-saas-gray-medium">
          Integrate with your existing CRM platform for seamless data flow
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-saas-blue text-white p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#0080FF"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg">Salesforce</h3>
              <p className="text-sm opacity-80">Connect to sync leads and contacts</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm mb-4">
              Connecting to Salesforce will allow us to:
            </p>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Import your leads and contacts</li>
              <li>Sync assignment rules</li>
              <li>Track performance metrics</li>
              <li>Access your sales team structure</li>
              <li>Analyze conversion patterns</li>
            </ul>
          </div>
          <div className="mt-6">
            <Button variant="secondary" className="bg-white text-saas-blue hover:bg-gray-100">
              Connect Salesforce
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-medium mb-2">Other integrations available</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-saas-blue transition-colors cursor-pointer">
            <div className="font-medium mb-1">HubSpot</div>
            <div className="text-xs text-saas-gray-medium">CRM Platform</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-saas-blue transition-colors cursor-pointer">
            <div className="font-medium mb-1">Pipedrive</div>
            <div className="text-xs text-saas-gray-medium">Sales CRM</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-saas-blue transition-colors cursor-pointer">
            <div className="font-medium mb-1">Zoho</div>
            <div className="text-xs text-saas-gray-medium">CRM Platform</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectCRMScreen;
