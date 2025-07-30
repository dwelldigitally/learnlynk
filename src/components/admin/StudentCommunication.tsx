import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Mail, 
  Phone, 
  MessageSquare,
  Calendar,
  User,
  ExternalLink,
  Clock,
  CheckCircle
} from "lucide-react";

interface StudentCommunicationProps {
  studentId: string;
  studentName: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: Date;
  type: 'email' | 'sms' | 'internal' | 'system';
  status: 'sent' | 'delivered' | 'read' | 'replied';
  isFromAdvisor: boolean;
}

const StudentCommunication: React.FC<StudentCommunicationProps> = ({ 
  studentId, 
  studentName 
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState<'email' | 'sms' | 'internal'>('internal');

  // Mock message history
  const messages: Message[] = [
    {
      id: "1",
      from: "Nicole Adams",
      to: studentName,
      subject: "Welcome to Health Care Assistant Program",
      content: "Welcome to the Health Care Assistant program! I'll be your advisor throughout your application journey. Please don't hesitate to reach out if you have any questions.",
      timestamp: new Date("2025-01-15T09:00:00"),
      type: 'email',
      status: 'read',
      isFromAdvisor: true
    },
    {
      id: "2",
      from: studentName,
      to: "Nicole Adams",
      subject: "Question about document requirements",
      content: "Hi Nicole, I have a question about the immunization records. Do I need to provide the full vaccination history or just the required vaccines for healthcare workers?",
      timestamp: new Date("2025-01-16T14:30:00"),
      type: 'email',
      status: 'replied',
      isFromAdvisor: false
    },
    {
      id: "3",
      from: "Nicole Adams",
      to: studentName,
      subject: "Re: Question about document requirements",
      content: "Great question! You'll need to provide documentation for the specific vaccines required for healthcare workers: Hepatitis B, MMR, Varicella, Tdap, and annual flu vaccine. A summary from your doctor's office will work perfectly.",
      timestamp: new Date("2025-01-16T15:45:00"),
      type: 'email',
      status: 'read',
      isFromAdvisor: true
    },
    {
      id: "4",
      from: "System",
      to: studentName,
      subject: "Document status update",
      content: "Your First Aid Certificate has been rejected. Please review the feedback and resubmit an updated document.",
      timestamp: new Date("2025-01-17T10:20:00"),
      type: 'system',
      status: 'delivered',
      isFromAdvisor: true
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    console.log(`Sending ${messageType} message to ${studentName}: ${newMessage}`);
    setNewMessage("");
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-3 w-3" />;
      case 'sms': return <Phone className="h-3 w-3" />;
      case 'internal': return <MessageSquare className="h-3 w-3" />;
      case 'system': return <User className="h-3 w-3" />;
      default: return <MessageSquare className="h-3 w-3" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send className="h-3 w-3 text-gray-500" />;
      case 'delivered': return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case 'read': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'replied': return <CheckCircle className="h-3 w-3 text-purple-500" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const quickTemplates = [
    {
      title: "Document Follow-up",
      content: "Hi [Student Name], I noticed you haven't submitted [Document Name] yet. The deadline is approaching on [Date]. Please upload it at your earliest convenience. Let me know if you need any assistance!"
    },
    {
      title: "Application Status Update",
      content: "Great news! Your application for [Program Name] has progressed to the next stage. Here's what you need to do next: [Next Steps]. Feel free to reach out if you have any questions."
    },
    {
      title: "Schedule Meeting",
      content: "I'd like to schedule a brief meeting to discuss your application progress and answer any questions you might have. Please let me know your availability for next week."
    },
    {
      title: "Congratulations",
      content: "Congratulations! I'm pleased to inform you that your application has been approved. You'll receive detailed next steps via email within 24 hours. Welcome to [Program Name]!"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Emails</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => m.type === 'email').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => m.type === 'internal').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">2.5h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Last Contact</p>
                <p className="text-2xl font-bold">2h ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Message History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-96 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`p-4 rounded-lg border ${
                    message.isFromAdvisor ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="text-xs">
                            {message.from.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{message.from}</span>
                        <div className="flex items-center space-x-1">
                          {getMessageTypeIcon(message.type)}
                          <Badge variant="outline" className="text-xs">
                            {message.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{message.timestamp.toLocaleString()}</span>
                        {getStatusIcon(message.status)}
                      </div>
                    </div>
                    {message.subject && (
                      <p className="font-medium text-sm mb-1">{message.subject}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Message & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Book Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Profile
              </Button>
            </CardContent>
          </Card>

          {/* New Message */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant={messageType === 'internal' ? 'default' : 'outline'}
                  onClick={() => setMessageType('internal')}
                >
                  Internal
                </Button>
                <Button
                  size="sm"
                  variant={messageType === 'email' ? 'default' : 'outline'}
                  onClick={() => setMessageType('email')}
                >
                  Email
                </Button>
                <Button
                  size="sm"
                  variant={messageType === 'sms' ? 'default' : 'outline'}
                  onClick={() => setMessageType('sms')}
                >
                  SMS
                </Button>
              </div>

              <Textarea
                placeholder={`Type your ${messageType} message here...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
              />

              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-2 text-left"
                  onClick={() => setNewMessage(template.content)}
                >
                  <div>
                    <p className="font-medium text-xs">{template.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {template.content.substring(0, 50)}...
                    </p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentCommunication;