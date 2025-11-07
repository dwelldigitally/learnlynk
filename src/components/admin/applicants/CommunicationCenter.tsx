import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useLeadCommunications } from '@/hooks/useLeadData';
import { LeadCommunicationService } from '@/services/leadCommunicationService';
import { CommunicationTemplateService } from '@/services/communicationTemplateService';
import { CommunicationTemplate, CommunicationType, CommunicationDirection } from '@/types/leadEnhancements';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Send, 
  Calendar,
  Clock,
  FileText,
  Bot,
  ChevronDown,
  Search,
  Loader2,
  X,
  ArrowDown,
  ArrowUp,
  Sparkles
} from "lucide-react";

interface CommunicationCenterProps {
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  onSendMessage?: (type: string, content: string, subject?: string) => void;
}

export const CommunicationCenter: React.FC<CommunicationCenterProps> = ({
  applicantId,
  applicantName,
  applicantEmail,
}) => {
  const { toast } = useToast();
  
  // Compose state
  const [messageType, setMessageType] = useState<CommunicationType>('email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [sending, setSending] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  
  // Templates state
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  
  // Fetch communications from database
  const { communications, loading: loadingComms, refetch } = useLeadCommunications(applicantId);
  
  // Load templates when message type changes
  useEffect(() => {
    loadTemplates();
  }, [messageType]);
  
  // Real-time subscription for new communications
  useEffect(() => {
    const channel = supabase
      .channel('lead-communications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lead_communications',
          filter: `lead_id=eq.${applicantId}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applicantId, refetch]);

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const data = await CommunicationTemplateService.getTemplates(messageType);
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    setSelectedTemplateId(templateId);
    
    // Fetch lead data for personalization
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', applicantId)
      .single();
    
    if (lead) {
      const { data: user } = await supabase.auth.getUser();
      const agentName = user?.user?.user_metadata?.full_name || 'Your Advisor';
      
      const personalized = CommunicationTemplateService.personalizeContent(
        template, 
        lead as any, 
        agentName
      );
      
      if (personalized.subject) {
        setSubject(personalized.subject);
      }
      setContent(personalized.content);
    } else {
      setSubject(template.subject || '');
      setContent(template.content);
    }
    
    // Increment template usage
    await CommunicationTemplateService.incrementUsage(templateId);
  };

  const handleSend = async () => {
    if (messageType === 'email' && (!subject || !content)) {
      toast({
        title: "Missing fields",
        description: "Please provide both subject and content for email",
        variant: "destructive"
      });
      return;
    }
    
    if (!content) {
      toast({
        title: "Missing content",
        description: "Please provide message content",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    
    try {
      // Create communication record
      await LeadCommunicationService.createCommunication(applicantId, {
        type: messageType,
        direction: 'outbound',
        subject: messageType === 'email' ? subject : undefined,
        content,
        communication_date: new Date().toISOString(),
      });

      // Send actual message based on type
      if (messageType === 'email') {
        const { data, error } = await supabase.functions.invoke('send-lead-email', {
          body: {
            to: applicantEmail,
            subject,
            content,
            leadId: applicantId,
          }
        });
        
        if (error) throw error;
      } else if (messageType === 'sms') {
        const { data: lead } = await supabase
          .from('leads')
          .select('phone')
          .eq('id', applicantId)
          .single();
          
        if (!lead?.phone) {
          throw new Error('No phone number found for this lead');
        }
        
        const { data, error } = await supabase.functions.invoke('send-sms', {
          body: {
            phoneNumber: lead.phone,
            message: content,
            leadId: applicantId,
          }
        });
        
        if (error) throw error;
      }

      toast({
        title: "Message sent",
        description: `${messageType.toUpperCase()} sent successfully`,
      });
      
      // Clear form
      setSubject('');
      setContent('');
      setSelectedTemplateId('');
      
      // Refresh communications
      refetch();
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const getMessageIcon = (type: CommunicationType) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", text: string }> = {
      'completed': { variant: 'default', text: 'Completed' },
      'scheduled': { variant: 'secondary', text: 'Scheduled' },
      'failed': { variant: 'destructive', text: 'Failed' }
    };
    
    const config = variants[status] || { variant: 'outline' as const, text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getDirectionIcon = (direction: CommunicationDirection, isAI?: boolean) => {
    if (isAI) {
      return <Bot className="h-4 w-4 text-purple-500" />;
    }
    return direction === 'inbound' 
      ? <ArrowDown className="h-4 w-4 text-blue-500" />
      : <ArrowUp className="h-4 w-4 text-green-500" />;
  };

  // Filter communications
  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = 
      comm.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || comm.type === typeFilter;
    const matchesDirection = directionFilter === 'all' || comm.direction === directionFilter;
    
    return matchesSearch && matchesType && matchesDirection;
  });

  // Group communications by date
  const groupedCommunications = filteredCommunications.reduce((groups, comm) => {
    const date = new Date(comm.communication_date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(comm);
    return groups;
  }, {} as Record<string, typeof communications>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* COMMUNICATION HISTORY */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Communication History ({communications.length})</h3>
              
              {/* Filters */}
              <div className="flex gap-2">
                <div className="relative w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={directionFilter} onValueChange={setDirectionFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                  </SelectContent>
                </Select>

                {(searchQuery || typeFilter !== 'all' || directionFilter !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setTypeFilter('all');
                      setDirectionFilter('all');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* History List */}
            <ScrollArea className="h-[400px] pr-4">
              {loadingComms ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredCommunications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No communications yet</p>
                  <p className="text-sm">Send your first message below</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedCommunications).map(([date, comms]) => (
                    <div key={date}>
                      <div className="sticky top-0 bg-background z-10 pb-2">
                        <p className="text-sm font-semibold text-muted-foreground">{date}</p>
                      </div>
                      <div className="space-y-3">
                        {comms.map((message) => (
                          <Collapsible key={message.id}>
                            <Card className={`border-l-4 ${
                              message.direction === 'inbound' ? 'border-l-blue-500' : 
                              message.direction === 'outbound' ? 'border-l-green-500' : 
                              'border-l-purple-500'
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                    message.is_ai_generated ? 'bg-purple-100 text-purple-600' :
                                    message.direction === 'inbound' ? 'bg-blue-100 text-blue-600' :
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    {message.is_ai_generated ? <Bot className="h-4 w-4" /> : getMessageIcon(message.type as CommunicationType)}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-medium text-sm">
                                          {message.type.toUpperCase()} Message
                                        </h4>
                                        {getStatusBadge(message.status)}
                                        <Badge variant="outline" className="capitalize text-xs">
                                          {getDirectionIcon(message.direction as CommunicationDirection, message.is_ai_generated)}
                                          <span className="ml-1">{message.direction}</span>
                                        </Badge>
                                        {message.is_ai_generated && (
                                          <Badge variant="secondary" className="text-xs">
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            AI
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                                          <ChevronDown className="h-4 w-4" />
                                        </Button>
                                      </CollapsibleTrigger>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                      {message.content}
                                    </p>
                                    
                                    <CollapsibleContent>
                                      <div className="mt-3 p-3 rounded-lg bg-muted/50">
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                      </div>
                                    </CollapsibleContent>
                                    
                                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(message.communication_date).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Collapsible>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <Separator className="my-6" />

          {/* COMPOSE NEW MESSAGE */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Send New Message</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Message Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={messageType} onValueChange={(val) => setMessageType(val as CommunicationType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="sms">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        SMS
                      </div>
                    </SelectItem>
                    <SelectItem value="note">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Internal Note
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Template Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Template (Optional)</label>
                <Select 
                  value={selectedTemplateId} 
                  onValueChange={handleTemplateSelect}
                  disabled={loadingTemplates}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingTemplates ? "Loading..." : "Choose template"} />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          {template.ai_generated && <Sparkles className="h-3 w-3 text-purple-500" />}
                          <span className="truncate">{template.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subject (Email only) */}
            {messageType === 'email' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            )}

            {/* Message Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder={
                  messageType === 'email' 
                    ? 'Compose your email...'
                    : messageType === 'sms'
                    ? 'Compose SMS (160 chars max)...'
                    : 'Add internal note...'
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                maxLength={messageType === 'sms' ? 160 : undefined}
              />
              {messageType === 'sms' && (
                <p className="text-xs text-muted-foreground">
                  {content.length}/160 characters
                </p>
              )}
            </div>

            {/* Send Button */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                To: {applicantName} ({applicantEmail})
              </p>
              <Button 
                onClick={handleSend} 
                disabled={sending || !content || (messageType === 'email' && !subject)}
                size="lg"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send {messageType === 'email' ? 'Email' : messageType === 'sms' ? 'SMS' : 'Note'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};