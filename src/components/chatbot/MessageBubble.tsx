import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChatMessage, AIAgent } from '@/types/chatbot';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: ChatMessage;
  agent: AIAgent;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  agent,
  showAvatar = true
}) => {
  const isUser = message.isUser;
  
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {showAvatar && !isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-sm" style={{ backgroundColor: agent.color }}>
            {agent.avatar}
          </AvatarFallback>
        </Avatar>
      )}
      {showAvatar && isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-sm bg-primary text-primary-foreground">
            👤
          </AvatarFallback>
        </Avatar>
      )}
      {!showAvatar && <div className="w-8" />}

      {/* Message content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {/* Message bubble */}
        <div
          className={`rounded-lg px-3 py-2 text-sm max-w-full break-words ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-muted text-foreground rounded-bl-none'
          }`}
        >
          {message.text}
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment) => (
                <Badge
                  key={attachment.id}
                  variant="outline"
                  className="text-xs"
                >
                  📎 {attachment.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};