import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickRepliesProps {
  replies: string[];
  onReply: (reply: string) => void;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onReply }) => {
  return (
    <div className="flex flex-wrap gap-2 ml-10">
      {replies.map((reply, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onReply(reply)}
          className="text-xs h-auto py-1 px-2 rounded-full border-primary/20 hover:bg-primary/10"
        >
          {reply}
        </Button>
      ))}
    </div>
  );
};