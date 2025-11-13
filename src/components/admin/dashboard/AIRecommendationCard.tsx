import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const getImpactColor = () => {
    switch (recommendation.impact) {
      case 'high':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'medium':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'low':
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10 shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{recommendation.title}</h3>
              <Badge variant="outline" className={cn("text-xs", getImpactColor())}>
                {recommendation.impact} impact
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {recommendation.category}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {recommendation.description}
            </p>
            
            <Button 
              size="sm" 
              variant="default"
              onClick={recommendation.action}
              className="group"
            >
              {recommendation.actionLabel}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
