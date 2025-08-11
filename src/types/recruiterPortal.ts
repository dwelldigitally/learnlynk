export interface RecruiterPortalContent {
  id: string;
  user_id: string;
  title: string;
  content: string;
  content_type: 'announcement' | 'news' | 'document' | 'training' | 'policy';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  target_companies: string[];
  target_roles: string[];
  is_published: boolean;
  publish_date?: string;
  expire_date?: string;
  attachment_urls: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface RecruiterPortalMessage {
  id: string;
  user_id: string;
  recipient_type: 'all' | 'company' | 'individual';
  recipient_companies: string[];
  recipient_users: string[];
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_read: boolean;
  read_at?: string;
  read_by?: string;
  attachment_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface RecruiterPortalConfig {
  id: string;
  user_id: string;
  portal_title: string;
  welcome_message?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  features: {
    application_submission: boolean;
    commission_tracking: boolean;
    document_management: boolean;
    performance_metrics: boolean;
    communication_center: boolean;
    training_materials: boolean;
    company_directory: boolean;
    automated_notifications: boolean;
  };
  access_control: {
    require_approval: boolean;
    allow_self_registration: boolean;
    session_timeout: number;
    max_login_attempts: number;
  };
  notification_settings: {
    email_notifications: boolean;
    new_application_alerts: boolean;
    commission_updates: boolean;
    system_announcements: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}