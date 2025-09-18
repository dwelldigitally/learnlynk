import React from "react";

export const QuickStatsPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-t">
      <div className="bg-card rounded-lg p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-2xl font-bold text-primary mb-1">4/5</div>
        <div className="text-sm text-muted-foreground">Documents Approved</div>
      </div>
      <div className="bg-card rounded-lg p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-2xl font-bold text-blue-600 mb-1">23</div>
        <div className="text-sm text-muted-foreground">Days in Process</div>
      </div>
      <div className="bg-card rounded-lg p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
        <div className="text-sm text-muted-foreground">AI Interactions</div>
      </div>
      <div className="bg-card rounded-lg p-4 text-center hover:shadow-md transition-shadow">
        <div className="text-2xl font-bold text-success mb-1">89%</div>
        <div className="text-sm text-muted-foreground">Success Score</div>
      </div>
    </div>
  );
};