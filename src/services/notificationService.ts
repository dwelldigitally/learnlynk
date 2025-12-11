import { supabase } from '@/integrations/supabase/client';

export interface AdminNotification {
  id: string;
  type: 'new_lead' | 'pending_document' | 'task_overdue' | 'payment_due' | 'new_message' | 'lead_assigned';
  title: string;
  description: string;
  count?: number;
  isRead: boolean;
  created_at: string;
  related_id?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationData {
  leadId?: string;
  leadName?: string;
  ruleName?: string;
  [key: string]: any;
}

export class NotificationService {
  static async getUnreadNotificationCount(): Promise<number> {
    try {
      const readNotifications = this.getReadNotifications();
      let count = 0;

      // Count new leads (only if not marked as read)
      if (!readNotifications.has('new-leads')) {
        const { count: newLeads } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');
        if (newLeads && newLeads > 0) count++;
      }

      // Count pending documents (only if not marked as read)
      if (!readNotifications.has('pending-docs')) {
        try {
          const { count: pendingDocs } = await supabase
            .from('student_documents')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');
          if (pendingDocs && pendingDocs > 0) count++;
        } catch (error) {
          // Table might not exist
        }
      }

      // Count overdue tasks (only if not marked as read)
      if (!readNotifications.has('overdue-tasks')) {
        try {
          const { count: overdueTasks } = await supabase
            .from('lead_tasks')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')
            .lt('due_date', new Date().toISOString());
          if (overdueTasks && overdueTasks > 0) count++;
        } catch (error) {
          // Table might not exist
        }
      }

      // Count unread communications (only if not marked as read)
      if (!readNotifications.has('unread-comms')) {
        try {
          const { count: unreadComms } = await supabase
            .from('student_communications')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'unread');
          if (unreadComms && unreadComms > 0) count++;
        } catch (error) {
          // Table might not exist
        }
      }

      return count;
    } catch (error) {
      console.error('Error getting notification count:', error);
      return 0;
    }
  }

  static async getNotifications(): Promise<AdminNotification[]> {
    const notifications: AdminNotification[] = [];
    const readNotifications = this.getReadNotifications();

    try {
      // Get new leads
      const { data: newLeads } = await supabase
        .from('leads')
        .select('id, first_name, last_name, created_at')
        .eq('status', 'new')
        .order('created_at', { ascending: false })
        .limit(5);

      if (newLeads?.length) {
        notifications.push({
          id: 'new-leads',
          type: 'new_lead',
          title: `${newLeads.length} New Lead${newLeads.length > 1 ? 's' : ''}`,
          description: `Latest: ${newLeads[0].first_name} ${newLeads[0].last_name}`,
          count: newLeads.length,
          isRead: readNotifications.has('new-leads'),
          created_at: newLeads[0].created_at,
          priority: 'high'
        });
      }

      // Get pending documents
      let pendingDocs = [];
      try {
        const { data } = await supabase
          .from('student_documents')
          .select('id, name, created_at')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(5);
        pendingDocs = data || [];
      } catch (error) {
        pendingDocs = [];
      }

      if (pendingDocs.length) {
        notifications.push({
          id: 'pending-docs',
          type: 'pending_document',
          title: `${pendingDocs.length} Document${pendingDocs.length > 1 ? 's' : ''} Pending Review`,
          description: `Latest: ${pendingDocs[0].name}`,
          count: pendingDocs.length,
          isRead: readNotifications.has('pending-docs'),
          created_at: pendingDocs[0].created_at,
          priority: 'medium'
        });
      }

      // Get overdue tasks
      let overdueTasks = [];
      try {
        const { data } = await supabase
          .from('lead_tasks')
          .select('id, title, due_date')
          .eq('status', 'pending')
          .lt('due_date', new Date().toISOString())
          .order('due_date', { ascending: true })
          .limit(5);
        overdueTasks = data || [];
      } catch (error) {
        overdueTasks = [];
      }

      if (overdueTasks.length) {
        notifications.push({
          id: 'overdue-tasks',
          type: 'task_overdue',
          title: `${overdueTasks.length} Overdue Task${overdueTasks.length > 1 ? 's' : ''}`,
          description: `Urgent: ${overdueTasks[0].title}`,
          count: overdueTasks.length,
          isRead: readNotifications.has('overdue-tasks'),
          created_at: overdueTasks[0].due_date,
          priority: 'high'
        });
      }

      // Get unread communications
      let unreadComms = [];
      try {
        const { data } = await supabase
          .from('student_communications')
          .select('id, subject, created_at')
          .eq('status', 'unread')
          .order('created_at', { ascending: false })
          .limit(5);
        unreadComms = data || [];
      } catch (error) {
        unreadComms = [];
      }

      if (unreadComms.length) {
        notifications.push({
          id: 'unread-comms',
          type: 'new_message',
          title: `${unreadComms.length} Unread Message${unreadComms.length > 1 ? 's' : ''}`,
          description: `Latest: ${unreadComms[0].subject}`,
          count: unreadComms.length,
          isRead: readNotifications.has('unread-comms'),
          created_at: unreadComms[0].created_at,
          priority: 'medium'
        });
      }

      return notifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  // Mark notification as read in localStorage  
  static markAsRead(notificationId: string): void {
    const readNotifications = this.getReadNotifications();
    readNotifications.add(notificationId);
    localStorage.setItem('admin-read-notifications', JSON.stringify(Array.from(readNotifications)));
  }

  // Mark all notifications as read
  static markAllAsRead(notificationIds: string[]): void {
    const readNotifications = new Set(notificationIds);
    localStorage.setItem('admin-read-notifications', JSON.stringify(Array.from(readNotifications)));
  }

  // Get read notifications from localStorage
  static getReadNotifications(): Set<string> {
    const stored = localStorage.getItem('admin-read-notifications');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }

  // Get actual unread count considering localStorage
  static getActualUnreadCount(notifications: AdminNotification[]): number {
    const readNotifications = this.getReadNotifications();
    return notifications.filter(n => !readNotifications.has(n.id)).length;
  }

  /**
   * Notifies an advisor when a lead is assigned to them
   * Uses NotificationDispatcher to respect user preferences
   */
  static async notifyLeadAssignment(
    leadId: string,
    advisorId: string,
    data: NotificationData
  ): Promise<void> {
    try {
      // Import dispatcher dynamically to avoid circular dependency
      const { NotificationDispatcher } = await import('./notificationDispatcher');
      
      await NotificationDispatcher.send({
        userId: advisorId,
        type: 'lead_assigned',
        title: 'New Lead Assigned',
        message: `You have been assigned a new lead: ${data.leadName}`,
        data: {
          lead_id: leadId,
          lead_name: data.leadName,
          rule_name: data.ruleName,
          assigned_at: new Date().toISOString()
        },
        priority: 'high'
      });

      console.log(`Notification dispatched to advisor ${advisorId} for lead ${leadId}`);
    } catch (error) {
      console.error('Error sending lead assignment notification:', error);
      // Fallback: direct insert
      await supabase.from('notifications').insert({
        user_id: advisorId,
        type: 'lead_assigned',
        title: 'New Lead Assigned',
        message: `You have been assigned a new lead: ${data.leadName}`,
        data: {
          lead_id: leadId,
          lead_name: data.leadName,
          rule_name: data.ruleName,
          assigned_at: new Date().toISOString()
        },
        is_read: false
      });
    }
  }

  /**
   * Creates a notification for a user using the dispatcher
   * Respects user preferences for channels and quiet hours
   */
  static async createNotification(
    userId: string,
    notification: {
      type: string;
      title: string;
      message?: string;
      data?: NotificationData;
      priority?: 'low' | 'medium' | 'high';
    }
  ): Promise<void> {
    try {
      const { NotificationDispatcher } = await import('./notificationDispatcher');
      
      await NotificationDispatcher.send({
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        priority: notification.priority || 'medium'
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      // Fallback: direct insert
      await supabase.from('notifications').insert({
        user_id: userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        is_read: false
      });
    }
  }
}