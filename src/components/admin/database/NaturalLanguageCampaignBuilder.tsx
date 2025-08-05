import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Send, Sparkles, Users, Target, Calendar, Mail, MessageSquare, Zap, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { CampaignService } from '@/services/campaignService';

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

interface NaturalLanguageCampaignBuilderProps {
  onCampaignCreated?: (campaign: any) => void;
}

export const NaturalLanguageCampaignBuilder = ({ onCampaignCreated }: NaturalLanguageCampaignBuilderProps) => {
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
      return `I've created a comprehensive 7-step nurture workflow for you! Here's the complete sequence:

**Campaign Workflow:**
🚀 **Step 1: Welcome Email** (Immediate)
   Subject: "Welcome to Your Healthcare Journey!"
   Content: Program overview and what to expect

⏰ **Step 2: Wait 2 Days**

📧 **Step 3: Success Stories Email** (Day 3)
   Subject: "From Student to Healthcare Professional"
   Content: Alumni success stories and career outcomes

⏰ **Step 4: Wait 4 Days**

📊 **Step 5: Career Data Email** (Day 7)
   Subject: "Your Future Salary & Job Prospects"
   Content: Employment statistics and salary data

⏰ **Step 6: Wait 3 Days**

👨‍⚕️ **Step 7: Faculty Spotlight Email** (Day 10)
   Subject: "Meet Your Expert Instructors"
   Content: Faculty credentials and teaching approach

⏰ **Step 8: Wait 4 Days**

📋 **Step 9: Application Guide Email** (Day 14)
   Subject: "Ready to Apply? Here's How"
   Content: Step-by-step application process

⏰ **Step 10: Wait 3 Days**

💰 **Step 11: Financial Aid Email** (Day 17)
   Subject: "Make Your Education Affordable"
   Content: Scholarships, payment plans, and financial aid

⏰ **Step 12: Wait 4 Days**

🎯 **Step 13: Final CTA Email** (Day 21)
   Subject: "Your Healthcare Career Starts Now"
   Content: Urgency-driven call to action with deadline

**Smart Features:**
✨ Conditional branching based on email opens
📱 SMS follow-up for non-openers after day 7
📞 Advisor call task created if no response by day 21

Ready to build this workflow step-by-step?`;
    }

    if (input.toLowerCase().includes('reactivation') || input.toLowerCase().includes('cold')) {
      return `Perfect! I've designed a multi-touch reactivation workflow for cold leads:

**Reactivation Workflow:**
🔄 **Step 1: "We Miss You" Email** (Immediate)
   Subject: "We miss you [First Name]!"
   Content: Soft reconnection message with value reminder

⏰ **Step 2: Wait 3 Days**

📧 **Step 3: Value-Add Email** (Day 4)
   Subject: "Here's what you've been missing..."
   Content: New program updates, success stories

⏰ **Step 4: Wait 2 Days**

📱 **Step 5: SMS Message** (Day 6)
   Content: "Quick question - still interested in [Program]? Reply YES for exclusive offer"

⏰ **Step 6: Wait 4 Days**

🎁 **Step 7: Limited Offer Email** (Day 10)
   Subject: "Exclusive comeback offer - 48 hours only"
   Content: Special discount or incentive

⏰ **Step 8: Wait 1 Day**

📱 **Step 9: SMS Reminder** (Day 11)
   Content: "24 hours left on your exclusive offer!"

⏰ **Step 10: Wait 2 Days**

📞 **Step 11: Advisor Call Task** (Day 13)
   Action: Create task for advisor to make personal call

⏰ **Step 12: Wait 7 Days**

📧 **Step 13: Final Touch Email** (Day 20)
   Subject: "One last thing before we say goodbye..."
   Content: Final attempt with feedback request

**Conditional Logic:**
- If lead opens any email → Branch to active nurture sequence
- If lead responds to SMS → Immediate advisor assignment
- If lead doesn't engage after 20 days → Move to quarterly check-in sequence

Ready to activate this multi-touch reactivation workflow?`;
    }

    return `Great request! I've analyzed your requirements and created a step-by-step campaign workflow:

**Multi-Step Campaign Workflow:**

🚀 **Step 1: Initial Touch** (Immediate)
   Channel: Email
   Purpose: Introduction and value proposition

⏰ **Step 2: Wait Period** (2-3 days)
   Smart timing based on lead behavior

📧 **Step 3: Follow-up Touch** 
   Channel: Email or SMS based on preferences
   Purpose: Reinforce value and address objections

⏰ **Step 4: Conditional Wait**
   Duration varies based on engagement level

📞 **Step 5: Personal Outreach**
   Action: Create advisor task for personal touch
   Trigger: If no engagement after previous steps

🎯 **Step 6: Final CTA**
   Multi-channel final push with urgency

**Advanced Features:**
✅ Behavioral triggers and conditions
✅ Dynamic timing based on engagement
✅ Multi-channel progression (Email → SMS → Call)
✅ Automatic lead scoring adjustments
✅ Performance tracking per step

Would you like me to customize the timing, messaging, or add specific conditions to any step?`;
  };

  const generateWorkflowData = (input: string) => {
    if (input.toLowerCase().includes('nurture')) {
      return {
        name: `Healthcare Nurture Campaign - ${new Date().toLocaleDateString()}`,
        type: 'nurture',
        steps: 13,
        channels: ['email', 'sms', 'call'],
        duration: '21 days',
        triggers: ['lead_created', 'program_interest'],
        workflowSteps: [
          { type: 'email', title: 'Welcome Email', content: 'Welcome to your healthcare journey!', order: 0 },
          { type: 'wait', delay: { value: 2, unit: 'days' }, order: 1 },
          { type: 'email', title: 'Success Stories', content: 'From student to healthcare professional...', order: 2 },
          { type: 'wait', delay: { value: 4, unit: 'days' }, order: 3 },
          { type: 'email', title: 'Career Data', content: 'Your future salary & job prospects...', order: 4 },
          { type: 'wait', delay: { value: 3, unit: 'days' }, order: 5 },
          { type: 'email', title: 'Faculty Spotlight', content: 'Meet your expert instructors...', order: 6 },
          { type: 'wait', delay: { value: 4, unit: 'days' }, order: 7 },
          { type: 'email', title: 'Application Guide', content: 'Ready to apply? Here\'s how...', order: 8 },
          { type: 'wait', delay: { value: 3, unit: 'days' }, order: 9 },
          { type: 'email', title: 'Financial Aid', content: 'Make your education affordable...', order: 10 },
          { type: 'wait', delay: { value: 4, unit: 'days' }, order: 11 },
          { type: 'email', title: 'Final CTA', content: 'Your healthcare career starts now...', order: 12 }
        ]
      };
    }

    if (input.toLowerCase().includes('reactivation') || input.toLowerCase().includes('cold')) {
      return {
        name: `Cold Lead Reactivation - ${new Date().toLocaleDateString()}`,
        type: 'reactivation',
        steps: 13,
        channels: ['email', 'sms', 'call'],
        duration: '20 days',
        triggers: ['lead_inactive_30_days'],
        workflowSteps: [
          { type: 'email', title: 'We Miss You', content: 'We miss you [First Name]!', order: 0 },
          { type: 'wait', delay: { value: 3, unit: 'days' }, order: 1 },
          { type: 'email', title: 'Value-Add Email', content: 'Here\'s what you\'ve been missing...', order: 2 },
          { type: 'wait', delay: { value: 2, unit: 'days' }, order: 3 },
          { type: 'sms', title: 'SMS Check-in', content: 'Still interested in [Program]? Reply YES for exclusive offer', order: 4 },
          { type: 'wait', delay: { value: 4, unit: 'days' }, order: 5 },
          { type: 'email', title: 'Limited Offer', content: 'Exclusive comeback offer - 48 hours only', order: 6 },
          { type: 'wait', delay: { value: 1, unit: 'days' }, order: 7 },
          { type: 'sms', title: 'SMS Reminder', content: '24 hours left on your exclusive offer!', order: 8 },
          { type: 'wait', delay: { value: 2, unit: 'days' }, order: 9 },
          { type: 'call', title: 'Advisor Call', content: 'Personal outreach call', order: 10 },
          { type: 'wait', delay: { value: 7, unit: 'days' }, order: 11 },
          { type: 'email', title: 'Final Touch', content: 'One last thing before we say goodbye...', order: 12 }
        ]
      };
    }

    return {
      name: `Custom Campaign - ${new Date().toLocaleDateString()}`,
      type: 'custom',
      steps: 6,
      channels: ['email', 'sms'],
      duration: '14 days',
      triggers: ['lead_created'],
      workflowSteps: [
        { type: 'email', title: 'Initial Touch', content: 'Introduction and value proposition', order: 0 },
        { type: 'wait', delay: { value: 2, unit: 'days' }, order: 1 },
        { type: 'email', title: 'Follow-up', content: 'Reinforce value and address objections', order: 2 },
        { type: 'wait', delay: { value: 3, unit: 'days' }, order: 3 },
        { type: 'call', title: 'Personal Outreach', content: 'Advisor call task', order: 4 },
        { type: 'email', title: 'Final CTA', content: 'Final call to action with urgency', order: 5 }
      ]
    };
  };

  const handlePreviewWorkflow = (workflowData: any) => {
    toast.success('Opening workflow preview...');
    // Would open in WorkflowBuilder
  };

  const handleExportWorkflow = async (workflowData: any) => {
    try {
      const campaign = await CampaignService.createCampaign({
        name: workflowData.name,
        description: `AI-generated ${workflowData.type} campaign with ${workflowData.steps} steps`,
        campaign_type: 'workflow',
        status: 'draft',
        campaign_data: workflowData,
        workflow_config: {
          steps: workflowData.steps,
          duration: workflowData.duration,
          channels: workflowData.channels,
          triggers: workflowData.triggers
        },
        target_audience: {
          type: workflowData.type || 'general',
          criteria: {}
        }
      });

      // Create campaign steps in database
      if (workflowData.workflowSteps) {
        for (const step of workflowData.workflowSteps) {
          await CampaignService.createCampaignStep({
            campaign_id: campaign.id,
            step_type: step.type,
            order_index: step.order,
            step_config: {
              title: step.title,
              content: step.content,
              subject: step.subject,
              delay: step.delay
            }
          });
        }
      }

      toast.success('Campaign workflow created successfully!');
      onCampaignCreated?.(campaign);
    } catch (error) {
      toast.error('Failed to create campaign');
      console.error('Campaign creation error:', error);
    }
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