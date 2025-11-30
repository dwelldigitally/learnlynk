import React from 'react';
import { cn } from '@/lib/utils';
import { PastelColor } from './utils';

interface StatusBarProps {
  color: PastelColor;
  width?: string;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const heightClasses = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
};

const colorClasses: Record<PastelColor, string> = {
  sky: 'bg-sky-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
  violet: 'bg-violet-400',
  rose: 'bg-rose-400',
  indigo: 'bg-indigo-400',
  slate: 'bg-slate-400',
  mint: 'bg-emerald-300',
  peach: 'bg-orange-300',
  primary: 'bg-primary',
};

export function StatusBar({
  color,
  width = 'w-full',
  height = 'md',
  className,
  animated = false,
}: StatusBarProps) {
  return (
    <div
      className={cn(
        'rounded-full',
        heightClasses[height],
        colorClasses[color],
        width,
        animated && 'animate-pulse',
        className
      )}
    />
  );
}

// Progress bar variant
interface StatusProgressBarProps {
  value: number; // 0-100
  color?: PastelColor;
  height?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

export function StatusProgressBar({
  value,
  color = 'primary',
  height = 'md',
  showBackground = true,
  className,
}: StatusProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        'w-full rounded-full overflow-hidden',
        heightClasses[height],
        showBackground && 'bg-muted/50',
        className
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500 ease-out',
          colorClasses[color]
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
