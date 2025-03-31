
import React from "react";
import { Check, X } from "lucide-react";

const FeatureComparisonScreen: React.FC = () => {
  const features = [
    { name: "Lead Scoring", competitors: true, us: true },
    { name: "AI Recommendations", competitors: false, us: true },
    { name: "Team Performance", competitors: true, us: true },
    { name: "Real-time Analytics", competitors: false, us: true },
    { name: "CRM Integration", competitors: true, us: true },
    { name: "Custom Rules", competitors: false, us: true },
  ];

  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Feature Comparison
        </h1>
        <p className="text-saas-gray-medium">
          See how our features compare to traditional lead assignment solutions
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-1 font-medium">Features</div>
        <div className="col-span-1 font-medium text-center">Competitors</div>
        <div className="col-span-1 font-medium text-center">Adaptify</div>
      </div>
      
      <div className="space-y-1">
        {features.map((feature, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 feature-item">
            <div className="col-span-1">{feature.name}</div>
            <div className="col-span-1 flex justify-center">
              {feature.competitors ? (
                <Check className="text-saas-green w-5 h-5" />
              ) : (
                <X className="text-saas-red w-5 h-5" />
              )}
            </div>
            <div className="col-span-1 flex justify-center">
              <Check className="text-saas-green w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-saas-gray-medium">
          * Based on average feature comparison across top 5 competitors
        </div>
        <div className="flex space-x-2">
          <div className="status-badge-green">98% Accurate</div>
          <div className="status-badge-blue">Updated Weekly</div>
        </div>
      </div>
    </div>
  );
};

export default FeatureComparisonScreen;
