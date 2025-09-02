import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Plus, 
  Search, 
  User, 
  Calendar, 
  Send,
  Eye,
  Reply,
  Forward,
  Paperclip
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailRecord {
  id: string;
  direction: 'inbound' | 'outbound';
  subject: string;
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  attachments?: string[];
}

interface EmailCommunicationPanelProps {
  leadId: string;
  emails?: EmailRecord[];
  leadEmail?: string;
  loading?: boolean;
}

export function EmailCommunicationPanel({ leadId, emails = [], leadEmail, loading = false }: EmailCommunicationPanelProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: leadEmail || '',
    subject: '',
    content: '',
    template: 'custom'
  });

  // Demo email history
  const demoEmails: EmailRecord[] = [
    {
      id: '1',
      direction: 'outbound',
      subject: 'Welcome to Healthcare Management Program',
      content: 'Dear Tushar,\n\nThank you for your interest in our Healthcare Management program. We are excited to help you begin your journey in healthcare leadership...',
      sender: 'Sarah Johnson <sarah@wcc.ca>',
      recipient: 'tushar@wcc.ca',
      timestamp: '2024-01-20T09:30:00Z',
      status: 'opened',
      attachments: ['program-brochure.pdf']
    },
    {
      id: '2',
      direction: 'inbound',
      subject: 'Re: Application Requirements',
      content: 'Hi Sarah,\n\nI have a question about the application requirements. Do I need to submit transcripts from all previous institutions?',
      sender: 'tushar@wcc.ca',
      recipient: 'Sarah Johnson <sarah@wcc.ca>',
      timestamp: '2024-01-19T14:15:00Z',
      status: 'sent'
    },
    {
      id: '3',
      direction: 'outbound',
      subject: 'Application Deadline Reminder',
      content: 'This is a friendly reminder that the application deadline for the Healthcare Management program is approaching...',
      sender: 'admissions@wcc.ca',
      recipient: 'tushar@wcc.ca',
      timestamp: '2024-01-18T16:00:00Z',
      status: 'clicked'
    }
  ];

  const displayEmails = emails.length > 0 ? emails : demoEmails;
  
  const filteredEmails = displayEmails.filter(email => 
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'secondary',
      delivered: 'default', 
      opened: 'default',
      clicked: 'default',
      bounced: 'destructive',
      failed: 'destructive'
    } as const;
    
    const colors = {
      sent: 'bg-gray-100 text-gray-800',
      delivered: 'bg-blue-100 text-blue-800',
      opened: 'bg-green-100 text-green-800',
      clicked: 'bg-purple-100 text-purple-800',
      bounced: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'} 
             className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    );
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'inbound' ? 
      <Mail className="h-4 w-4 text-blue-500" /> : 
      <Send className="h-4 w-4 text-green-500" />;
  };

  const emailTemplates = [
    { value: 'welcome', label: 'Welcome Email', subject: 'Welcome to [Program Name]' },
    { value: 'follow_up', label: 'Follow-up', subject: 'Following up on your application' },
    { value: 'deadline_reminder', label: 'Deadline Reminder', subject: 'Application deadline approaching' },
    { value: 'custom', label: 'Custom Email', subject: '' }
  ];

  const sendEmail = async () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.content) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);
    
    try {
      // Simulate API call to send email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Email Sent Successfully',
        description: `Email sent to ${newEmail.to}`,
        variant: 'default'
      });
      
      setIsComposing(false);
      setNewEmail({
        to: leadEmail || '',
        subject: '',
        content: '',
        template: 'custom'
      });
    } catch (error) {
      toast({
        title: 'Failed to Send Email',
        description: 'There was an error sending the email. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleTemplateChange = (template: string) => {
    const selectedTemplate = emailTemplates.find(t => t.value === template);
    setNewEmail({
      ...newEmail,
      template,
      subject: selectedTemplate?.subject || ''
    });
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Communications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Communications
          </div>
          <Dialog open={isComposing} onOpenChange={setIsComposing}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Compose Email
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Compose New Email</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Template</label>
                    <Select value={newEmail.template} onValueChange={handleTemplateChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem key={template.value} value={template.value}>
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">To</label>
                    <Input 
                      value={newEmail.to}
                      onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
                      placeholder="recipient@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input 
                    value={newEmail.subject}
                    onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                    placeholder="Email subject..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    value={newEmail.content}
                    onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
                    placeholder="Email content..."
                    rows={8}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={sendEmail} disabled={isSending} className="flex-1">
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsComposing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search emails..."
            className="pl-9"
          />
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {filteredEmails.length > 0 ? (
            <div className="space-y-3">
              {filteredEmails.map((email) => (
                <div key={email.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getDirectionIcon(email.direction)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{email.subject}</h4>
                          {getStatusBadge(email.status)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {email.direction === 'inbound' ? `From: ${email.sender}` : `To: ${email.recipient}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {new Date(email.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(email.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {email.content}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {email.attachments && email.attachments.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Paperclip className="h-3 w-3 mr-1" />
                          {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedEmail(email)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{selectedEmail?.subject}</DialogTitle>
                          </DialogHeader>
                          {selectedEmail && (
                            <div className="space-y-4">
                              <div className="border rounded p-3 bg-muted/30">
                                <div className="text-sm space-y-1">
                                  <div><strong>From:</strong> {selectedEmail.sender}</div>
                                  <div><strong>To:</strong> {selectedEmail.recipient}</div>
                                  <div><strong>Date:</strong> {new Date(selectedEmail.timestamp).toLocaleString()}</div>
                                  <div className="flex items-center gap-2">
                                    <strong>Status:</strong> {getStatusBadge(selectedEmail.status)}
                                  </div>
                                </div>
                              </div>
                              <div className="whitespace-pre-wrap text-sm">
                                {selectedEmail.content}
                              </div>
                              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                                <div>
                                  <strong className="text-sm">Attachments:</strong>
                                  <ul className="mt-1">
                                    {selectedEmail.attachments.map((attachment, index) => (
                                      <li key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                                        <Paperclip className="h-3 w-3 inline mr-1" />
                                        {attachment}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Reply className="h-3 w-3 mr-1" />
                                  Reply
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Forward className="h-3 w-3 mr-1" />
                                  Forward
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground font-medium">No email communications</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Email history will appear here once communications begin
              </p>
              <Button variant="outline" size="sm" onClick={() => setIsComposing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Send First Email
              </Button>
            </div>
          )}
        </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}