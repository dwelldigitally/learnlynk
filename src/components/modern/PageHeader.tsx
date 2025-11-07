import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  className
}) => {
  return (
    <div className={cn("text-center space-y-3 mb-8", className)}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex justify-center mt-4">
          {action}
        </div>
      )}
    </div>
  );
};
