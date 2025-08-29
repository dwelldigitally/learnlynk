import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Bot, MessageSquare, Phone, Mail, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Lead } from '@/types/lead';

interface CommunicationTemplate {
  id: string;
  type: 'email' | 'sms' | 'call_script';
  title: string;
  subject?: string;
  content: string;
  trigger: string;
  timing: string;
  personalization: string[];
}

interface ScheduledCommunication {
  id: string;
  type: 'email' | 'sms' | 'call';
  title: string;
  scheduled_at: string;
  status: 'scheduled' | 'sent' | 'delivered' | 'failed';
  template_used: string;
  ai_reasoning: string;
}

interface AICommunicationDemoProps {
  lead: Lead;
}

export function AICommunicationDemo({ lead }: AICommunicationDemoProps) {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [scheduledComms, setScheduledComms] = useState<ScheduledCommunication[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    generateAITemplates();
    generateScheduledCommunications();
  }, [lead]);

  const generateAITemplates = () => {
    const studentName = `${lead.first_name} ${lead.last_name}`;
    const program = lead.program_interest?.[0] || 'our program';
    
    const aiTemplates: CommunicationTemplate[] = [
      {
        id: 'welcome-email',
        type: 'email',
        title: 'Welcome Email',
        subject: `Welcome to ${program}, ${lead.first_name}!`,
        content: `Hi ${studentName},

Thank you for your interest in ${program}! I'm excited to help you take the next step in your educational journey.

Based on your inquiry, I've prepared some personalized information about:
• Program curriculum and learning outcomes
• Application requirements and deadlines
• Financial aid and scholarship opportunities
• Career support and job placement statistics

I'd love to schedule a brief 15-minute call to discuss your goals and answer any questions you might have. 

Are you available for a quick chat this week?

Best regards,
AI Assistant`,
        trigger: 'New inquiry submitted',
        timing: 'Within 5 minutes',
        personalization: ['First name', 'Program interest', 'Location-based timing']
      },
      {
        id: 'document-reminder',
        type: 'sms',
        title: 'Document Reminder SMS',
        content: `Hi ${lead.first_name}! Your ${program} application is 90% complete. Only your transcripts are missing. Upload them here: [LINK]. Questions? Reply HELP. Need to stop? Reply STOP.`,
        trigger: 'Missing documents after 3 days',
        timing: '10 AM local time',
        personalization: ['First name', 'Specific missing documents', 'Local timezone']
      },
      {
        id: 'follow-up-call',
        type: 'call_script',
        title: 'Follow-up Call Script',
        content: `Hi ${studentName}, this is [AI Assistant] calling about your ${program} application.

OPENING:
"I hope I'm catching you at a good time. I wanted to follow up on your application and see if you had any questions about the next steps."

KEY POINTS TO COVER:
1. Application status and missing items
2. Program start dates and deadlines
3. Financial aid options
4. Schedule campus visit or virtual tour

OBJECTION HANDLING:
- If busy: "I understand you're busy. Would you prefer if I sent you a summary email, or is there a better time for a 10-minute conversation?"
- If unsure: "That's completely normal. Let me share how our career services team has helped 95% of graduates find jobs within 6 months."

CLOSING:
"Based on your background in [relevant experience], I think you'd be a great fit. Shall we get your application completed this week?"`,
        trigger: 'No response to email after 2 days',
        timing: '2 PM local time',
        personalization: ['Full name', 'Program name', 'Application status', 'Background/experience']
      },
      {
        id: 'nurture-email',
        type: 'email',
        title: 'Educational Content Email',
        subject: `5 Skills You'll Master in ${program}`,
        content: `Hi ${lead.first_name},

I thought you'd find this interesting - here are the top 5 skills our ${program} graduates master that employers are actively seeking:

🎯 1. [Skill 1] - Used by 89% of our graduates in their current roles
📊 2. [Skill 2] - Average salary increase of 40% for those with this skill
🚀 3. [Skill 3] - The #1 skill requested in recent job postings
💡 4. [Skill 4] - Our unique approach that sets us apart
🔧 5. [Skill 5] - Hands-on experience through real-world projects

Our graduates report that these skills directly contributed to their career advancement within the first year.

Curious to learn more about how you can develop these skills? Let's schedule a quick 15-minute conversation about your career goals.

[SCHEDULE CALL BUTTON]

Best,
AI Assistant

P.S. Did you know that 95% of our graduates are employed within 6 months? Here's what some recent graduates are saying: [testimonials link]`,
        trigger: 'Engaged with previous emails but no application',
        timing: '9 AM local time, Tuesday',
        personalization: ['First name', 'Program name', 'Career goals', 'Industry-specific skills']
      }
    ];

    setTemplates(aiTemplates);
  };

  const generateScheduledCommunications = () => {
    const now = new Date();
    const scheduled: ScheduledCommunication[] = [
      {
        id: '1',
        type: 'email',
        title: 'Welcome Email',
        scheduled_at: new Date(now.getTime() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
        status: 'scheduled',
        template_used: 'welcome-email',
        ai_reasoning: 'New inquiry received, immediate response increases conversion by 400%'
      },
      {
        id: '2',
        type: 'call',
        title: 'Follow-up Call',
        scheduled_at: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
        status: 'scheduled',
        template_used: 'follow-up-call',
        ai_reasoning: 'Optimal timing based on response patterns - Tuesday 2 PM has highest connection rate'
      },
      {
        id: '3',
        type: 'sms',
        title: 'Document Reminder',
        scheduled_at: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
        status: 'scheduled',
        template_used: 'document-reminder',
        ai_reasoning: 'If no documents submitted by day 3, SMS reminder increases completion by 65%'
      }
    ];

    setScheduledComms(scheduled);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'call': case 'call_script': return Phone;
      default: return MessageSquare;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return Clock;
      case 'sent': case 'delivered': return CheckCircle;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'sent': case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5" />
          AI Communication Strategy
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <Tabs defaultValue="schedule" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="schedule">Scheduled Communications</TabsTrigger>
            <TabsTrigger value="templates">AI Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="flex-1 overflow-y-auto space-y-3">
            <div className="space-y-3">
              {scheduledComms.map((comm) => {
                const TypeIcon = getTypeIcon(comm.type);
                const StatusIcon = getStatusIcon(comm.status);
                
                return (
                  <div key={comm.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{comm.title}</span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(comm.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {comm.status}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDateTime(comm.scheduled_at)}</span>
                      </div>
                      <div className="flex items-start gap-1 mt-2">
                        <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span className="text-xs">{comm.ai_reasoning}</span>
                      </div>
                    </div>
                    
                    {comm.status === 'scheduled' && (
                      <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                        Preview & Edit
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {templates.map((template) => {
                const TypeIcon = getTypeIcon(template.type);
                const isSelected = selectedTemplate === template.id;
                
                return (
                  <div key={template.id} className="border rounded-lg">
                    <div 
                      className={`p-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-muted/50' : 'hover:bg-muted/30'
                      }`}
                      onClick={() => setSelectedTemplate(isSelected ? '' : template.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{template.title}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div>Trigger: {template.trigger}</div>
                        <div>Timing: {template.timing}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="border-t p-3 bg-muted/20">
                        {template.subject && (
                          <div className="mb-3">
                            <label className="text-xs font-medium text-muted-foreground">Subject:</label>
                            <div className="text-sm mt-1 p-2 bg-background rounded border">
                              {template.subject}
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-3">
                          <label className="text-xs font-medium text-muted-foreground">Content:</label>
                          <div className="text-sm mt-1 p-2 bg-background rounded border whitespace-pre-wrap">
                            {template.content}
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="text-xs font-medium text-muted-foreground">AI Personalization:</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.personalization.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button size="sm" className="w-full text-xs">
                          <Send className="h-3 w-3 mr-1" />
                          Send Now
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}