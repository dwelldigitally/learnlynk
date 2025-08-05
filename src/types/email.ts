// Email management types for Microsoft Outlook integration

export interface EmailAccount {
  id: string;
  user_id: string;
  email_address: string;
  provider: 'microsoft';
  access_token_encrypted?: string;
  refresh_token_encrypted?: string;
  token_expires_at?: string;
  account_type: 'individual' | 'team';
  display_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamInbox {
  id: string;
  name: string;
  email_address: string;
  email_account_id: string;
  description?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TeamInboxMember {
  id: string;
  team_inbox_id: string;
  user_id: string;
  role: 'admin' | 'member' | 'viewer';
  permissions: Record<string, any>;
  added_at: string;
}

export interface Email {
  id: string;
  microsoft_id: string;
  email_account_id: string;
  team_inbox_id?: string;
  thread_id?: string;
  
  // Content
  subject?: string;
  body_content?: string;
  body_preview?: string;
  from_email: string;
  from_name?: string;
  to_emails: string[];
  cc_emails: string[];
  bcc_emails: string[];
  
  // Timestamps
  sent_datetime?: string;
  received_datetime: string;
  created_datetime: string;
  
  // Status and priority
  is_read: boolean;
  importance: 'low' | 'normal' | 'high';
  has_attachments: boolean;
  
  // Lead scoring and AI
  lead_id?: string;
  ai_priority_score: number;
  ai_lead_match_confidence: number;
  ai_suggested_actions: any[];
  
  // Assignment
  assigned_to?: string;
  assigned_at?: string;
  status: 'new' | 'assigned' | 'in_progress' | 'replied' | 'resolved';
  
  // Microsoft metadata
  microsoft_metadata: Record<string, any>;
  
  created_at: string;
  updated_at: string;
}

export interface EmailAttachment {
  id: string;
  email_id: string;
  microsoft_attachment_id?: string;
  name: string;
  content_type?: string;
  size_bytes?: number;
  content_bytes?: Uint8Array;
  download_url?: string;
  is_inline: boolean;
  created_at: string;
}

export interface EmailDraft {
  id: string;
  original_email_id?: string;
  created_by: string;
  subject?: string;
  body_content?: string;
  to_emails: string[];
  cc_emails: string[];
  bcc_emails: string[];
  
  // AI assistance
  is_ai_generated: boolean;
  ai_confidence_score: number;
  suggested_attachments: string[];
  
  // Status
  status: 'draft' | 'scheduled' | 'sent';
  scheduled_for?: string;
  sent_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface EmailAnalytics {
  id: string;
  email_id: string;
  user_id: string;
  
  // Response metrics
  response_time_minutes?: number;
  first_response_at?: string;
  resolution_time_minutes?: number;
  resolved_at?: string;
  
  // Lead conversion tracking
  lead_score_before?: number;
  lead_score_after?: number;
  conversion_action?: string;
  
  created_at: string;
}

// AI prioritization types
export interface EmailPriorityFactors {
  lead_score: number;
  conversion_likelihood: number;
  sales_approach_urgency: 'aggressive' | 'balanced' | 'neutral';
  email_urgency_indicators: string[];
  response_time_sensitivity: number;
}

export interface AIEmailAnalysis {
  priority_score: number;
  confidence: number;
  lead_match?: {
    lead_id: string;
    confidence: number;
    matching_factors: string[];
  };
  suggested_actions: Array<{
    action: string;
    priority: number;
    reason: string;
  }>;
  suggested_response?: {
    tone: string;
    key_points: string[];
    templates: string[];
  };
  document_suggestions: Array<{
    document_id: string;
    relevance_score: number;
    reason: string;
  }>;
}

// Microsoft Graph API types
export interface MicrosoftGraphMessage {
  id: string;
  subject: string;
  bodyPreview: string;
  body: {
    contentType: string;
    content: string;
  };
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  toRecipients: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
  }>;
  ccRecipients: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
  }>;
  sentDateTime: string;
  receivedDateTime: string;
  importance: string;
  hasAttachments: boolean;
  isRead: boolean;
}

export interface MicrosoftAuthConfig {
  clientId: string;
  tenantId?: string;
  redirectUri: string;
  scopes: string[];
}

// Email management filters and search
export interface EmailFilter {
  inbox_type?: 'individual' | 'team';
  team_inbox_id?: string;
  status?: Email['status'][];
  importance?: Email['importance'][];
  is_read?: boolean;
  has_lead_match?: boolean;
  ai_priority_range?: {
    min: number;
    max: number;
  };
  assigned_to?: string[];
  date_range?: {
    start: Date;
    end: Date;
  };
  search_query?: string;
}

export interface EmailStats {
  total_emails: number;
  unread_count: number;
  high_priority_count: number;
  assigned_count: number;
  response_rate: number;
  avg_response_time_hours: number;
  lead_conversion_count: number;
  by_status: Record<Email['status'], number>;
  by_importance: Record<Email['importance'], number>;
}