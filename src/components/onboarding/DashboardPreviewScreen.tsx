
import React from "react";
import { Check, ArrowRight, BarChart3, Users, BarChart, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardPreviewScreen: React.FC = () => {
  return (
    <div className="slide-container">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Your Dashboard Preview
        </h1>
        <p className="text-saas-gray-medium max-w-md mx-auto">
          Here's what you'll have access to after completing setup
        </p>
      </div>
      
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="bg-saas-gray-light border-b border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="ml-4 text-sm font-medium">Adaptify Dashboard</div>
          </div>
        </div>
        
        <div className="p-4 bg-white">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-1 bg-saas-gray-light rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-saas-blue" />
                </div>
                <span className="font-medium">Performance</span>
              </div>
              <div className="h-24 bg-gray-300 rounded opacity-70"></div>
            </div>
            
            <div className="col-span-1 bg-saas-gray-light rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium">Conversion Rate</span>
              </div>
              <div className="h-24 bg-gray-300 rounded opacity-70"></div>
            </div>
            
            <div className="col-span-1 bg-saas-gray-light rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium">Lead Distribution</span>
              </div>
              <div className="h-24 bg-gray-300 rounded opacity-70"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2 bg-saas-gray-light rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-600" />
                </div>
                <span className="font-medium">Team Performance Comparison</span>
              </div>
              <div className="h-32 bg-gray-300 rounded opacity-70"></div>
            </div>
            
            <div className="col-span-1 bg-saas-gray-light rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <span className="font-medium">Recent Assignments</span>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded-full w-full opacity-70"></div>
                <div className="h-6 bg-gray-300 rounded-full w-full opacity-70"></div>
                <div className="h-6 bg-gray-300 rounded-full w-full opacity-70"></div>
                <div className="h-6 bg-gray-300 rounded-full w-full opacity-70"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <h3 className="font-medium">Available Dashboard Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Check className="text-saas-green w-5 h-5 mt-1" />
            <div>
              <h4 className="font-medium">AI vs Round Robin Simulation</h4>
              <p className="text-sm text-saas-gray-medium">Compare different assignment strategies</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Check className="text-saas-green w-5 h-5 mt-1" />
            <div>
              <h4 className="font-medium">Team Performance Analytics</h4>
              <p className="text-sm text-saas-gray-medium">Track individual and team performance</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Check className="text-saas-green w-5 h-5 mt-1" />
            <div>
              <h4 className="font-medium">AI Algorithm Metrics</h4>
              <p className="text-sm text-saas-gray-medium">View accuracy and prediction confidence</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Check className="text-saas-green w-5 h-5 mt-1" />
            <div>
              <h4 className="font-medium">Configuration Management</h4>
              <p className="text-sm text-saas-gray-medium">Adjust settings and rules anytime</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-saas-blue to-blue-600 text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg mb-1">Ready to Get Started</h3>
            <p className="text-sm opacity-90">Complete setup and access your dashboard</p>
          </div>
          <Button variant="secondary" className="bg-white text-saas-blue hover:bg-gray-100">
            Complete Setup <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreviewScreen;
