import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, XCircle, Mail, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import advisorNicole from "@/assets/advisor-nicole.jpg";

interface Notification {
  id: string;
  type: "document_approved" | "document_rejected" | "message_received" | "new_event" | "deadline_reminder";
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  relatedApplication?: string;
  avatar?: string;
  navigationPath?: string;
}

interface NotificationCentreProps {
  onNotificationCountChange?: (count: number) => void;
}

const NotificationCentre: React.FC<NotificationCentreProps> = ({ onNotificationCountChange }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      type: "document_rejected",
      title: "First Aid Certificate Needs Attention",
      description: "Your First Aid certificate has expired and needs to be updated for your Health Care Assistant application.",
      timestamp: new Date("2025-01-17T10:30:00"),
      isRead: false,
      relatedApplication: "HCA-1047859",
      avatar: advisorNicole,
      navigationPath: "/student/dashboard",
    },
    {
      id: "notif-2",
      type: "message_received",
      title: "New Message from Nicole Ye",
      description: "Document Review Update - Health Care Assistant",
      timestamp: new Date("2025-01-17T10:28:00"),
      isRead: false,
      avatar: advisorNicole,
      navigationPath: "/student/messages",
    },
    {
      id: "notif-3",
      type: "document_approved",
      title: "Documents Approved",
      description: "Your Official Transcripts, Photo ID, and Criminal Record Check have been approved.",
      timestamp: new Date("2025-01-16T14:20:00"),
      isRead: true,
      relatedApplication: "HCA-1047859",
      navigationPath: "/student/dashboard",
    },
    {
      id: "notif-4",
      type: "new_event",
      title: "New Event: Healthcare Career Fair",
      description: "Join us for networking opportunities and career insights in the healthcare industry.",
      timestamp: new Date("2025-01-15T09:00:00"),
      isRead: true,
      navigationPath: "/student/campus-life",
    },
    {
      id: "notif-5",
      type: "deadline_reminder",
      title: "Application Deadline Approaching",
      description: "Health Care Assistant program application deadline is in 10 days.",
      timestamp: new Date("2025-01-14T08:00:00"),
      isRead: true,
      relatedApplication: "HCA-1047859",
      navigationPath: "/student/applications",
    },
  ]);

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  useEffect(() => {
    onNotificationCountChange?.(unreadCount);
  }, [unreadCount, onNotificationCountChange]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "document_approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "document_rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "message_received":
        return <Mail className="w-4 h-4 text-blue-600" />;
      case "new_event":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case "deadline_reminder":
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => prev.map(notif => 
      notif.id === notification.id ? { ...notif, isRead: true } : notif
    ));

    // Navigate to the relevant page
    if (notification.navigationPath) {
      navigate(notification.navigationPath);
    }

    // Close the popover
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {notification.avatar ? (
                      <img 
                        src={notification.avatar} 
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-sm truncate ${
                              !notification.isRead ? 'font-semibold' : 'font-medium'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {notification.description}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.timestamp)}
                            </span>
                            {notification.relatedApplication && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {notification.relatedApplication}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCentre;