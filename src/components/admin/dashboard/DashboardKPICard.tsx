import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HotSheetCard, IconContainer, PastelBadge, getTrendColor } from '@/components/hotsheet';

interface DashboardKPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
  className?: string;
}

export const DashboardKPICard: React.FC<DashboardKPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  onClick,
  className
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const trendColor = getTrendColor(trend);

  return (
    <HotSheetCard 
      hover
      interactive={!!onClick}
      onClick={onClick}
      className={className}
      padding="md"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trendValue && (
            <div className="mt-2">
              <PastelBadge color={trendColor} size="sm" icon={getTrendIcon()}>
                {trendValue}
              </PastelBadge>
            </div>
          )}
        </div>
        <div className="ml-4">
          <IconContainer color="primary" size="lg">
            <Icon />
          </IconContainer>
        </div>
      </div>
    </HotSheetCard>
  );
};
