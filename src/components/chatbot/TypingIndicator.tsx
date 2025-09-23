import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AIAgent } from '@/types/chatbot';

interface TypingIndicatorProps {
  agent: AIAgent;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ agent }) => {
  return (
    <div className="flex gap-2">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="text-sm" style={{ backgroundColor: agent.color }}>
          {agent.avatar}
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-muted rounded-lg rounded-bl-none px-4 py-3 flex items-center gap-1">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};