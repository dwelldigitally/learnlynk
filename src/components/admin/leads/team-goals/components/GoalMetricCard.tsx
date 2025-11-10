import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface GoalMetricCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  icon?: React.ReactNode;
  trend?: number; // percentage change from previous period
}

export const GoalMetricCard: React.FC<GoalMetricCardProps> = ({
  title,
  current,
  target,
  unit,
  icon,
  trend
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isOnTrack = percentage >= 90;
  const isAtRisk = percentage >= 70 && percentage < 90;
  
  const formatValue = (value: number) => {
    if (unit === '$') {
      return `$${value.toLocaleString()}`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(current)}</div>
        <p className="text-xs text-muted-foreground mt-1">
          Target: {formatValue(target)}
        </p>
        <Progress 
          value={percentage} 
          className={`mt-3 ${
            isOnTrack ? '[&>div]:bg-green-500' : 
            isAtRisk ? '[&>div]:bg-yellow-500' : 
            '[&>div]:bg-red-500'
          }`}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium">{percentage.toFixed(0)}%</span>
          {trend !== undefined && (
            <div className={`flex items-center text-xs ${
              trend > 0 ? 'text-green-600' : 
              trend < 0 ? 'text-red-600' : 
              'text-muted-foreground'
            }`}>
              {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : 
               trend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : 
               <Minus className="h-3 w-3 mr-1" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
