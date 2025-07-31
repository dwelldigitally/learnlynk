import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Phone
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
  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [messageType, setMessageType] = useState('email');
  const { toast } = useToast();

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
    if (!composeSubject.trim() || !composeRecipient.trim() || !composeMessage.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${composeRecipient}.`
    });
    
    setComposeSubject('');
    setComposeRecipient('');
    setComposeMessage('');
    setSelectedFiles([]);
    onClose();
  };

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isComposeMode ? 'Compose New Message' : `Message from ${message?.studentName}`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
          {/* Compose Mode Form */}
          {isComposeMode ? (
            <div className="lg:col-span-3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Recipient</label>
                  <Input
                    placeholder="Student name or email"
                    value={composeRecipient}
                    onChange={(e) => setComposeRecipient(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message Type</label>
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
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="Message subject"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Type your message..."
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

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
                    id="compose-file-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('compose-file-upload')?.click()}
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach Files
                  </Button>
                </div>

                <Button 
                  onClick={handleCompose} 
                  disabled={!composeSubject.trim() || !composeRecipient.trim() || !composeMessage.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};