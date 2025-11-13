import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PriorityAction {
  id: string;
  title: string;
  description: string;
  urgency: 'critical' | 'high' | 'medium';
  count: number;
  icon: LucideIcon;
  action: () => void;
  actionLabel: string;
}

interface PriorityActionCardProps {
  action: PriorityAction;
}

export const PriorityActionCard: React.FC<PriorityActionCardProps> = ({ action }) => {
  const Icon = action.icon;
  
  const getUrgencyStyles = () => {
    switch (action.urgency) {
      case 'critical':
        return {
          badge: 'bg-red-500/10 text-red-600 border-red-200',
          card: 'border-red-200 bg-red-500/5',
          icon: 'text-red-600'
        };
      case 'high':
        return {
          badge: 'bg-orange-500/10 text-orange-600 border-orange-200',
          card: 'border-orange-200 bg-orange-500/5',
          icon: 'text-orange-600'
        };
      case 'medium':
        return {
          badge: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
          card: 'border-yellow-200 bg-yellow-500/5',
          icon: 'text-yellow-600'
        };
    }
  };

  const styles = getUrgencyStyles();

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-md", styles.card)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-full bg-background shrink-0", styles.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-foreground">{action.title}</h3>
              <Badge variant="outline" className={cn("shrink-0", styles.badge)}>
                {action.count}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={action.action}
              className="w-full group"
            >
              {action.actionLabel}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
