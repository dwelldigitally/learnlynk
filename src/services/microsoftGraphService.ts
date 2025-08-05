import { EmailAccount, Email, MicrosoftGraphMessage, MicrosoftAuthConfig } from '@/types/email';

/**
 * Microsoft Graph API service for Outlook integration
 * This handles authentication and email synchronization with Microsoft 365
 */
export class MicrosoftGraphService {
  private static readonly GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0';
  
  /**
   * Microsoft OAuth configuration
   */
  static getAuthConfig(): MicrosoftAuthConfig {
    return {
      clientId: 'your-microsoft-app-client-id', // This would come from environment
      tenantId: 'common', // Or specific tenant ID
      redirectUri: `${window.location.origin}/auth/microsoft/callback`,
      scopes: [
        'https://graph.microsoft.com/Mail.Read',
        'https://graph.microsoft.com/Mail.ReadWrite',
        'https://graph.microsoft.com/Mail.Send',
        'https://graph.microsoft.com/User.Read'
      ]
    };
  }

  /**
   * Get Microsoft OAuth URL for authentication
   */
  static getAuthUrl(): string {
    const config = this.getAuthConfig();
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'code',
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(' '),
      response_mode: 'query',
      state: crypto.randomUUID() // CSRF protection
    });

    return `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/authorize?${params}`;
  }

  /**
   * Exchange authorization code for access tokens
   */
  static async exchangeCodeForTokens(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const config = this.getAuthConfig();
    
    const response = await fetch(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        scope: config.scopes.join(' '),
        code,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code',
        // client_secret would be handled server-side
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    return response.json();
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    access_token: string;
    expires_in: number;
  }> {
    const config = this.getAuthConfig();
    
    const response = await fetch(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        scope: config.scopes.join(' '),
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    return response.json();
  }

  /**
   * Make authenticated request to Microsoft Graph API
   */
  static async makeGraphRequest(
    endpoint: string, 
    accessToken: string, 
    options: RequestInit = {}
  ): Promise<any> {
    const response = await fetch(`${this.GRAPH_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Access token expired');
      }
      throw new Error(`Graph API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get user profile from Microsoft Graph
   */
  static async getUserProfile(accessToken: string): Promise<{
    id: string;
    displayName: string;
    mail: string;
    userPrincipalName: string;
  }> {
    return this.makeGraphRequest('/me', accessToken);
  }

  /**
   * Get emails from user's inbox
   */
  static async getInboxEmails(
    accessToken: string,
    options: {
      top?: number;
      skip?: number;
      filter?: string;
      orderby?: string;
    } = {}
  ): Promise<{ value: MicrosoftGraphMessage[]; '@odata.nextLink'?: string }> {
    const params = new URLSearchParams();
    
    if (options.top) params.append('$top', options.top.toString());
    if (options.skip) params.append('$skip', options.skip.toString());
    if (options.filter) params.append('$filter', options.filter);
    if (options.orderby) params.append('$orderby', options.orderby);
    
    // Select specific fields for efficiency
    params.append('$select', 'id,subject,bodyPreview,body,from,toRecipients,ccRecipients,sentDateTime,receivedDateTime,importance,hasAttachments,isRead');

    const endpoint = `/me/mailFolders/inbox/messages?${params}`;
    return this.makeGraphRequest(endpoint, accessToken);
  }

  /**
   * Get specific email by ID
   */
  static async getEmail(emailId: string, accessToken: string): Promise<MicrosoftGraphMessage> {
    return this.makeGraphRequest(`/me/messages/${emailId}`, accessToken);
  }

  /**
   * Send email via Microsoft Graph
   */
  static async sendEmail(
    accessToken: string,
    email: {
      subject: string;
      body: string;
      toRecipients: string[];
      ccRecipients?: string[];
      bccRecipients?: string[];
      attachments?: Array<{
        name: string;
        contentBytes: string; // base64 encoded
        contentType: string;
      }>;
    }
  ): Promise<void> {
    const message = {
      subject: email.subject,
      body: {
        contentType: 'HTML',
        content: email.body,
      },
      toRecipients: email.toRecipients.map(email => ({
        emailAddress: { address: email }
      })),
      ccRecipients: email.ccRecipients?.map(email => ({
        emailAddress: { address: email }
      })) || [],
      bccRecipients: email.bccRecipients?.map(email => ({
        emailAddress: { address: email }
      })) || [],
      attachments: email.attachments || []
    };

    await this.makeGraphRequest('/me/sendMail', accessToken, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  /**
   * Create draft email
   */
  static async createDraft(
    accessToken: string,
    draft: {
      subject: string;
      body: string;
      toRecipients: string[];
      ccRecipients?: string[];
    }
  ): Promise<{ id: string }> {
    const message = {
      subject: draft.subject,
      body: {
        contentType: 'HTML',
        content: draft.body,
      },
      toRecipients: draft.toRecipients.map(email => ({
        emailAddress: { address: email }
      })),
      ccRecipients: draft.ccRecipients?.map(email => ({
        emailAddress: { address: email }
      })) || [],
    };

    return this.makeGraphRequest('/me/messages', accessToken, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  /**
   * Mark email as read/unread
   */
  static async updateEmailReadStatus(
    emailId: string,
    accessToken: string,
    isRead: boolean
  ): Promise<void> {
    await this.makeGraphRequest(`/me/messages/${emailId}`, accessToken, {
      method: 'PATCH',
      body: JSON.stringify({ isRead }),
    });
  }

  /**
   * Get email attachments
   */
  static async getEmailAttachments(
    emailId: string,
    accessToken: string
  ): Promise<Array<{
    id: string;
    name: string;
    contentType: string;
    size: number;
    isInline: boolean;
    contentBytes?: string;
  }>> {
    const response = await this.makeGraphRequest(
      `/me/messages/${emailId}/attachments`,
      accessToken
    );
    return response.value || [];
  }

  /**
   * Convert Microsoft Graph message to our Email type
   */
  static convertGraphMessageToEmail(
    graphMessage: MicrosoftGraphMessage,
    emailAccountId: string
  ): Partial<Email> {
    return {
      microsoft_id: graphMessage.id,
      email_account_id: emailAccountId,
      subject: graphMessage.subject,
      body_content: graphMessage.body?.content,
      body_preview: graphMessage.bodyPreview,
      from_email: graphMessage.from?.emailAddress?.address || '',
      from_name: graphMessage.from?.emailAddress?.name,
      to_emails: graphMessage.toRecipients?.map(r => r.emailAddress.address) || [],
      cc_emails: graphMessage.ccRecipients?.map(r => r.emailAddress.address) || [],
      sent_datetime: graphMessage.sentDateTime,
      received_datetime: graphMessage.receivedDateTime,
      is_read: graphMessage.isRead,
      importance: graphMessage.importance?.toLowerCase() as 'low' | 'normal' | 'high',
      has_attachments: graphMessage.hasAttachments,
      status: 'new' as const,
      ai_priority_score: 0,
      ai_lead_match_confidence: 0,
      ai_suggested_actions: [],
      microsoft_metadata: {
        originalMessage: graphMessage
      }
    };
  }

  /**
   * Set up webhook subscription for real-time email notifications
   */
  static async createWebhookSubscription(
    accessToken: string,
    notificationUrl: string
  ): Promise<{ id: string; expirationDateTime: string }> {
    const subscription = {
      changeType: 'created,updated',
      notificationUrl,
      resource: '/me/mailFolders/inbox/messages',
      expirationDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
      clientState: crypto.randomUUID(), // For security
    };

    return this.makeGraphRequest('/subscriptions', accessToken, {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  }
}