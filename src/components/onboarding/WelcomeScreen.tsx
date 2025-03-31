
import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WelcomeScreen: React.FC = () => {
  return (
    <div className="slide-container">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Assign smarter<br />Close faster
        </h1>
        <p className="text-saas-gray-medium max-w-md mx-auto">
          Our AI-powered platform helps sales teams automate lead assignment and close more deals.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-8 my-6">
        <div className="bg-saas-gray-light rounded-lg p-4 flex items-center justify-between">
          <span className="font-medium">Productivity</span>
          <span className="percentage-increase">+15%</span>
        </div>
        <div className="bg-saas-gray-light rounded-lg p-4 flex items-center justify-between">
          <span className="font-medium">Close rate</span>
          <span className="percentage-increase">+25%</span>
        </div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-saas-gray-light w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span>1</span>
            </div>
            <div>
              <h3 className="font-medium">Connect your CRM</h3>
              <p className="text-saas-gray-medium text-sm">
                Seamlessly integrate with Salesforce, HubSpot, and more
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-saas-gray-light w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span>2</span>
            </div>
            <div>
              <h3 className="font-medium">Set your rules</h3>
              <p className="text-saas-gray-medium text-sm">
                Define your assignment criteria or use our AI recommendations
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-saas-gray-light w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span>3</span>
            </div>
            <div>
              <h3 className="font-medium">Watch conversion rates soar</h3>
              <p className="text-saas-gray-medium text-sm">
                Our AI matches the right reps with the right leads, improving close rates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
