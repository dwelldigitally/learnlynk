import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatInterface } from './ChatInterface';
import { AgentSelector } from './AgentSelector';
import { ConversationList } from './ConversationList';
import { useChatbot } from '@/hooks/useChatbot';
import { AI_AGENTS } from '@/data/aiAgents';

interface ModernChatbotProps {
  leadId?: string;
  mode?: 'student' | 'admin';
  className?: string;
}

export const ModernChatbot: React.FC<ModernChatbotProps> = ({ 
  leadId, 
  mode = 'student',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'agents' | 'chat' | 'conversations'>('agents'); // Start with agent selection
  
  const {
    conversations,
    messages,
    activeAgent,
    activeConversation,
    isTyping,
    loadingMessages,
    sendingMessage,
    unreadCount,
    switchAgent,
    sendMessage,
    markConversationAsRead,
  } = useChatbot(leadId);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset to agent selection when opening
      setView('agents');
    }
  };

  const handleAgentSelect = (agentId: string) => {
    switchAgent(agentId as any);
    setView('chat');
  };

  const handleConversationSelect = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      switchAgent(conversation.agentId);
      setView('chat');
      markConversationAsRead(conversationId);
    }
  };

  const currentAgent = AI_AGENTS.find(agent => agent.id === activeAgent) || AI_AGENTS[0];

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 transition-all duration-200 ${
          isOpen 
            ? 'bg-muted hover:bg-muted/80' 
            : 'bg-primary hover:bg-primary/90'
        } ${className}`}
      >
        {isOpen ? (
          <X size={24} className="text-primary-foreground" />
        ) : (
          <div className="relative">
            <MessageCircle size={24} className="text-primary-foreground" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
        )}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] shadow-xl flex flex-col z-50 overflow-hidden bg-background border">
          {/* Header */}
          <div 
            className="p-4 border-b flex justify-between items-center"
            style={{ backgroundColor: view === 'chat' ? currentAgent.color : 'hsl(var(--muted))' }}
          >
            <div className="flex items-center gap-3">
              {view === 'chat' && (
                <>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback 
                      className="text-xs text-white font-medium" 
                      style={{ backgroundColor: currentAgent.color }}
                    >
                      <img 
                        src={currentAgent.avatar} 
                        alt={currentAgent.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                      <span style={{ display: 'none' }}>
                        {currentAgent.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm text-background">
                      {currentAgent.name}
                    </h3>
                    <p className="text-xs text-background/80">
                      {isTyping ? 'Typing...' : 'Online'}
                    </p>
                  </div>
                </>
              )}
              {view === 'conversations' && (
                <h3 className="font-semibold text-foreground">Chat History</h3>
              )}
              {view === 'agents' && (
                <h3 className="font-semibold text-foreground">Choose Your AI Assistant</h3>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {view === 'chat' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView('conversations')}
                    className="text-background hover:bg-background/20 h-8 w-8 p-0"
                  >
                    📋
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView('agents')}
                    className="text-background hover:bg-background/20 h-8 w-8 p-0"
                  >
                    🤖
                  </Button>
                </>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleChatbot}
                className={`${
                  view === 'chat' 
                    ? 'text-background hover:bg-background/20' 
                    : 'text-foreground hover:bg-muted'
                } h-8 w-8 p-0`}
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {view === 'chat' && (
              <ChatInterface
                messages={messages}
                agent={currentAgent}
                onSendMessage={sendMessage}
                isTyping={isTyping}
                isLoading={loadingMessages}
                isSending={sendingMessage}
                leadId={leadId}
              />
            )}
            
            {view === 'conversations' && (
              <ConversationList
                conversations={conversations}
                onSelectConversation={handleConversationSelect}
                onBackToChat={() => setView('chat')}
              />
            )}
            
            {view === 'agents' && (
              <AgentSelector
                agents={AI_AGENTS}
                activeAgent={activeAgent}
                onSelectAgent={handleAgentSelect}
                onBackToChat={() => setView('chat')}
              />
            )}
          </div>
        </Card>
      )}
    </>
  );
};