import { supabase } from "@/integrations/supabase/client";
import { MasterRecord, StageHistory, StageTransitionRequest, Stage, Substage } from "@/types/masterRecord";

export class MasterRecordService {
  static async createMasterRecord(data: Partial<MasterRecord>): Promise<MasterRecord> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data: result, error } = await supabase
      .from('master_records')
      .insert({
        ...data,
        user_id: user.id,
        current_stage: data.current_stage || 'lead',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        source: data.source || 'direct'
      })
      .select()
      .single();

    if (error) throw error;
    return result as MasterRecord;
  }

  static async getMasterRecord(id: string): Promise<MasterRecord | null> {
    const { data, error } = await supabase
      .from('master_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as MasterRecord;
  }

  static async getMasterRecordByEmail(email: string): Promise<MasterRecord | null> {
    const { data, error } = await supabase
      .from('master_records')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as MasterRecord;
  }

  static async updateMasterRecord(id: string, updates: Partial<MasterRecord>): Promise<MasterRecord> {
    const { data, error } = await supabase
      .from('master_records')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as MasterRecord;
  }

  static async transitionStage(request: StageTransitionRequest): Promise<{ masterRecord: MasterRecord; history: StageHistory }> {
    // Get current master record
    const currentRecord = await this.getMasterRecord(request.master_record_id);
    if (!currentRecord) {
      throw new Error('Master record not found');
    }

    // Update master record stage
    const updatedRecord = await this.updateMasterRecord(request.master_record_id, {
      current_stage: request.to_stage,
      current_substage: request.to_substage,
      stage_entered_at: new Date().toISOString()
    });

    // Create stage history entry
    const { data: historyData, error: historyError } = await supabase
      .from('stage_history')
      .insert([{
        master_record_id: request.master_record_id,
        from_stage: currentRecord.current_stage,
        to_stage: request.to_stage,
        from_substage: currentRecord.current_substage,
        to_substage: request.to_substage,
        transition_reason: request.transition_reason,
        transitioned_by: (await supabase.auth.getUser()).data.user?.id,
        metadata: request.metadata || {}
      }])
      .select()
      .single();

    if (historyError) throw historyError;

    return {
      masterRecord: updatedRecord,
      history: historyData as StageHistory
    };
  }

  static async getStageHistory(masterRecordId: string): Promise<StageHistory[]> {
    const { data, error } = await supabase
      .from('stage_history')
      .select('*')
      .eq('master_record_id', masterRecordId)
      .order('transitioned_at', { ascending: false });

    if (error) throw error;
    return (data || []) as StageHistory[];
  }

  static async getMasterRecordsByStage(stage: Stage): Promise<MasterRecord[]> {
    const { data, error } = await supabase
      .from('master_records')
      .select('*')
      .eq('current_stage', stage)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as MasterRecord[];
  }

  static async searchMasterRecords(filters: {
    stage?: Stage;
    substage?: Substage;
    search?: string;
    source?: string;
    program_interest?: string[];
    tags?: string[];
  }): Promise<MasterRecord[]> {
    let query = supabase
      .from('master_records')
      .select('*');

    if (filters.stage) {
      query = query.eq('current_stage', filters.stage);
    }

    if (filters.substage) {
      query = query.eq('current_substage', filters.substage);
    }

    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters.source) {
      query = query.eq('source', filters.source);
    }

    if (filters.program_interest && filters.program_interest.length > 0) {
      query = query.overlaps('program_interest', filters.program_interest);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as MasterRecord[];
  }

  static async deleteMasterRecord(id: string): Promise<void> {
    const { error } = await supabase
      .from('master_records')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}