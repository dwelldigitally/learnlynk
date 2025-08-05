import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, Zap } from 'lucide-react';
import { Lead } from '@/types/lead';

interface UrgencyIndicatorProps {
  lead: Lead;
}

export function UrgencyIndicator({ lead }: UrgencyIndicatorProps) {
  const calculateUrgency = () => {
    const now = new Date();
    const leadAge = (now.getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60); // hours
    
    let urgencyScore = 0;
    let factors: string[] = [];
    
    // Age factor (fresher = more urgent)
    if (leadAge < 1) {
      urgencyScore += 40;
      factors.push('Very fresh lead');
    } else if (leadAge < 24) {
      urgencyScore += 30;
      factors.push('Fresh lead');
    } else if (leadAge < 72) {
      urgencyScore += 15;
    } else {
      urgencyScore -= 10;
      factors.push('Getting cold');
    }
    
    // Priority level
    if (lead.priority === 'urgent') {
      urgencyScore += 35;
      factors.push('Marked urgent');
    } else if (lead.priority === 'high') {
      urgencyScore += 25;
      factors.push('High priority');
    } else if (lead.priority === 'medium') {
      urgencyScore += 10;
    }
    
    // Status urgency
    if (lead.status === 'new') {
      urgencyScore += 20;
      factors.push('Uncontacted');
    } else if (lead.status === 'contacted') {
      urgencyScore += 10;
    }
    
    // Lead score factor
    if (lead.lead_score >= 80) {
      urgencyScore += 15;
      factors.push('High lead score');
    } else if (lead.lead_score >= 60) {
      urgencyScore += 10;
    }
    
    // Source quality
    const highQualitySources = ['referral', 'agent', 'event', 'phone', 'walk_in'];
    if (highQualitySources.includes(lead.source)) {
      urgencyScore += 10;
      factors.push('Quality source');
    }
    
    // Time-sensitive factors
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    
    // Business hours boost
    if (currentHour >= 9 && currentHour <= 17 && currentDay >= 1 && currentDay <= 5) {
      urgencyScore += 5;
    }
    
    // International consideration
    if (lead.country && lead.country !== 'United States') {
      urgencyScore += 5;
      factors.push('International lead');
    }
    
    // Last contact consideration
    if (lead.last_contacted_at) {
      const lastContactAge = (now.getTime() - new Date(lead.last_contacted_at).getTime()) / (1000 * 60 * 60);
      if (lastContactAge > 48) {
        urgencyScore += 10;
        factors.push('No recent contact');
      }
    }
    
    return { score: Math.max(0, Math.min(100, urgencyScore)), factors };
  };

  const { score, factors } = calculateUrgency();
  
  const getUrgencyData = (score: number) => {
    if (score >= 80) {
      return {
        level: 'Critical',
        variant: 'destructive' as const,
        icon: <AlertTriangle className="h-3 w-3" />,
        color: 'text-red-600'
      };
    } else if (score >= 60) {
      return {
        level: 'High',
        variant: 'default' as const,
        icon: <Zap className="h-3 w-3" />,
        color: 'text-orange-600'
      };
    } else if (score >= 40) {
      return {
        level: 'Medium',
        variant: 'secondary' as const,
        icon: <Clock className="h-3 w-3" />,
        color: 'text-blue-600'
      };
    } else {
      return {
        level: 'Low',
        variant: 'outline' as const,
        icon: <Clock className="h-3 w-3" />,
        color: 'text-gray-600'
      };
    }
  };

  const urgencyData = getUrgencyData(score);

  return (
    <div className="flex items-center gap-2">
      <Badge variant={urgencyData.variant} className="flex items-center gap-1">
        {urgencyData.icon}
        {urgencyData.level} Urgency
      </Badge>
      <span className={`text-xs font-medium ${urgencyData.color}`}>
        {score}/100
      </span>
    </div>
  );
}