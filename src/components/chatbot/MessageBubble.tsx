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
        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-border/30 shadow-medium">
          <AvatarFallback 
            className="text-sm text-white font-medium" 
            style={{ backgroundColor: agent.color }}
          >
            <img 
              src={agent.avatar} 
              alt={agent.name}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <span style={{ display: 'none' }}>
              {agent.name.split(' ').map(n => n[0]).join('')}
            </span>
          </AvatarFallback>
        </Avatar>
      )}
      {showAvatar && isUser && (
        <Avatar 
          className="h-9 w-9 shrink-0 ring-2 shadow-medium" 
          style={{ '--tw-ring-color': 'hsl(var(--chatbot-primary) / 0.4)' } as React.CSSProperties}
        >
          <AvatarFallback 
            className="text-sm text-white font-medium"
            style={{ background: 'var(--chatbot-gradient-primary)' }}
          >
            👤
          </AvatarFallback>
        </Avatar>
      )}
      {!showAvatar && <div className="w-9" />}

      {/* Message content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm max-w-full break-words shadow-soft transition-all duration-200 hover:shadow-medium ${
            isUser
              ? 'text-white rounded-br-lg'
              : 'text-foreground rounded-bl-lg border'
          }`}
          style={isUser ? {
            background: 'var(--chatbot-gradient-bubble)',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2), var(--shadow-soft)'
          } : {
            background: 'var(--chatbot-glass-bg)',
            borderColor: 'var(--chatbot-glass-border)',
            backdropFilter: 'blur(10px)'
          }}
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
        <span className={`text-xs text-muted-foreground/70 mt-2 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};