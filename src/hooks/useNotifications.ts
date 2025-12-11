import { useState, useEffect, useCallback } from 'react';
import { NotificationService, AdminNotification } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseNotification {
  id: string;
  user_id: string;
  tenant_id: string | null;
  type: string;
  title: string;
  message: string | null;
  data: Record<string, any> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch real notifications from the notifications table
      const { data: dbNotifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
      }

      // Convert database notifications to AdminNotification format
      const realNotifications: AdminNotification[] = (dbNotifications || []).map((n: DatabaseNotification) => ({
        id: n.id,
        type: n.type as AdminNotification['type'],
        title: n.title,
        description: n.message || '',
        isRead: n.is_read,
        created_at: n.created_at,
        related_id: n.data?.lead_id || n.data?.task_id || n.data?.document_id,
        priority: (n.data?.priority as 'low' | 'medium' | 'high') || 'medium'
      }));

      // Also fetch aggregated notifications (new leads, pending docs, etc.)
      const aggregatedNotifications = await NotificationService.getNotifications();

      // Combine and deduplicate (prioritize real notifications)
      const combined = [...realNotifications];
      
      // Add aggregated notifications that don't overlap with real ones
      for (const aggNotif of aggregatedNotifications) {
        const isDuplicate = combined.some(n => 
          n.type === aggNotif.type && 
          Math.abs(new Date(n.created_at).getTime() - new Date(aggNotif.created_at).getTime()) < 60000
        );
        if (!isDuplicate) {
          combined.push(aggNotif);
        }
      }

      // Sort by created_at
      combined.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setNotifications(combined);
      
      // Calculate unread count from real notifications
      const realUnread = realNotifications.filter(n => !n.isRead).length;
      const aggregatedCount = await NotificationService.getUnreadNotificationCount();
      setUnreadCount(realUnread + aggregatedCount);

    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark a notification as read in the database
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Update in database if it's a real notification (UUID format)
      if (notificationId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        await supabase
          .from('notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('id', notificationId);
      }
      
      // Also mark in localStorage for aggregated notifications
      NotificationService.markAsRead(notificationId);
      
      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [fetchNotifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mark all real notifications as read in database
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false);

      // Mark aggregated notifications in localStorage
      const notificationIds = notifications.map(n => n.id);
      NotificationService.markAllAsRead(notificationIds);

      // Refresh
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications, fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for notifications table
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lead_tasks' },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications]);

  return {
    unreadCount,
    notifications,
    isLoading,
    refreshNotifications: fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}