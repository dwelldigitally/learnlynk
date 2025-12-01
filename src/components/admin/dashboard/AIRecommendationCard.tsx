import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { HotSheetCard, IconContainer, PastelBadge, PillButton, getImpactColor } from '@/components/hotsheet';

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  action: () => void;
  actionLabel: string;
}

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ recommendation }) => {
  const impactColor = getImpactColor(recommendation.impact);

  return (
    <HotSheetCard hover padding="md" className="border-primary/20">
      <div className="flex items-start gap-3">
        <IconContainer color="violet" size="md">
          <Sparkles />
        </IconContainer>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{recommendation.title}</h3>
            <PastelBadge color={impactColor} size="sm">
              {recommendation.impact} impact
            </PastelBadge>
            <PastelBadge color="slate" size="sm">
              {recommendation.category}
            </PastelBadge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {recommendation.description}
          </p>
          
          <PillButton 
            size="sm" 
            variant="primary"
            onClick={recommendation.action}
            className="group"
            icon={<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          >
            {recommendation.actionLabel}
          </PillButton>
        </div>
      </div>
    </HotSheetCard>
  );
};
