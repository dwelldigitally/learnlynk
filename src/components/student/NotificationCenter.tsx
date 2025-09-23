import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Filter, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  X,
  MoreHorizontal,
  Archive,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import advisorNicole from "@/assets/advisor-nicole.jpg";

interface Notification {
  id: string;
  type: 'message' | 'application' | 'document' | 'payment' | 'system' | 'deadline';
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  actionText?: string;
  from?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  children: React.ReactNode;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ children }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'message' | 'application' | 'document' | 'payment' | 'system'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New Message from Nicole Ye',
      description: 'Your First Aid certificate has expired. Please upload a current certificate to proceed.',
      timestamp: new Date('2025-01-17T10:30:00'),
      isRead: false,
      priority: 'high',
      actionUrl: '/student/messages',
      actionText: 'View Message',
      from: {
        name: 'Nicole Ye',
        avatar: advisorNicole,
        role: 'Senior Admissions Advisor'
      }
    },
    {
      id: '2',
      type: 'application',
      title: 'Application Status Update',
      description: 'Your Health Care Assistant application has moved to Document Review stage.',
      timestamp: new Date('2025-01-16T14:20:00'),
      isRead: false,
      priority: 'medium',
      actionUrl: '/student/applications',
      actionText: 'View Application',
      metadata: {
        applicationId: 'HCA-1047859',
        stage: 'Document Review'
      }
    },
    {
      id: '3',
      type: 'document',
      title: 'Document Approved',
      description: 'Your Official Transcripts have been approved and are now in your file.',
      timestamp: new Date('2025-01-15T16:45:00'),
      isRead: true,
      priority: 'low',
      actionUrl: '/student/documents',
      actionText: 'View Documents'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Due Reminder',
      description: 'Your application fee payment is due in 3 days. Please complete payment to avoid delays.',
      timestamp: new Date('2025-01-14T09:00:00'),
      isRead: false,
      priority: 'high',
      actionUrl: '/student/payments',
      actionText: 'Make Payment',
      metadata: {
        amount: '$150.00',
        dueDate: '2025-01-20'
      }
    },
    {
      id: '5',
      type: 'deadline',
      title: 'Document Submission Deadline',
      description: 'Reminder: Submit your remaining documents by January 25th to meet the intake deadline.',
      timestamp: new Date('2025-01-13T12:00:00'),
      isRead: true,
      priority: 'medium',
      actionUrl: '/student/documents',
      actionText: 'Upload Documents',
      metadata: {
        deadline: '2025-01-25',
        missingDocuments: ['First Aid Certificate', 'English Proficiency Test']
      }
    },
    {
      id: '6',
      type: 'system',
      title: 'Welcome to Student Portal',
      description: 'Your student portal account has been activated. Explore all the features available to you.',
      timestamp: new Date('2025-01-12T08:30:00'),
      isRead: true,
      priority: 'low',
      actionUrl: '/student',
      actionText: 'Explore Portal'
    }
  ]);

  const { toast } = useToast();

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.isRead;
    return notification.type === selectedFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'application': return <FileText className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'payment': return <CreditCard className="w-4 h-4" />;
      case 'deadline': return <Clock className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string, isRead: boolean) => {
    const opacity = isRead ? '50' : '';
    switch (priority) {
      case 'high': return `text-red-600 bg-red-${opacity || '100'} border-red-200`;
      case 'medium': return `text-orange-600 bg-orange-${opacity || '100'} border-orange-200`;
      case 'low': return `text-blue-600 bg-blue-${opacity || '100'} border-blue-200`;
      default: return `text-gray-600 bg-gray-${opacity || '100'} border-gray-200`;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications marked as read.`,
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast({
      title: "Notification deleted",
      description: "Notification has been removed.",
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0 mr-4" 
        align="end"
        sideOffset={8}
      >
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          
          <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as typeof selectedFilter)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <Separator className="my-1" />
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="application">Applications</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-96">
          <div className="p-2">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {selectedFilter === 'all' 
                    ? 'No notifications yet' 
                    : `No ${selectedFilter} notifications`}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <Card 
                  key={notification.id}
                  className={`p-3 mb-2 transition-all hover:shadow-sm cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${getPriorityColor(notification.priority, notification.isRead)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-sm font-medium truncate ${
                              !notification.isRead ? 'font-semibold' : ''
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          
                          {notification.from && (
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="w-4 h-4">
                                <AvatarImage src={notification.from.avatar} />
                                <AvatarFallback className="text-xs">
                                  {notification.from.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {notification.from.name} • {notification.from.role}
                              </span>
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {notification.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.timestamp)}
                            </span>
                            
                            {notification.actionText && (
                              <Button variant="outline" size="sm" className="text-xs h-6">
                                {notification.actionText}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.isRead && (
                              <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                <Check className="w-4 h-4 mr-2" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                              <X className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
        
        {filteredNotifications.length > 0 && (
          <div className="border-t p-3">
            <Button variant="outline" className="w-full text-sm" size="sm">
              View All Notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};