import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send, 
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Bot,
  Plus
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudentCommunicationsProps {
  student: any;
  onUpdate: () => void;
}

export function StudentCommunications({ student, onUpdate }: StudentCommunicationsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const communications = [
    {
      id: 1,
      type: 'email',
      direction: 'outbound',
      from: 'Dr. Sarah Wilson',
      to: 'Emma Johnson',
      subject: 'Welcome to Computer Science Program',
      content: 'Dear Emma, Welcome to our Computer Science program! We are excited to have you join us. Please find attached the program handbook and orientation schedule.',
      timestamp: '2024-01-25T10:30:00Z',
      status: 'sent',
      isRead: true,
      attachments: ['Program_Handbook.pdf', 'Orientation_Schedule.pdf']
    },
    {
      id: 2,
      type: 'email',
      direction: 'inbound',
      from: 'Emma Johnson',
      to: 'Dr. Sarah Wilson',
      subject: 'Re: Welcome to Computer Science Program',
      content: 'Thank you for the warm welcome! I have a few questions about the course prerequisites and would like to schedule a meeting to discuss my academic plan.',
      timestamp: '2024-01-25T14:20:00Z',
      status: 'received',
      isRead: true,
      attachments: []
    },
    {
      id: 3,
      type: 'phone',
      direction: 'outbound',
      from: 'Dr. Sarah Wilson',
      to: 'Emma Johnson',
      subject: 'Phone consultation - Academic planning',
      content: 'Discussed course selection for first semester. Student expressed interest in AI/ML track. Scheduled follow-up for next week.',
      timestamp: '2024-01-24T15:45:00Z',
      status: 'completed',
      duration: '25 minutes',
      isRead: true
    },
    {
      id: 4,
      type: 'system',
      direction: 'automated',
      from: 'System',
      to: 'Emma Johnson',
      subject: 'Document Upload Reminder',
      content: 'This is a reminder that your Letter of Recommendation is still pending. Please submit by February 15th to avoid delays in processing.',
      timestamp: '2024-01-23T09:00:00Z',
      status: 'sent',
      isRead: false
    },
    {
      id: 5,
      type: 'sms',
      direction: 'outbound',
      from: 'University System',
      to: 'Emma Johnson',
      subject: 'Application Status Update',
      content: 'Hi Emma! Your transcripts have been approved. Next step: submit recommendation letters by Feb 15. Questions? Reply HELP.',
      timestamp: '2024-01-22T16:30:00Z',
      status: 'delivered',
      isRead: true
    }
  ];

  const templates = [
    { id: 'welcome', name: 'Welcome Message', category: 'onboarding' },
    { id: 'document_reminder', name: 'Document Reminder', category: 'follow-up' },
    { id: 'interview_invite', name: 'Interview Invitation', category: 'process' },
    { id: 'status_update', name: 'Status Update', category: 'progress' },
    { id: 'payment_reminder', name: 'Payment Reminder', category: 'financial' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'system':
        return <Bot className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      case 'phone':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'sms':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200';
      case 'system':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'inbound':
        return 'border-l-4 border-l-green-500';
      case 'outbound':
        return 'border-l-4 border-l-blue-500';
      case 'automated':
        return 'border-l-4 border-l-gray-500';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  const filteredCommunications = communications.filter(comm =>
    comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.from.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Communications</h2>
          <p className="text-muted-foreground">All communication history with {student.firstName} {student.lastName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Schedule Call
          </Button>
          <Button size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search communications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Calls</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filteredCommunications.map((comm) => (
              <Card key={comm.id} className={`${getDirectionColor(comm.direction)} ${!comm.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${getTypeColor(comm.type)}`}>
                      {getTypeIcon(comm.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{comm.subject}</h4>
                          {!comm.isRead && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(comm.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">{comm.direction === 'inbound' ? 'From:' : 'To:'}</span> {comm.direction === 'inbound' ? comm.from : comm.to}
                        {comm.type === 'phone' && comm.duration && (
                          <span className="ml-4">Duration: {comm.duration}</span>
                        )}
                      </div>
                      
                      <p className="text-sm mb-3">{comm.content}</p>
                      
                      {comm.attachments && comm.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {comm.attachments.map((attachment, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              📎 {attachment}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {comm.direction === 'inbound' ? 
                          student.firstName[0] + student.lastName[0] : 
                          comm.from === 'System' ? 'SY' : 'SW'
                        }
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <div className="space-y-4">
            {filteredCommunications.filter(c => c.type === 'email').map((comm) => (
              <Card key={comm.id} className={getDirectionColor(comm.direction)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{comm.subject}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comm.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {comm.from} → {comm.to}
                      </p>
                      <p className="text-sm">{comm.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="phone" className="space-y-4">
          <div className="space-y-4">
            {filteredCommunications.filter(c => c.type === 'phone').map((comm) => (
              <Card key={comm.id} className={getDirectionColor(comm.direction)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{comm.subject}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comm.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Duration: {comm.duration}
                      </p>
                      <p className="text-sm">{comm.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <div className="space-y-4">
            {filteredCommunications.filter(c => c.type === 'sms').map((comm) => (
              <Card key={comm.id} className={getDirectionColor(comm.direction)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <MessageSquare className="h-5 w-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{comm.subject}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comm.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{comm.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Compose New Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Message Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="phone">Schedule Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Template</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Enter subject..." />
              </div>
              
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{communications.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">95%</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">4.2h</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Contact</p>
                <p className="text-2xl font-bold">2d</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}