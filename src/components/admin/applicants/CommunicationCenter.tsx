import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Send, 
  Calendar,
  History,
  FileText,
  Clock
} from "lucide-react";

interface CommunicationCenterProps {
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  onSendMessage: (type: string, content: string, subject?: string) => void;
}

export const CommunicationCenter: React.FC<CommunicationCenterProps> = ({
  applicantId,
  applicantName,
  applicantEmail,
  onSendMessage
}) => {
  const [messageType, setMessageType] = useState('email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Mock communication history
  const communicationHistory = [
    {
      id: '1',
      type: 'email',
      direction: 'outbound',
      subject: 'Welcome to Your Application Process',
      content: 'Thank you for your application. We have received your documents...',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'delivered',
      from: 'admissions@university.edu',
      to: applicantEmail
    },
    {
      id: '2',
      type: 'email',
      direction: 'inbound',
      subject: 'Re: Welcome to Your Application Process',
      content: 'Thank you for the confirmation. I have a question about...',
      timestamp: '2024-01-15T14:45:00Z',
      status: 'read',
      from: applicantEmail,
      to: 'admissions@university.edu'
    },
    {
      id: '3',
      type: 'sms',
      direction: 'outbound',
      content: 'Reminder: Your application deadline is approaching. Please submit remaining documents.',
      timestamp: '2024-01-16T09:00:00Z',
      status: 'delivered'
    },
    {
      id: '4',
      type: 'internal',
      direction: 'internal',
      content: 'Applicant called to inquire about interview schedule. Scheduled for next week.',
      timestamp: '2024-01-16T11:15:00Z',
      status: 'noted',
      author: 'Jane Smith'
    }
  ];

  const emailTemplates = [
    {
      id: 'welcome',
      name: 'Welcome Message',
      subject: 'Welcome to {University Name} Application Process',
      content: 'Dear {ApplicantName},\n\nThank you for your application to {ProgramName}. We have received your submission and will review it thoroughly...'
    },
    {
      id: 'document_request',
      name: 'Document Request',
      subject: 'Additional Documents Required',
      content: 'Dear {ApplicantName},\n\nWe are reviewing your application and require the following additional documents...'
    },
    {
      id: 'interview_invitation',
      name: 'Interview Invitation',
      subject: 'Interview Invitation - {ProgramName}',
      content: 'Dear {ApplicantName},\n\nWe are pleased to invite you for an interview as part of our selection process...'
    },
    {
      id: 'acceptance',
      name: 'Acceptance Letter',
      subject: 'Congratulations! Acceptance to {ProgramName}',
      content: 'Dear {ApplicantName},\n\nCongratulations! We are delighted to offer you admission to {ProgramName}...'
    },
    {
      id: 'rejection',
      name: 'Rejection Letter',
      subject: 'Application Update - {ProgramName}',
      content: 'Dear {ApplicantName},\n\nThank you for your interest in {ProgramName}. After careful consideration...'
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject.replace('{University Name}', 'University'));
      setContent(template.content.replace('{ApplicantName}', applicantName));
      setSelectedTemplate(templateId);
    }
  };

  const handleSend = () => {
    if (messageType === 'email' && (!subject || !content)) return;
    if (messageType !== 'email' && !content) return;

    onSendMessage(messageType, content, subject);
    setSubject('');
    setContent('');
    setSelectedTemplate('');
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'delivered': { variant: 'default' as const, text: 'Delivered' },
      'read': { variant: 'secondary' as const, text: 'Read' },
      'replied': { variant: 'outline' as const, text: 'Replied' },
      'noted': { variant: 'outline' as const, text: 'Noted' }
    };
    
    const config = variants[status as keyof typeof variants] || { variant: 'outline' as const, text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-4">
              {/* Message Type Selector */}
              <Select value={messageType} onValueChange={setMessageType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select message type" />
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
                  <SelectItem value="internal">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Internal Note
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Template Selector */}
              {messageType === 'email' && (
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <FileText className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Choose a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Subject Line (Email only) */}
              {messageType === 'email' && (
                <Input
                  placeholder="Subject line"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              )}

              {/* Message Content */}
              <Textarea
                placeholder={
                  messageType === 'email' 
                    ? 'Compose your email message...'
                    : messageType === 'sms'
                    ? 'Compose your SMS message...'
                    : 'Add internal note...'
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />

              {/* Send Button */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {messageType === 'sms' && (
                    <span>SMS character count: {content.length}/160</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                  <Button onClick={handleSend} disabled={!content || (messageType === 'email' && !subject)}>
                    <Send className="h-4 w-4 mr-1" />
                    Send {messageType === 'email' ? 'Email' : messageType === 'sms' ? 'SMS' : 'Note'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="space-y-3">
                {communicationHistory.map((message) => (
                  <Card key={message.id} className={`border-l-4 ${
                    message.direction === 'inbound' ? 'border-l-blue-500' : 
                    message.direction === 'outbound' ? 'border-l-green-500' : 
                    'border-l-gray-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            message.direction === 'inbound' ? 'bg-blue-100 text-blue-600' :
                            message.direction === 'outbound' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {getMessageIcon(message.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {message.subject || `${message.type.toUpperCase()} Message`}
                              </h4>
                              {getStatusBadge(message.status)}
                              <Badge variant="outline" className="capitalize">
                                {message.direction}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {message.content}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                              {message.from && (
                                <span>From: {message.from}</span>
                              )}
                              {message.author && (
                                <span>By: {message.author}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4">
                {emailTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleTemplateSelect(template.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">{template.subject}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {template.content}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};