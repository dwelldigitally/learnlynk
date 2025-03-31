
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResultsScreen: React.FC = () => {
  return (
    <div className="slide-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Expected Results
        </h1>
        <p className="text-saas-gray-medium max-w-md mx-auto">
          Based on your team setup and industry, here's what you can expect
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-8 my-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-saas-green mb-1">+7%</div>
          <div className="text-sm text-saas-gray-medium">Revenue Increase</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">$1,250,000</div>
          <div className="text-sm text-saas-gray-medium">Additional Annual Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-saas-green mb-1">93%</div>
          <div className="text-sm text-saas-gray-medium">Improved Lead Distribution</div>
        </div>
      </div>
      
      <div className="bg-saas-gray-light rounded-lg p-4 mb-6">
        <h3 className="font-medium mb-2">ROI Calculation</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
            <span>Current Annual Revenue</span>
            <span className="font-medium">$16,500,000</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
            <span>Adaptify Annual Cost</span>
            <span className="font-medium">$36,000</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
            <span>Projected Additional Revenue</span>
            <span className="font-medium text-saas-green">$1,250,000</span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span>ROI</span>
            <span className="text-saas-green">34.7x</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-saas-blue to-blue-600 text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg mb-1">Ready for Professional Success</h3>
            <p className="text-sm opacity-90">Your team is set up for optimal performance</p>
          </div>
          <Button variant="secondary" className="bg-white text-saas-blue hover:bg-gray-100">
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
