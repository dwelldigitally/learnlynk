import { useState, useEffect } from 'react';
import { NotificationService } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const [count, notifs] = await Promise.all([
        NotificationService.getUnreadNotificationCount(),
        NotificationService.getNotifications()
      ]);
      
      setUnreadCount(count);
      setNotifications(notifs);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscriptions for notification updates
    const channel = supabase
      .channel('notifications')
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
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'student_communications' },
        () => fetchNotifications()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'student_documents' },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate actual unread count considering localStorage
  const getActualUnreadCount = () => {
    const readNotifications = NotificationService.getReadNotifications();
    return notifications.filter(n => !readNotifications.has(n.id)).length;
  };

  return {
    unreadCount: getActualUnreadCount(),
    notifications,
    isLoading,
    refreshNotifications: fetchNotifications,
    markAsRead: NotificationService.markAsRead,
    markAllAsRead: NotificationService.markAllAsRead
  };
}