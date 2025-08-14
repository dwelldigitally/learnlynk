import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';

interface AICommunicationBadgeProps {
  isAIGenerated: boolean;
  className?: string;
}

export function AICommunicationBadge({ isAIGenerated, className }: AICommunicationBadgeProps) {
  if (!isAIGenerated) return null;
  
  return (
    <Badge 
      variant="secondary" 
      className={`bg-blue-50 text-blue-700 border-blue-200 ${className}`}
    >
      <Bot className="h-3 w-3 mr-1" />
      AI Generated
    </Badge>
  );
}