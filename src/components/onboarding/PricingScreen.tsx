
import React, { useState } from "react";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlanFeature {
  name: string;
  tooltip?: string;
  included: boolean | string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  recommended?: boolean;
  buttonText: string;
}

const PricingScreen: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<string>('growth');
  
  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'annual' ? 149 : 179,
      description: 'For small teams getting started with AI-powered lead assignment',
      features: [
        { name: 'Up to 5 team members', included: true },
        { name: 'Up to 100 leads per month', included: true },
        { name: 'Basic AI assignment', included: true },
        { name: 'CRM integration', included: '1 platform' },
        { name: 'Assignment explanations', included: false },
        { name: 'Performance analytics', included: 'Basic' },
        { name: 'Custom rules', included: false },
        { name: 'Priority support', included: false },
      ],
      buttonText: 'Start with Starter'
    },
    {
      id: 'growth',
      name: 'Growth',
      price: billingCycle === 'annual' ? 299 : 349,
      description: 'For growing teams looking to optimize their sales process',
      recommended: true,
      features: [
        { name: 'Up to 15 team members', included: true },
        { name: 'Up to 500 leads per month', included: true },
        { name: 'Advanced AI assignment', included: true },
        { name: 'CRM integration', included: '3 platforms' },
        { name: 'Assignment explanations', included: true },
        { name: 'Performance analytics', included: 'Advanced' },
        { name: 'Custom rules', included: true },
        { name: 'Priority support', included: false },
      ],
      buttonText: 'Choose Growth'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'annual' ? 699 : 849,
      description: 'For larger organizations with complex sales structures',
      features: [
        { name: 'Unlimited team members', tooltip: 'No limit on the number of users', included: true },
        { name: 'Unlimited leads', included: true },
        { name: 'Enterprise AI assignment', tooltip: 'Our most sophisticated AI model with highest accuracy', included: true },
        { name: 'CRM integration', included: 'Unlimited' },
        { name: 'Assignment explanations', included: true },
        { name: 'Performance analytics', included: 'Premium' },
        { name: 'Custom rules', included: true },
        { name: 'Priority support', included: true },
      ],
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <div className="slide-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Choose Your Plan
        </h1>
        <p className="text-saas-gray-medium max-w-md mx-auto">
          Select the plan that best fits your team's needs
        </p>
        
        <div className="inline-flex items-center bg-saas-gray-light rounded-lg p-1 mt-6">
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              billingCycle === 'monthly' 
                ? 'bg-white shadow-sm' 
                : 'text-saas-gray-medium'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              billingCycle === 'annual' 
                ? 'bg-white shadow-sm' 
                : 'text-saas-gray-medium'
            }`}
            onClick={() => setBillingCycle('annual')}
          >
            Annual <span className="text-saas-green text-xs">Save 15%</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`border rounded-xl p-6 relative ${
              selectedPlan === plan.id 
                ? 'border-saas-blue ring-2 ring-blue-100' 
                : 'border-gray-200 hover:border-gray-300'
            } ${plan.recommended ? 'md:transform md:-translate-y-2' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-saas-blue text-white px-3 py-1 rounded-full text-xs font-medium">
                Recommended
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="font-bold text-xl">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-saas-gray-medium">/month</span>
              </div>
              <p className="text-saas-gray-medium text-sm mt-2">
                {billingCycle === 'annual' ? 'Billed annually' : 'Billed monthly'}
              </p>
              <p className="mt-4 text-sm">{plan.description}</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  {feature.included ? (
                    <Check className="text-saas-green w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="ml-3">
                    <div className="flex items-center">
                      <span className="text-sm">{feature.name}</span>
                      {feature.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="ml-1">
                                <HelpCircle className="w-3 h-3 text-saas-gray-medium" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {typeof feature.included === 'string' && (
                      <span className="text-xs text-saas-gray-medium">{feature.included}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              className={`w-full ${
                selectedPlan === plan.id 
                  ? 'bg-saas-blue hover:bg-blue-600' 
                  : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
              }`}
              variant={selectedPlan === plan.id ? 'default' : 'outline'}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="bg-saas-gray-light p-4 rounded-lg text-center">
        <p className="text-sm mb-2">
          <strong>Need a custom solution?</strong> Contact our sales team for a tailored plan.
        </p>
        <Button variant="link" className="text-saas-blue">
          Contact Sales
        </Button>
      </div>
    </div>
  );
};

export default PricingScreen;
