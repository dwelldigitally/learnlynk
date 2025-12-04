import { supabase } from '@/integrations/supabase/client';

interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  message?: string;
  data?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
}

interface UserPreference {
  notification_type: string;
  channel: string;
  enabled: boolean;
  frequency: string;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
}

interface UserProfile {
  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
}

export class NotificationDispatcher {
  /**
   * Send notification respecting user preferences
   */
  static async send(payload: NotificationPayload): Promise<void> {
    const { userId, type, title, message, data, priority = 'medium' } = payload;

    try {
      // Fetch user preferences for this notification type
      const { data: preferences } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .eq('notification_type', type);

      // Fetch user profile for contact info
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, phone, first_name, last_name')
        .eq('user_id', userId)
        .single();

      // If no preferences exist, create default ones and send to all channels
      if (!preferences || preferences.length === 0) {
        await this.createDefaultPreferences(userId, type);
        await this.sendToAllChannels(userId, profile, { type, title, message, data, priority });
        return;
      }

      // Check each channel preference
      for (const pref of preferences as UserPreference[]) {
        if (!pref.enabled) continue;

        // Check quiet hours
        if (pref.quiet_hours_enabled && this.isInQuietHours(pref.quiet_hours_start, pref.quiet_hours_end)) {
          // Queue notification for later (for now, skip email/sms, still send in-app)
          if (pref.channel !== 'in_app') {
            console.log(`Notification queued for ${pref.channel} due to quiet hours`);
            continue;
          }
        }

        // Send to the appropriate channel
        switch (pref.channel) {
          case 'in_app':
            await this.sendInApp(userId, { type, title, message, data, priority });
            break;
          case 'email':
            if (profile?.email) {
              await this.sendEmail(profile.email, { type, title, message, data, userName: profile.first_name });
            }
            break;
          case 'sms':
            if (profile?.phone) {
              await this.sendSMS(profile.phone, { title, message });
            }
            break;
        }
      }
    } catch (error) {
      console.error('Error dispatching notification:', error);
      // Fallback: always create in-app notification
      await this.sendInApp(userId, { type, title, message, data, priority });
    }
  }

  /**
   * Send in-app notification (insert into notifications table)
   */
  private static async sendInApp(
    userId: string,
    payload: { type: string; title: string; message?: string; data?: Record<string, any>; priority: string }
  ): Promise<void> {
    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        data: payload.data,
        is_read: false
      });
      console.log(`In-app notification sent to user ${userId}`);
    } catch (error) {
      console.error('Error sending in-app notification:', error);
    }
  }

  /**
   * Send email notification via edge function
   */
  private static async sendEmail(
    email: string,
    payload: { type: string; title: string; message?: string; data?: Record<string, any>; userName?: string | null }
  ): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: payload.title,
          html: this.buildEmailHTML(payload),
          text: payload.message || payload.title
        }
      });

      if (error) {
        console.error('Error sending email notification:', error);
      } else {
        console.log(`Email notification sent to ${email}`);
      }
    } catch (error) {
      console.error('Error invoking send-email function:', error);
    }
  }

  /**
   * Send SMS notification via edge function
   */
  private static async sendSMS(
    phone: string,
    payload: { title: string; message?: string }
  ): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-sms', {
        body: {
          to: phone,
          message: `${payload.title}${payload.message ? ': ' + payload.message : ''}`
        }
      });

      if (error) {
        console.error('Error sending SMS notification:', error);
      } else {
        console.log(`SMS notification sent to ${phone}`);
      }
    } catch (error) {
      console.error('Error invoking send-sms function:', error);
    }
  }

  /**
   * Build HTML for email notifications
   */
  private static buildEmailHTML(payload: { title: string; message?: string; userName?: string | null }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 20px;">${payload.title}</h1>
          </div>
          <div class="content">
            ${payload.userName ? `<p>Hi ${payload.userName},</p>` : ''}
            <p>${payload.message || 'You have a new notification.'}</p>
          </div>
          <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Check if current time is within quiet hours
   */
  private static isInQuietHours(start: string | null, end: string | null): boolean {
    if (!start || !end) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    // Handle overnight quiet hours (e.g., 22:00 to 07:00)
    if (startMinutes > endMinutes) {
      return currentTime >= startMinutes || currentTime <= endMinutes;
    }

    return currentTime >= startMinutes && currentTime <= endMinutes;
  }

  /**
   * Create default preferences for a notification type
   */
  private static async createDefaultPreferences(userId: string, notificationType: string): Promise<void> {
    const channels = ['in_app', 'email'];
    
    for (const channel of channels) {
      try {
        await supabase.from('user_notification_preferences').insert({
          user_id: userId,
          notification_type: notificationType,
          channel,
          is_enabled: true,
          frequency: 'immediate'
        });
      } catch (error) {
        // Preference might already exist, ignore error
      }
    }
  }

  /**
   * Send to all channels (fallback when no preferences exist)
   */
  private static async sendToAllChannels(
    userId: string,
    profile: UserProfile | null,
    payload: { type: string; title: string; message?: string; data?: Record<string, any>; priority: string }
  ): Promise<void> {
    // Always send in-app
    await this.sendInApp(userId, payload);

    // Send email if available
    if (profile?.email) {
      await this.sendEmail(profile.email, { ...payload, userName: profile.first_name });
    }
  }
}
