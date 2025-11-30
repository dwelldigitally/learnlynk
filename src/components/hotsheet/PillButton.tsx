import React from 'react';
import { cn } from '@/lib/utils';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-muted text-foreground hover:bg-muted/80',
  outline: 'border border-border/60 bg-transparent hover:bg-muted/10 hover:border-primary/30',
  ghost: 'bg-transparent hover:bg-muted/10',
  soft: 'bg-primary/10 text-primary hover:bg-primary/20',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs min-h-[32px]',
  md: 'px-4 py-2 text-sm min-h-[40px]',
  lg: 'px-6 py-2.5 text-base min-h-[44px]',
};

export function PillButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}: PillButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-full',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="shrink-0">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
}

// Icon-only variant
interface PillIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  label: string; // For accessibility
}

const iconSizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function PillIconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  label,
  className,
  ...props
}: PillIconButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        iconSizeClasses[size],
        className
      )}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}
