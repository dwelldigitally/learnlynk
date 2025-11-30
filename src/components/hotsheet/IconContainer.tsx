import React from 'react';
import { cn } from '@/lib/utils';
import { PastelColor, pastelColorClasses } from './utils';

interface IconContainerProps {
  children: React.ReactNode;
  color?: PastelColor | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-xl',
  xl: 'w-16 h-16 rounded-2xl',
};

const iconSizes = {
  sm: '[&>svg]:w-4 [&>svg]:h-4',
  md: '[&>svg]:w-5 [&>svg]:h-5',
  lg: '[&>svg]:w-6 [&>svg]:h-6',
  xl: '[&>svg]:w-8 [&>svg]:h-8',
};

export function IconContainer({
  children,
  color = 'primary',
  size = 'md',
  className,
}: IconContainerProps) {
  const colorStyles = color === 'muted' 
    ? { bg: 'bg-muted', text: 'text-muted-foreground', border: '' }
    : pastelColorClasses[color];

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        sizeClasses[size],
        iconSizes[size],
        colorStyles.bg,
        colorStyles.text,
        className
      )}
    >
      {children}
    </div>
  );
}
