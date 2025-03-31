
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-saas-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">AI</span>
            </div>
            <span className="font-bold text-xl">adaptify</span>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Return to Onboarding
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p className="text-gray-600 mb-8">
            This is a placeholder for your dashboard. In a real application, this would
            show your lead assignment analytics and team performance.
          </p>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="font-medium mb-2">Lead Distribution</h3>
              <div className="h-32 flex items-center justify-center text-gray-400">
                Chart Placeholder
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="font-medium mb-2">Team Performance</h3>
              <div className="h-32 flex items-center justify-center text-gray-400">
                Chart Placeholder
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="font-medium mb-2">Conversion Rates</h3>
              <div className="h-32 flex items-center justify-center text-gray-400">
                Chart Placeholder
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
