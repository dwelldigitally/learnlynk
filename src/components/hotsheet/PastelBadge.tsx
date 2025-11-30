import React from 'react';
import { cn } from '@/lib/utils';
import { PastelColor, pastelColorClasses } from './utils';

interface PastelBadgeProps {
  children: React.ReactNode;
  color: PastelColor;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
  icon?: React.ReactNode;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function PastelBadge({
  children,
  color,
  size = 'md',
  className,
  dot,
  icon,
}: PastelBadgeProps) {
  const colorStyles = pastelColorClasses[color];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        colorStyles.bg,
        colorStyles.text,
        colorStyles.border,
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            color === 'emerald' && 'bg-emerald-500',
            color === 'sky' && 'bg-sky-500',
            color === 'amber' && 'bg-amber-500',
            color === 'violet' && 'bg-violet-500',
            color === 'rose' && 'bg-rose-500',
            color === 'indigo' && 'bg-indigo-500',
            color === 'slate' && 'bg-slate-500',
            color === 'mint' && 'bg-emerald-400',
            color === 'peach' && 'bg-orange-400',
            color === 'primary' && 'bg-primary'
          )}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
