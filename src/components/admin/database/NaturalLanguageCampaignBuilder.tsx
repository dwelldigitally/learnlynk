import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Send, Sparkles, Users, Target, Calendar, Mail, MessageSquare, Zap, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  workflowData?: any;
}

interface CampaignSuggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  prompt: string;
}

const campaignSuggestions: CampaignSuggestion[] = [
  {
    id: 'nurture-healthcare',
    title: 'Healthcare Program Nurture',
    description: 'Create a 7-email nurture sequence for healthcare program leads',
    icon: Target,
    prompt: 'Create a nurture campaign for healthcare program leads that includes 7 emails over 3 weeks, focusing on career outcomes and program benefits'
  },
  {
    id: 'reactivation-cold',
    title: 'Cold Lead Reactivation',
    description: 'Re-engage leads who haven\'t responded in 30+ days',
    icon: Zap,
    prompt: 'Build a reactivation campaign for cold leads who haven\'t engaged in 30 days, using multiple channels and urgency-based messaging'
  },
  {
    id: 'application-reminders',
    title: 'Application Completion',
    description: 'Automated reminders for incomplete applications',
    icon: Calendar,
    prompt: 'Create an automated campaign to remind students about incomplete applications with escalating urgency over 2 weeks'
  },
  {
    id: 'enrollment-push',
    title: 'Enrollment Deadline Push',
    description: 'Final push campaign before enrollment deadlines',
    icon: Users,
    prompt: 'Design a final enrollment push campaign with countdown timers and limited-time incentives for the last 2 weeks before deadline'
  }
];

export const NaturalLanguageCampaignBuilder = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m your AI Campaign Builder. I can help you create personalized marketing workflows using natural language. Just describe what kind of campaign you need, and I\'ll build it for you!\n\nFor example, try: "Create a welcome series for new nursing program leads" or "Build a re-engagement campaign for dormant prospects"',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
        workflowData: generateWorkflowData(inputValue)
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: CampaignSuggestion) => {
    setInputValue(suggestion.prompt);
  };

  const generateAIResponse = (input: string): string => {
    // Simulate AI response based on input
    if (input.toLowerCase().includes('nurture')) {
      return `I've created a comprehensive nurture campaign for you! Here's what I've built:

**Campaign Overview:**
📧 7-email sequence over 3 weeks
🎯 Targeted at healthcare program leads
📊 Automated behavior-based triggers
⏰ Optimal send times based on engagement data

**Email Sequence:**
1. Welcome & Program Overview (Day 1)
2. Success Stories from Alumni (Day 3)
3. Career Outcomes & Salary Data (Day 7)
4. Faculty Spotlight (Day 10)
5. Application Process Guide (Day 14)
6. Financial Aid Options (Day 17)
7. Final Call to Action (Day 21)

**Advanced Features:**
✨ Dynamic content based on lead location
📱 SMS backup for non-openers
🔄 Automatic A/B testing on subject lines
📈 Real-time performance tracking

Would you like me to customize any of these elements or add additional touchpoints?`;
    }

    if (input.toLowerCase().includes('reactivation') || input.toLowerCase().includes('cold')) {
      return `Perfect! I've designed a multi-channel reactivation campaign for your cold leads:

**Campaign Strategy:**
🎯 Target: Leads inactive for 30+ days
📊 Multi-channel approach (Email + SMS + Phone)
⚡ Escalating urgency sequence
🎁 Special incentives for re-engagement

**Sequence Breakdown:**
Week 1: "We Miss You" soft touch (Email)
Week 2: Value-focused content + limited offer (Email + SMS)
Week 3: Final chance with urgent messaging (Email + SMS + Call task)

**Smart Features:**
🤖 AI-powered subject line optimization
📱 Mobile-first design
🏆 Win-back offers based on lead score
📞 Automatic advisor assignment for responders

The campaign includes behavioral triggers and will automatically pause if leads re-engage. Ready to deploy?`;
    }

    return `Great request! I've analyzed your requirements and created a custom campaign strategy:

**Campaign Structure:**
📋 Multi-step automated workflow
🎯 Audience segmentation based on your criteria
📊 Performance tracking and optimization
⚡ Real-time personalization

**Key Components:**
✅ Automated email sequences
✅ SMS integration for high-priority messages
✅ Calendar booking automation
✅ Lead scoring adjustments
✅ Follow-up task creation

**Next Steps:**
I can help you refine the messaging, adjust timing, or add additional channels. What specific aspects would you like to customize?`;
  };

  const generateWorkflowData = (input: string) => {
    // Generate mock workflow data structure
    return {
      name: `AI Generated Campaign - ${new Date().toLocaleDateString()}`,
      type: 'nurture',
      steps: 7,
      channels: ['email', 'sms'],
      duration: '21 days',
      triggers: ['lead_created', 'behavior_score']
    };
  };

  const handlePreviewWorkflow = (workflowData: any) => {
    toast.success('Opening workflow preview...');
    // Would open in WorkflowBuilder
  };

  const handleExportWorkflow = (workflowData: any) => {
    toast.success('Workflow exported successfully!');
    // Would export to JSON or open in WorkflowBuilder
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Natural Language Campaign Builder</h2>
        <Badge variant="secondary" className="ml-2">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Campaign Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                      {message.workflowData && (
                        <div className="flex justify-start">
                          <Card className="max-w-[80%] border-dashed">
                            <CardContent className="p-3">
                              <div className="text-xs font-medium mb-2">Generated Workflow</div>
                              <div className="space-y-1 text-xs text-muted-foreground">
                                <div>📧 {message.workflowData.steps} steps</div>
                                <div>⏱️ {message.workflowData.duration}</div>
                                <div>📱 {message.workflowData.channels.join(', ')}</div>
                              </div>
                              <div className="flex space-x-2 mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handlePreviewWorkflow(message.workflowData)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Preview
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleExportWorkflow(message.workflowData)}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Export
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <Separator />
              
              <div className="p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Describe the campaign you want to build..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Suggestions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Start Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {campaignSuggestions.map((suggestion) => (
                <Card 
                  key={suggestion.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <suggestion.icon className="h-4 w-4 text-primary mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {suggestion.description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div>💡 Be specific about your audience and goals</div>
              <div>📊 Mention preferred channels (email, SMS, calls)</div>
              <div>⏰ Include timing preferences and duration</div>
              <div>🎯 Specify any special offers or incentives</div>
              <div>📈 Ask for A/B testing suggestions</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};