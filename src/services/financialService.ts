import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { leadActivityService } from './leadActivityService';

export class FinancialService {
  /**
   * Get all financial records for the current user
   */
  static async getFinancialRecords() {
    const { data, error } = await supabase
      .from('financial_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching financial records:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Create a new financial record with activity logging
   */
  static async createFinancialRecord(record: any, leadId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('financial_records')
      .insert({
        ...record,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating financial record:', error);
      throw error;
    }

    // Log payment creation if lead_id is available
    if (leadId || record.lead_id) {
      await leadActivityService.logPaymentCreated(
        leadId || record.lead_id,
        record.payment_type || record.type || 'Payment',
        Number(record.amount),
        record.currency || 'USD'
      );
    }

    return data;
  }

  /**
   * Update a financial record with status change logging
   */
  static async updateFinancialRecord(id: string, record: any, leadId?: string, oldRecord?: any) {
    const { data, error } = await supabase
      .from('financial_records')
      .update(record)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating financial record:', error);
      throw error;
    }

    // Log status changes
    const effectiveLeadId = leadId || record.lead_id || oldRecord?.lead_id;
    if (effectiveLeadId && oldRecord && record.status && oldRecord.status !== record.status) {
      if (record.status === 'paid') {
        await leadActivityService.logPaymentReceived(
          effectiveLeadId,
          record.payment_type || oldRecord.payment_type || 'Payment',
          Number(record.amount || oldRecord.amount),
          record.currency || oldRecord.currency || 'USD'
        );
      } else {
        await leadActivityService.logPaymentStatusChange(
          effectiveLeadId,
          record.payment_type || oldRecord.payment_type || 'Payment',
          oldRecord.status,
          record.status,
          Number(record.amount || oldRecord.amount)
        );
      }
    }

    return data;
  }

  /**
   * Delete a financial record
   */
  static async deleteFinancialRecord(id: string) {
    const { error } = await supabase
      .from('financial_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting financial record:', error);
      throw error;
    }
  }

  /**
   * Get financial statistics
   */
  static async getFinancialStats() {
    const records = await this.getFinancialRecords();
    
    const totalRevenue = records.reduce((sum, r) => sum + Number(r.amount), 0);
    const paidRecords = records.filter(r => r.status === 'paid');
    const pendingRecords = records.filter(r => r.status === 'pending');
    const overdueRecords = records.filter(r => r.status === 'overdue');

    return {
      totalRevenue,
      totalPayments: paidRecords.length,
      pendingPayments: pendingRecords.length,
      overduePayments: overdueRecords.length,
      collectedRevenue: paidRecords.reduce((sum, r) => sum + Number(r.amount), 0),
      pendingRevenue: pendingRecords.reduce((sum, r) => sum + Number(r.amount), 0)
    };
  }
}

/**
 * React hook to get financial records with conditional demo data
 */
export function useFinancialRecords() {
  return useQuery({
    queryKey: ['financial-records'],
    queryFn: () => FinancialService.getFinancialRecords(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * React hook to get financial statistics
 */
export function useFinancialStats() {
  return useQuery({
    queryKey: ['financial-stats'],
    queryFn: () => FinancialService.getFinancialStats(),
    staleTime: 5 * 60 * 1000,
  });
}