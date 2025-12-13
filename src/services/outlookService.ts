import { supabase } from '@/integrations/supabase/client';

export interface OutlookConnectionStatus {
  connected: boolean;
  email?: string;
  expiresAt?: string;
}

export interface OutlookSendEmailRequest {
  leadId?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  bodyType?: 'html' | 'text';
  attachments?: Array<{
    name: string;
    contentBytes: string;
    contentType: string;
  }>;
  replyToMessageId?: string;
}

export interface OutlookSyncResult {
  success: boolean;
  totalFetched: number;
  newlySynced: number;
  alreadySynced: number;
  hasMore: boolean;
}

export interface OutlookCalendarEvent {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
  isOnlineMeeting?: boolean;
  leadId?: string;
}

export interface FreeBusySlot {
  status: 'free' | 'busy' | 'tentative' | 'workingElsewhere' | 'unknown';
  start: string;
  end: string;
}

export const OutlookService = {
  // Check if user has Outlook connected
  async checkConnection(): Promise<OutlookConnectionStatus> {
    const { data, error } = await supabase.functions.invoke('outlook-auth', {
      body: { action: 'check-connection' },
    });

    if (error) {
      console.error('Error checking Outlook connection:', error);
      return { connected: false };
    }

    return {
      connected: data.connected,
      email: data.email,
    };
  },

  // Get OAuth URL for connecting Outlook
  async getAuthUrl(): Promise<string> {
    const { data, error } = await supabase.functions.invoke('outlook-auth', {
      body: { action: 'get-auth-url' },
    });

    if (error) {
      throw new Error('Failed to get Outlook auth URL');
    }

    return data.authUrl;
  },

  // Exchange OAuth code for tokens
  async exchangeCode(code: string): Promise<{ success: boolean; email: string }> {
    const { data, error } = await supabase.functions.invoke('outlook-auth', {
      body: { action: 'exchange-code', code },
    });

    if (error) {
      throw new Error('Failed to exchange code');
    }

    return data;
  },

  // Disconnect Outlook
  async disconnect(): Promise<void> {
    const { error } = await supabase.functions.invoke('outlook-auth', {
      body: { action: 'disconnect' },
    });

    if (error) {
      throw new Error('Failed to disconnect Outlook');
    }
  },

  // Send email via Outlook
  async sendEmail(request: OutlookSendEmailRequest): Promise<{ success: boolean; emailId?: string }> {
    const { data, error } = await supabase.functions.invoke('outlook-send-email', {
      body: request,
    });

    if (error) {
      throw new Error(error.message || 'Failed to send email');
    }

    return data;
  },

  // Fetch and sync emails from Outlook
  async syncEmails(options?: { since?: string; top?: number }): Promise<OutlookSyncResult> {
    const { data, error } = await supabase.functions.invoke('outlook-fetch-emails', {
      body: options || {},
    });

    if (error) {
      throw new Error('Failed to sync emails');
    }

    return data;
  },

  // Create webhook subscription for real-time email updates
  async createEmailSubscription(): Promise<{ success: boolean; subscriptionId: string }> {
    const { data, error } = await supabase.functions.invoke('outlook-subscription', {
      body: { action: 'create', resource: 'inbox' },
    });

    if (error) {
      throw new Error('Failed to create email subscription');
    }

    return data;
  },

  // Create webhook subscription for calendar updates
  async createCalendarSubscription(): Promise<{ success: boolean; subscriptionId: string }> {
    const { data, error } = await supabase.functions.invoke('outlook-subscription', {
      body: { action: 'create', resource: 'calendar' },
    });

    if (error) {
      throw new Error('Failed to create calendar subscription');
    }

    return data;
  },

  // List active subscriptions
  async listSubscriptions(): Promise<any[]> {
    const { data, error } = await supabase.functions.invoke('outlook-subscription', {
      body: { action: 'list' },
    });

    if (error) {
      throw new Error('Failed to list subscriptions');
    }

    return data.subscriptions;
  },

  // Create calendar event in Outlook
  async createCalendarEvent(event: OutlookCalendarEvent): Promise<{ 
    success: boolean; 
    eventId?: string;
    microsoftEventId?: string;
    onlineMeetingUrl?: string;
  }> {
    const { data, error } = await supabase.functions.invoke('outlook-calendar', {
      body: { action: 'create-event', event },
    });

    if (error) {
      throw new Error('Failed to create calendar event');
    }

    return data;
  },

  // Update calendar event
  async updateCalendarEvent(eventId: string, microsoftEventId: string, event: OutlookCalendarEvent): Promise<{ success: boolean }> {
    const { data, error } = await supabase.functions.invoke('outlook-calendar', {
      body: { action: 'update-event', eventId, microsoftEventId, event },
    });

    if (error) {
      throw new Error('Failed to update calendar event');
    }

    return data;
  },

  // Delete calendar event
  async deleteCalendarEvent(eventId: string, microsoftEventId: string): Promise<{ success: boolean }> {
    const { data, error } = await supabase.functions.invoke('outlook-calendar', {
      body: { action: 'delete-event', eventId, microsoftEventId },
    });

    if (error) {
      throw new Error('Failed to delete calendar event');
    }

    return data;
  },

  // Get free/busy availability
  async getFreeBusy(schedules: string[], startTime: string, endTime: string): Promise<{ schedules: any[] }> {
    const { data, error } = await supabase.functions.invoke('outlook-calendar', {
      body: { 
        action: 'get-free-busy', 
        freeBusy: { schedules, startTime, endTime } 
      },
    });

    if (error) {
      throw new Error('Failed to get availability');
    }

    return data;
  },

  // Sync calendar events from Outlook
  async syncCalendarEvents(since?: string): Promise<{ success: boolean; syncedEvents: any[] }> {
    const { data, error } = await supabase.functions.invoke('outlook-calendar', {
      body: { action: 'sync-events', syncOptions: { since } },
    });

    if (error) {
      throw new Error('Failed to sync calendar events');
    }

    return data;
  },
};
