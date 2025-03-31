
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WelcomeScreen: React.FC = () => {
  return (
    <div className="slide-container">
      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/9b985eb3-4f7d-4a96-9fa2-2e7a85a64983.png" 
          alt="Learnlynk Logo" 
          className="h-16 mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold mb-3">
          Personalized Learning<br />Made Simple
        </h1>
        <p className="text-saas-gray-medium max-w-lg mx-auto">
          Our AI-powered platform helps educational teams connect students with the right learning resources and improve completion rates.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-8 my-6">
        <div className="bg-saas-gray-light rounded-lg p-4 flex items-center justify-between">
          <span className="font-medium">Learning engagement</span>
          <span className="percentage-increase">+42%</span>
        </div>
        <div className="bg-saas-gray-light rounded-lg p-4 flex items-center justify-between">
          <span className="font-medium">Course completion</span>
          <span className="percentage-increase">+35%</span>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Key Benefits</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-saas-gray-light w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span>1</span>
            </div>
            <div>
              <h3 className="font-medium">AI-Powered Learning Paths</h3>
              <p className="text-saas-gray-medium text-sm">
                Personalized learning recommendations based on student behavior and learning styles
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-saas-gray-light w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span>2</span>
            </div>
            <div>
              <h3 className="font-medium">Seamless Integration</h3>
              <p className="text-saas-gray-medium text-sm">
                Connect with your LMS, CRM, and content libraries with just a few clicks
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-saas-gray-light w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <span>3</span>
            </div>
            <div>
              <h3 className="font-medium">Comprehensive Analytics</h3>
              <p className="text-saas-gray-medium text-sm">
                Track engagement, progress, and outcomes with detailed reporting and insights
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button className="bg-saas-blue hover:bg-saas-blue/90 text-white px-6">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-saas-gray-medium text-sm mt-2">
          Start your 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
