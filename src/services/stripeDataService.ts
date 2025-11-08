import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  description?: string;
  lead_id?: string;
  currency?: string;
  balance: number;
  delinquent: boolean;
  created: string;
  metadata: any;
  synced_at: string;
  updated_at: string;
  user_id: string;
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  default_price_id?: string;
  images?: string[];
  metadata: any;
  created: string;
  synced_at: string;
  updated_at: string;
  user_id: string;
}

export interface StripePrice {
  id: string;
  product_id?: string;
  active: boolean;
  currency: string;
  unit_amount?: number;
  recurring_interval?: string;
  recurring_interval_count?: number;
  type?: string;
  metadata: any;
  created: string;
  synced_at: string;
  updated_at: string;
  user_id: string;
}

export interface StripePaymentIntent {
  id: string;
  customer_id?: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  description?: string;
  receipt_email?: string;
  created: string;
  metadata: any;
  synced_at: string;
  updated_at: string;
  user_id: string;
}

export interface StripeSyncLog {
  id: string;
  user_id: string;
  sync_type: string;
  status: string;
  records_synced: any;
  customers_matched: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
}

export class StripeDataService {
  static async syncStripeData(syncType: 'customers' | 'products' | 'payments' | 'full' = 'full'): Promise<any> {
    const { data, error } = await supabase.functions.invoke('sync-stripe-data', {
      body: { sync_type: syncType }
    });

    if (error) throw error;
    return data;
  }

  static async getSyncHistory(limit = 20): Promise<StripeSyncLog[]> {
    const { data, error } = await supabase
      .from('stripe_sync_log')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  static async getLatestSyncStatus(): Promise<StripeSyncLog | null> {
    const { data, error } = await supabase
      .from('stripe_sync_log')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getStripeCustomers(filters?: { linkedOnly?: boolean }): Promise<StripeCustomer[]> {
    let query = supabase
      .from('stripe_customers')
      .select('*')
      .order('created', { ascending: false });

    if (filters?.linkedOnly) {
      query = query.not('lead_id', 'is', null);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getStripeProducts(): Promise<StripeProduct[]> {
    const { data, error } = await supabase
      .from('stripe_products')
      .select('*')
      .order('created', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getStripePayments(customerId?: string): Promise<StripePaymentIntent[]> {
    let query = supabase
      .from('stripe_payment_intents')
      .select('*')
      .order('created', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async linkCustomerToLead(stripeCustomerId: string, leadId: string): Promise<void> {
    const { error } = await supabase
      .from('stripe_customers')
      .update({ lead_id: leadId })
      .eq('id', stripeCustomerId);

    if (error) throw error;
  }

  static async unlinkCustomerFromLead(stripeCustomerId: string): Promise<void> {
    const { error } = await supabase
      .from('stripe_customers')
      .update({ lead_id: null })
      .eq('id', stripeCustomerId);

    if (error) throw error;
  }

  static async getCustomerByLeadId(leadId: string): Promise<StripeCustomer | null> {
    const { data, error } = await supabase
      .from('stripe_customers')
      .select('*')
      .eq('lead_id', leadId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getSyncStats(): Promise<any> {
    const { data: customers } = await supabase
      .from('stripe_customers')
      .select('id, lead_id');

    const { data: products } = await supabase
      .from('stripe_products')
      .select('id');

    const { data: payments } = await supabase
      .from('stripe_payment_intents')
      .select('id, amount, currency, status');

    const linkedCustomers = customers?.filter(c => c.lead_id !== null).length || 0;
    const totalCustomers = customers?.length || 0;
    const totalProducts = products?.length || 0;

    const successfulPayments = payments?.filter(p => p.status === 'succeeded') || [];
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalCustomers,
      linkedCustomers,
      unlinkedCustomers: totalCustomers - linkedCustomers,
      linkagePercentage: totalCustomers > 0 ? Math.round((linkedCustomers / totalCustomers) * 100) : 0,
      totalProducts,
      totalPayments: payments?.length || 0,
      successfulPayments: successfulPayments.length,
      totalRevenue,
      currencySummary: this.groupByCurrency(successfulPayments)
    };
  }

  private static groupByCurrency(payments: any[]): any {
    const summary: any = {};
    payments.forEach(p => {
      if (!summary[p.currency]) {
        summary[p.currency] = { count: 0, total: 0 };
      }
      summary[p.currency].count++;
      summary[p.currency].total += p.amount;
    });
    return summary;
  }
}

// React Query Hooks

export const useStripeSyncStatus = () => {
  return useQuery({
    queryKey: ['stripe-sync-status'],
    queryFn: () => StripeDataService.getLatestSyncStatus(),
    refetchInterval: 10000 // Auto-refresh every 10 seconds
  });
};

export const useTriggerSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (syncType: 'customers' | 'products' | 'payments' | 'full') => 
      StripeDataService.syncStripeData(syncType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripe-sync-status'] });
      queryClient.invalidateQueries({ queryKey: ['stripe-sync-history'] });
      queryClient.invalidateQueries({ queryKey: ['stripe-customers'] });
      queryClient.invalidateQueries({ queryKey: ['stripe-products'] });
      queryClient.invalidateQueries({ queryKey: ['stripe-payments'] });
      queryClient.invalidateQueries({ queryKey: ['stripe-stats'] });
      
      toast({
        title: "Sync started",
        description: "Stripe data is being synced in the background.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSyncHistory = (limit = 20) => {
  return useQuery({
    queryKey: ['stripe-sync-history', limit],
    queryFn: () => StripeDataService.getSyncHistory(limit),
  });
};

export const useStripeCustomers = (filters?: { linkedOnly?: boolean }) => {
  return useQuery({
    queryKey: ['stripe-customers', filters],
    queryFn: () => StripeDataService.getStripeCustomers(filters),
  });
};

export const useStripeProducts = () => {
  return useQuery({
    queryKey: ['stripe-products'],
    queryFn: () => StripeDataService.getStripeProducts(),
  });
};

export const useStripePayments = (customerId?: string) => {
  return useQuery({
    queryKey: ['stripe-payments', customerId],
    queryFn: () => StripeDataService.getStripePayments(customerId),
    enabled: !!customerId,
  });
};

export const useLinkCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stripeCustomerId, leadId }: { stripeCustomerId: string; leadId: string }) =>
      StripeDataService.linkCustomerToLead(stripeCustomerId, leadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripe-customers'] });
      queryClient.invalidateQueries({ queryKey: ['stripe-stats'] });
      
      toast({
        title: "Customer linked",
        description: "Stripe customer has been linked to the lead.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to link customer",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSyncStats = () => {
  return useQuery({
    queryKey: ['stripe-stats'],
    queryFn: () => StripeDataService.getSyncStats(),
  });
};