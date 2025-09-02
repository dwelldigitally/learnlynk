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
  MessageSquare, 
  Plus, 
  Search, 
  User, 
  Calendar, 
  Send,
  Eye,
  Reply,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SMSRecord {
  id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  cost?: number;
}

interface SMSCommunicationPanelProps {
  leadId: string;
  messages?: SMSRecord[];
  leadPhone?: string;
  loading?: boolean;
}

export function SMSCommunicationPanel({ leadId, messages = [], leadPhone, loading = false }: SMSCommunicationPanelProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<SMSRecord | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: leadPhone || '',
    content: '',
    template: 'custom'
  });

  // Demo SMS history
  const demoMessages: SMSRecord[] = [
    {
      id: '1',
      direction: 'outbound',
      content: 'Hi Tushar! Thanks for your interest in Healthcare Management. We have received your application and will review it shortly. Feel free to call us if you have any questions!',
      sender: 'WCC Admissions',
      recipient: '7785988440',
      timestamp: '2024-01-20T10:15:00Z',
      status: 'read',
      cost: 0.02
    },
    {
      id: '2',
      direction: 'inbound',
      content: 'Thank you! When can I expect to hear back about my application status?',
      sender: '7785988440',
      recipient: 'WCC Admissions',
      timestamp: '2024-01-20T10:18:00Z',
      status: 'delivered'
    },
    {
      id: '3',
      direction: 'outbound',
      content: 'Typically within 5-7 business days. We will send you an email with next steps. Have a great day!',
      sender: 'WCC Admissions',
      recipient: '7785988440',
      timestamp: '2024-01-20T10:20:00Z',
      status: 'delivered',
      cost: 0.02
    },
    {
      id: '4',
      direction: 'outbound',
      content: 'Reminder: Application deadline is January 31st. Please submit any remaining documents by then.',
      sender: 'WCC Admissions',
      recipient: '7785988440',
      timestamp: '2024-01-18T09:00:00Z',
      status: 'read',
      cost: 0.02
    }
  ];

  const displayMessages = messages.length > 0 ? messages : demoMessages;
  
  const filteredMessages = displayMessages.filter(message => 
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'secondary',
      delivered: 'default',
      read: 'default',
      failed: 'destructive'
    } as const;
    
    const colors = {
      sent: 'bg-gray-100 text-gray-800',
      delivered: 'bg-blue-100 text-blue-800',
      read: 'bg-green-100 text-green-800',
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
      <MessageSquare className="h-4 w-4 text-blue-500" /> : 
      <Send className="h-4 w-4 text-green-500" />;
  };

  const smsTemplates = [
    { value: 'welcome', label: 'Welcome Message', content: 'Welcome to [Institution]! Thanks for your interest in our programs.' },
    { value: 'reminder', label: 'Application Reminder', content: 'Reminder: Your application deadline is approaching. Please submit any remaining documents.' },
    { value: 'follow_up', label: 'Follow-up', content: 'Hi! Just following up on your application. Do you have any questions we can help with?' },
    { value: 'custom', label: 'Custom Message', content: '' }
  ];

  const sendSMS = async () => {
    if (!newMessage.to || !newMessage.content) {
      toast({
        title: 'Missing Information',
        description: 'Please enter phone number and message content',
        variant: 'destructive'
      });
      return;
    }

    if (newMessage.content.length > 160) {
      toast({
        title: 'Message Too Long',
        description: 'SMS messages should be 160 characters or less',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);
    
    try {
      // Simulate API call to send SMS
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'SMS Sent Successfully',
        description: `Message sent to ${newMessage.to}`,
        variant: 'default'
      });
      
      setIsComposing(false);
      setNewMessage({
        to: leadPhone || '',
        content: '',
        template: 'custom'
      });
    } catch (error) {
      toast({
        title: 'Failed to Send SMS',
        description: 'There was an error sending the SMS. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleTemplateChange = (template: string) => {
    const selectedTemplate = smsTemplates.find(t => t.value === template);
    setNewMessage({
      ...newMessage,
      template,
      content: selectedTemplate?.content || ''
    });
  };

  const formatPhoneNumber = (phone: string) => {
    // Simple phone number formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Communications
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
            <Smartphone className="h-5 w-5" />
            SMS Communications
          </div>
          <Dialog open={isComposing} onOpenChange={setIsComposing}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Send SMS
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send New SMS</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Template</label>
                    <Select value={newMessage.template} onValueChange={handleTemplateChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {smsTemplates.map((template) => (
                          <SelectItem key={template.value} value={template.value}>
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input 
                      value={newMessage.to}
                      onChange={(e) => setNewMessage({...newMessage, to: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Message</label>
                    <span className="text-xs text-muted-foreground">
                      {newMessage.content.length}/160
                    </span>
                  </div>
                  <Textarea 
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    placeholder="Type your message..."
                    rows={4}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    SMS messages are limited to 160 characters
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={sendSMS} disabled={isSending} className="flex-1">
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send SMS
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
            placeholder="Search messages..."
            className="pl-9"
          />
        </div>

        {/* SMS List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {filteredMessages.length > 0 ? (
            <div className="space-y-3">
              {filteredMessages.map((message) => (
                <div key={message.id} className={`border rounded-lg p-3 hover:bg-muted/50 transition-colors ${
                  message.direction === 'inbound' ? 'bg-blue-50/50' : 'bg-green-50/50'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getDirectionIcon(message.direction)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {message.direction === 'inbound' ? 
                              `From: ${formatPhoneNumber(message.sender)}` : 
                              `To: ${formatPhoneNumber(message.recipient)}`
                            }
                          </span>
                          {getStatusBadge(message.status)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm mb-3 bg-white p-2 rounded border">
                    {message.content}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {message.cost && (
                        <Badge variant="outline" className="text-xs">
                          Cost: ${message.cost.toFixed(3)}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {message.content.length} chars
                      </Badge>
                    </div>
                    
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => setSelectedMessage(message)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>SMS Details</DialogTitle>
                          </DialogHeader>
                          {selectedMessage && (
                            <div className="space-y-4">
                              <div className="border rounded p-3 bg-muted/30">
                                <div className="text-sm space-y-1">
                                  <div><strong>From:</strong> {formatPhoneNumber(selectedMessage.sender)}</div>
                                  <div><strong>To:</strong> {formatPhoneNumber(selectedMessage.recipient)}</div>
                                  <div><strong>Date:</strong> {new Date(selectedMessage.timestamp).toLocaleString()}</div>
                                  <div className="flex items-center gap-2">
                                    <strong>Status:</strong> {getStatusBadge(selectedMessage.status)}
                                  </div>
                                  {selectedMessage.cost && (
                                    <div><strong>Cost:</strong> ${selectedMessage.cost.toFixed(3)}</div>
                                  )}
                                </div>
                              </div>
                              <div className="bg-white p-3 border rounded">
                                <strong className="text-sm">Message:</strong>
                                <div className="mt-1 text-sm">
                                  {selectedMessage.content}
                                </div>
                              </div>
                              {selectedMessage.direction === 'inbound' && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => {
                                    setNewMessage({
                                      to: selectedMessage.sender,
                                      content: '',
                                      template: 'custom'
                                    });
                                    setIsComposing(true);
                                  }}>
                                    <Reply className="h-3 w-3 mr-1" />
                                    Reply
                                  </Button>
                                </div>
                              )}
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
                <Smartphone className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground font-medium">No SMS communications</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  SMS history will appear here once messages are sent
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsComposing(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Send First SMS
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}