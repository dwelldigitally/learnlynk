import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, Clock } from 'lucide-react';
import { ChatConversation } from '@/types/chatbot';
import { AI_AGENTS } from '@/data/aiAgents';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: ChatConversation[];
  onSelectConversation: (conversationId: string) => void;
  onBackToChat: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  onBackToChat
}) => {
  const getAgent = (agentId: string) => {
    return AI_AGENTS.find(agent => agent.id === agentId) || AI_AGENTS[4];
  };

  if (conversations.length === 0) {
    return (
      <div className="h-full flex flex-col">
        {/* Back button */}
        <div className="p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToChat}
            className="gap-2"
          >
            <ChevronLeft size={16} />
            Back to Chat
          </Button>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-muted-foreground mb-2">No conversations yet</h3>
            <p className="text-sm text-muted-foreground">
              Start chatting with one of our AI assistants to see your conversation history here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Back button */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToChat}
          className="gap-2"
        >
          <ChevronLeft size={16} />
          Back to Chat
        </Button>
      </div>

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {conversations.map((conversation) => {
            const agent = getAgent(conversation.agentId);
            
            return (
              <div
                key={conversation.id}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 shrink-0">
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
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {agent.name}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {conversation.unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="h-5 w-5 flex items-center justify-center p-0 text-xs"
                          >
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={conversation.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {conversation.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};