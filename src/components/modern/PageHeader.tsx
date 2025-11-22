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
  return <div className={cn("text-center space-y-3 mb-8", className)}>
      
      {action && <div className="flex justify-center mt-4">
          {action}
        </div>}
    </div>;
};