import { supabase } from '@/integrations/supabase/client';

export interface AircallCall {
  id: string;
  aircall_call_id: string;
  user_id: string;
  lead_id?: string;
  phone_number: string;
  direction: 'inbound' | 'outbound';
  status: 'initial' | 'answered' | 'hungup' | 'busy' | 'no_answer' | 'failed' | 'canceled';
  duration: number;
  agent_id?: string;
  agent_name?: string;
  caller_name?: string;
  caller_company?: string;
  started_at?: string;
  answered_at?: string;
  ended_at?: string;
  recording_url?: string;
  transcription?: string;
  summary?: string;
  tags?: string[];
  outcome?: 'connected' | 'no_answer' | 'busy' | 'failed' | 'voicemail' | 'callback_requested';
  disposition?: string;
  notes?: string;
  aircall_metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface AircallSettings {
  id: string;
  user_id: string;
  api_id?: string;
  api_token_encrypted?: string;
  auto_create_leads: boolean;
  auto_log_calls: boolean;
  call_recording_enabled: boolean;
  transcription_enabled: boolean;
  click_to_call_enabled: boolean;
  call_popup_enabled: boolean;
  auto_dial_enabled: boolean;
  webhook_url?: string;
  webhook_secret?: string;
  is_active: boolean;
  last_sync_at?: string;
  connection_status: 'connected' | 'disconnected' | 'error';
  created_at: string;
  updated_at: string;
}

export class AircallService {
  private static BASE_URL = 'https://api.aircall.io/v1';

  // Get user's Aircall settings
  static async getSettings(): Promise<AircallSettings | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('aircall_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching Aircall settings:', error);
      return null;
    }

    return data ? {
      ...data,
      connection_status: data.connection_status as 'connected' | 'disconnected' | 'error'
    } : null;
  }

  // Update user's Aircall settings
  static async updateSettings(settings: Partial<AircallSettings>): Promise<AircallSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('aircall_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          connection_status: settings.connection_status as 'connected' | 'disconnected' | 'error',
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
      console.error('Error updating Aircall settings:', error);
      throw new Error('Failed to update Aircall settings');
    }

    return {
      ...data,
      connection_status: data.connection_status as 'connected' | 'disconnected' | 'error'
    };
  }

  // Test Aircall API connection
  static async testConnection(apiId: string, apiToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/company`, {
        headers: {
          'Authorization': `Basic ${btoa(`${apiId}:${apiToken}`)}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Aircall connection test failed:', error);
      return false;
    }
  }

  // Get calls for the current user
  static async getCalls(leadId?: string): Promise<AircallCall[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('aircall_calls')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (leadId) {
      query = query.eq('lead_id', leadId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching calls:', error);
      return [];
    }

    return (data || []).map(call => ({
      ...call,
      direction: call.direction as 'inbound' | 'outbound',
      status: call.status as AircallCall['status'],
      outcome: call.outcome as AircallCall['outcome']
    }));
  }

  // Create a new call record
  static async createCall(callData: Partial<AircallCall>): Promise<AircallCall> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const insertData = {
      user_id: user.id,
      aircall_call_id: callData.aircall_call_id || `manual-${Date.now()}`,
      phone_number: callData.phone_number || '',
      direction: callData.direction || 'outbound',
      status: callData.status || 'initial',
      duration: callData.duration || 0,
      ...callData
    };

    const { data, error } = await supabase
      .from('aircall_calls')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating call:', error);
      throw new Error('Failed to create call record');
    }

    return {
      ...data,
      direction: data.direction as 'inbound' | 'outbound',
      status: data.status as AircallCall['status'],
      outcome: data.outcome as AircallCall['outcome']
    };
  }

  // Update an existing call record
  static async updateCall(callId: string, updates: Partial<AircallCall>): Promise<AircallCall> {
    const { data, error } = await supabase
      .from('aircall_calls')
      .update(updates)
      .eq('id', callId)
      .select()
      .single();

    if (error) {
      console.error('Error updating call:', error);
      throw new Error('Failed to update call');
    }

    return {
      ...data,
      direction: data.direction as 'inbound' | 'outbound',
      status: data.status as AircallCall['status'],
      outcome: data.outcome as AircallCall['outcome']
    };
  }

  // Initiate a call through Aircall API (via Edge Function)
  static async initiateCall(phoneNumber: string, settings: AircallSettings): Promise<any> {
    console.log('Initiating call via Edge Function:', phoneNumber);
    
    if (!settings.api_id || !settings.api_token_encrypted) {
      throw new Error('Aircall API credentials not configured');
    }

    try {
      const { data, error } = await supabase.functions.invoke('aircall-api', {
        body: {
          phoneNumber,
          leadId: null // Will be set by the calling component if available
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to initiate call');
      }

      console.log('Call initiated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error calling aircall-api function:', error);
      throw error;
    }
  }

  // Match phone number to existing lead
  static async findLeadByPhone(phoneNumber: string): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Clean phone number for matching
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .ilike('phone', `%${cleanPhone}%`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error finding lead by phone:', error);
      return null;
    }

    return data;
  }

  // Create a new lead from call data
  static async createLeadFromCall(callData: {
    phone_number: string;
    caller_name?: string;
    caller_company?: string;
  }): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const names = callData.caller_name?.split(' ') || ['Unknown', 'Caller'];
    const firstName = names[0] || 'Unknown';
    const lastName = names.slice(1).join(' ') || 'Caller';

    const { data, error } = await supabase
      .from('leads')
      .insert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone: callData.phone_number,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@temp.com`, // Temporary email
        source: 'phone' as any,
        status: 'new' as any,
        priority: 'medium' as any,
        lead_score: 0,
        program_interest: [],
        tags: ['phone-lead']
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lead from call:', error);
      throw new Error('Failed to create lead');
    }

    return data;
  }

  // Get call statistics
  static async getCallStats(leadId?: string): Promise<{
    total_calls: number;
    answered_calls: number;
    missed_calls: number;
    average_duration: number;
    last_call_date?: string;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('aircall_calls')
      .select('status, duration, created_at')
      .eq('user_id', user.id);

    if (leadId) {
      query = query.eq('lead_id', leadId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching call stats:', error);
      return {
        total_calls: 0,
        answered_calls: 0,
        missed_calls: 0,
        average_duration: 0
      };
    }

    const calls = data || [];
    const totalCalls = calls.length;
    const answeredCalls = calls.filter(call => call.status === 'answered').length;
    const missedCalls = calls.filter(call => call.status === 'no_answer').length;
    const averageDuration = calls.length > 0 
      ? calls.reduce((sum, call) => sum + (call.duration || 0), 0) / calls.length 
      : 0;
    const lastCallDate = calls.length > 0 ? calls[0].created_at : undefined;

    return {
      total_calls: totalCalls,
      answered_calls: answeredCalls,
      missed_calls: missedCalls,
      average_duration: Math.round(averageDuration),
      last_call_date: lastCallDate
    };
  }
}