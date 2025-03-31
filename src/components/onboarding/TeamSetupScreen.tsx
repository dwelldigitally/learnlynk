
import React from "react";
import { Check } from "lucide-react";

const TeamSetupScreen: React.FC = () => {
  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Configure Your Team
        </h1>
        <p className="text-saas-gray-medium">
          Set up your sales team and define their specialties
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="col-span-1">
          <h3 className="font-medium mb-3">Team Members</h3>
          <div className="space-y-2">
            <div className="bg-saas-gray-light p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-saas-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">JS</span>
                </div>
                <span>John Smith</span>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Admin</span>
            </div>
            
            <div className="bg-saas-gray-light p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">AW</span>
                </div>
                <span>Amy Wilson</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Sales Rep</span>
            </div>
            
            <div className="bg-saas-gray-light p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">ML</span>
                </div>
                <span>Mike Lee</span>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Sales Rep</span>
            </div>
          </div>
        </div>
        
        <div className="col-span-1">
          <h3 className="font-medium mb-3">Specialties</h3>
          <div className="space-y-2">
            <div className="bg-saas-gray-light p-3 rounded-lg flex items-center justify-between">
              <span>Enterprise</span>
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-saas-blue rounded-full flex items-center justify-center text-xs text-white">J</div>
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">A</div>
              </div>
            </div>
            
            <div className="bg-saas-gray-light p-3 rounded-lg flex items-center justify-between">
              <span>Mid-Market</span>
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-xs text-white">M</div>
              </div>
            </div>
            
            <div className="bg-saas-gray-light p-3 rounded-lg flex items-center justify-between">
              <span>SMB</span>
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">A</div>
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-xs text-white">M</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-saas-gray-light p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium mb-2">AI-Recommended Team Configuration</h3>
        <p className="text-sm text-saas-gray-medium mb-3">
          Based on your team structure, we recommend the following setup for optimal results:
        </p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Check className="text-saas-green w-4 h-4" />
            <span className="text-sm">Amy should focus on SMB leads with manufacturing backgrounds</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="text-saas-green w-4 h-4" />
            <span className="text-sm">Mike performs best with technology mid-market companies</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="text-saas-green w-4 h-4" />
            <span className="text-sm">John excels with enterprise financial services clients</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSetupScreen;
