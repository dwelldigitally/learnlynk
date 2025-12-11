import React, { useState } from "react";
import { Bell, Filter, CheckCircle, Users, FileText, Clock, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

const AdminNotificationCentre: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  
  // Use the centralized hook for all notification state - no duplicate localStorage
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_lead":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "lead_assigned":
        return <Users className="w-4 h-4 text-indigo-600" />;
      case "pending_document":
        return <FileText className="w-4 h-4 text-orange-600" />;
      case "task_overdue":
        return <Clock className="w-4 h-4 text-red-600" />;
      case "new_message":
        return <Mail className="w-4 h-4 text-green-600" />;
      case "payment_due":
        return <Bell className="w-4 h-4 text-yellow-600" />;
      case "system_update":
        return <Bell className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationNavigation = (type: string, relatedId?: string) => {
    switch (type) {
      case "new_lead":
        return relatedId ? `/admin/leads/${relatedId}` : "/admin/leads";
      case "lead_assigned":
        return relatedId ? `/admin/leads/${relatedId}` : "/admin/leads";
      case "pending_document":
        return "/admin/students";
      case "task_overdue":
        return relatedId ? `/admin/leads/${relatedId}` : "/admin/leads";
      case "new_message":
        return "/admin/communications";
      case "payment_due":
        return "/admin/payments";
      default:
        return "/admin";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read using the hook (syncs to database + all components)
    markAsRead(notification.id);

    // Navigate to the relevant page
    const navigationPath = getNotificationNavigation(notification.type, notification.related_id);
    navigate(navigationPath);

    // Close the popover
    setIsOpen(false);
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been cleared."
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unread") return !notification.isRead;
    return notification.type === selectedFilter;
  });

  const getFilterCount = (filterType: string) => {
    if (filterType === "all") return notifications.length;
    if (filterType === "unread") return unreadCount;
    return notifications.filter(n => n.type === filterType).length;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-orange-600"; 
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-background border border-border shadow-lg rounded-md z-50" align="end">
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleMarkAllAsRead}
                  className="text-sm px-3 py-2 hover:bg-muted/50 transition-colors"
                >
                  Mark all read
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="hover:bg-muted/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-5 text-xs h-8">
              <TabsTrigger value="all" className="text-xs px-2 py-1">
                All ({getFilterCount("all")})
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs px-2 py-1">
                Unread ({getFilterCount("unread")})
              </TabsTrigger>
              <TabsTrigger value="new_lead" className="text-xs px-2 py-1">
                Leads ({getFilterCount("new_lead")})
              </TabsTrigger>
              <TabsTrigger value="pending_document" className="text-xs px-2 py-1">
                Docs ({getFilterCount("pending_document")})
              </TabsTrigger>
              <TabsTrigger value="task_overdue" className="text-xs px-2 py-1">
                Tasks ({getFilterCount("task_overdue")})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="max-h-96 overflow-y-auto bg-background">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {selectedFilter === "unread" ? "No unread notifications" : "No notifications"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => {
                const isRead = notification.isRead;
                return (
                  <div
                    key={notification.id}
                    className={`px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 border-b border-border/50 ${
                      !isRead ? 'bg-muted/30' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-sm truncate ${
                                !isRead ? 'font-semibold' : 'font-medium'
                              }`}>
                                {notification.title}
                              </h4>
                              {!isRead && (
                                <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                              )}
                              <Badge 
                                variant="outline" 
                                className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {notification.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatDate(notification.created_at)}
                              </span>
                              {!isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs hover:bg-muted/50 transition-colors"
                                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                                  Mark read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminNotificationCentre;