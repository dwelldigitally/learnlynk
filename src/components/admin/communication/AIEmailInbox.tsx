import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  User, 
  Brain, 
  TrendingUp,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { generateDummyEmails, getHighPriorityEmails, getUnreadEmails } from '@/services/dummyEmailService';
import { EmailImportDialog } from './EmailImportDialog';
import { EmailService } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { toast } = useToast();
  
  const dummyEmails = generateDummyEmails();
  const allEmails = [...realEmails, ...dummyEmails];
  const highPriorityEmails = getHighPriorityEmails();
  const unreadEmails = getUnreadEmails();

  const loadRealEmails = async () => {
    setLoading(true);
    try {
      const { emails } = await EmailService.getEmails({}, 1, 20);
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
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.from_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.body_content.toLowerCase().includes(searchQuery.toLowerCase());
    
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
      case 'inquiry': return <MessageSquare className="h-4 w-4" />;
      case 'application': return <FileText className="h-4 w-4" />;
      case 'complaint': return <AlertCircle className="h-4 w-4" />;
      case 'follow_up': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
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
        variant: "destructive",
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
        description: "Email has been archived successfully.",
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
        description: `Successfully executed: ${action.description}`,
      });
      
      // Refresh emails to show any status changes
      loadRealEmails();
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
      toast({
        title: "Action Failed",
        description: `Failed to execute: ${action.description}`,
        variant: "destructive",
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
    const { data: { user } } = await supabase.auth.getUser();
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
      const { data, error } = await supabase.functions.invoke('generate-reply-ai', {
        body: {
          leadName: emailData.lead_match?.name || emailData.from_name,
          leadContext: {
            email: emailData.from_email,
            programInterest: emailData.lead_match?.program_interest || [],
            subject: emailData.subject
          },
          communicationHistory: [
            {
              type: 'email',
              content: emailData.body_content,
              date: emailData.received_datetime,
              direction: 'inbound'
            }
          ]
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
        description: "AI has generated a personalized response. Review and edit before sending.",
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
        description: "Your reply has been sent successfully.",
      });
      
      setShowReplyBox(false);
      setReplyContent({ subject: '', body: '', type: 'reply' });
      
      // Update email status and refresh
      if (selectedEmail) {
        await EmailService.updateEmailStatus(selectedEmail, 'replied');
        loadRealEmails();
      }
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    }
  };

   return (
    <div className="space-y-4">
      {/* Header with Import Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">AI Email Management</h2>
        <EmailImportDialog onEmailImported={loadRealEmails} />
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails by subject, sender, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filterCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory('all')}
          >
            All
          </Button>
          <Button
            variant={filterCategory === 'inquiry' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory('inquiry')}
          >
            Inquiries
          </Button>
          <Button
            variant={filterCategory === 'application' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory('application')}
          >
            Applications
          </Button>
          <Button
            variant={filterCategory === 'complaint' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory('complaint')}
          >
            Issues
          </Button>
        </div>
      </div>

      {/* Email List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Email List */}
        <div className="lg:col-span-1 space-y-2">
          <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredEmails.map((email) => (
              <Card
                key={email.id}
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  selectedEmail === email.id ? 'ring-1 ring-primary' : ''
                } ${!email.is_read ? 'bg-blue-50/50' : ''}`}
                onClick={() => setSelectedEmail(email.id)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-primary/10">
                          {getCategoryIcon(email.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{email.from_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{email.from_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!email.is_read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                        <Badge className={`text-xs ${getPriorityColor(email.ai_priority_score)}`}>
                          {email.ai_priority_score}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <p className={`text-sm ${!email.is_read ? 'font-semibold' : ''} truncate`}>
                        {email.subject}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {email.body_preview}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(email.received_datetime).toLocaleTimeString()}</span>
                      <div className="flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        <span>{email.ai_suggested_actions.length} actions</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Email Detail View */}
        <div className="lg:col-span-2">
          {selectedEmailData ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedEmailData.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <User className="h-4 w-4" />
                      <span>{selectedEmailData.from_name} &lt;{selectedEmailData.from_email}&gt;</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(selectedEmailData.received_datetime).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(selectedEmailData.ai_priority_score)}>
                      AI Score: {selectedEmailData.ai_priority_score}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {selectedEmailData.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Content */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {selectedEmailData.body_content}
                  </pre>
                </div>

                {/* AI Insights */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    AI Insights & Suggestions
                  </h4>
                  
                  {/* Lead Match */}
                  {selectedEmailData.lead_match && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Lead Match Found</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{selectedEmailData.lead_match.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Interested in: {selectedEmailData.lead_match.program_interest.join(', ')}
                            </p>
                          </div>
                          <Badge className="bg-green-50 text-green-700">
                            {selectedEmailData.lead_match.score}% match
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Suggested Actions */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Suggested Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedEmailData.ai_suggested_actions.map((action, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{action.description}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {action.type.replace('_', ' ')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {action.confidence}% confidence
                              </Badge>
                              <Button 
                                size="sm"
                                onClick={() => handleExecuteSuggestedAction(action, selectedEmailData)}
                                disabled={processingAction === `suggested_${action.type}`}
                              >
                                {processingAction === `suggested_${action.type}` ? 'Executing...' : 'Execute'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleEmailAction('reply', selectedEmailData)}
                    disabled={processingAction === 'reply'}
                  >
                    {processingAction === 'reply' ? 'Creating Reply...' : 'Reply'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleEmailAction('forward', selectedEmailData)}
                    disabled={processingAction === 'forward'}
                  >
                    {processingAction === 'forward' ? 'Creating Forward...' : 'Forward'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleEmailAction('archive', selectedEmailData)}
                    disabled={processingAction === 'archive'}
                  >
                    {processingAction === 'archive' ? 'Archiving...' : 'Archive'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleEmailAction('generate_ai', selectedEmailData)}
                    disabled={processingAction === 'generate_ai'}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {processingAction === 'generate_ai' ? 'Generating...' : 'Generate AI Response'}
                  </Button>
                </div>

                {/* Reply Box */}
                {showReplyBox && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {replyContent.type === 'reply' ? 'Reply' : 'Forward'} - {replyContent.subject}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="reply-subject">Subject</Label>
                        <Input
                          id="reply-subject"
                          value={replyContent.subject}
                          onChange={(e) => setReplyContent(prev => ({ ...prev, subject: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="reply-body">Message</Label>
                        <Textarea
                          id="reply-body"
                          value={replyContent.body}
                          onChange={(e) => setReplyContent(prev => ({ ...prev, body: e.target.value }))}
                          rows={12}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button onClick={handleSendReply}>
                            Send {replyContent.type === 'reply' ? 'Reply' : 'Forward'}
                          </Button>
                          <Button variant="outline" onClick={() => setShowReplyBox(false)}>
                            Cancel
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEmailAction('generate_ai', selectedEmailData)}
                            disabled={processingAction === 'generate_ai'}
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            {processingAction === 'generate_ai' ? 'Regenerating...' : 'Regenerate with AI'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Select an email to view</h3>
                  <p className="text-muted-foreground">
                    Choose an email from the list to see AI insights and suggestions
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}