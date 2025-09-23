import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AIAgent, ChatMessage } from '@/types/chatbot';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { QuickReplies } from './QuickReplies';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  agent: AIAgent;
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  isLoading: boolean;
  isSending: boolean;
  leadId?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  agent,
  onSendMessage,
  isTyping,
  isLoading,
  isSending,
  leadId
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when agent changes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [agent.id, isLoading]);

  const handleSendMessage = () => {
    if (currentMessage.trim() === '' || isSending) return;
    
    onSendMessage(currentMessage);
    setCurrentMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (reply: string) => {
    onSendMessage(reply);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  // Show agent greeting if no messages
  const displayMessages = messages.length === 0 ? [
    {
      id: 'greeting',
      text: agent.greeting,
      isUser: false,
      timestamp: new Date(),
      agentId: agent.id,
      messageType: 'text' as const,
      quickReplies: getInitialQuickReplies(agent.id)
    }
  ] : messages;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent shadow-medium"></div>
            </div>
          ) : (
            displayMessages.map((message, index) => (
              <div key={message.id} className="space-y-3 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <MessageBubble 
                  message={message} 
                  agent={agent}
                  showAvatar={index === 0 || displayMessages[index - 1]?.isUser !== message.isUser}
                />
                {message.quickReplies && message.quickReplies.length > 0 && (
                  <QuickReplies 
                    replies={message.quickReplies}
                    onReply={handleQuickReply}
                  />
                )}
              </div>
            ))
          )}
          
            {isTyping && <TypingIndicator agent={agent} />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Capabilities */}
      {messages.length === 0 && !isLoading && (
        <div className="px-4 py-3 border-t border-border/50 bg-gradient-to-r from-muted/20 to-muted/40 backdrop-blur-sm animate-fade-in shrink-0">
          <p className="text-xs text-muted-foreground mb-3 font-medium">✨ I can help with:</p>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.slice(0, 3).map((capability, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-3 py-1 rounded-full shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105 border border-border/30"
              >
                {capability}
              </Badge>
            ))}
            {agent.capabilities.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs px-3 py-1 rounded-full shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105"
              >
                +{agent.capabilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-border/50 bg-gradient-to-r from-card to-muted/20 backdrop-blur-sm shrink-0">
        <div className="flex items-end gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 h-11 w-11 p-0 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105 bg-muted/50 hover:bg-muted/80"
            disabled
          >
            <Paperclip size={18} className="text-muted-foreground" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${agent.name}...`}
              disabled={isSending}
              className="pr-12 resize-none min-h-[44px] rounded-xl border-border/50 shadow-soft focus:shadow-medium transition-all duration-200 bg-card/80 backdrop-blur-sm"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            className={`shrink-0 h-11 w-11 p-0 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105 bg-muted/50 hover:bg-muted/80 ${isRecording ? 'text-red-500' : 'text-muted-foreground'}`}
            disabled
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isSending}
            size="sm"
            className="shrink-0 h-11 w-11 p-0 rounded-xl shadow-medium hover:shadow-[0_4px_20px_hsl(var(--primary)/0.4)] transition-all duration-200 hover:scale-105 bg-gradient-chatbot text-white border border-white/20"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

function getInitialQuickReplies(agentId: string): string[] {
  switch (agentId) {
    case 'finance':
      return ['Check payment status', 'Payment plans', 'Scholarships'];
    case 'admissions':
      return ['Application status', 'Program info', 'Requirements'];
    case 'student-services':
      return ['Housing info', 'Campus events', 'Orientation'];
    case 'academic-support':
      return ['Course planning', 'Academic advisor', 'Study resources'];
    default:
      return ['How can you help?', 'Connect me with specialist', 'General info'];
  }
}