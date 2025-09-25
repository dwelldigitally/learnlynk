import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  Inbox, 
  Archive, 
  Bell, 
  User,
  Clock,
  CheckCircle,
  ArrowLeft,
  Reply,
  MoreHorizontal,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const PreceptorCommunications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');

  // Mock message data
  const messages = [
    {
      id: '1',
      type: 'student_message',
      from: 'Sarah Johnson',
      fromAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      subject: 'Question about competency evaluation',
      message: 'Hi Dr. Martinez, I have a question about the medication administration competency I submitted yesterday. Could you please review it when you have a moment? I want to make sure I documented everything correctly.',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      priority: 'normal',
      studentId: '1'
    },
    {
      id: '2',
      type: 'reminder',
      from: 'System',
      fromAvatar: null,
      subject: 'Pending Review Reminder',
      message: 'You have 3 pending attendance reviews that are due for approval. Students are waiting for your approval to continue their practicum.',
      timestamp: '2024-01-15T09:00:00Z',
      isRead: false,
      priority: 'high',
      studentId: null
    },
    {
      id: '3',
      type: 'student_message',
      from: 'Michael Chen',
      fromAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      subject: 'Schedule change request',
      message: 'Hello, I need to request a schedule change for next week due to a family emergency. I can provide documentation if needed. Please let me know how to proceed.',
      timestamp: '2024-01-14T16:45:00Z',
      isRead: true,
      priority: 'high',
      studentId: '2'
    },
    {
      id: '4',
      type: 'system_notification',
      from: 'Academic Office',
      fromAvatar: null,
      subject: 'New evaluation forms available',
      message: 'Updated midterm evaluation forms are now available in the system. Please use the new forms for all evaluations starting this week.',
      timestamp: '2024-01-14T14:20:00Z',
      isRead: true,
      priority: 'normal',
      studentId: null
    },
    {
      id: '5',
      type: 'student_message',
      from: 'Emily Rodriguez',
      fromAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      subject: 'Thank you for feedback',
      message: 'Thank you for the detailed feedback on my patient care competency. I have incorporated your suggestions and will apply them in my next shift. I really appreciate your guidance.',
      timestamp: '2024-01-14T11:15:00Z',
      isRead: true,
      priority: 'normal',
      studentId: '3'
    }
  ];

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'student_message': return <User className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'system_notification': return <Bell className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'normal': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSendReply = (messageId: string) => {
    if (replyText.trim()) {
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      });
      setReplyText('');
      setSelectedMessage(null);
    }
  };

  const handleMarkAsRead = (messageId: string) => {
    toast({
      title: "Marked as Read",
      description: "Message has been marked as read.",
    });
  };

  const filteredMessages = messages.filter(message =>
    message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 opacity-40" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/preceptor/dashboard')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <MessageSquare className="h-6 w-6 mr-2 text-indigo-600" />
                    Communications
                  </h1>
                  <p className="text-gray-600">Messages and notifications</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                  {unreadCount} Unread
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-2">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Inbox className="h-5 w-5 mr-2" />
                      Messages
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 text-sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                          selectedMessage === message.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                        } ${!message.isRead ? 'bg-blue-50/30' : ''}`}
                        onClick={() => setSelectedMessage(message.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {message.fromAvatar ? (
                              <img
                                src={message.fromAvatar}
                                alt={message.from}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                {getMessageTypeIcon(message.type)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {message.from}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Badge className={getPriorityColor(message.priority)}>
                                  {message.priority}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatTimestamp(message.timestamp)}
                                </span>
                              </div>
                            </div>
                            <p className={`text-sm ${!message.isRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                              {message.subject}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {message.message}
                            </p>
                          </div>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Detail / Actions */}
            <div className="lg:col-span-1">
              {selectedMessage ? (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Message Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const message = messages.find(m => m.id === selectedMessage);
                      if (!message) return null;
                      
                      return (
                        <>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              {message.fromAvatar ? (
                                <img
                                  src={message.fromAvatar}
                                  alt={message.from}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                  {getMessageTypeIcon(message.type)}
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{message.from}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(message.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">{message.subject}</h4>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {message.message}
                              </p>
                            </div>
                          </div>

                          {message.type === 'student_message' && (
                            <div className="space-y-3 border-t pt-4">
                              <h4 className="font-medium">Quick Reply</h4>
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                rows={4}
                              />
                              <Button
                                onClick={() => handleSendReply(message.id)}
                                className="w-full"
                                disabled={!replyText.trim()}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send Reply
                              </Button>
                            </div>
                          )}

                          {message.type === 'reminder' && (
                            <div className="space-y-2 border-t pt-4">
                              <Button
                                onClick={() => navigate('/preceptor/dashboard')}
                                className="w-full"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Review Pending Items
                              </Button>
                            </div>
                          )}

                          <div className="flex space-x-2 border-t pt-4">
                            {!message.isRead && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsRead(message.id)}
                                className="flex-1"
                              >
                                Mark as Read
                              </Button>
                            )}
                            {message.studentId && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/preceptor/students`)}
                                className="flex-1"
                              >
                                <User className="h-3 w-3 mr-1" />
                                View Student
                              </Button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Message</h3>
                    <p className="text-gray-600">Choose a message from the list to view details and reply.</p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/preceptor/dashboard')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Review Pending Items
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/preceptor/students')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    View All Students
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/preceptor/evaluations')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    View Evaluations
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreceptorCommunications;