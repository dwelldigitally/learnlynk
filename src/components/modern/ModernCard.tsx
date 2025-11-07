import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className,
  hover = true
}) => {
  return (
    <Card
      className={cn(
        "transition-all duration-300 bg-card border border-border",
        hover && "hover:border-primary/20 hover:shadow-md",
        className
      )}
    >
      {children}
    </Card>
  );
};
