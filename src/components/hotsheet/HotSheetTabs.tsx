import React from 'react';
import { cn } from '@/lib/utils';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HotSheetTabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function HotSheetTabsList({ children, className }: HotSheetTabsListProps) {
  return (
    <TabsList
      className={cn(
        'bg-muted/30 p-1.5 rounded-2xl h-auto gap-1',
        className
      )}
    >
      {children}
    </TabsList>
  );
}

interface HotSheetTabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  icon?: React.ReactNode;
}

export function HotSheetTabsTrigger({
  children,
  value,
  className,
  icon,
}: HotSheetTabsTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        'rounded-xl px-4 py-2 text-sm font-medium',
        'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground',
        'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
        'data-[state=active]:shadow-none',
        'transition-all duration-200',
        className
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </TabsTrigger>
  );
}

// Compact variant for secondary navigation
export function HotSheetTabsListCompact({ children, className }: HotSheetTabsListProps) {
  return (
    <TabsList
      className={cn(
        'bg-transparent p-0 h-auto gap-2',
        className
      )}
    >
      {children}
    </TabsList>
  );
}

export function HotSheetTabsTriggerCompact({
  children,
  value,
  className,
  icon,
}: HotSheetTabsTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs font-medium border',
        'data-[state=inactive]:border-border/40 data-[state=inactive]:bg-transparent',
        'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:border-primary/30',
        'data-[state=active]:bg-primary/10 data-[state=active]:text-primary',
        'data-[state=active]:border-primary/30',
        'data-[state=active]:shadow-none',
        'transition-all duration-200',
        className
      )}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </TabsTrigger>
  );
}
