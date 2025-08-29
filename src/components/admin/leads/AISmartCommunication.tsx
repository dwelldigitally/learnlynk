import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Mail, Phone, Sparkles, Copy, Send, RefreshCw, ThumbsUp } from 'lucide-react';
import { Lead } from '@/types/lead';
import { useToast } from '@/components/ui/use-toast';

interface CommunicationProps {
  lead: Lead;
}

interface GeneratedContent {
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  tone: string;
  personalization: string[];
  estimatedEngagement: number;
}

export function AISmartCommunication({ lead }: CommunicationProps) {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'email' | 'sms'>('email');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'casual', label: 'Casual' },
    { value: 'enthusiastic', label: 'Enthusiastic' }
  ];

  const templates = {
    email: [
      'Welcome & Introduction',
      'Program Information Follow-up',
      'Application Reminder',
      'Scholarship Information',
      'Deadline Reminder',
      'Re-engagement Campaign'
    ],
    sms: [
      'Quick Check-in',
      'Appointment Reminder',
      'Urgent Follow-up',
      'Application Status',
      'Event Invitation'
    ]
  };

  const generateAIContent = async (template?: string) => {
    setLoading(true);
    
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const personalizationFactors = [
        `Name: ${lead.first_name}`,
        `Location: ${lead.country}`,
        `Programs: ${lead.program_interest?.join(', ') || 'General'}`,
        `Lead Score: ${lead.lead_score}`,
        `Source: ${lead.source}`
      ];

      let content = '';
      let subject = '';
      
      if (selectedType === 'email') {
        if (template === 'Welcome & Introduction' || !template) {
          subject = `Welcome ${lead.first_name} - Your Educational Journey Starts Here`;
          content = `Dear ${lead.first_name},

Thank you for your interest in our programs! I'm excited to help you explore the educational opportunities that align with your goals.

Based on your inquiry about ${lead.program_interest?.join(' and ') || 'our programs'}, I believe we have exactly what you're looking for. Our ${lead.program_interest?.[0] || 'programs'} have helped thousands of students like you achieve their career aspirations.

As someone from ${lead.country}, you'll be interested to know that we have a strong international community and provide comprehensive support for global students.

I'd love to schedule a brief 15-minute call to discuss:
• Program details and career outcomes
• Application process and requirements  
• Scholarship opportunities
• Next steps for ${lead.country} residents

Are you available for a quick call this week? I have availability on [suggested times].

Looking forward to speaking with you soon!

Best regards,
[Your Name]
Academic Advisor

P.S. Did you know that 94% of our ${lead.program_interest?.[0] || 'program'} graduates advance in their careers within 6 months? Let's discuss how this could apply to your goals.`;
        } else if (template === 'Program Information Follow-up') {
          subject = `${lead.program_interest?.[0] || 'Program'} Details for ${lead.first_name}`;
          content = `Hi ${lead.first_name},

Following up on your interest in our ${lead.program_interest?.[0] || 'program'}. I've attached some detailed information that I think you'll find valuable.

Key highlights for international students from ${lead.country}:
• Flexible scheduling options
• Industry-leading curriculum 
• Strong alumni network in ${lead.country}
• Visa support and guidance

Based on your profile, you're an excellent candidate for our program. Your background would be a great fit for our upcoming cohort.

Would you like to schedule a personalized consultation? I can show you exactly how our program aligns with your career goals.

Best regards,
[Your Name]`;
        }
      } else {
        // SMS content
        if (template === 'Quick Check-in' || !template) {
          content = `Hi ${lead.first_name}! This is [Name] from [Institution]. Quick question - are you still interested in learning more about our ${lead.program_interest?.[0] || 'programs'}? I have some great updates to share! 📚`;
        } else if (template === 'Appointment Reminder') {
          content = `Hi ${lead.first_name}, reminder about our consultation call today at [time]. Looking forward to discussing your ${lead.program_interest?.[0] || 'program'} goals! 🎓`;
        }
      }

      // Add custom prompt influence
      if (customPrompt.trim()) {
        content += `\n\n[AI Note: Content influenced by custom prompt: "${customPrompt}"]`;
      }

      const estimated = Math.floor(Math.random() * 20) + 65; // 65-85% engagement

      setGeneratedContent({
        type: selectedType,
        subject: selectedType === 'email' ? subject : undefined,
        content,
        tone: selectedTone,
        personalization: personalizationFactors,
        estimatedEngagement: estimated
      });

    } catch (error) {
      console.error('Failed to generate content:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedContent) return;
    
    const textToCopy = selectedType === 'email' 
      ? `Subject: ${generatedContent.subject}\n\n${generatedContent.content}`
      : generatedContent.content;
    
    await navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const sendContent = async () => {
    if (!generatedContent) return;
    
    setLoading(true);
    try {
      if (selectedType === 'email') {
        const response = await fetch('https://rpxygdaimdiarjpfmswl.supabase.co/functions/v1/send-lead-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            leadId: lead.id,
            leadEmail: lead.email,
            leadName: `${lead.first_name} ${lead.last_name}`,
            emailType: 'ai_generated',
            subject: generatedContent.subject || 'Message from Learnlynk',
            content: generatedContent.content,
            programInterest: lead.program_interest,
            metadata: {
              tone: selectedTone,
              estimatedEngagement: generatedContent.estimatedEngagement,
              generatedAt: new Date().toISOString()
            }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to send email');
        }

        const result = await response.json();
        console.log('Email sent successfully:', result);

        toast({
          title: "Email Sent Successfully",
          description: `Email sent to ${lead.first_name} ${lead.last_name}`,
        });
      } else {
        // SMS sending would be implemented here
        toast({
          title: "SMS Feature Coming Soon",
          description: "SMS sending will be available in the next update",
        });
      }
    } catch (error) {
      console.error('Failed to send content:', error);
      toast({
        title: "Failed to Send",
        description: "There was an error sending the message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Communication Type */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={selectedType === 'email' ? 'default' : 'outline'}
              onClick={() => setSelectedType('email')}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button
              variant={selectedType === 'sms' ? 'default' : 'outline'}
              onClick={() => setSelectedType('sms')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              SMS
            </Button>
          </div>

          {/* Tone Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tone</label>
            <Select value={selectedTone} onValueChange={setSelectedTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map(tone => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Templates */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quick Templates</label>
            <div className="grid grid-cols-1 gap-2">
              {templates[selectedType].map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => generateAIContent(template)}
                  disabled={loading}
                  className="justify-start text-left"
                >
                  {template}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="text-sm font-medium mb-2 block">Custom Instructions (Optional)</label>
            <Textarea
              placeholder="Add specific instructions for AI content generation..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={() => generateAIContent()} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate AI Content
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Generated Content
            </CardTitle>
            {generatedContent && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {generatedContent.estimatedEngagement}% Est. Engagement
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!generatedContent ? (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Select a template or use custom instructions to generate AI content</p>
            </div>
          ) : (
            <>
              {/* Content Preview */}
              <div className="space-y-3">
                {selectedType === 'email' && generatedContent.subject && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subject</label>
                    <div className="p-2 bg-muted rounded border text-sm">
                      {generatedContent.subject}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Content</label>
                  <div className="p-3 bg-muted rounded border text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {generatedContent.content}
                  </div>
                </div>
              </div>

              {/* Personalization Used */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Personalization Applied</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedContent.personalization.slice(0, 3).map((factor, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={() => generateAIContent()}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
                <Button size="sm" onClick={sendContent} disabled={loading}>
                  <Send className="h-3 w-3 mr-1" />
                  {loading ? 'Sending...' : 'Send Now'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}