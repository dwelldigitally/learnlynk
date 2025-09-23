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
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            displayMessages.map((message, index) => (
              <div key={message.id} className="space-y-2">
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

      {/* Capabilities */}
      {messages.length === 0 && !isLoading && (
        <div className="px-4 py-2 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">I can help with:</p>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 3).map((capability, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
            {agent.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{agent.capabilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 h-10 w-10 p-0"
            disabled
          >
            <Paperclip size={18} />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${agent.name}...`}
              disabled={isSending}
              className="pr-12 resize-none min-h-[40px]"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            className={`shrink-0 h-10 w-10 p-0 ${isRecording ? 'text-red-500' : ''}`}
            disabled
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isSending}
            size="sm"
            className="shrink-0 h-10 w-10 p-0"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
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