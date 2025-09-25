import React, { useState } from 'react';
import { MessageCircle, X, History, Users } from 'lucide-react';
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
        className={`fixed bottom-6 right-6 rounded-full h-16 w-16 shadow-elevated z-50 transition-all duration-300 hover:scale-105 ${
          isOpen 
            ? 'bg-card border-2 border-border hover:shadow-large animate-scale-in' 
            : 'hover:shadow-large animate-bounce-in'
        } ${className}`}
        style={!isOpen ? { 
          background: 'var(--chatbot-gradient-primary)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), var(--shadow-elevated)'
        } : {}}
      >
        {isOpen ? (
          <X size={24} className="text-foreground transition-transform duration-200 hover:rotate-90" />
        ) : (
          <div className="relative">
            <MessageCircle size={26} className="text-primary-foreground" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs animate-bounce-in border-2 border-card"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
        )}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card 
          className="fixed bottom-24 right-6 w-96 h-[600px] shadow-elevated flex flex-col z-50 overflow-hidden border-2 backdrop-blur-xl animate-modal-enter"
          style={{
            background: 'var(--chatbot-glass-bg)',
            borderColor: 'var(--chatbot-glass-border)',
            backdropFilter: 'blur(20px) saturate(200%)',
            boxShadow: 'var(--chatbot-glass-shadow), 0 0 40px rgba(139, 92, 246, 0.1)'
          }}
        >
          {/* Header */}
          <div 
            className="p-4 border-b border-border/30 flex justify-between items-center relative overflow-hidden shrink-0"
            style={{ 
              background: view === 'chat' 
                ? `linear-gradient(135deg, ${currentAgent.color} 0%, hsl(var(--chatbot-primary)) 100%)`
                : 'var(--chatbot-gradient-accent)'
            }}
          >
            <div className="absolute inset-0 bg-blue-600/90 backdrop-blur-sm" />
            <div className="flex items-center gap-3 relative z-10">
              {view === 'chat' && (
                <>
                  <Avatar className="h-10 w-10 shrink-0 ring-2 ring-white/30 shadow-medium">
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
                  <div className="animate-fade-in">
                    <h3 className="font-semibold text-sm text-white">
                      {currentAgent.name}
                    </h3>
                    <p className="text-xs text-white/95 flex items-center gap-1">
                      {isTyping ? (
                        <>
                          <div className="w-1.5 h-1.5 bg-white/90 rounded-full animate-pulse" />
                          Typing...
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          Online
                        </>
                      )}
                    </p>
                  </div>
                </>
              )}
              {view === 'conversations' && (
                <h3 className="font-semibold text-foreground flex items-center gap-2 animate-fade-in">
                  📋 Chat History
                </h3>
              )}
              {view === 'agents' && (
                <h3 className="font-semibold text-foreground flex items-center gap-2 animate-fade-in">
                  🤖 Choose Your AI Assistant
                </h3>
              )}
            </div>
            
            <div className="flex items-center gap-2 relative z-10">
              {view === 'chat' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView('conversations')}
                    className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:scale-105 shadow-soft"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView('agents')}
                    className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:scale-105 shadow-soft"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleChatbot}
                className={`${
                  view === 'chat' 
                    ? 'text-white hover:bg-white/20' 
                    : 'text-foreground hover:bg-muted'
                } h-9 w-9 p-0 rounded-lg transition-all duration-200 hover:scale-105 hover:rotate-90`}
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div 
            className="flex-1 overflow-hidden min-h-0"
            style={{
              background: 'var(--chatbot-gradient-glass)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {view === 'chat' && (
              <div className="animate-fade-in h-full">
                <ChatInterface
                  messages={messages}
                  agent={currentAgent}
                  onSendMessage={sendMessage}
                  isTyping={isTyping}
                  isLoading={loadingMessages}
                  isSending={sendingMessage}
                  leadId={leadId}
                />
              </div>
            )}
            
            {view === 'conversations' && (
              <div className="animate-slide-in h-full">
                <ConversationList
                  conversations={conversations}
                  onSelectConversation={handleConversationSelect}
                  onBackToChat={() => setView('chat')}
                />
              </div>
            )}
            
            {view === 'agents' && (
              <div className="animate-fade-up h-full">
                <AgentSelector
                  agents={AI_AGENTS}
                  activeAgent={activeAgent}
                  onSelectAgent={handleAgentSelect}
                  onBackToChat={() => setView('chat')}
                />
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
};