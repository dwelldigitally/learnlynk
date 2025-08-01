import React from 'react';
import { cn } from '@/lib/utils';

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const NeoCard: React.FC<NeoCardProps> = ({ 
  children, 
  className,
  hover = true 
}) => {
  return (
    <div 
      className={cn(
        "neo-card p-6",
        hover && "hover:scale-105 transition-transform duration-300",
        className
      )}
    >
      {children}
    </div>
  );
};