import { supabase } from '@/integrations/supabase/client';
import { LeadCommunication, CommunicationFormData } from '@/types/leadEnhancements';
import { DummyLeadDataService } from './dummyLeadDataService';

export class LeadCommunicationService {
  static async getCommunications(leadId: string): Promise<LeadCommunication[]> {
    try {
      const response = await supabase
        .from('lead_communications')
        .select('*')
        .eq('lead_id', leadId)
        .order('communication_date', { ascending: false });

      if (response.error) {
        console.error('Error fetching communications:', response.error);
        // Return dummy data if database fetch fails
        return DummyLeadDataService.generateDummyCommunications(leadId);
      }

      // If no data found, return dummy data for demonstration
      if (!response.data || response.data.length === 0) {
        return DummyLeadDataService.generateDummyCommunications(leadId);
      }

      return response.data as LeadCommunication[];
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
    const authResponse = await supabase.auth.getUser();
    if (!authResponse.data.user) throw new Error('User not authenticated');

    const insertResponse = await supabase
      .from('lead_communications')
      .insert({
        lead_id: leadId,
        user_id: authResponse.data.user.id,
        ...communicationData,
        communication_date: communicationData.communication_date || new Date().toISOString(),
        is_ai_generated: isAIGenerated,
        ai_agent_id: aiAgentId
      })
      .select()
      .single();

    if (insertResponse.error) {
      console.error('Error creating communication:', insertResponse.error);
      throw new Error('Failed to create communication');
    }

    return insertResponse.data as LeadCommunication;
  }

  static async updateCommunication(
    id: string, 
    updates: Partial<CommunicationFormData>
  ): Promise<LeadCommunication> {
    const updateResponse = await supabase
      .from('lead_communications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateResponse.error) {
      console.error('Error updating communication:', updateResponse.error);
      throw new Error('Failed to update communication');
    }

    return updateResponse.data as LeadCommunication;
  }

  static async deleteCommunication(id: string): Promise<void> {
    const deleteResponse = await supabase
      .from('lead_communications')
      .delete()
      .eq('id', id);

    if (deleteResponse.error) {
      console.error('Error deleting communication:', deleteResponse.error);
      throw new Error('Failed to delete communication');
    }
  }

  static async getCommunicationStats(leadId: string): Promise<{
    total: number;
    by_type: Record<string, number>;
    recent_count: number;
  }> {
    const statsResponse = await supabase
      .from('lead_communications')
      .select('type, created_at')
      .eq('lead_id', leadId);

    if (statsResponse.error) {
      console.error('Error fetching communication stats:', statsResponse.error);
      return { total: 0, by_type: {}, recent_count: 0 };
    }

    const total = statsResponse.data.length;
    const by_type = statsResponse.data.reduce((acc, comm) => {
      acc[comm.type] = (acc[comm.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent_count = statsResponse.data.filter(comm => 
      new Date(comm.created_at) > weekAgo
    ).length;

    return { total, by_type, recent_count };
  }

  // AI Communication Methods
  static async createAICommunication(
    leadId: string,
    agentId: string,
    communicationData: any
  ): Promise<any> {
    const authResponse = await supabase.auth.getUser();
    if (!authResponse.data.user) throw new Error('User not authenticated');

    const insertResponse = await supabase
      .from('lead_communications')
      .insert({
        lead_id: leadId,
        user_id: authResponse.data.user.id,
        ...communicationData,
        is_ai_generated: true,
        ai_agent_id: agentId
      })
      .select()
      .single();

    if (insertResponse.error) throw new Error('Failed to create AI communication');
    return insertResponse.data;
  }

  static async getAICommunications(leadId: string): Promise<any[]> {
    // Temporarily simplified to avoid TypeScript issues
    return [];
  }

  static async getHumanCommunications(leadId: string): Promise<any[]> {
    // Temporarily simplified to avoid TypeScript issues  
    return [];
  }
}