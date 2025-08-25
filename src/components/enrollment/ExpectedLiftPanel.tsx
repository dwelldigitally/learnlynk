import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3, Target } from 'lucide-react';

interface ExpectedLiftPanelProps {
  isActive: boolean;
  expectedLift: number;
  policyName: string;
}

export function ExpectedLiftPanel({ isActive, expectedLift, policyName }: ExpectedLiftPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span>Expected Impact</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
            isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}>
            <TrendingUp className="h-8 w-8" />
          </div>
          <p className="font-medium text-foreground">{policyName}</p>
          <p className={`text-sm ${isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
            {isActive ? 'Currently Active' : 'Not Active'}
          </p>
        </div>

        {/* Expected Lift */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-primary mr-2" />
            <span className="text-2xl font-bold text-primary">+{expectedLift}%</span>
          </div>
          <p className="text-sm text-muted-foreground">Expected Conversion Lift</p>
        </div>

        {/* Impact Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Response Time</span>
            <span className="text-sm font-medium text-foreground">
              {isActive ? 'Improved' : 'Baseline'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Lead Quality</span>
            <span className="text-sm font-medium text-foreground">
              {isActive ? 'Enhanced' : 'Standard'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Conversion Rate</span>
            <span className="text-sm font-medium text-foreground">
              {isActive ? `+${expectedLift}%` : 'Baseline'}
            </span>
          </div>
        </div>

        {/* ROI Indicator */}
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Expected ROI</p>
          <p className="text-lg font-bold text-foreground">
            {isActive ? `${(expectedLift * 2.1).toFixed(1)}:1` : 'Not Active'}
          </p>
          <p className="text-xs text-muted-foreground">
            Based on industry benchmarks
          </p>
        </div>
      </CardContent>
    </Card>
  );
}