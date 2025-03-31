
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const CompletionScreen: React.FC = () => {
  return (
    <div className="slide-container">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-saas-green rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          You're All Set!
        </h1>
        <p className="text-saas-gray-medium max-w-md mx-auto">
          Your Adaptify platform is ready to help you optimize lead assignment and boost sales
        </p>
      </div>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3">
          <Check className="text-saas-green w-5 h-5" />
          <span>Team configuration complete</span>
        </div>
        <div className="flex items-center space-x-3">
          <Check className="text-saas-green w-5 h-5" />
          <span>CRM integration configured</span>
        </div>
        <div className="flex items-center space-x-3">
          <Check className="text-saas-green w-5 h-5" />
          <span>AI assignment rules established</span>
        </div>
        <div className="flex items-center space-x-3">
          <Check className="text-saas-green w-5 h-5" />
          <span>Performance tracking enabled</span>
        </div>
      </div>
      
      <div className="bg-saas-gray-light p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-bold text-lg mb-4">Next Steps for Success</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-saas-blue w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-medium">Invite your team members</h4>
              <p className="text-sm text-saas-gray-medium">Share access with your sales representatives</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-saas-blue w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-medium">Schedule onboarding call</h4>
              <p className="text-sm text-saas-gray-medium">Meet with our customer success team</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-saas-blue w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-medium">Explore your dashboard</h4>
              <p className="text-sm text-saas-gray-medium">Get familiar with your new analytics</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center">
        <Button className="bg-saas-blue hover:bg-blue-600">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CompletionScreen;
