import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, AlertTriangle, CheckCircle, Clock, Mail, MessageSquare, Phone, X, Cog } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  method: 'email' | 'sms' | 'push' | 'in_app';
  enabled: boolean;
  recipients: string[];
  conditions: any;
}

interface ActiveNotification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  actionUrl?: string;
  isRead: boolean;
}

export function EnrollmentNotifications() {
  const [notifications, setNotifications] = useState<ActiveNotification[]>([]);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
    loadNotificationRules();
  }, []);

  const loadNotifications = async () => {
    try {
      // Mock active notifications - in real implementation this would come from database
      const mockNotifications: ActiveNotification[] = [
        {
          id: '1',
          type: 'urgent',
          title: 'SLA Breach Alert',
          message: '5 high-yield prospects have exceeded their response SLA',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          actionUrl: '/admin/enrollment/today?filter=overdue',
          isRead: false
        },
        {
          id: '2',
          type: 'warning',
          title: 'Document Chase Required',
          message: '12 applicants missing critical documents',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          actionUrl: '/admin/enrollment/waste-radar',
          isRead: false
        },
        {
          id: '3',
          type: 'success',
          title: 'Speed Policy Success',
          message: '23% conversion lift achieved this week',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/admin/enrollment/outcomes',
          isRead: true
        },
        {
          id: '4',
          type: 'info',
          title: 'Weekly Report Ready',
          message: 'Your enrollment optimization report is available',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/admin/reports',
          isRead: false
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadNotificationRules = async () => {
    try {
      // Mock notification rules - in real implementation this would come from database
      const mockRules: NotificationRule[] = [
        {
          id: '1',
          name: 'SLA Breach Alert',
          trigger: 'sla_exceeded',
          method: 'email',
          enabled: true,
          recipients: ['admin@example.com'],
          conditions: { threshold_minutes: 30 }
        },
        {
          id: '2',
          name: 'High Score Prospect',
          trigger: 'high_score_detected',
          method: 'push',
          enabled: true,
          recipients: ['counselors'],
          conditions: { score_threshold: 85 }
        },
        {
          id: '3',
          name: 'Weekly Summary',
          trigger: 'weekly_report',
          method: 'email',
          enabled: true,
          recipients: ['admin@example.com', 'manager@example.com'],
          conditions: { day_of_week: 'monday' }
        },
        {
          id: '4',
          name: 'Document Missing Alert',
          trigger: 'document_overdue',
          method: 'sms',
          enabled: false,
          recipients: ['counselors'],
          conditions: { days_overdue: 3 }
        }
      ];

      setRules(mockRules);
    } catch (error) {
      console.error('Error loading notification rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      setRules(rules.map(rule => 
        rule.id === ruleId ? { ...rule, enabled } : rule
      ));

      toast({
        title: enabled ? "Rule Enabled" : "Rule Disabled",
        description: `Notification rule has been ${enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast({
        title: "Error",
        description: "Failed to update notification rule",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'info': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'phone': return Phone;
      case 'push': return Bell;
      default: return Bell;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        <Button variant="outline" onClick={() => {
          setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        }}>
          Mark All Read
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Notifications */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Recent Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map(notification => {
                  const Icon = getNotificationIcon(notification.type);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`border-l-4 p-4 rounded-r-lg ${getNotificationColor(notification.type)} ${
                        !notification.isRead ? 'opacity-100' : 'opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Icon className={`h-5 w-5 mt-0.5 ${
                            notification.type === 'urgent' ? 'text-red-600' :
                            notification.type === 'warning' ? 'text-yellow-600' :
                            notification.type === 'success' ? 'text-green-600' :
                            'text-blue-600'
                          }`} />
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(notification.timestamp).toLocaleString()}
                              </span>
                              
                              {notification.actionUrl && (
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                  View Details
                                </Button>
                              )}
                              
                              {!notification.isRead && (
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="h-auto p-0 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark Read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                          className="h-auto p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notification Rules */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cog className="h-5 w-5" />
                <span>Notification Rules</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.map(rule => {
                const MethodIcon = getMethodIcon(rule.method);
                
                return (
                  <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MethodIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{rule.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{rule.method}</p>
                      </div>
                    </div>
                    
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                    />
                  </div>
                );
              })}
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                Configure Rules
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Notification Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Today</span>
                <span className="text-sm font-medium">{notifications.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Unread</span>
                <span className="text-sm font-medium">{unreadCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Rules</span>
                <span className="text-sm font-medium">{rules.filter(r => r.enabled).length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}