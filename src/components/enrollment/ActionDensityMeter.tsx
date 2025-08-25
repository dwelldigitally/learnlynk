import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ActionDensityMeterProps {
  actionsPerHour: number;
}

export function ActionDensityMeter({ actionsPerHour }: ActionDensityMeterProps) {
  const targetActionsPerHour = 20; // Target benchmark
  const percentage = Math.min((actionsPerHour / targetActionsPerHour) * 100, 100);
  
  const getStatusColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-64">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Action Density</span>
          </div>
          <span className={`text-lg font-bold ${getStatusColor()}`}>
            {actionsPerHour}/hr
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0</span>
          <span>Target: {targetActionsPerHour}/hr</span>
        </div>
      </CardContent>
    </Card>
  );
}