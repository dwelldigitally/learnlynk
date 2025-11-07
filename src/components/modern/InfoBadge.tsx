import React from 'react';
import { cn } from '@/lib/utils';

interface InfoBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'destructive' | 'default' | 'secondary';
  className?: string;
}

export const InfoBadge: React.FC<InfoBadgeProps> = ({
  children,
  variant = 'default',
  className
}) => {
  const variantStyles = {
    success: 'bg-success-light text-success border-success/20',
    warning: 'bg-warning-light text-warning border-warning/20',
    destructive: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
    default: 'bg-primary-light text-primary border-primary/20',
    secondary: 'bg-muted text-muted-foreground border-border'
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
