import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetadataItemProps {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
}

export const MetadataItem: React.FC<MetadataItemProps> = ({
  icon: Icon,
  label,
  value,
  className
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <span>{value}</span>
      </div>
    </div>
  );
};
