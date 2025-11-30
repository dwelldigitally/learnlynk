import React from 'react';
import { cn } from '@/lib/utils';

interface HotSheetCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'md' | 'lg' | 'xl' | '2xl';
  bordered?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
  xl: 'p-8',
};

const radiusClasses = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

export function HotSheetCard({
  children,
  className,
  hover = false,
  padding = 'lg',
  radius = '2xl',
  bordered = true,
  interactive = false,
  onClick,
}: HotSheetCardProps) {
  const isClickable = interactive || !!onClick;

  return (
    <div
      className={cn(
        'bg-card',
        bordered && 'border border-border/40',
        radiusClasses[radius],
        paddingClasses[padding],
        hover && 'transition-all duration-200 hover:bg-muted/5 hover:border-primary/20',
        isClickable && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// Variant for stats/metric cards
interface HotSheetStatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function HotSheetStatCard({
  title,
  value,
  icon,
  trend,
  className,
  onClick,
}: HotSheetStatCardProps) {
  return (
    <HotSheetCard
      hover={!!onClick}
      interactive={!!onClick}
      onClick={onClick}
      className={className}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && <div className="mt-1">{trend}</div>}
        </div>
        {icon && <div className="shrink-0">{icon}</div>}
      </div>
    </HotSheetCard>
  );
}
