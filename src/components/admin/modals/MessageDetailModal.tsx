import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Send, 
  Reply, 
  Forward, 
  Printer, 
  Paperclip,
  Clock,
  User,
  Mail,
  Phone,
  Users,
  Filter,
  Eye,
  X
} from 'lucide-react';

interface Message {
  id: string;
  studentName: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  program: string;
  channel: 'email' | 'sms' | 'portal';
  avatar?: string;
  thread?: ThreadMessage[];
}

interface ThreadMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isFromStudent: boolean;
  attachments?: string[];
}

interface RecipientFilter {
  programs: string[];
  stages: string[];
  statuses: string[];
  sendToAll: boolean;
  specificStudents: string[];
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  variables: string[];
}

interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message | null;
  mode?: 'view' | 'compose';
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  isOpen,
  onClose,
  message,
  mode = 'view'
}) => {
  const [replyText, setReplyText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [messageType, setMessageType] = useState('email');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const { toast } = useToast();

  // Advanced recipient filtering
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>({
    programs: [],
    stages: [],
    statuses: [],
    sendToAll: false,
    specificStudents: []
  });
  
  const [recipientCount, setRecipientCount] = useState(0);
  const [showRecipientPreview, setShowRecipientPreview] = useState(false);

  // Mock data for filters
  const availablePrograms = ["Health Care Assistant", "Aviation", "Education Assistant", "Hospitality", "ECE", "MLA"];
  const availableStages = ["LEAD_FORM", "SEND_DOCUMENTS", "DOCUMENT_APPROVAL", "FEE_PAYMENT", "ACCEPTED"];
  const availableStatuses = ["Active", "Inactive", "On Hold", "Pending", "Enrolled"];
  
  const messageTemplates: MessageTemplate[] = [
    {
      id: "welcome",
      name: "Welcome Message",
      subject: "Welcome to {{program_name}}",
      content: "Dear {{student_name}},\n\nWelcome to {{program_name}}! We're excited to have you join us.\n\nBest regards,\nAdmissions Team",
      category: "Welcome",
      variables: ["student_name", "program_name"]
    },
    {
      id: "document_reminder",
      name: "Document Reminder",
      subject: "Document Submission Reminder",
      content: "Hi {{student_name}},\n\nThis is a reminder to submit your required documents for {{program_name}}.\n\nDeadline: {{deadline}}\n\nBest regards,\nAdmissions Team",
      category: "Reminder",
      variables: ["student_name", "program_name", "deadline"]
    },
    {
      id: "acceptance",
      name: "Acceptance Letter",
      subject: "Congratulations! You've been accepted to {{program_name}}",
      content: "Dear {{student_name}},\n\nCongratulations! We're pleased to inform you that you've been accepted into {{program_name}}.\n\nNext steps:\n1. Pay your enrollment fee\n2. Attend orientation\n\nWelcome to our community!\n\nBest regards,\nAdmissions Team",
      category: "Acceptance",
      variables: ["student_name", "program_name"]
    },
    {
      id: "fee_reminder",
      name: "Fee Payment Reminder",
      subject: "Fee Payment Required - {{program_name}}",
      content: "Dear {{student_name}},\n\nThis is a reminder that your fee payment for {{program_name}} is due.\n\nAmount: ${{amount}}\nDue Date: {{due_date}}\n\nPlease make your payment to secure your spot.\n\nBest regards,\nFinance Team",
      category: "Payment",
      variables: ["student_name", "program_name", "amount", "due_date"]
    }
  ];

  const isComposeMode = mode === 'compose' || !message;

  const mockThread: ThreadMessage[] = message ? [
    {
      id: '1',
      sender: message.studentName,
      content: message.message,
      timestamp: message.timestamp,
      isFromStudent: true
    },
    {
      id: '2',
      sender: 'Sarah Johnson',
      content: 'Thank you for your inquiry. I\'ll look into this and get back to you within 24 hours.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isFromStudent: false
    }
  ] : [];

  const handleReply = () => {
    if (!replyText.trim()) return;
    
    toast({
      title: "Reply Sent",
      description: `Your reply has been sent to ${message?.studentName}.`
    });
    
    setReplyText('');
    setSelectedFiles([]);
    onClose();
  };

  const handleCompose = () => {
    if (!composeSubject.trim() || !composeMessage.trim()) {
      toast({
        title: "Error",
        description: "Please fill in subject and message fields.",
        variant: "destructive"
      });
      return;
    }

    if (recipientCount === 0 && !recipientFilter.sendToAll) {
      toast({
        title: "Error",
        description: "Please select at least one recipient.",
        variant: "destructive"
      });
      return;
    }
    
    const finalRecipientCount = recipientFilter.sendToAll ? 150 : recipientCount;
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${finalRecipientCount} recipient(s) via ${messageType}.`
    });
    
    // Reset form
    setComposeSubject('');
    setComposeMessage('');
    setSelectedTemplate('');
    setRecipientFilter({
      programs: [],
      stages: [],
      statuses: [],
      sendToAll: false,
      specificStudents: []
    });
    setSelectedFiles([]);
    onClose();
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "none") {
      // Clear template selection
      setComposeSubject("");
      setComposeMessage("");
      setSelectedTemplate("");
      return;
    }
    
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setComposeSubject(template.subject);
      setComposeMessage(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const updateRecipientCount = () => {
    if (recipientFilter.sendToAll) {
      setRecipientCount(150); // Mock total count
    } else {
      // Mock calculation based on filters
      let count = 0;
      if (recipientFilter.programs.length > 0) count += recipientFilter.programs.length * 25;
      if (recipientFilter.stages.length > 0) count += recipientFilter.stages.length * 15;
      if (recipientFilter.statuses.length > 0) count += recipientFilter.statuses.length * 20;
      if (recipientFilter.specificStudents.length > 0) count = recipientFilter.specificStudents.length;
      
      setRecipientCount(Math.min(count, 150));
    }
  };

  React.useEffect(() => {
    updateRecipientCount();
  }, [recipientFilter]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'destructive';
      case 'read': return 'secondary';
      case 'replied': return 'default';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isComposeMode ? 'Send New Message' : `Message from ${message?.studentName}`}
          </DialogTitle>
          {isComposeMode && (
            <DialogDescription>
              Send messages to students with advanced targeting and templates
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="h-[75vh] overflow-y-auto">
          {/* Compose Mode Form */}
          {isComposeMode ? (
            <Tabs defaultValue="recipients" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recipients">Recipients</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              {/* Recipients Tab */}
              <TabsContent value="recipients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Recipient Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Send to All */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sendToAll"
                        checked={recipientFilter.sendToAll}
                        onCheckedChange={(checked) => 
                          setRecipientFilter(prev => ({ ...prev, sendToAll: checked as boolean }))
                        }
                      />
                      <Label htmlFor="sendToAll" className="text-sm font-medium">
                        Send to all students (150 students)
                      </Label>
                    </div>

                    {!recipientFilter.sendToAll && (
                      <>
                        {/* Program Filter */}
                        <div className="space-y-2">
                          <Label>Programs</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {availablePrograms.map((program) => (
                              <div key={program} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`program-${program}`}
                                  checked={recipientFilter.programs.includes(program)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setRecipientFilter(prev => ({
                                        ...prev,
                                        programs: [...prev.programs, program]
                                      }));
                                    } else {
                                      setRecipientFilter(prev => ({
                                        ...prev,
                                        programs: prev.programs.filter(p => p !== program)
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`program-${program}`} className="text-sm">
                                  {program}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stage Filter */}
                        <div className="space-y-2">
                          <Label>Admission Stages</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {availableStages.map((stage) => (
                              <div key={stage} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`stage-${stage}`}
                                  checked={recipientFilter.stages.includes(stage)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setRecipientFilter(prev => ({
                                        ...prev,
                                        stages: [...prev.stages, stage]
                                      }));
                                    } else {
                                      setRecipientFilter(prev => ({
                                        ...prev,
                                        stages: prev.stages.filter(s => s !== stage)
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`stage-${stage}`} className="text-sm">
                                  {stage.replace(/_/g, ' ')}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                          <Label>Student Status</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {availableStatuses.map((status) => (
                              <div key={status} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`status-${status}`}
                                  checked={recipientFilter.statuses.includes(status)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setRecipientFilter(prev => ({
                                        ...prev,
                                        statuses: [...prev.statuses, status]
                                      }));
                                    } else {
                                      setRecipientFilter(prev => ({
                                        ...prev,
                                        statuses: prev.statuses.filter(s => s !== status)
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`status-${status}`} className="text-sm">
                                  {status}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Recipient Count */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span className="text-sm font-medium">
                        Selected Recipients: {recipientFilter.sendToAll ? 150 : recipientCount}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowRecipientPreview(!showRecipientPreview)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4">
                {/* Template Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Message Template (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No template</SelectItem>
                        {messageTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} ({template.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Message Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Message Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Message Type */}
                    <div className="space-y-2">
                      <Label htmlFor="type">Message Type</Label>
                      <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="portal">Portal Message</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Enter subject"
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Type your message here... Use {{student_name}}, {{program_name}} for personalization"
                        className="min-h-[150px]"
                        value={composeMessage}
                        onChange={(e) => setComposeMessage(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Available variables: {`{{student_name}}, {{program_name}}, {{deadline}}, {{stage}}, {{amount}}, {{due_date}}`}
                      </p>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label>Attachments</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          id="file-upload"
                          onChange={handleFileSelect}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Paperclip className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload files or drag and drop</p>
                        </label>
                      </div>
                      
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Selected files:</p>
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm">{file.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Message Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-md bg-muted/50">
                      <div className="space-y-2">
                        <p><strong>Recipients:</strong> {recipientFilter.sendToAll ? 'All students (150)' : `${recipientCount} selected students`}</p>
                        <p><strong>Type:</strong> {messageType}</p>
                        <p><strong>Subject:</strong> {composeSubject || 'No subject'}</p>
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <p><strong>Message Content:</strong></p>
                        <div className="p-3 bg-background border rounded whitespace-pre-wrap">
                          {composeMessage || 'No message content'}
                        </div>
                      </div>
                      {selectedFiles.length > 0 && (
                        <>
                          <Separator className="my-4" />
                          <p><strong>Attachments:</strong> {selectedFiles.length} file(s)</p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Send Button */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCompose}
                    disabled={!composeSubject || !composeMessage || (recipientCount === 0 && !recipientFilter.sendToAll)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send to {recipientFilter.sendToAll ? 150 : recipientCount} Recipients
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Message Details Sidebar */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={message?.avatar} />
                      <AvatarFallback>
                        {message?.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{message?.studentName}</h4>
                      <p className="text-sm text-muted-foreground">{message?.program}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      <span>student@example.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{message && formatTimestamp(message.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span>{message?.assignedTo}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {message && (
                      <>
                        <Badge variant={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                        <Badge variant={getPriorityColor(message.priority)}>
                          {message.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {message.channel}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h5 className="font-medium">Quick Actions</h5>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Forward className="w-4 h-4 mr-2" />
                      Forward
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </div>

              {/* Conversation Thread */}
              <div className="col-span-2 space-y-4">
                <ScrollArea className="h-96 pr-4">
                  <div className="space-y-4">
                    {mockThread.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromStudent ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.isFromStudent
                              ? 'bg-muted'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{msg.sender}</span>
                            <span className="text-xs opacity-70">
                              {formatTimestamp(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {msg.attachments.map((attachment, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  <Paperclip className="w-3 h-3 mr-1" />
                                  {attachment}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Reply Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Reply className="w-4 h-4" />
                    <span className="font-medium">Reply</span>
                  </div>

                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[100px]"
                  />

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Attachments:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Paperclip className="w-3 h-3 mr-1" />
                            {file.name}
                            <button
                              onClick={() => removeFile(index)}
                              className="ml-1 text-destructive hover:text-destructive-foreground"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="reply-file-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('reply-file-upload')?.click()}
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach Files
                      </Button>
                    </div>

                    <Button onClick={handleReply} disabled={!replyText.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};