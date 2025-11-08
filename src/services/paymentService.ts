import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export interface Payment {
  id: string;
  lead_id: string;
  financial_record_id?: string;
  amount: number;
  currency: string;
  payment_type: string;
  status: string;
  stripe_payment_intent_id?: string;
  stripe_invoice_id?: string;
  invoice_template_id?: string;
  invoice_sent_at?: string;
  paid_at?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  payment_id: string;
  transaction_type: string;
  amount?: number;
  stripe_transaction_id?: string;
  status: string;
  metadata: any;
  created_at: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  template_type: string;
  subject_line: string;
  body_html: string;
  body_text: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReceiptTemplate {
  id: string;
  name: string;
  template_type: string;
  body_html: string;
  body_text: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export class PaymentService {
  static async getLeadPayments(leadId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }

    return data || [];
  }

  static async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData as any])
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      throw error;
    }

    return data;
  }

  static async createPaymentIntent(paymentId: string): Promise<{ client_secret: string; payment_id: string }> {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { payment_id: paymentId }
    });

    if (error) throw error;
    return data;
  }

  static async sendInvoice(paymentId: string, templateId?: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('send-invoice-email', {
      body: { payment_id: paymentId, template_id: templateId }
    });

    if (error) throw error;
    return data;
  }

  static async sendReceipt(paymentId: string, templateId?: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('send-receipt-email', {
      body: { payment_id: paymentId, template_id: templateId }
    });

    if (error) throw error;
    return data;
  }

  static async getPaymentTransactions(paymentId: string): Promise<PaymentTransaction[]> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('payment_id', paymentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }

    return data || [];
  }

  static async getInvoiceTemplates(): Promise<InvoiceTemplate[]> {
    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching invoice templates:', error);
      throw error;
    }

    return data || [];
  }

  static async getReceiptTemplates(): Promise<ReceiptTemplate[]> {
    const { data, error } = await supabase
      .from('receipt_templates')
      .select('*')
      .order('is_default', { ascending: false });

    if (error) {
      console.error('Error fetching receipt templates:', error);
      throw error;
    }

    return data || [];
  }

  static async getPaymentStats(leadId: string) {
    const payments = await this.getLeadPayments(leadId);
    
    const totalDue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const paidPayments = payments.filter(p => p.status === 'paid');
    const totalPaid = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const outstanding = totalDue - totalPaid;

    return {
      totalDue,
      totalPaid,
      outstanding,
      paymentCount: payments.length,
      paidCount: paidPayments.length,
      pendingCount: payments.filter(p => p.status === 'pending').length
    };
  }
}

// React Query hooks
export function useLeadPayments(leadId: string) {
  return useQuery({
    queryKey: ['lead-payments', leadId],
    queryFn: () => PaymentService.getLeadPayments(leadId),
    enabled: !!leadId,
  });
}

export function usePaymentStats(leadId: string) {
  return useQuery({
    queryKey: ['payment-stats', leadId],
    queryFn: () => PaymentService.getPaymentStats(leadId),
    enabled: !!leadId,
  });
}

export function useInvoiceTemplates() {
  return useQuery({
    queryKey: ['invoice-templates'],
    queryFn: () => PaymentService.getInvoiceTemplates(),
  });
}

export function useReceiptTemplates() {
  return useQuery({
    queryKey: ['receipt-templates'],
    queryFn: () => PaymentService.getReceiptTemplates(),
  });
}

export function usePaymentTransactions(paymentId: string) {
  return useQuery({
    queryKey: ['payment-transactions', paymentId],
    queryFn: () => PaymentService.getPaymentTransactions(paymentId),
    enabled: !!paymentId,
  });
}

export function useSendInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ paymentId, templateId }: { paymentId: string; templateId?: string }) =>
      PaymentService.sendInvoice(paymentId, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
      toast({
        title: 'Success',
        description: 'Invoice sent successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to send invoice: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

export function useSendReceipt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ paymentId, templateId }: { paymentId: string; templateId?: string }) =>
      PaymentService.sendReceipt(paymentId, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-transactions'] });
      toast({
        title: 'Success',
        description: 'Receipt sent successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to send receipt: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}
