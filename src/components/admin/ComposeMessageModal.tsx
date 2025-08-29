import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CommunicationTemplate } from '@/types/leadEnhancements';
import { CommunicationTemplateService } from '@/services/communicationTemplateService';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Copy,
  RefreshCw,
  Loader2
} from "lucide-react";

interface ComposeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLead?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  } | null;
}

interface GeneratedContent {
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  tone: string;
  personalization: {
    nameUsage: string;
    personalDetails: string[];
  };
  estimatedEngagement: string;
}

export function ComposeMessageModal({ 
  isOpen, 
  onClose, 
  selectedLead
}: ComposeMessageModalProps) {
  const [selectedType, setSelectedType] = useState<'email' | 'sms'>('email');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen, selectedType]);

  const loadTemplates = async () => {
    try {
      const data = await CommunicationTemplateService.getTemplates(selectedType);
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && selectedLead) {
      const mockLead = { 
        name: `${selectedLead.first_name} ${selectedLead.last_name}`, 
        email: selectedLead.email 
      };
      const personalized = CommunicationTemplateService.personalizeContent(template, mockLead as any);
      
      if (selectedType === 'email' && personalized.subject) {
        setSubject(personalized.subject);
      }
      setContent(personalized.content);
      setSelectedTemplate(templateId);
    }
  };

  const generateAIContent = async () => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('ai-content-analyzer', {
        body: {
          action: 'generateCommunication',
          leadData: {
            name: selectedLead ? `${selectedLead.first_name} ${selectedLead.last_name}` : 'Lead',
            email: selectedLead?.email || '',
            phone: selectedLead?.phone || '',
            id: selectedLead?.id || ''
          },
          communicationType: selectedType,
          tone: selectedTone,
          customPrompt: customPrompt || undefined,
          context: 'Communication Hub - Lead follow-up'
        }
      });

      if (response.error) throw response.error;

      const generated = response.data;
      setGeneratedContent(generated);
      
      if (selectedType === 'email' && generated.subject) {
        setSubject(generated.subject);
      }
      setContent(generated.content);

      toast({
        title: "Content Generated",
        description: `AI ${selectedType} content generated successfully!`,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const textToCopy = selectedType === 'email' 
      ? `Subject: ${subject}\n\n${content}`
      : content;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard",
        variant: "destructive",
      });
    }
  };

  const sendContent = async () => {
    if (!selectedLead) {
      toast({
        title: "No Lead Selected",
        description: "Please select a lead before sending",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please add content before sending",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      if (selectedType === 'email') {
        if (!subject.trim()) {
          toast({
            title: "Missing Subject",
            description: "Please add a subject for the email",
            variant: "destructive",
          });
          setSending(false);
          return;
        }

        const response = await supabase.functions.invoke('send-lead-email', {
          body: {
            leadId: selectedLead.id,
            leadEmail: selectedLead.email,
            leadName: `${selectedLead.first_name} ${selectedLead.last_name}`,
            emailType: 'ai_generated',
            subject,
            content: content.replace(/\n/g, '<br>')
          }
        });

        if (response.error) throw response.error;
      } else {
        if (!selectedLead.phone?.trim()) {
          toast({
            title: "Missing Phone Number",
            description: "This lead doesn't have a phone number",
            variant: "destructive",
          });
          setSending(false);
          return;
        }

        const response = await supabase.functions.invoke('send-sms', {
          body: {
            leadId: selectedLead.id,
            phoneNumber: selectedLead.phone,
            leadName: `${selectedLead.first_name} ${selectedLead.last_name}`,
            message: content,
            messageType: 'ai_generated',
            metadata: {
              source: 'communication_hub',
              tone: selectedTone,
              generated: !!generatedContent
            }
          }
        });

        if (response.error) {
          console.error('SMS sending error:', response.error);
          throw new Error(response.error.message || 'Failed to send SMS');
        }
      }

      toast({
        title: "Message Sent!",
        description: `${selectedType === 'email' ? 'Email' : 'SMS'} sent successfully to ${selectedLead.first_name} ${selectedLead.last_name}`,
      });

      // Reset form
      setSubject('');
      setContent('');
      setCustomPrompt('');
      setGeneratedContent(null);
      setSelectedTemplate('');
      onClose();
    } catch (error) {
      console.error('Error sending:', error);
      toast({
        title: "Send Failed",
        description: `Failed to send ${selectedType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const quickTemplates = {
    email: [
      { name: "Welcome", prompt: "Welcome email for new lead" },
      { name: "Follow-up", prompt: "Follow-up email after initial contact" },
      { name: "Information Request", prompt: "Request for additional information" }
    ],
    sms: [
      { name: "Quick Follow-up", prompt: "Brief follow-up message" },
      { name: "Appointment Reminder", prompt: "Appointment reminder message" },
      { name: "Thank You", prompt: "Thank you message after meeting" }
    ]
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Compose Message
            {selectedLead && ` - ${selectedLead.first_name} ${selectedLead.last_name}`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Content Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Communication Type */}
              <div className="flex gap-2">
                <Button
                  variant={selectedType === 'email' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('email')}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant={selectedType === 'sms' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('sms')}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS
                </Button>
              </div>

              {/* Tone Selection */}
              <div>
                <Label>Tone</Label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map(tone => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Templates */}
              <div>
                <Label>Quick Templates</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickTemplates[selectedType].map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomPrompt(template.prompt)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Saved Templates */}
              {templates.length > 0 && (
                <div>
                  <Label>Saved Templates</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Custom Instructions */}
              <div>
                <Label>Custom Instructions (Optional)</Label>
                <Textarea
                  placeholder="Add specific instructions for the AI..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateAIContent} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Message Composer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedType === 'email' ? (
                  <Mail className="h-5 w-5" />
                ) : (
                  <MessageSquare className="h-5 w-5" />
                )}
                Compose {selectedType === 'email' ? 'Email' : 'SMS'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recipient Info */}
              {selectedLead ? (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>To:</strong> {selectedLead.first_name} {selectedLead.last_name} ({selectedType === 'email' ? selectedLead.email : selectedLead.phone})
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <p className="text-sm text-destructive">
                    <strong>No lead selected.</strong> Please close this modal and select a lead first.
                  </p>
                </div>
              )}

              {/* Subject (Email only) */}
              {selectedType === 'email' && (
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                  />
                </div>
              )}

              {/* Content */}
              <div>
                <Label>Message Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Enter your ${selectedType} content...`}
                  rows={selectedType === 'email' ? 8 : 4}
                />
                {selectedType === 'sms' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Character count: {content.length}/160
                  </p>
                )}
              </div>

              {/* AI Generated Content Info */}
              {generatedContent && (
                <Card className="bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">AI Generated Content</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Tone:</strong> {generatedContent.tone}</p>
                      <p><strong>Personalization:</strong> {generatedContent.personalization.nameUsage}</p>
                      <p><strong>Engagement:</strong> {generatedContent.estimatedEngagement}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={copyToClipboard} disabled={!content}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  onClick={generateAIContent} 
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button 
                  onClick={sendContent} 
                  disabled={!content || sending}
                  className="flex-1"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send {selectedType === 'email' ? 'Email' : 'SMS'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}