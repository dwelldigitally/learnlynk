import { supabase } from '@/integrations/supabase/client';
import type { RecruiterPortalContent, RecruiterPortalMessage, RecruiterPortalConfig } from '@/types/recruiterPortal';

// Database types to interface conversion helpers
const convertDbContentToInterface = (dbContent: any): RecruiterPortalContent => ({
  ...dbContent,
  target_companies: Array.isArray(dbContent.target_companies) ? dbContent.target_companies : [],
  target_roles: Array.isArray(dbContent.target_roles) ? dbContent.target_roles : [],
  attachment_urls: Array.isArray(dbContent.attachment_urls) ? dbContent.attachment_urls : [],
});

const convertDbMessageToInterface = (dbMessage: any): RecruiterPortalMessage => ({
  ...dbMessage,
  recipient_companies: Array.isArray(dbMessage.recipient_companies) ? dbMessage.recipient_companies : [],
  recipient_users: Array.isArray(dbMessage.recipient_users) ? dbMessage.recipient_users : [],
  attachment_urls: Array.isArray(dbMessage.attachment_urls) ? dbMessage.attachment_urls : [],
});

const convertDbConfigToInterface = (dbConfig: any): RecruiterPortalConfig => ({
  ...dbConfig,
  features: dbConfig.features || {
    application_submission: true,
    commission_tracking: true,
    document_management: true,
    performance_metrics: true,
    communication_center: true,
    training_materials: true,
    company_directory: false,
    automated_notifications: true
  },
  access_control: dbConfig.access_control || {
    require_approval: true,
    allow_self_registration: false,
    session_timeout: 60,
    max_login_attempts: 5
  },
  notification_settings: dbConfig.notification_settings || {
    email_notifications: true,
    new_application_alerts: true,
    commission_updates: true,
    system_announcements: true
  }
});

export class RecruiterPortalService {
  // Content Management
  static async getPortalContent(): Promise<RecruiterPortalContent[]> {
    const { data, error } = await supabase
      .from('recruiter_portal_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(convertDbContentToInterface);
  }

  static async getPublishedContent(): Promise<RecruiterPortalContent[]> {
    const { data, error } = await supabase
      .from('recruiter_portal_content')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(convertDbContentToInterface);
  }

  static async createPortalContent(content: any): Promise<RecruiterPortalContent> {
    const { data, error } = await supabase
      .from('recruiter_portal_content')
      .insert(content)
      .select()
      .single();

    if (error) throw error;
    return convertDbContentToInterface(data);
  }

  static async updatePortalContent(id: string, updates: any): Promise<RecruiterPortalContent> {
    const { data, error } = await supabase
      .from('recruiter_portal_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return convertDbContentToInterface(data);
  }

  static async deletePortalContent(id: string): Promise<void> {
    const { error } = await supabase
      .from('recruiter_portal_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Message Management
  static async getPortalMessages(): Promise<RecruiterPortalMessage[]> {
    const { data, error } = await supabase
      .from('recruiter_portal_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(convertDbMessageToInterface);
  }

  static async createPortalMessage(message: any): Promise<RecruiterPortalMessage> {
    const { data, error } = await supabase
      .from('recruiter_portal_messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return convertDbMessageToInterface(data);
  }

  static async updatePortalMessage(id: string, updates: any): Promise<RecruiterPortalMessage> {
    const { data, error } = await supabase
      .from('recruiter_portal_messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return convertDbMessageToInterface(data);
  }

  static async deletePortalMessage(id: string): Promise<void> {
    const { error } = await supabase
      .from('recruiter_portal_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async markMessageAsRead(id: string, readBy: string): Promise<void> {
    const { error } = await supabase
      .from('recruiter_portal_messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
        read_by: readBy
      })
      .eq('id', id);

    if (error) throw error;
  }

  // Configuration Management
  static async getPortalConfig(): Promise<RecruiterPortalConfig | null> {
    const { data, error } = await supabase
      .from('recruiter_portal_config')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? convertDbConfigToInterface(data) : null;
  }

  static async createOrUpdatePortalConfig(config: any): Promise<RecruiterPortalConfig> {
    const existingConfig = await this.getPortalConfig();

    if (existingConfig) {
      const { data, error } = await supabase
        .from('recruiter_portal_config')
        .update(config)
        .eq('id', existingConfig.id)
        .select()
        .single();

      if (error) throw error;
      return convertDbConfigToInterface(data);
    } else {
      const { data, error } = await supabase
        .from('recruiter_portal_config')
        .insert(config)
        .select()
        .single();

      if (error) throw error;
      return convertDbConfigToInterface(data);
    }
  }

  // Real-time Subscriptions
  static subscribeToContentChanges(callback: (payload: any) => void) {
    return supabase
      .channel('recruiter_portal_content_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'recruiter_portal_content' }, 
        callback
      )
      .subscribe();
  }

  static subscribeToMessageChanges(callback: (payload: any) => void) {
    return supabase
      .channel('recruiter_portal_message_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'recruiter_portal_messages' }, 
        callback
      )
      .subscribe();
  }

  static subscribeToConfigChanges(callback: (payload: any) => void) {
    return supabase
      .channel('recruiter_portal_config_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'recruiter_portal_config' }, 
        callback
      )
      .subscribe();
  }
}