import React, { useState } from 'react';
import { Bell, CheckCheck, AlertCircle, FileText, Users, DollarSign, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { 
  HotSheetCard, 
  IconContainer, 
  PastelBadge, 
  PillButton, 
  PillIconButton,
  HotSheetTabsList, 
  HotSheetTabsTriggerCompact,
  type PastelColor 
} from '@/components/hotsheet';
import { Tabs, TabsContent } from '@/components/ui/tabs';

export interface Notification {
  id: string;
  type: 'system' | 'task' | 'communication' | 'financial' | 'team';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  action?: () => void;
}

interface DashboardNotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (id: string) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'system': return AlertCircle;
    case 'task': return CheckCheck;
    case 'communication': return Bell;
    case 'financial': return DollarSign;
    case 'team': return Users;
    default: return Bell;
  }
};

const getPriorityColor = (priority: string): PastelColor => {
  switch (priority) {
    case 'high': return 'rose';
    case 'medium': return 'amber';
    case 'low': return 'sky';
    default: return 'slate';
  }
};

export const DashboardNotificationPanel: React.FC<DashboardNotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <HotSheetCard padding="none" className="h-full">
      <div className="flex flex-row items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-2">
          <IconContainer color="primary" size="sm">
            <Bell />
          </IconContainer>
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <PastelBadge color="primary" size="sm">
              {unreadCount}
            </PastelBadge>
          )}
        </div>
        {unreadCount > 0 && (
          <PillButton 
            variant="ghost" 
            size="sm"
            onClick={onMarkAllAsRead}
            icon={<CheckCheck className="h-4 w-4" />}
          >
            Mark all read
          </PillButton>
        )}
      </div>
      
      <div className="px-6 pb-2">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
          <HotSheetTabsList className="w-full grid grid-cols-2">
            <HotSheetTabsTriggerCompact value="all">All</HotSheetTabsTriggerCompact>
            <HotSheetTabsTriggerCompact value="unread">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </HotSheetTabsTriggerCompact>
          </HotSheetTabsList>
          
          <TabsContent value={filter} className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-2 pb-6">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <IconContainer color="slate" size="xl" className="mx-auto mb-2">
                      <Bell />
                    </IconContainer>
                    <p>No notifications to display</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => {
                    const Icon = getTypeIcon(notification.type);
                    const priorityColor = getPriorityColor(notification.priority);
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 rounded-xl border transition-all duration-200",
                          notification.read 
                            ? "bg-card border-border/40 hover:bg-muted/5" 
                            : "bg-primary/5 border-primary/20"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <IconContainer color={priorityColor} size="sm">
                            <Icon />
                          </IconContainer>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium text-foreground">
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                {!notification.read && onMarkAsRead && (
                                  <PillIconButton
                                    variant="ghost"
                                    size="sm"
                                    icon={<CheckCheck className="h-3 w-3" />}
                                    onClick={() => onMarkAsRead(notification.id)}
                                    label="Mark as read"
                                    className="h-6 w-6"
                                  />
                                )}
                                {onDismiss && (
                                  <PillIconButton
                                    variant="ghost"
                                    size="sm"
                                    icon={<X className="h-3 w-3" />}
                                    onClick={() => onDismiss(notification.id)}
                                    label="Dismiss"
                                    className="h-6 w-6"
                                  />
                                )}
                              </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </span>
                              {notification.action && (
                                <PillButton
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                  onClick={notification.action}
                                >
                                  View details
                                </PillButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </HotSheetCard>
  );
};
