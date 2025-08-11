import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  hover = false 
}) => {
  return (
    <div 
      className={cn(
        "glass-card p-6",
        hover && "hover:scale-105 transition-transform duration-300",
        className
      )}
    >
      {children}
    </div>
  );
};