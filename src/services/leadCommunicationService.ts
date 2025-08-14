import { supabase } from '@/integrations/supabase/client';
import { LeadCommunication, CommunicationFormData } from '@/types/leadEnhancements';
import { DummyLeadDataService } from './dummyLeadDataService';

export class LeadCommunicationService {
  static async getCommunications(leadId: string): Promise<LeadCommunication[]> {
    try {
      const { data, error } = await supabase
        .from('lead_communications')
        .select('*')
        .eq('lead_id', leadId)
        .order('communication_date', { ascending: false });

      if (error) {
        console.error('Error fetching communications:', error);
        // Return dummy data if database fetch fails
        return DummyLeadDataService.generateDummyCommunications(leadId);
      }

      // If no data found, return dummy data for demonstration
      if (!data || data.length === 0) {
        return DummyLeadDataService.generateDummyCommunications(leadId);
      }

      return data as LeadCommunication[];
    } catch (error) {
      console.error('Database connection error:', error);
      return DummyLeadDataService.generateDummyCommunications(leadId);
    }
  }

  static async createCommunication(
    leadId: string, 
    communicationData: CommunicationFormData,
    isAIGenerated: boolean = false,
    aiAgentId?: string
  ): Promise<LeadCommunication> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('lead_communications')
      .insert({
        lead_id: leadId,
        user_id: user.id,
        ...communicationData,
        communication_date: communicationData.communication_date || new Date().toISOString(),
        is_ai_generated: isAIGenerated,
        ai_agent_id: aiAgentId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating communication:', error);
      throw new Error('Failed to create communication');
    }

    return data as LeadCommunication;
  }

  static async updateCommunication(
    id: string, 
    updates: Partial<CommunicationFormData>
  ): Promise<LeadCommunication> {
    const { data, error } = await supabase
      .from('lead_communications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating communication:', error);
      throw new Error('Failed to update communication');
    }

    return data as LeadCommunication;
  }

  static async deleteCommunication(id: string): Promise<void> {
    const { error } = await supabase
      .from('lead_communications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting communication:', error);
      throw new Error('Failed to delete communication');
    }
  }

  static async getCommunicationStats(leadId: string): Promise<{
    total: number;
    by_type: Record<string, number>;
    recent_count: number;
  }> {
    const { data, error } = await supabase
      .from('lead_communications')
      .select('type, created_at')
      .eq('lead_id', leadId);

    if (error) {
      console.error('Error fetching communication stats:', error);
      return { total: 0, by_type: {}, recent_count: 0 };
    }

    const total = data.length;
    const by_type = data.reduce((acc, comm) => {
      acc[comm.type] = (acc[comm.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent_count = data.filter(comm => 
      new Date(comm.created_at) > weekAgo
    ).length;

    return { total, by_type, recent_count };
  }

  // AI Communication Methods
  static async createAICommunication(
    leadId: string,
    agentId: string,
    communicationData: any
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('lead_communications')
      .insert({
        lead_id: leadId,
        user_id: user.id,
        ...communicationData,
        is_ai_generated: true,
        ai_agent_id: agentId
      })
      .select()
      .single();

    if (error) throw new Error('Failed to create AI communication');
    return data;
  }

  static async getAICommunications(leadId: string) {
    const { data, error } = await supabase
      .from('lead_communications')
      .select('*')
      .eq('lead_id', leadId)
      .eq('is_ai_generated', true)
      .order('communication_date', { ascending: false });

    if (error) {
      console.error('Error fetching AI communications:', error);
      return [];
    }

    return data;
  }

  static async getHumanCommunications(leadId: string) {
    const { data, error } = await supabase
      .from('lead_communications')
      .select('*')
      .eq('lead_id', leadId)
      .eq('is_ai_generated', false)
      .order('communication_date', { ascending: false });

    if (error) {
      console.error('Error fetching human communications:', error);
      return [];
    }

    return data;
  }
}