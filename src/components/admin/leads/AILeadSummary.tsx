import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  RefreshCw, 
  MessageSquare, 
  Send, 
  Sparkles,
  Bot,
  User
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

export function AILeadSummary({ leadId, leadName }: AILeadSummaryProps) {
  const { toast } = useToast();
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [question, setQuestion] = useState('');
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('lead-ai-summary', {
        body: {
          leadId,
          action: 'summary'
        }
      });

      if (error) throw error;

      if (data.success) {
        setSummary(data.response);
        toast({
          title: 'AI Summary Generated',
          description: 'Lead summary has been created successfully',
        });
      } else {
        throw new Error(data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate AI summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setAskingQuestion(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('lead-ai-summary', {
        body: {
          leadId,
          action: 'question',
          question: question
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

        setChatMessages(prev => [...prev, aiMessage]);
        setQuestion('');
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

  const refreshSummary = async () => {
    setRefreshing(true);
    try {
      await generateSummary();
    } finally {
      setRefreshing(false);
    }
  };

  // Removed auto-generation on mount - summary is now created only when user clicks a button

  return (
    <div className="space-y-6">
      {/* AI Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Lead Summary
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={refreshSummary}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <span className="text-muted-foreground">Generating AI summary...</span>
            </div>
          ) : summary ? (
            <div className="prose prose-sm max-w-none">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {summary}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No summary available</p>
              <Button onClick={generateSummary} className="mt-2" size="sm">
                Generate Summary
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Q&A Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Ask AI About This Lead
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          {chatMessages.length > 0 && (
            <ScrollArea className="h-64 border rounded-lg p-3">
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
                "What is this lead's application status?",
                "What are the key risk factors?",
                "What documents are missing?",
                "What's the next best action?",
                "How engaged is this lead?"
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
    </div>
  );
}