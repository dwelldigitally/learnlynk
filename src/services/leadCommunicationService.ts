import { supabase } from '@/integrations/supabase/client';
import { LeadCommunication, CommunicationFormData } from '@/types/leadEnhancements';

export class LeadCommunicationService {
  static async getCommunications(leadId: string): Promise<LeadCommunication[]> {
    const { data, error } = await supabase
      .from('lead_communications')
      .select('*')
      .eq('lead_id', leadId)
      .order('communication_date', { ascending: false });

    if (error) {
      console.error('Error fetching communications:', error);
      throw new Error('Failed to fetch communications');
    }

    return (data || []) as LeadCommunication[];
  }

  static async createCommunication(
    leadId: string, 
    communicationData: CommunicationFormData
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
}