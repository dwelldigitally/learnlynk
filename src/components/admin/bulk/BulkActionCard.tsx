import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  lastUsed?: string;
  variant?: 'default' | 'primary' | 'warning' | 'danger';
}

const variantStyles = {
  default: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    hoverBorder: 'hover:border-primary/30',
    gradient: 'from-primary/5 to-transparent'
  },
  primary: {
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    hoverBorder: 'hover:border-blue-500/30',
    gradient: 'from-blue-500/5 to-transparent'
  },
  warning: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    hoverBorder: 'hover:border-amber-500/30',
    gradient: 'from-amber-500/5 to-transparent'
  },
  danger: {
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
    hoverBorder: 'hover:border-red-500/30',
    gradient: 'from-red-500/5 to-transparent'
  }
};

export function BulkActionCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  lastUsed,
  variant = 'default'
}: BulkActionCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 border border-border/50",
        "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
        "bg-gradient-to-br backdrop-blur-sm",
        styles.hoverBorder,
        styles.gradient
      )} 
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Icon with animated background */}
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
            "group-hover:scale-110 group-hover:shadow-md",
            styles.iconBg
          )}>
            <Icon className={cn("h-6 w-6 transition-colors", styles.iconColor)} />
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
          
          {/* Last used indicator */}
          {lastUsed && (
            <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
              <Clock className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-xs text-muted-foreground/60">
                {lastUsed}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}