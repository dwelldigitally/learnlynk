import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Bot,
  User,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AILeadSummaryProps {
  leadId: string;
  leadName: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

// LocalStorage key prefix for chat history
const CHAT_STORAGE_KEY = 'ai_lead_chat_';

export function AILeadSummary({ leadId, leadName }: AILeadSummaryProps) {
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const storageKey = `${CHAT_STORAGE_KEY}${leadId}`;
    const savedMessages = localStorage.getItem(storageKey);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messages = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setChatMessages(messages);
      } catch (e) {
        console.error('Error parsing saved chat messages:', e);
      }
    }
  }, [leadId]);

  // Save chat history to localStorage whenever messages change
  const saveMessages = useCallback((messages: ChatMessage[]) => {
    const storageKey = `${CHAT_STORAGE_KEY}${leadId}`;
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [leadId]);

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    saveMessages(updatedMessages);
    setAskingQuestion(true);
    const currentQuestion = question;
    setQuestion('');
    
    try {
      const { data, error } = await supabase.functions.invoke('lead-ai-summary', {
        body: {
          leadId,
          action: 'question',
          question: currentQuestion
        }
      });

      if (error) throw error;

      if (data.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date()
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setChatMessages(finalMessages);
        saveMessages(finalMessages);
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: 'Error',
        description: 'Failed to get answer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAskingQuestion(false);
    }
  };

  const clearChatHistory = () => {
    setChatMessages([]);
    const storageKey = `${CHAT_STORAGE_KEY}${leadId}`;
    localStorage.removeItem(storageKey);
    toast({
      title: 'Chat Cleared',
      description: 'Conversation history has been cleared.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Ask AI About This Lead
          </div>
          {chatMessages.length > 0 && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={clearChatHistory}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        {chatMessages.length > 0 && (
          <ScrollArea className="h-80 border rounded-lg p-3">
            <div className="space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0">
                      <Bot className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 text-sm ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {askingQuestion && (
                <div className="flex items-start gap-3">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      <span className="text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Question Input */}
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask any question about this lead..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                askQuestion();
              }
            }}
            disabled={askingQuestion}
          />
          <Button 
            onClick={askQuestion} 
            disabled={!question.trim() || askingQuestion}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggested Questions */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Summarize this lead",
              "What documents are missing?",
              "What is the current application status?",
              "What are the key risk factors?",
              "What's the next best action?",
              "What entry requirements are fulfilled?"
            ].map((suggestedQ) => (
              <Button
                key={suggestedQ}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setQuestion(suggestedQ)}
                disabled={askingQuestion}
              >
                {suggestedQ}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
