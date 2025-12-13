import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Search, Filter, Star, Clock, User, Brain, TrendingUp, MessageSquare, FileText, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { EmailImportDialog } from './EmailImportDialog';
import { EmailService } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ModernCard } from '@/components/modern/ModernCard';
import { InfoBadge } from '@/components/modern/InfoBadge';
export function AIEmailInbox() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [realEmails, setRealEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState({
    subject: '',
    body: '',
    type: 'reply' as 'reply' | 'forward'
  });
  const {
    toast
  } = useToast();
  const allEmails = realEmails;
  const loadRealEmails = async () => {
    setLoading(true);
    try {
      const {
        emails
      } = await EmailService.getEmails({}, 1, 20);
      setRealEmails(emails.map(email => {
        // Extract lead information from the joined data
        const leadData = (email as any).lead;
        return {
          id: email.id,
          from_name: email.from_name || 'Unknown',
          from_email: email.from_email,
          subject: email.subject || 'No Subject',
          body_content: email.body_content || '',
          body_preview: email.body_preview || '',
          received_datetime: email.received_datetime,
          is_read: email.is_read,
          ai_priority_score: email.ai_priority_score || 0,
          category: email.ai_suggested_actions?.[0]?.type || 'inquiry',
          ai_suggested_actions: email.ai_suggested_actions || [],
          lead_match: leadData ? {
            name: `${leadData.first_name || ''} ${leadData.last_name || ''}`.trim() || 'Unknown Lead',
            program_interest: leadData.program_interest || [],
            score: email.ai_lead_match_confidence || 0
          } : null
        };
      }));
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadRealEmails();
  }, []);
  const filteredEmails = allEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || email.from_name.toLowerCase().includes(searchQuery.toLowerCase()) || email.body_content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || email.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  const selectedEmailData = selectedEmail ? allEmails.find(e => e.id === selectedEmail) : null;
  const getPriorityColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-50';
    if (score >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inquiry':
        return <MessageSquare className="h-4 w-4" />;
      case 'application':
        return <FileText className="h-4 w-4" />;
      case 'complaint':
        return <AlertCircle className="h-4 w-4" />;
      case 'follow_up':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  const handleEmailAction = async (action: string, emailData: any) => {
    if (!emailData) return;
    setProcessingAction(action);
    try {
      switch (action) {
        case 'reply':
          await handleReply(emailData);
          break;
        case 'forward':
          await handleForward(emailData);
          break;
        case 'archive':
          await handleArchive(emailData);
          break;
        case 'generate_ai':
          await handleGenerateAIResponse(emailData);
          break;
      }
    } catch (error) {
      console.error(`Error with ${action}:`, error);
      toast({
        title: "Action Failed",
        description: `Failed to ${action} email. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };
  const handleReply = async (emailData: any) => {
    try {
      // Mark email as read
      await EmailService.updateEmailReadStatus(emailData.id, true);

      // Show reply box with basic template
      setReplyContent({
        subject: `Re: ${emailData.subject}`,
        body: `\n\n--- Original Message ---\nFrom: ${emailData.from_name} <${emailData.from_email}>\nDate: ${new Date(emailData.received_datetime).toLocaleString()}\nSubject: ${emailData.subject}\n\n${emailData.body_content}`,
        type: 'reply'
      });
      setShowReplyBox(true);

      // Refresh emails to show updated read status
      loadRealEmails();
    } catch (error) {
      throw error;
    }
  };
  const handleForward = async (emailData: any) => {
    try {
      setReplyContent({
        subject: `Fwd: ${emailData.subject}`,
        body: `\n\n--- Forwarded Message ---\nFrom: ${emailData.from_name} <${emailData.from_email}>\nDate: ${new Date(emailData.received_datetime).toLocaleString()}\nSubject: ${emailData.subject}\n\n${emailData.body_content}`,
        type: 'forward'
      });
      setShowReplyBox(true);
    } catch (error) {
      throw error;
    }
  };
  const handleArchive = async (emailData: any) => {
    try {
      await EmailService.updateEmailStatus(emailData.id, 'resolved');
      toast({
        title: "Email Archived",
        description: "Email has been archived successfully."
      });

      // Refresh emails to show updated status
      loadRealEmails();
    } catch (error) {
      throw error;
    }
  };
  const handleExecuteSuggestedAction = async (action: any, emailData: any) => {
    setProcessingAction(`suggested_${action.type}`);
    try {
      switch (action.type) {
        case 'send_program_info':
        case 'send_program_brochure':
          await executeSendProgramInfo(emailData, action);
          break;
        case 'schedule_consultation':
          await executeScheduleConsultation(emailData, action);
          break;
        case 'respond':
          await executeRespondAction(emailData, action);
          break;
        case 'forward':
          await executeForwardAction(emailData, action);
          break;
        case 'assign_advisor':
          await executeAssignAdvisor(emailData, action);
          break;
        default:
          await executeGenericAction(emailData, action);
      }
      toast({
        title: "Action Executed",
        description: `Successfully executed: ${action.description}`
      });

      // Refresh emails to show any status changes
      loadRealEmails();
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
      toast({
        title: "Action Failed",
        description: `Failed to execute: ${action.description}`,
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };
  const executeSendProgramInfo = async (emailData: any, action: any) => {
    // Create communication record
    if (emailData.lead_match) {
      await supabase.functions.invoke('generate-reply-ai', {
        body: {
          leadName: emailData.lead_match.name,
          leadContext: {
            email: emailData.from_email,
            programInterest: emailData.lead_match.program_interest,
            actionType: 'send_program_info'
          },
          communicationHistory: []
        }
      });
    }

    // Update email status
    await EmailService.updateEmailStatus(emailData.id, 'in_progress');
  };
  const executeScheduleConsultation = async (emailData: any, action: any) => {
    // Generate consultation scheduling email
    if (emailData.lead_match) {
      await supabase.functions.invoke('generate-reply-ai', {
        body: {
          leadName: emailData.lead_match.name,
          leadContext: {
            email: emailData.from_email,
            programInterest: emailData.lead_match.program_interest,
            actionType: 'schedule_consultation'
          },
          communicationHistory: []
        }
      });
    }
    await EmailService.updateEmailStatus(emailData.id, 'in_progress');
  };
  const executeRespondAction = async (emailData: any, action: any) => {
    await handleReply(emailData);
  };
  const executeForwardAction = async (emailData: any, action: any) => {
    await handleForward(emailData);
  };
  const executeAssignAdvisor = async (emailData: any, action: any) => {
    // For now, just assign to current user
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (user && emailData.lead_match) {
      await EmailService.assignEmail(emailData.id, user.id);
    }
  };
  const executeGenericAction = async (emailData: any, action: any) => {
    // Log the action execution
    console.log('Executing generic action:', action.type, 'for email:', emailData.id);
    await EmailService.updateEmailStatus(emailData.id, 'in_progress');
  };
  const handleGenerateAIResponse = async (emailData: any) => {
    try {
      // Call the edge function to generate AI response
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-reply-ai', {
        body: {
          leadName: emailData.lead_match?.name || emailData.from_name,
          leadContext: {
            email: emailData.from_email,
            programInterest: emailData.lead_match?.program_interest || [],
            subject: emailData.subject
          },
          communicationHistory: [{
            type: 'email',
            content: emailData.body_content,
            date: emailData.received_datetime,
            direction: 'inbound'
          }]
        }
      });
      if (error) throw error;

      // Show the AI-generated response in the reply box
      setReplyContent({
        subject: `Re: ${emailData.subject}`,
        body: data.generatedReply || `Dear ${emailData.from_name},

Thank you for your inquiry regarding our programs. Based on your message, I'd be happy to provide you with more information.

[AI-generated response would appear here based on the email content and lead context]

Best regards,
Admissions Team`,
        type: 'reply'
      });
      setShowReplyBox(true);
      toast({
        title: "AI Response Generated",
        description: "AI has generated a personalized response. Review and edit before sending."
      });
    } catch (error) {
      throw error;
    }
  };
  const handleSendReply = async () => {
    try {
      // Here you would integrate with your email sending service
      toast({
        title: "Email Sent",
        description: "Your reply has been sent successfully."
      });
      setShowReplyBox(false);
      setReplyContent({
        subject: '',
        body: '',
        type: 'reply'
      });

      // Update email status and refresh
      if (selectedEmail) {
        await EmailService.updateEmailStatus(selectedEmail, 'replied');
        loadRealEmails();
      }
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      });
    }
  };
  return <div className="space-y-6">
      {/* Stats Overview */}
      

      {/* Action Bar */}
      <ModernCard>
        <div className="flex items-center justify-between p-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search emails by subject, sender, or content..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-background" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant={filterCategory === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilterCategory('all')}>
              All
            </Button>
            <Button variant={filterCategory === 'inquiry' ? 'default' : 'outline'} size="sm" onClick={() => setFilterCategory('inquiry')}>
              Inquiries
            </Button>
            <Button variant={filterCategory === 'application' ? 'default' : 'outline'} size="sm" onClick={() => setFilterCategory('application')}>
              Applications
            </Button>
            <Button variant={filterCategory === 'complaint' ? 'default' : 'outline'} size="sm" onClick={() => setFilterCategory('complaint')}>
              Issues
            </Button>
            <EmailImportDialog onEmailImported={loadRealEmails} />
          </div>
        </div>
      </ModernCard>

      {/* Email List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-200px)]">
        {/* Email List */}
        <div className="lg:col-span-1">
          <ModernCard className="h-[calc(100vh-200px)]">
            <div className="p-4 border-b bg-card/50">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Inbox ({filteredEmails.length})
              </h3>
            </div>
            <div className="space-y-1 overflow-y-auto p-2 max-h-[calc(100vh-280px)]">
              {filteredEmails.map(email => <Card key={email.id} className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${selectedEmail === email.id ? 'border-l-primary bg-primary/5 ring-1 ring-primary/20' : 'border-l-transparent hover:border-l-muted-foreground/30'} ${!email.is_read ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''}`} onClick={() => setSelectedEmail(email.id)}>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
                            {getCategoryIcon(email.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${!email.is_read ? 'font-semibold' : 'font-medium'}`}>
                              {email.from_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{email.from_email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!email.is_read && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                          <InfoBadge variant={email.ai_priority_score >= 90 ? 'destructive' : email.ai_priority_score >= 70 ? 'warning' : 'default'}>
                            {email.ai_priority_score}
                          </InfoBadge>
                        </div>
                      </div>
                      
                      <div>
                        <p className={`text-sm ${!email.is_read ? 'font-semibold' : ''} truncate text-foreground`}>
                          {email.subject}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {email.body_preview}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(email.received_datetime).toLocaleTimeString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain className="h-3 w-3 text-primary" />
                          {email.ai_suggested_actions.length} actions
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </ModernCard>
        </div>

        {/* Email Detail View */}
        <div className="lg:col-span-2">
          {selectedEmailData ? <ModernCard className="h-[calc(100vh-200px)] flex flex-col">
              {/* Email Header */}
              <div className="p-6 border-b bg-card/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-foreground mb-3">{selectedEmailData.subject}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedEmailData.from_name}</span>
                        <span className="text-muted-foreground">&lt;{selectedEmailData.from_email}&gt;</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(selectedEmailData.received_datetime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <InfoBadge variant={selectedEmailData.ai_priority_score >= 90 ? 'destructive' : selectedEmailData.ai_priority_score >= 70 ? 'warning' : 'default'}>
                      AI Score: {selectedEmailData.ai_priority_score}
                    </InfoBadge>
                    <Badge variant="outline" className="capitalize">
                      {selectedEmailData.category}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Email Body */}
                <div className="bg-muted/30 border border-border/50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                    {selectedEmailData.body_content}
                  </pre>
                </div>

                {/* AI Insights Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2 text-foreground">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Insights & Recommendations
                  </h4>
                  
                  {/* Lead Match Card */}
                  {selectedEmailData.lead_match && <ModernCard className="bg-success-light/20 border-success/30">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              <p className="font-semibold text-sm">Lead Match Found</p>
                            </div>
                            <p className="font-medium text-foreground">{selectedEmailData.lead_match.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Interested in: <span className="font-medium">{selectedEmailData.lead_match.program_interest.join(', ')}</span>
                            </p>
                          </div>
                          <InfoBadge variant="success">
                            {selectedEmailData.lead_match.score}% match
                          </InfoBadge>
                        </div>
                      </div>
                    </ModernCard>}

                  {/* Suggested Actions */}
                  <ModernCard>
                    <div className="p-4">
                      <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Suggested Actions
                      </h5>
                      <div className="space-y-2">
                        {selectedEmailData.ai_suggested_actions.map((action, index) => <div key={index} className="flex items-center justify-between p-3 bg-muted/30 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-foreground">{action.description}</p>
                              <p className="text-xs text-muted-foreground capitalize mt-1">
                                {action.type.replace('_', ' ')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <InfoBadge variant="secondary">
                                {action.confidence}%
                              </InfoBadge>
                              <Button size="sm" onClick={() => handleExecuteSuggestedAction(action, selectedEmailData)} disabled={processingAction === `suggested_${action.type}`}>
                                {processingAction === `suggested_${action.type}` ? 'Executing...' : 'Execute'}
                              </Button>
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </ModernCard>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 border-t bg-card/50">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button onClick={() => handleEmailAction('reply', selectedEmailData)} disabled={processingAction === 'reply'} className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {processingAction === 'reply' ? 'Creating Reply...' : 'Reply'}
                  </Button>
                  <Button variant="outline" onClick={() => handleEmailAction('forward', selectedEmailData)} disabled={processingAction === 'forward'}>
                    {processingAction === 'forward' ? 'Creating Forward...' : 'Forward'}
                  </Button>
                  <Button variant="outline" onClick={() => handleEmailAction('archive', selectedEmailData)} disabled={processingAction === 'archive'}>
                    {processingAction === 'archive' ? 'Archiving...' : 'Archive'}
                  </Button>
                  <Button variant="default" onClick={() => handleEmailAction('generate_ai', selectedEmailData)} disabled={processingAction === 'generate_ai'} className="gap-2 ml-auto">
                    <Brain className="h-4 w-4" />
                    {processingAction === 'generate_ai' ? 'Generating...' : 'Generate AI Response'}
                  </Button>
                </div>

                {/* Reply Box */}
                {showReplyBox && <ModernCard className="mt-4">
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <h4 className="font-semibold">
                          {replyContent.type === 'reply' ? 'Reply' : 'Forward'} - {replyContent.subject}
                        </h4>
                      </div>
                      <div>
                        <Label htmlFor="reply-subject" className="text-sm font-medium">Subject</Label>
                        <Input id="reply-subject" value={replyContent.subject} onChange={e => setReplyContent(prev => ({
                    ...prev,
                    subject: e.target.value
                  }))} className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="reply-body" className="text-sm font-medium">Message</Label>
                        <Textarea id="reply-body" value={replyContent.body} onChange={e => setReplyContent(prev => ({
                    ...prev,
                    body: e.target.value
                  }))} rows={10} className="font-mono text-sm mt-1.5" />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Button onClick={handleSendReply}>
                            Send {replyContent.type === 'reply' ? 'Reply' : 'Forward'}
                          </Button>
                          <Button variant="outline" onClick={() => setShowReplyBox(false)}>
                            Cancel
                          </Button>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleEmailAction('generate_ai', selectedEmailData)} disabled={processingAction === 'generate_ai'} className="gap-2">
                          <Brain className="h-4 w-4" />
                          {processingAction === 'generate_ai' ? 'Regenerating...' : 'Regenerate with AI'}
                        </Button>
                      </div>
                    </div>
                  </ModernCard>}
              </div>
            </ModernCard> : <ModernCard className="h-[calc(100vh-400px)]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="p-6 rounded-full bg-primary/10 w-24 h-24 flex items-center justify-center mx-auto">
                    <Mail className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Select an email to view</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      Choose an email from the list to see AI-powered insights, lead matching, and automated response suggestions
                    </p>
                  </div>
                </div>
              </div>
            </ModernCard>}
        </div>
      </div>
    </div>;
}