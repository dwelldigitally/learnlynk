import React, { useState } from "react";
import { ArrowLeft, Bell, CheckCircle, XCircle, Mail, Calendar, FileText, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  actionUrl?: string;
}

const NotificationCentre: React.FC = () => {
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
    },
    {
      id: "notif-2",
      type: "message_received",
      title: "New Message from Nicole Ye",
      description: "Document Review Update - Health Care Assistant",
      timestamp: new Date("2025-01-17T10:28:00"),
      isRead: false,
      avatar: advisorNicole,
      actionUrl: "/student/messages",
    },
    {
      id: "notif-3",
      type: "document_approved",
      title: "Documents Approved",
      description: "Your Official Transcripts, Photo ID, and Criminal Record Check have been approved.",
      timestamp: new Date("2025-01-16T14:20:00"),
      isRead: true,
      relatedApplication: "HCA-1047859",
    },
    {
      id: "notif-4",
      type: "new_event",
      title: "New Event: Healthcare Career Fair",
      description: "Join us for networking opportunities and career insights in the healthcare industry.",
      timestamp: new Date("2025-01-15T09:00:00"),
      isRead: true,
    },
    {
      id: "notif-5",
      type: "deadline_reminder",
      title: "Application Deadline Approaching",
      description: "Health Care Assistant program application deadline is in 10 days.",
      timestamp: new Date("2025-01-14T08:00:00"),
      isRead: true,
      relatedApplication: "HCA-1047859",
    },
  ]);

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "document_approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "document_rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "message_received":
        return <Mail className="w-5 h-5 text-blue-600" />;
      case "new_event":
        return <Calendar className="w-5 h-5 text-purple-600" />;
      case "deadline_reminder":
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (!isRead) {
      switch (type) {
        case "document_approved":
          return "bg-green-50 border-green-200";
        case "document_rejected":
          return "bg-red-50 border-red-200";
        case "message_received":
          return "bg-blue-50 border-blue-200";
        case "new_event":
          return "bg-purple-50 border-purple-200";
        case "deadline_reminder":
          return "bg-orange-50 border-orange-200";
        default:
          return "bg-gray-50 border-gray-200";
      }
    }
    return "hover:bg-gray-50";
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

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-600" />
            Notification Centre
          </h1>
          <p className="text-gray-600 mt-1">
            Stay updated on your application progress and important events
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              {unreadCount} Unread
            </Badge>
          )}
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card 
            key={notification.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              getNotificationBgColor(notification.type, notification.isRead)
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start gap-4">
              {notification.avatar ? (
                <img 
                  src={notification.avatar} 
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium truncate ${
                        !notification.isRead ? 'font-semibold' : ''
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.description}
                    </p>
                    
                    {notification.relatedApplication && (
                      <Badge variant="outline" className="text-xs">
                        {notification.relatedApplication}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.timestamp)}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card className="p-8 text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Notifications</h3>
          <p className="text-gray-500">
            You'll receive notifications about your application progress and important updates here.
          </p>
        </Card>
      )}
    </div>
  );
};

export default NotificationCentre;