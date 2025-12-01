import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { HotSheetCard, IconContainer, PastelBadge, PillButton, getUrgencyColor } from '@/components/hotsheet';

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
  const urgencyColor = getUrgencyColor(action.urgency);

  return (
    <HotSheetCard hover padding="md">
      <div className="flex items-start gap-3">
        <IconContainer color={urgencyColor} size="md">
          <Icon />
        </IconContainer>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground">{action.title}</h3>
            <PastelBadge color={urgencyColor} size="sm">
              {action.count}
            </PastelBadge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
          
          <PillButton 
            size="sm" 
            variant="outline"
            onClick={action.action}
            className="w-full group"
            icon={<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          >
            {action.actionLabel}
          </PillButton>
        </div>
      </div>
    </HotSheetCard>
  );
};
