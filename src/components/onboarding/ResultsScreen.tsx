
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResultsScreen: React.FC = () => {
  const revenueData = [
    { name: 'Current', value: 1650000 },
    { name: 'With Adaptify', value: 1897500 },
  ];
  
  const recentLeads = [
    { id: "L-1023", name: "Acme Corp", industry: "Manufacturing", bestAdvisor: "John Smith", confidence: 94 },
    { id: "L-1022", name: "TechGrow", industry: "Technology", bestAdvisor: "Mike Lee", confidence: 87 },
    { id: "L-1021", name: "MediCare Plus", industry: "Healthcare", bestAdvisor: "Amy Wilson", confidence: 91 },
    { id: "L-1020", name: "Global Services", industry: "Consulting", bestAdvisor: "John Smith", confidence: 82 },
    { id: "L-1019", name: "Retail Solutions", industry: "Retail", bestAdvisor: "Amy Wilson", confidence: 88 },
  ];

  return (
    <div className="slide-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Your AI Model Results
        </h1>
        <p className="text-saas-gray-medium max-w-md mx-auto">
          Based on your team and data, here's what you can expect
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-8 my-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-saas-green mb-1">+15%</div>
          <div className="text-sm text-saas-gray-medium">Revenue Increase</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">+23%</div>
          <div className="text-sm text-saas-gray-medium">Lead Conversion Rate</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-saas-green mb-1">97%</div>
          <div className="text-sm text-saas-gray-medium">AI Prediction Accuracy</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-saas-gray-light rounded-lg p-4">
          <h3 className="font-medium mb-3">Annual Revenue Projection</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                <YAxis type="category" dataKey="name" />
                <Tooltip 
                  formatter={(value) => [`$${(value).toLocaleString()}`, 'Revenue']}
                  labelFormatter={(value) => value === 'Current' ? 'Current Revenue' : 'Projected with Adaptify'}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-saas-gray-light rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">AI Assignment Demo</h3>
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Recent Leads
            </div>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{lead.name}</span>
                  <span className="text-xs text-saas-gray-medium">{lead.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-saas-gray-medium">{lead.industry}</div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {lead.bestAdvisor}
                    </span>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {lead.confidence}% match
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <span className="font-medium text-saas-green">$2,475,000</span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span>ROI</span>
            <span className="text-saas-green">68.8x</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-saas-blue to-blue-600 text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg mb-1">Ready to optimize your sales assignments</h3>
            <p className="text-sm opacity-90">Continue to select your pricing plan</p>
          </div>
          <Button variant="secondary" className="bg-white text-saas-blue hover:bg-gray-100">
            Next Step <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
