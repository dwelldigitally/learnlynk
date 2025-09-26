import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Preceptor {
  id: string;
  user_id: string;
  site_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  specialization?: string;
  years_experience?: number;
  license_number?: string;
  license_expiry?: string;
  is_primary_contact?: boolean;
  is_active?: boolean;
  max_students?: number;
  current_students?: number;
  availability_notes?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  bio?: string;
  qualifications?: any[];
  schedule_preferences?: any;
  communication_preferences?: any;
  created_at: string;
  updated_at: string;
}

export function usePreceptors(siteId?: string) {
  return useQuery({
    queryKey: ['preceptors', siteId],
    queryFn: async () => {
      let query = supabase
        .from('preceptors')
        .select('*')
        .order('created_at', { ascending: false });

      if (siteId) {
        query = query.eq('site_id', siteId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Preceptor[];
    },
    enabled: !!siteId,
  });
}

export function useCreatePreceptor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (preceptor: Omit<Preceptor, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('preceptors')
        .insert([{ ...preceptor, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['preceptors'] });
      queryClient.invalidateQueries({ queryKey: ['preceptors', data.site_id] });
      toast({
        title: 'Preceptor added',
        description: 'The preceptor has been successfully added to the site.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add preceptor: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdatePreceptor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Preceptor> & { id: string }) => {
      const { data, error } = await supabase
        .from('preceptors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['preceptors'] });
      queryClient.invalidateQueries({ queryKey: ['preceptors', data.site_id] });
      toast({
        title: 'Preceptor updated',
        description: 'The preceptor has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update preceptor: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

export function useDeletePreceptor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('preceptors')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preceptors'] });
      toast({
        title: 'Preceptor removed',
        description: 'The preceptor has been successfully removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to remove preceptor: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}