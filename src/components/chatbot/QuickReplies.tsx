import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickRepliesProps {
  replies: string[];
  onReply: (reply: string) => void;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onReply }) => {
  return (
    <div className="flex flex-wrap gap-2 ml-11 animate-fade-in">
      {replies.map((reply, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onReply(reply)}
          className="text-xs rounded-full px-3 py-1.5 border-chatbot-border/50 bg-card/90 hover:bg-gradient-chatbot hover:text-white hover:border-white/30 transition-all duration-200 hover:scale-105 shadow-soft hover:shadow-[0_4px_20px_hsl(var(--primary)/0.3)] backdrop-blur-sm animate-stagger"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {reply}
        </Button>
      ))}
    </div>
  );
};