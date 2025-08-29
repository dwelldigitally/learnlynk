import { supabase } from "@/integrations/supabase/client";

export interface StudentPortalContent {
  id: string;
  title: string;
  content: string;
  content_type: 'announcement' | 'news' | 'alert' | 'document';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_published: boolean;
  publish_date?: string;
  expiry_date?: string;
  target_audience?: string[];
  metadata?: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface StudentPortalMessage {
  id: string;
  title: string;
  content: string;
  message_type: 'info' | 'warning' | 'success' | 'error';
  priority: 'normal' | 'high' | 'urgent';
  target_students: string[];
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface StudentPortalConfig {
  id: string;
  portal_title: string;
  welcome_message: string;
  features: {
    application_tracking: boolean;
    fee_payments: boolean;
    message_center: boolean;
    document_upload: boolean;
    advisor_contact: boolean;
    event_registration: boolean;
  };
  theme_settings?: any;
  custom_settings?: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export class StudentPortalService {
  // Content Management - Using mock data for demo
  static async getPortalContent(): Promise<StudentPortalContent[]> {
    // For demo purposes, return mock data
    return [
      {
        id: '1',
        title: 'Welcome to Student Portal',
        content: 'Welcome to your student portal dashboard where you can track your applications and access resources.',
        content_type: 'announcement',
        priority: 'high',
        is_published: true,
        publish_date: new Date().toISOString(),
        target_audience: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: ''
      },
      {
        id: '2',
        title: 'Academic Calendar Update',
        content: 'Important dates for the upcoming semester have been updated. Please check your program schedule.',
        content_type: 'news',
        priority: 'medium',
        is_published: true,
        publish_date: new Date().toISOString(),
        target_audience: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: ''
      }
    ];
  }

  static async createPortalContent(content: Omit<StudentPortalContent, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<StudentPortalContent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // For demo purposes, return mock data
    return {
      id: Math.random().toString(),
      title: content.title,
      content: content.content,
      content_type: content.content_type,
      priority: content.priority,
      is_published: content.is_published,
      publish_date: content.publish_date,
      expiry_date: content.expiry_date,
      target_audience: content.target_audience || [],
      metadata: content.metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.id
    };
  }

  static async updatePortalContent(id: string, updates: Partial<StudentPortalContent>): Promise<StudentPortalContent> {
    // For demo purposes, return mock updated data
    return {
      id,
      title: updates.title || '',
      content: updates.content || '',
      content_type: updates.content_type || 'announcement',
      priority: updates.priority || 'medium',
      is_published: updates.is_published || false,
      publish_date: updates.publish_date,
      expiry_date: updates.expiry_date,
      target_audience: updates.target_audience || [],
      metadata: updates.metadata,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: ''
    };
  }

  static async deletePortalContent(id: string): Promise<void> {
    // For demo purposes, do nothing
  }

  static async getPublishedContent(): Promise<StudentPortalContent[]> {
    // For demo purposes, return filtered mock data
    const allContent = await this.getPortalContent();
    return allContent.filter(content => content.is_published);
  }

  // Message Management - Using a simplified approach for now
  static async getPortalMessages(): Promise<StudentPortalMessage[]> {
    // For demo purposes, return mock data since table structure differs
    return [];
  }

  static async createPortalMessage(message: Omit<StudentPortalMessage, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<StudentPortalMessage> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // For demo purposes, return mock data
    return {
      id: Math.random().toString(),
      title: message.title,
      content: message.content,
      message_type: message.message_type,
      priority: message.priority,
      target_students: message.target_students,
      scheduled_for: message.scheduled_for,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.id
    };
  }

  static async updatePortalMessage(id: string, updates: Partial<StudentPortalMessage>): Promise<StudentPortalMessage> {
    // For demo purposes, return mock data
    return {
      id,
      title: updates.title || '',
      content: updates.content || '',
      message_type: updates.message_type || 'info',
      priority: updates.priority || 'normal',
      target_students: updates.target_students || [],
      scheduled_for: updates.scheduled_for,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: ''
    };
  }

  static async deletePortalMessage(id: string): Promise<void> {
    // For demo purposes, do nothing
  }

  static async getStudentMessages(studentId: string): Promise<StudentPortalMessage[]> {
    // For demo purposes, return mock data
    return [];
  }

  static async markMessageAsRead(messageId: string, studentId: string): Promise<void> {
    // For demo purposes, do nothing
  }

  // Configuration Management - Using simplified approach for now
  static async getPortalConfig(): Promise<StudentPortalConfig | null> {
    // For demo purposes, return default config
    return {
      id: '1',
      portal_title: 'Student Portal',
      welcome_message: 'Welcome to your student portal',
      features: {
        application_tracking: true,
        fee_payments: true,
        message_center: true,
        document_upload: true,
        advisor_contact: true,
        event_registration: true
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: ''
    };
  }

  static async createOrUpdatePortalConfig(config: Omit<StudentPortalConfig, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<StudentPortalConfig> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // For demo purposes, return the config as saved
    return {
      id: '1',
      portal_title: config.portal_title,
      welcome_message: config.welcome_message,
      features: config.features,
      theme_settings: config.theme_settings,
      custom_settings: config.custom_settings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.id
    };
  }

  // Real-time subscriptions
  static subscribeToContentChanges(callback: (payload: any) => void) {
    return supabase
      .channel('portal-content-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_portal_content'
      }, callback)
      .subscribe();
  }

  static subscribeToMessageChanges(callback: (payload: any) => void) {
    return supabase
      .channel('portal-message-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_portal_messages'
      }, callback)
      .subscribe();
  }

  static subscribeToConfigChanges(callback: (payload: any) => void) {
    return supabase
      .channel('portal-config-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_portal_config'
      }, callback)
      .subscribe();
  }
}