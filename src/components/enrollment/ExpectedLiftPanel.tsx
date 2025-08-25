import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ExpectedLiftPanelProps {
  isActive: boolean;
  expectedLift: number;
  policyName: string;
}

export function ExpectedLiftPanel({ isActive, expectedLift, policyName }: ExpectedLiftPanelProps) {
  const [animatedLift, setAnimatedLift] = useState(0);

  useEffect(() => {
    if (isActive) {
      // Animate the lift value when policy becomes active
      const timer = setTimeout(() => {
        setAnimatedLift(expectedLift);
      }, 200);
      
      return () => clearTimeout(timer);
    } else {
      setAnimatedLift(0);
    }
  }, [isActive, expectedLift]);

  const getLiftIcon = () => {
    if (animatedLift > 0) return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (animatedLift < 0) return <TrendingDown className="h-5 w-5 text-red-600" />;
    return <Minus className="h-5 w-5 text-gray-400" />;
  };

  const getLiftColor = () => {
    if (animatedLift > 0) return 'text-green-600';
    if (animatedLift < 0) return 'text-red-600';
    return 'text-gray-400';
  };

  const getStatusBadge = () => {
    if (isActive) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    }
    return <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Expected Lift</span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Lift Metric */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            {getLiftIcon()}
          </div>
          <div className={`text-3xl font-bold transition-all duration-500 ${getLiftColor()}`}>
            {animatedLift > 0 ? '+' : ''}{animatedLift.toFixed(1)}%
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Conversion Rate Improvement
          </p>
        </div>

        {/* Policy Status */}
        <div className="border-t border-border pt-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Policy:</span>
              <span className="text-sm font-medium text-foreground">{policyName}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {isActive ? 'Running' : 'Stopped'}
              </span>
            </div>
            
            {isActive && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Impact:</span>
                <span className="text-sm font-medium text-green-600">Immediate</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Metrics */}
        {isActive && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Projected Impact</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Response Time:</span>
                <span className="font-medium text-foreground">-40%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lead Temperature:</span>
                <span className="font-medium text-foreground">+25%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Conversion Rate:</span>
                <span className="font-medium text-green-600">+{expectedLift}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="border-t border-border pt-4">
          <h4 className="font-medium text-foreground mb-2">Recommendations</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Monitor callback completion rates</li>
            <li>• Track conversion by response time</li>
            <li>• Adjust criteria based on results</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}