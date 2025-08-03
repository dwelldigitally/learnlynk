import { supabase } from '@/integrations/supabase/client';

export interface AdminNotification {
  id: string;
  type: 'new_lead' | 'pending_document' | 'task_overdue' | 'payment_due' | 'new_message';
  title: string;
  description: string;
  count?: number;
  isRead: boolean;
  created_at: string;
  related_id?: string;
  priority: 'low' | 'medium' | 'high';
}

export class NotificationService {
  static async getUnreadNotificationCount(): Promise<number> {
    try {
      // Count new leads
      const { count: newLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      // Count pending documents (if student_documents table exists)
      let pendingDocs = 0;
      try {
        const { count } = await supabase
          .from('student_documents')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        pendingDocs = count || 0;
      } catch (error) {
        pendingDocs = 0;
      }

      // Count overdue tasks
      let overdueTasks = 0;
      try {
        const { count } = await supabase
          .from('lead_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .lt('due_date', new Date().toISOString());
        overdueTasks = count || 0;
      } catch (error) {
        overdueTasks = 0;
      }

      // Count unread communications
      let unreadComms = 0;
      try {
        const { count } = await supabase
          .from('student_communications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'unread');
        unreadComms = count || 0;
      } catch (error) {
        unreadComms = 0;
      }

      return (newLeads || 0) + pendingDocs + overdueTasks + unreadComms;
    } catch (error) {
      console.error('Error getting notification count:', error);
      return 0;
    }
  }

  static async getNotifications(): Promise<AdminNotification[]> {
    const notifications: AdminNotification[] = [];

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
          isRead: false,
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
          isRead: false,
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
          isRead: false,
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
          isRead: false,
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
}