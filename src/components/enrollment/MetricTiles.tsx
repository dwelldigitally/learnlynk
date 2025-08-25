import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricData {
  title: string;
  currentValue: string | number;
  previousValue: string | number;
  improvement: number;
  icon: React.ComponentType<any>;
  color: string;
}

interface MetricTilesProps {
  metrics: MetricData[];
}

export function MetricTiles({ metrics }: MetricTilesProps) {
  const formatImprovement = (improvement: number) => {
    const isPositive = improvement > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    
    return (
      <Badge 
        variant="secondary" 
        className={`${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {isPositive ? '+' : ''}{improvement.toFixed(1)}%
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-5 w-5 ${metric.color}`} />
                  <span className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </span>
                </div>
                {formatImprovement(metric.improvement)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-foreground">
                    {metric.currentValue}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {metric.previousValue}
                  </span>
                </div>
                
                {/* Simple sparkline representation */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metric.color.replace('text-', 'bg-')}`}
                    style={{ width: `${Math.min(Math.abs(metric.improvement) * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}