import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period?: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  className?: string;
}

const ModernStatsCard: React.FC<ModernStatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  description,
  className
}) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300",
      "bg-gradient-to-br from-card to-card/80",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">{value}</h3>
              {change && (
                <Badge 
                  variant="outline"
                  className={cn(
                    "text-xs font-medium border-0 px-2 py-1",
                    change.type === 'increase' 
                      ? "bg-success/10 text-success" 
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {change.type === 'increase' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(change.value)}%
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {change?.period && (
              <p className="text-xs text-muted-foreground">vs {change.period}</p>
            )}
          </div>
          
          {Icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </CardContent>
    </Card>
  );
};

export default ModernStatsCard;